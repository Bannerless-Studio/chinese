#!/usr/bin/env python3
"""Validate data/hsk_patterns.js (grammar patterns) against data/hsk_vocab.json.

The same rules as tools/check_sentences.py for every pattern sentence, plus the
pattern fields:
1. Pattern: id unique (p01, p02, ...), lv 1-4 and patterns in level order, label
   and en non-empty, note exactly two lines of at most 60 characters, near (when
   present) names other pattern ids, 6-8 sentences.
2. Segmentation: "".join(words) == zh (punctuation stripped); every word in VOCAB
   or EXTRA (check_sentences.EXTRA, plus the file's PATTERN_EXTRA: compounds only
   pattern sentences use, bases in VOCAB) at a level <= the pattern's lv. The sentence's
   own mark words are exempt from the level rule (the pattern teaches them: 过 is
   an HSK 2 particle but L4 in VOCAB as the verb "to pass").
3. Pinyin cross-check against the vocab readings, with check_sentences' 不/一
   tone-sandhi tolerance.
4. Length 3-14 characters (punctuation excluded).
5. No zh duplicated within the patterns or with data/hsk_sentences.js.
6. marks: a non-empty, sorted, non-overlapping list of [start, end) ranges inside
   zh, each starting and ending on a word boundary and covering no punctuation.

`--options` prints, per sentence and mark, the wrong-option pool the engine can offer
(vocab-engine core.js patternOpts): the pattern's other marks, then other patterns'
marks (minus its `near`) of the same length, then the count of other-length marks.
Ambiguity is not machine-checkable; the dump is for reading the 1-char pools.
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from check_sentences import EXTRA as SENTENCE_EXTRA, load_sentences, load_vocab, strip_punct, PUNCT_CHARS  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
PATTERNS_PATH = ROOT / "data" / "hsk_patterns.js"
SANDHI_CHARS = {"不", "一"}
NOTE_MAX = 60
MAX_LEN = 14


def load_patterns(path=PATTERNS_PATH):
    """The file is comment lines, then `const PATTERNS=[...];` (JSON, any line breaks)."""
    text = path.read_text(encoding="utf-8")
    body = text[text.index("const PATTERNS=") + len("const PATTERNS="):]
    return json.loads(body[:body.rindex("];") + 1])


def load_pattern_extra(path=PATTERNS_PATH):
    """`const PATTERN_EXTRA={...};` (one JSON line): compound tokens only pattern sentences use."""
    text = path.read_text(encoding="utf-8")
    if "const PATTERN_EXTRA=" not in text:
        return {}
    body = text[text.index("const PATTERN_EXTRA=") + len("const PATTERN_EXTRA="):]
    return json.loads(body[:body.index(";\n")])


def mark_texts(p):
    return list(dict.fromkeys(s["zh"][a:b] for s in p["sentences"] for a, b in s["marks"]))


def option_pool(p, patterns, ans):
    """(own, same-length others, other-length others) as core.js patternOpts orders them."""
    near = set(p.get("near", []))
    own = [t for t in mark_texts(p) if t != ans]
    others = list(dict.fromkeys(t for q in patterns if q["id"] != p["id"] and q["id"] not in near for t in mark_texts(q)))
    others = [t for t in others if t != ans and t not in own]
    return own, [t for t in others if len(t) == len(ans)], [t for t in others if len(t) != len(ans)]


def dump_options(patterns):
    for p in patterns:
        for k, s in enumerate(p["sentences"], 1):
            for a, b in s["marks"]:
                ans = s["zh"][a:b]
                own, same, other = option_pool(p, patterns, ans)
                print(f"{p['id']}.{k} {s['zh'][:a]}[{ans}]{s['zh'][b:]} | own: {' '.join(own) or '-'} | same-length: {' '.join(same) or '-'} | +{len(other)} other-length")


def main():
    if "--options" in sys.argv:
        dump_options(load_patterns())
        return
    vocab = load_vocab()
    patterns = load_patterns()
    known = {s["zh"] for s in load_sentences()}
    errors = []
    pattern_extra = load_pattern_extra()
    for token, info in pattern_extra.items():
        if token in SENTENCE_EXTRA or token in vocab:
            errors.append(f"PATTERN_EXTRA[{token!r}]: already in SENTENCE_EXTRA or VOCAB")
        elif info.get("base") not in vocab:
            errors.append(f"PATTERN_EXTRA[{token!r}]: base {info.get('base')!r} not in VOCAB")
    EXTRA = dict(SENTENCE_EXTRA, **pattern_extra)

    def resolve(w):
        e = vocab.get(w)
        if e is not None:
            return e["py"], e["lv"]
        x = EXTRA.get(w)
        if x is not None and x["base"] in vocab:
            return x["py"], vocab[x["base"]]["lv"]
        return None

    ids = [p.get("id") for p in patterns]
    seen_zh = {}
    prev_lv = 0
    n_sent = 0
    for i, p in enumerate(patterns):
        pid = p.get("id")
        label = f"pattern {pid!r}"
        if pid != f"p{i + 1:02d}":
            errors.append(f"{label}: id must be p{i + 1:02d} (ids run p01, p02, ... in file order)")
        lv = p.get("lv")
        if lv not in (1, 2, 3, 4):
            errors.append(f"{label}: lv must be 1-4")
            lv = 4
        if lv < prev_lv:
            errors.append(f"{label}: lv {lv} after a level-{prev_lv} pattern (keep level order)")
        prev_lv = max(prev_lv, lv)
        for f in ("label", "en"):
            if not isinstance(p.get(f), str) or not p[f].strip():
                errors.append(f"{label}: {f} must be a non-empty string")
        note = p.get("note")
        if not (isinstance(note, list) and len(note) == 2 and all(isinstance(x, str) and x.strip() for x in note)):
            errors.append(f"{label}: note must be two non-empty lines")
        else:
            for x in note:
                if len(x) > NOTE_MAX:
                    errors.append(f"{label}: note line over {NOTE_MAX} characters ({len(x)}): {x!r}")
        for q in p.get("near", []):
            if q not in ids or q == pid:
                errors.append(f"{label}: near {q!r} is not another pattern id")
        sents = p.get("sentences")
        if not isinstance(sents, list) or not 6 <= len(sents) <= 8:
            errors.append(f"{label}: needs 6-8 sentences")
            sents = sents if isinstance(sents, list) else []
        for s in sents:
            n_sent += 1
            zh, py, words, marks = s.get("zh", ""), s.get("py", ""), s.get("words", []), s.get("marks")
            where = f"{label} {zh!r}"
            if not isinstance(s.get("en"), str) or not s["en"].strip():
                errors.append(f"{where}: en must be a non-empty string")
            if zh in known:
                errors.append(f"{where}: duplicates a sentence in hsk_sentences.js")
            if zh in seen_zh:
                errors.append(f"{where}: duplicates a sentence of {seen_zh[zh]}")
            seen_zh[zh] = pid
            if strip_punct("".join(words)) != strip_punct(zh):
                errors.append(f"{where}: segmentation mismatch: words join to {''.join(words)!r}")
            pys, bad = [], False
            mark_words = {zh[m[0]:m[1]] for m in marks if isinstance(m, list) and len(m) == 2} if isinstance(marks, list) else set()
            for w in words:
                r = resolve(w)
                if r is None:
                    errors.append(f"{where}: word {w!r} not in VOCAB or EXTRA")
                    bad = True
                elif r[1] > lv and w not in mark_words:
                    errors.append(f"{where}: word {w!r} is level {r[1]}, above the pattern's {lv}")
                else:
                    pys.append(r[0])
            if not bad:
                exp, act = strip_punct(" ".join(pys)).lower().split(), strip_punct(py).lower().split()
                if len(exp) != len(act) or any(e != a and w not in SANDHI_CHARS for w, e, a in zip(words, exp, act)):
                    errors.append(f"{where}: pinyin mismatch: expected {' '.join(exp)!r} got {' '.join(act)!r}")
            n = len(strip_punct(zh))
            if not 3 <= n <= MAX_LEN:
                errors.append(f"{where}: length {n} out of range 3-{MAX_LEN}")
            bounds, pos = {0, len(zh)}, 0
            for w in words:
                at = zh.find(w, pos)
                if at < 0:
                    break
                bounds.update((at, at + len(w)))
                pos = at + len(w)
            if not isinstance(marks, list) or not marks:
                errors.append(f"{where}: marks must be a non-empty list of [start, end] ranges")
                continue
            end = 0
            for m in marks:
                if not (isinstance(m, list) and len(m) == 2 and all(isinstance(v, int) and not isinstance(v, bool) for v in m)
                        and end <= m[0] < m[1] <= len(zh)):
                    errors.append(f"{where}: mark {m!r} must be [start, end] inside zh, sorted, not overlapping")
                    continue
                end = m[1]
                if m[0] not in bounds or m[1] not in bounds:
                    errors.append(f"{where}: mark {zh[m[0]:m[1]]!r} splits a word")
                if any(c in PUNCT_CHARS for c in zh[m[0]:m[1]]):
                    errors.append(f"{where}: mark {zh[m[0]:m[1]]!r} covers punctuation")

    print(f"Patterns: {len(patterns)}  sentences: {n_sent}")
    print(f"Errors: {len(errors)}")
    for e in errors[:500]:
        print(" -", e)
    if errors:
        sys.exit(1)
    print("\nAll checks passed.")


if __name__ == "__main__":
    main()

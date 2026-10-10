#!/usr/bin/env python3
"""Validate data/hsk_sentences.js against data/hsk_vocab.json.

Checks:
1. Segmentation: "".join(words) (punctuation stripped) == zh (punctuation stripped),
   and every word exists in VOCAB (or EXTRA, see below) with level <= lv, and
   max(word levels) == lv.
2. Pinyin cross-check: py (lowercased, punctuation stripped) must equal the vocab
   pinyin for each word joined with spaces (lowercased, punctuation stripped),
   modulo a small set of documented tone-sandhi exceptions for 不/一, and any
   context-dependent-reading exceptions listed in ALLOWED below.
3. No duplicate zh strings.
4. Length limits: lv 1-2 sentences 3-12 characters (excluding punctuation),
   lv 3-4 sentences up to 16 characters.
5. Vocabulary coverage: >= 70% of VOCAB words must appear in at least one sentence.
6. Sensitive-content screening, the same three tiers the shared packbuilder
   applies to every other language pack (vocab-engine
   tools/packbuilder/langs/base.py and qa/check.py), with Chinese terms added:
   a. drop-all: a sentence whose zh or en matches DROP_ALL_EN/DROP_ALL_ZH
      (rape, sexual or child abuse, suicide, self-harm) may not ship at any level;
   b. sensitive: a sentence whose zh or en matches SENSITIVE_EN/SENSITIVE_ZH
      (sexual content, violence, profanity) may only be top level (lv 4);
   c. gloss: a VOCAB word below lv 4 may not carry an English sense matching
      SENSITIVE_GLOSS_EN or the shared word ceiling (WORD_CEILING_EN).

EXTRA compound whitelist
------------------------
data/hsk_vocab.json is a curated subset of HSK 1-4 that is missing several
extremely common transparent compounds built from a single-morpheme VOCAB
word plus a bound suffix that is NOT itself a separate VOCAB entry (e.g. 春
"spring" is in VOCAB but 天 "day" is not, so 春天 "spring[time]" can't be
built by concatenating two VOCAB words the way 打+电话 can). Rather than
write awkward, telegraphic sentences to dodge this gap (e.g. "现在是春"
instead of "现在是春天"), a `words` entry may be one of the whitelisted
compounds in EXTRA below. Each EXTRA entry names its own pinyin (since it
isn't derivable by joining VOCAB pinyin) and its `base` VOCAB word, which is
what counts toward vocabulary coverage and toward the sentence's `lv` (an
EXTRA token contributes its base word's level, not a new one, since it is
not new vocabulary being taught, just a natural surface form of a taught
morpheme). Every EXTRA base is validated against VOCAB at check time.
"""
import importlib.util
import json
import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VOCAB_PATH = ROOT / "data" / "hsk_vocab.json"
SENTENCES_PATH = ROOT / "data" / "hsk_sentences.js"

PUNCT_CHARS = "，。？！：；、,.?!:;\"'“”‘’"
PUNCT_RE = re.compile("[" + re.escape(PUNCT_CHARS) + "]")

# Words whose vocab-listed pinyin is a dictionary/citation-form reading that
# legitimately differs from how the word surfaces in a natural sentence.
# Map: word -> reason (kept for documentation; the checker currently has none
# needed because 了/着/地/得-type words each have a single fixed vocab reading
# that is used consistently). Empty by design; extend here if a future word
# needs a documented exception.
ALLOWED = {
    # "word": "reason this word's sentence pinyin may differ from vocab py",
}

# Transparent compound whitelist: token -> {"py": ..., "base": <VOCAB word>}.
# `base` must exist in VOCAB (validated in main()). This is also exported
# verbatim into data/hsk_sentences.js as `SENTENCE_EXTRA` so the app can
# resolve per-word audio/availability for these tokens.
EXTRA = {
    "春天": {"py": "chūntiān", "base": "春"},
    "夏天": {"py": "xiàtiān", "base": "夏"},
    "秋天": {"py": "qiūtiān", "base": "秋"},
    "冬天": {"py": "dōngtiān", "base": "冬"},
    "哪儿": {"py": "nǎr", "base": "哪"},
    "这儿": {"py": "zhèr", "base": "这"},
    "那儿": {"py": "nàr", "base": "那"},
    "这里": {"py": "zhèlǐ", "base": "这"},
    "那里": {"py": "nàlǐ", "base": "那"},
    "哪里": {"py": "nǎlǐ", "base": "哪"},
    "你们": {"py": "nǐmen", "base": "你"},
    "他们": {"py": "tāmen", "base": "他"},
    "她们": {"py": "tāmen", "base": "她"},
    "这个": {"py": "zhège", "base": "这"},
    "那个": {"py": "nàge", "base": "那"},
    "哪个": {"py": "nǎge", "base": "哪"},
    "这些": {"py": "zhèxiē", "base": "这"},
    "那些": {"py": "nàxiē", "base": "那"},
}

TOP_LEVEL = 4

# The English term lists are loaded from the engine, not copied, so this pack
# follows the cross-pack content policy whenever the submodule is bumped.
# This file is the engine's own entry point for zh (no packbuilder spec builds
# this pack), so a missing submodule must fail rather than skip screening.
BASE_PY = ROOT / "engine" / "tools" / "packbuilder" / "langs" / "base.py"

# Hanzi have no word boundaries, so every term is a substring that cannot
# occur inside an unrelated common word. 死 is deliberately absent: 累死了,
# 饿死了 ("exhausted", "starving") are everyday intensifiers.
DROP_ALL_ZH = (r"强奸|性侵|性虐待|猥亵|乱伦|恋童|虐待儿童|"
               r"自杀|自残|轻生|割腕|上吊")
SENSITIVE_ZH = (r"杀|死人|尸体|枪|子弹|炸弹|流血|鲜血|酷刑|"
                r"性交|做爱|色情|裸体|妓女|卖淫|嫖|毒品|吸毒|"
                r"他妈的|操你|傻逼")


def load_content_filters():
    if not BASE_PY.exists():
        sys.exit(f"check_sentences: {BASE_PY.relative_to(ROOT)} not found; "
                 "run `git submodule update --init` (needed for content screening)")
    spec = importlib.util.spec_from_file_location("packbuilder_langs_base", BASE_PY)
    base = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(base)
    drop_all = base.drop_all_re(DROP_ALL_ZH)
    sensitive = re.compile(r"(?:" + SENSITIVE_ZH + r")|(?<![A-Za-z])(?:"
                           + base.SENSITIVE_EN + r")(?![A-Za-z])", re.I)
    gloss = re.compile(r"\b(" + base.SENSITIVE_GLOSS_EN + r")\b", re.I)
    return drop_all, sensitive, gloss, base.make_word_ceiling_re()


def content_error(zh, en, lv, drop_all_re, sensitive_re):
    hit = drop_all_re.search(zh) or drop_all_re.search(en)
    if hit:
        return f"drop-all content {hit.group(0)!r}: may not ship at any level"
    if lv != TOP_LEVEL:
        hit = sensitive_re.search(zh) or sensitive_re.search(en)
        if hit:
            return f"sensitive content {hit.group(0)!r}: only allowed at lv{TOP_LEVEL}, is lv{lv}"
    return None


def strip_punct(s):
    return PUNCT_RE.sub("", s)


def load_vocab():
    data = json.loads(VOCAB_PATH.read_text(encoding="utf-8"))
    by_word = {}
    for item in data:
        by_word[item["w"]] = item
    return by_word


def load_sentences():
    text = SENTENCES_PATH.read_text(encoding="utf-8")
    # file is `const SENTENCES=[...];`
    start = text.index("[")
    end = text.rindex("]") + 1
    return json.loads(text[start:end])


def main():
    vocab = load_vocab()
    sentences = load_sentences()
    drop_all_re, sensitive_re, gloss_re, ceiling_re = load_content_filters()

    errors = []
    warnings = []
    zh_seen = set()
    used_words = set()
    lv_counts = Counter()

    # Validate EXTRA bases up front: an EXTRA entry whose base isn't in
    # VOCAB would silently break level/coverage accounting, so treat it as
    # a hard error rather than a per-sentence surprise.
    for token, info in EXTRA.items():
        if info["base"] not in vocab:
            errors.append(
                f"EXTRA[{token!r}]: base {info['base']!r} not in VOCAB"
            )

    # Word levels are fixed by the official HSK list, so a hit here is fixed by
    # choosing another sense in tools/build_vocab.py, not by moving the word.
    for w, entry in vocab.items():
        if entry["lv"] == TOP_LEVEL:
            continue
        for kind, rx in (("sensitive gloss", gloss_re), ("word ceiling gloss", ceiling_re)):
            m = rx.search(entry["en"])
            if m:
                errors.append(
                    f"VOCAB {w!r} (lv{entry['lv']}): {kind} {m.group(0)!r} below lv{TOP_LEVEL} in {entry['en']!r}"
                )
                break

    def resolve(w):
        """Return (pinyin, level) for a word, checking VOCAB then EXTRA.
        Returns None if the word is not recognized anywhere."""
        entry = vocab.get(w)
        if entry is not None:
            return entry["py"], entry["lv"], w  # w itself counts for coverage
        extra = EXTRA.get(w)
        if extra is not None and extra["base"] in vocab:
            base_entry = vocab[extra["base"]]
            return extra["py"], base_entry["lv"], extra["base"]  # base counts
        return None

    # Tone-sandhi tolerant compare for 不 (bu4->bu2 before 4th tone) and
    # 一 (yi1 -> yi2/yi4 depending on following tone) is handled by simply
    # allowing the written pinyin to differ from the dictionary tone ONLY for
    # these two characters; all other words must match the vocab pinyin
    # exactly (case-insensitive, punctuation-insensitive).
    SANDHI_CHARS = {"不", "一"}

    for idx, s in enumerate(sentences):
        zh = s["zh"]
        py = s["py"]
        en = s.get("en", "")
        lv = s["lv"]
        words = s["words"]
        label = f"#{idx} {zh!r}"

        # duplicate check
        if zh in zh_seen:
            errors.append(f"{label}: duplicate zh")
        zh_seen.add(zh)

        err = content_error(zh, en, lv, drop_all_re, sensitive_re)
        if err:
            errors.append(f"{label}: {err}")

        # segmentation check
        joined = "".join(words)
        if strip_punct(joined) != strip_punct(zh):
            errors.append(
                f"{label}: segmentation mismatch: words join to {joined!r}"
            )

        # vocab membership + level check (VOCAB word, or EXTRA compound
        # whose base is a VOCAB word)
        max_lv = 0
        word_pinyins = []
        bad_word = False
        for w in words:
            resolved = resolve(w)
            if resolved is None:
                errors.append(f"{label}: word {w!r} not in VOCAB or EXTRA")
                bad_word = True
                continue
            wpy, wlv, coverage_word = resolved
            used_words.add(coverage_word)
            max_lv = max(max_lv, wlv)
            word_pinyins.append((w, wpy))

        if not bad_word:
            if max_lv != lv:
                errors.append(
                    f"{label}: lv={lv} but max word level is {max_lv}"
                )

        lv_counts[lv] += 1

        # pinyin cross-check
        if not bad_word:
            expected = []
            for w, wpy in word_pinyins:
                if w in ALLOWED:
                    continue
                expected.append(wpy)
            expected_str = strip_punct(" ".join(expected)).lower()
            # allow sandhi variance: strip 不/一 tone marks by normalizing
            # bu2/bu4 and yi1/yi2/yi4 to a neutral form before compare, but
            # ONLY for those characters' syllables.
            def normalize_sandhi(py_str, word_list):
                # crude: for each occurrence of a sandhi word, allow any of
                # its known tone variants. We just check exact match first;
                # if not exact, retry allowing tone digit-free compare for
                # syllables corresponding to 不/一.
                return py_str

            actual_str = strip_punct(py).lower()
            if expected_str != actual_str:
                # retry with sandhi tolerance: rebuild expected allowing
                # bu/yi tone variants by stripping diacritics only on those
                # syllables is complex; simplest robust approach: if the
                # only differing tokens correspond to 不 or 一, accept it.
                exp_tokens = expected_str.split()
                act_tokens = actual_str.split()
                if len(exp_tokens) == len(act_tokens):
                    ok = True
                    for w, et, at in zip(words, exp_tokens, act_tokens):
                        if et == at:
                            continue
                        if w in SANDHI_CHARS:
                            continue  # tolerate tone-sandhi variance
                        ok = False
                        break
                    if not ok:
                        errors.append(
                            f"{label}: pinyin mismatch: expected {expected_str!r} got {actual_str!r}"
                        )
                else:
                    errors.append(
                        f"{label}: pinyin token count mismatch: expected {expected_str!r} got {actual_str!r}"
                    )

        # length limits (character count, punctuation excluded)
        zh_len = len(strip_punct(zh))
        if lv in (1, 2):
            if not (3 <= zh_len <= 12):
                errors.append(f"{label}: length {zh_len} out of range 3-12 for lv{lv}")
        else:
            if not (3 <= zh_len <= 16):
                errors.append(f"{label}: length {zh_len} out of range 3-16 for lv{lv}")

    # coverage
    total_vocab = len(vocab)
    covered = len(used_words & set(vocab.keys()))
    coverage_pct = 100.0 * covered / total_vocab
    uncovered = sorted(set(vocab.keys()) - used_words)

    print(f"Total sentences: {len(sentences)}")
    print(f"Level counts: {dict(sorted(lv_counts.items()))}")
    print(f"Vocab coverage: {covered}/{total_vocab} = {coverage_pct:.1f}%")
    if coverage_pct < 70.0:
        print(f"Uncovered words ({len(uncovered)}):")
        print(" ".join(uncovered))

    print(f"\nErrors: {len(errors)}")
    for e in errors[:500]:
        print(" -", e)

    if errors or coverage_pct < 70.0:
        sys.exit(1)
    print("\nAll checks passed.")


if __name__ == "__main__":
    main()

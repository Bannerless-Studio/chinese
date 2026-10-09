# HSK 1-4 Mandarin trainer

Live: **https://bannerless-studio.github.io/chinese/**

A free, offline-capable trainer for HSK 1-4 Mandarin: about 1200 words, 880
short sentences and 60 short reading passages, built on the shared
[`vocab-engine`](https://github.com/Bannerless-Studio/vocab-engine).

## Using the trainer

- **Pinyin first.** Words and sentences are taught by sound and pinyin
  first. Typing answers are pinyin.
- **Characters stage.** A 字 stage teaches recognition of the characters of
  words already known by sound. Characters are composed into sentences as
  they are learned.
- **Sounds** shows the 12-lesson pinyin curriculum.
- **Read tab passages.** 60 short passages with comprehension questions.
  Today offers one passage per session when one is available (skippable; a
  missed passage is re-offered for spaced re-reading after 7 days). When
  audio is available, a spaced re-read becomes a listening pass instead,
  with text hidden until revealed.
- **Replay.** Autoplay/reveal cards get a Replay button.
- **Offline.** The page is cached on first visit and keeps working without
  a connection.
- Your progress is stored only in your browser (`localStorage`, key
  `vocab_zh`). Use Progress to export a backup or move it to another
  device.
- **If you used the old `hsk_pinyin` trainer:** at first load the page
  imports your existing progress into the new record. It keeps a raw copy
  under `hsk_pinyin.bak` and never modifies the original `hsk_pinyin` key.
  If the import fails, Today says why and nothing is saved until you
  choose. Old bookmarks (`hsk_pinyin.html`) still work: it's now a
  same-origin redirect stub to the site root, so stored progress carries
  over.
- **Samsung Internet** has no working speech synthesis. The app shows a
  notice and text-based drills still work, but audio doesn't play.

## Data quality

Vocabulary comes from the [complete-hsk-vocabulary](https://github.com/drkameleon/complete-hsk-vocabulary)
dataset (`tools/build_vocab.py` selects one sense and one pronunciation per
word; see its docstring for the full sense-selection rules and manual
overrides). Sentences in `data/hsk_sentences.js` are hand-authored for this
pack and validated against the vocabulary by `tools/check_sentences.py`
(segmentation, pinyin cross-check, length limits, coverage). Grammar-pattern
sentences in `data/hsk_patterns.js` (27 HSK 2-4 patterns, drilled as cloze)
are hand-authored the same way and checked by `tools/check_patterns.py`.

The example-sentence corpus has not yet been screened by the shared
sensitive-content filter used in the other language repos; tracked as an
open item in `TODO.md`.

## Credits

- **Character hints** (memory hints on teach cards, reveals and word popovers)
  come from [Make Me a Hanzi](https://github.com/skishore/makemeahanzi)
  (`dictionary.txt` at commit `bddc96d41bef78427ed0e034e9f7e31d71fd1b92`),
  © Shaunak Kishore and contributors, licensed LGPL-3.0-or-later. Licence
  texts: `LICENSES/LGPL-3.0.txt` and `LICENSES/GPL-3.0.txt`. Two hand-written
  hints (气, 来) also restate English Wiktionary (CC BY-SA 4.0).
- **English glosses** originate from [CC-CEDICT](https://cc-cedict.org/wiki/)
  (CC BY-SA 4.0), via complete-hsk-vocabulary (MIT).
- Full source and licence record: `pack/attribution.json`.

### Sources and licences

| Data | Source | Licence | Used for |
|---|---|---|---|
| HSK vocabulary | [complete-hsk-vocabulary](https://github.com/drkameleon/complete-hsk-vocabulary) | MIT | Word lists and levels |
| English glosses, zh gloss overrides | [CC-CEDICT](https://cc-cedict.org/wiki/) via complete-hsk-vocabulary | CC BY-SA 4.0 | Meanings |
| Character hints | [Make Me a Hanzi](https://github.com/skishore/makemeahanzi) (Unihan, CJKlib) | LGPL-3.0-or-later | Teach cards, reveals, popovers |
| Hint overrides (气, 来) | English Wiktionary | CC BY-SA 4.0 | Two restated glyph origins |
| Word frequency | [wordfreq](https://github.com/rspeer/wordfreq) 3.1.1 | CC BY-SA 4.0 (code Apache-2.0, not shipped) | Order within level, frequency tiers |
| Sentences, patterns | Hand-authored for this pack | CC BY-SA 4.0 | Examples and patterns |

Licence: code MIT, pack data CC BY-SA 4.0, see LICENSE. Cross-repo summary:
`vocab-engine/docs/LICENSING.md`.

## Rebuild and publish

This repo holds the Chinese data (`data/`) and a generated copy of the
engine pack (`pack/`). `vocab-engine` (above) is a git submodule at
`engine/` and holds the shared UI, drill logic and pack builder; unlike the
other language repos, this pack is produced by
`vocab-engine/tools/pack_from_hsk.py` reading `data/`, not by the shared
corpus-based packbuilder (there is no `langs/zh.py`). A pre-switch,
single-file version of this app (`src/`, `tests/`, `docs/`) is kept
alongside for history and rollback.

**Every engine bump into this repo needs a migration-proof check** (storage
format changes can silently break learners' saved progress) — see the
Migration policy in `TODO.md` before merging or pushing one.

For the exact rebuild/check commands (including the legacy build) and
file-by-file notes, see `tools/README.md` and `CLAUDE.md`.

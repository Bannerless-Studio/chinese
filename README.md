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
(segmentation, pinyin cross-check, length limits, coverage).

The example-sentence corpus has not yet been screened by the shared
sensitive-content filter used in the other language repos; tracked as an
open item in `TODO.md`.

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

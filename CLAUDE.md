# Chinese (HSK 1-4) trainer — agent notes

```
complete-hsk-vocabulary dataset --tools/build_vocab.py--> data/hsk_vocab.{json,js}
data/hsk_sentences.js (hand-authored, tools/check_sentences.py validates)
        |
        v
vocab-engine/tools/pack_from_hsk.py (reads this repo's data/)  -->  pack/*.json
        |                                                           (copy of vocab-engine/packs/zh)
        v
engine/tools/jsonify_pack.py  -->  pack/*.js (generated)
        |
        v
build.sh (engine/app.html + engine/core.js + pack js)  -->  index.html + sw.js
        |
        v
GitHub Pages https://bannerless-studio.github.io/chinese/
progress lives in localStorage key vocab_zh; a legacy hsk_pinyin record is
imported into vocab_zh on first load and kept (untouched) as hsk_pinyin.bak
```

Why it is built this way: this repo predates the shared packbuilder pipeline
(it's the original `hsk_pinyin` app vocab-engine was extracted from), so its
pack is produced by `pack_from_hsk.py` from this repo's `data/`, not by
`packbuilder` like the other language repos — there is no `langs/zh.py` and
`check.sh` has no `packbuilder check` step. The pre-switch single-file
pipeline (`src/`, `build_legacy.sh`, `tests/pinyin_checks.js`) is kept
alongside the engine build for rollback and history; do not delete it.
`hsk_pinyin.html` is a hand-written redirect stub to `./` (same origin, so
`localStorage` progress carries over) and is not built by `build.sh`.

## Commands (pinned)

- Rebuild HSK vocabulary from source: `python3 tools/build_vocab.py`
  (add `--source /path/to/complete.json` to use a downloaded snapshot)
  -> `data/hsk_vocab.{json,js}`
- Validate hand-authored sentences: `python3 tools/check_sentences.py`
- Rebuild the engine pack from `data/`: see `vocab-engine/tools/pack_from_hsk.py`
  (run from vocab-engine, or via engine tooling — this repo's `pack/` is a
  generated copy of `vocab-engine/packs/zh`)
- Convert to JS: `python3 engine/tools/jsonify_pack.py pack`
- Build site: `./build.sh` (engine/build.sh pack index.html)
- Check (must pass before every commit of index.html): `./check.sh`
  (`validate_pack.py` + stale-build guard; no packbuilder check)
- Legacy-only rebuild (pre-switch app, kept for rollback):
  `OUT=/tmp/x.html INDEX=/tmp/y.html ./build_legacy.sh`, then
  `/opt/homebrew/bin/node tests/pinyin_checks.js`
- Engine tests live in vocab-engine (see its CLAUDE.md)

## Always

- Follow the **Migration policy** in `TODO.md` before merging or pushing
  any engine bump: (1) diff-audit the engine range for `dist/sw.js` and the
  storage/migration functions in `core.js`; (2) run
  `node tests/migration_checks.js` and `node tests/characters_app_checks.js`
  green in vocab-engine; (3) a live snapshot diff by a browser worker
  against the previous published build (progress intact, no console
  errors); (4) record the rollback commit hash before pushing. Record the
  finished proof in `TODO.md`'s "Org move" / migration-proof history —
  never delete these STATUS lines.
- Commit `index.html` and `sw.js` together; `check.sh`'s stale-build guard
  runs post-commit.
- Never modify `hsk_pinyin` (the pre-switch progress key) or its
  `.bak` copy; only import from it into `vocab_zh`.
- Path-limited commits: `engine`, `index.html`, `sw.js`, `pack/`, `data/`,
  `tools/`, `README.md`, `TODO.md`; never `.venv` or `.cache`.

## Never

- Edit `pack/*.json` by hand; regenerate from `data/` via
  `pack_from_hsk.py` and rebuild.
- Edit `pack/*.js`, `index.html`, `hsk_pinyin.html` or `sw.js` by hand
  (generated).
- Delete `sw.js` (use `engine/sw.disable.js`).
- Delete the legacy pipeline (`src/`, `data/`, `tests/pinyin_checks.js`,
  `build_legacy.sh`, `docs/PINYIN_SPEC.md`) — kept for history and rollback.
- Add comments that say what the code does; only why, or an external
  reference.
- Push to main without completing the Migration policy checklist above.

## Forbidden patterns

- No engine bump without the full migration-proof checklist (see Always).
- No hand edits to any generated file (see below).
- No what-comments in code, only why/external-reference comments.

## Generated files

`pack/*.js`, `pack/*.json` (copied from `vocab-engine/packs/zh`),
`data/hsk_vocab.{json,js}` (from `tools/build_vocab.py`), `index.html`,
`hsk_pinyin.html`, `sw.js`.

## Where things are

`README.md` (end users), `tools/README.md` (the two build/validate
scripts, file by file), `TODO.md` (migration policy + proof history, org
move history, open items — never delete STATUS lines), `engine/`
(submodule, read-only here), `src/`/`data/`/`tests/`/`docs/` (pre-switch
legacy app, kept for rollback).

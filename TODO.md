# TODO

Reviewed 2026-09-26 after the engine-submodule switch (89eb7cf) and republish
on 3fd45bf.

The 2026-09-25 list below was written before hsk moved onto the engine
submodule to track features to port from `../vocab-engine`. That switch
(89eb7cf) landed all of them: reading passages, the gap-drill/overflow/speak
fixes, the no-voice fallback, the characters stage, the learning-order switch,
and the Samsung Internet notice are now all present in `engine/engine/app.html`
and `engine/engine/core.js`, confirmed by grep during the 3fd45bf republish
(passages.json has the same 60 passages; `isSamsungBrowser`, `speechUsable`,
`bareForm`/`findSurface`/`locateWord`, `overflow-wrap`, and the learning-order
chips all match). Nothing here needs porting by hand anymore.

## Still open (hsk-specific)

### Content-policy screening of the sentence corpus
The packbuilder's shared sensitive-content filter (`vocab-engine/tools/packbuilder/README.md`
~150–200, `langs/base.py` `SENSITIVE_EN`/`SENSITIVE_GLOSS_EN`) has never been
applied to the HSK corpus (`data/hsk_sentences.js`), because hsk's sentences
were never routed through the packbuilder. `tools/check_sentences.py` exists
but has no sensitive-content checks (verified 2026-09-26: no `sensitive`/
`SENSITIVE`/`drop_all_levels` hits). Add the same three-tier screening there.

### Browser smoke script
Other language repos have a Playwright smoke script that seeds progress and
walks Today/Learn/Read/Test at 390px (`../italian/.cache/live/check.js`).
hsk has no equivalent under `.cache/live/`. `validate_pack.py` and the
stale-build/byte-identical double-build guard are already wired into
`check.sh`, so only the browser walk is missing.

## Migration policy
Every engine bump into this repo needs, before merging/pushing:
1. Engine-range storage/migration/sw diff audit — `git -C engine log/diff`
   over the old..new range for `dist/sw.js` and the `migrateLegacy`/
   `storageKey`/`parseStored`/`defaultProg`/`validateProgShape`/
   `normalizeProg` functions in `engine/core.js`.
2. `node tests/migration_checks.js` and `node tests/characters_app_checks.js`
   green in `vocab-engine`.
3. A live snapshot diff by a browser worker against the previous published
   build (progress intact, no console errors).
4. The rollback commit hash recorded before pushing.

Migration proof 2026-09-26 for 4e5d4dc (engine 63109a7 → 3fd45bf): a real-use vocab_zh snapshot
from d612e63 (39 word records, 4 sets, 2 lessons, 3 sessions, theme, showPron) loaded into the live
build with 0 field diffs after a full UI walk, offline boot and two reloads; a legacy hsk_pinyin
record migrated byte-identically to the old build's result with the .bak key kept. Inputs and
scripts: .cache/live/ (gitignored).

Migration proof 2026-09-26 for the 122d88a republish (engine 3fd45bf → 122d88a, typed pinyin +
typed characters items, lenient folds + collision guard): storage/migration diff audit found the
engine.js diff (`git -C engine diff 3fd45bf..122d88a -- engine/core.js engine/app.html engine/sw.js`,
217 lines) touches only the compare-time API export list — additive names
`foldLenientLetters`, `LENIENT_LETTERS`, `pointingKey`, `listenPlanCount`, `kanaFold`,
`plainPronKey`, `affixBare`, `typeSlotKind` — with no changes to `parseStored`, `migrateLegacy`,
`storageKey`, `defaultProg`, `validateProgShape`, or `normalizeProg`, no `localStorage` calls
touched, no `vocab_`/`hsk_pinyin` key strings touched, and `engine/sw.js` unchanged (0 diff lines).
No progress-record field changes. `tests/migration_checks.js` (270 passed) and
`tests/characters_app_checks.js` (177 passed) both green at 122d88a in vocab-engine. Rollback hash
(pre-republish HEAD): 254c035d13d0b0556e1a4d3a1d7e9f9c44ad66be. Pre-republish live/local md5s:
index.html e055d7959592a0d62a3c43134957a19c, sw.js b6f206a94a0d52ce230e7f90743b04a4 (live and
local checkout matched before the build). A browser worker runs the live snapshot-diff proof
(progress intact, no console errors) separately.

## Org move (2026-09-26)
Site: https://bannerless-studio.github.io/chinese/ (repo Bannerless-Studio/chinese). The user migrated progress by Export/Import and confirmed it; the old repo ishmum123/hsk is archived with Pages disabled (old URL dead). It is not deleted (token lacks delete_repo); delete only on the user's say-so. Local remote `legacy` may be removed.

Renamed 2026-09-26: repo and path are now Bannerless-Studio/chinese, live https://bannerless-studio.github.io/chinese/ (same origin, so localStorage progress vocab_zh carries over; the old /hsk/ path is dead). Local checkout: ~/Programming/Voluntary/chinese.

# TODO

Reviewed 2026-09-26 after the engine-submodule switch (89eb7cf) and republish
on 3fd45bf.

**Rollback to the pre-engine-switch build:** reset `main` to `3aeecc4` and
republish. `hsk_pinyin` progress is never modified, so the old build resumes
at its pre-switch state; progress made after the switch stays in `vocab_zh`.

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

Migration proof 2026-09-26 (engine 122d88a, commit 0109f91): PASS, KEEP. Browser proof in .cache/live/proof-122d88a/ — vocab_zh byte-equal after boot, legacy hsk_pinyin → vocab_zh + .bak identical to the d612e63 proof, Progress numbers match, pinyin item silent + tone-optional ("ge" for gè accepted with note), characters item speaks once on mount, below-tier words never get the characters item (3 sessions, 0/24), offline boot OK, 0 console errors. Rollback 254c035 not needed.

Migration proof 2026-09-26 for the dec16e8 republish (engine 122d88a -> dec16e8, Today Read stage,
Replay buttons + TTS reliability driver, cue lines in ink): storage/migration diff audit
(`git -C engine diff 122d88a..dec16e8 -- engine/core.js engine/app.html engine/sw.js`, 741 lines)
found the app.html/core.js diff adds `nextReadItem`/`isoDayNumber` (Today's Read-stage picker),
the `ttsDriver`/`clipStartWatch` Replay/reliability helpers, and cue-line rendering/classes — all
additive. The only reads of stored shape are `prog.read.done[id]` fields `sc`/`n`/`d` (existing
`{sc,n,d,x}` shape, unchanged) via `isObj`/typeof guards; no write path, no new top-level key, no
renamed key, no `storageKey`/`migrateLegacy`/`parseStored`/`defaultProg`/`validateProgShape`/
`normalizeProg` touched, no `localStorage`/`vocab_`/`hsk_pinyin` string touched, and `engine/sw.js`
is unchanged (0 diff lines). `tests/migration_checks.js` (270 passed, 0 skipped) green at dec16e8
in vocab-engine (tree already at dec16e8, clean, read-only — not modified). Rollback hash
  Browser proof 2026-09-27 00:05 PASS 5/5, verdict KEEP (chinese/.cache/live/proof-dec16e8/, run.js + result-*.json + screenshots): vocab_zh byte-equal after boot, Progress rows equal the 122d88a proof, hsk_pinyin legacy migrates with .bak; Today has no Read hint box and a "6. Read" plan row, Skip today leaves read.done untouched, reading + Continue writes read.done.p0001 {sc,n,d,x}; Replay #rpa/#rvp call counts as specified, typed pinyin silent; cue line class q cue 17px ink; offline boot from SW cache ve:/chinese/ new build id; no console errors.
(pre-republish HEAD): 045ef3f45ae9434f9aba22f1bdc95258651468bd. Pre-republish live/local md5s:
index.html 6436898b16d495e3b76bd9f910e3199a, sw.js 1be2fa87920165896a8cfce08a47f613 (live and
local checkout matched before the build). `./check.sh` green (0 errors) after the build; only
`engine`, `index.html`, `sw.js` changed in the working tree, so the `pack/` files are unchanged.

Migration proof 2026-09-27 for the e370698 republish (engine dec16e8 -> e370698, passage questions
spoken + Replay, source sentence played on reveal, question translation behind "Show translation",
speech stopped on every screen transition, LISTENING PASS: a Today spaced re-read becomes a
listening pass when audio is available): storage/migration diff audit (`git -C engine diff
dec16e8..e370698 -- engine/core.js engine/app.html engine/sw.js`, 232 changed lines across
app.html/core.js) found exactly ONE stored-shape change: `markPassageDone(prog, pid, sc, n, d,
listen)` gains an optional `listen` arg and, when set, writes `st.done[pid].l = 1` on the whole
replaced `{sc,n,d,x}` record (a later reading pass replaces the record and drops `l`, since the
record is written whole each time, not merged). `validateReadShape` extends its numeric-field
check from `["sc","n","x"]` to `["sc","n","x","l"]`, so an absent `l` is accepted (undefined skips
the typeof check) and a non-number `l` is rejected exactly like a bad `sc`/`n`/`x` today (rejection
routes through the existing `validateProgShape` -> `bootProg` path, which keeps a `.bak` and starts
fresh, unchanged from before). No new top-level key, no renamed key, no other field touched; no
`storageKey`/`migrateLegacy`/`parseStored`/`defaultProg`/`normalizeProg` touched, no
`localStorage`/`vocab_`/`hsk_pinyin` string touched, and `engine/sw.js` is unchanged (0 diff
lines). `tests/migration_checks.js` (279 passed, 0 skipped, including a new `[read.done.l]`
listening-pass-marker suite covering: pre-listen records boot unchanged, a listening pass writes
l:1 on that record only, parseStored/validateProgShape accept a record with l, l survives
save/boot and export/import round trips, a later reading pass replaces the record without l, and a
non-number l is rejected with a kept backup) green at e370698 in vocab-engine (tree already at
e370698, clean, read-only — not modified). Rollback hash (pre-republish HEAD):
  Browser proof 2026-09-27 05:10 PASS 5/5, verdict KEEP (chinese/.cache/live/proof-e370698/: run.js, result-{mig,read,listen,leak}.json, screenshots; the worker's runs finished 01:00 but its report was compiled by the orchestrator from the result files). Migration: vocab_zh byte-equal after boot, Progress rows equal the dec16e8 proof, hsk_pinyin migrates with .bak; read.done records with and without `l` survive reload unchanged. Reading pass: question spoken once on mount (+1 on #rpa tap), translation hidden behind #qtr and shown on tap, source sentence spoken on reveal with #rvp, results line ' · translation shown' only on the peeked question, Replay per sentence, no autoplay. Listening pass (seed d 8 days ago, no l, zh voices present): plan row '6. Listen', passage text absent from the DOM, Play all speaks sentences in order, Stop, Show text, 3 of 5 questions hidden behind #qsh, ' · question shown' only on the tapped one, headers 'Listening pass' + 'Text shown while listening', done record {sc:4,n:5,d,x:2,l:1}; second run with l:1 → plan row '6. Read … to re-read' (alternation). Leak: tab switch mid-question cancels speech, nothing spoken after. Offline boot from SW cache ve:/chinese/ new build id, no console errors. Not verified in browser (unit-tested only): auto-reveal of a hidden question's text after answering (the probe checked hanzi in a pinyin-first display).
baf8905071835aa7791738de166dcf23eddd1aba. Pre-republish live/local md5s: index.html
d7c07ce9f96ee5295bacf81b4d6b8850, sw.js db88f8c18841af51ce74f791360de144 (live and local checkout
matched before the build). `./check.sh` green (0 errors, `validate_pack.py` 1193 words, 882
sentences, 12 lessons, 60 passages, 1193 character units, 0 warnings) after the build; only
`engine`, `index.html`, `sw.js` changed in the working tree (pack files md5 unchanged:
8c181c3a1bfc12b1ec50ac88c993b9e4 before and after). A browser worker runs the live snapshot-diff
proof (progress intact, no console errors) separately.
A browser worker runs the live snapshot-diff proof (progress intact, no console errors) separately.

Migration proof 2026-09-27 for the 0e2bb0c republish (engine e370698 -> 0e2bb0c, new optional word
field `forms` (inflected surfaces locate a word in text, never typed), `textForms` helper at every
locate-in-text site, a cloze distractor guard so no option's spelling equals the blanked text):
storage/migration diff audit (`git -C engine diff e370698..0e2bb0c -- engine/core.js engine/app.html
engine/sw.js`, 59 changed lines, core.js only; engine/app.html and engine/sw.js unchanged, 0 diff
lines) found ZERO stored-shape changes. The diff adds a `textForms(e)` helper (w + alt + forms) used
at every locate-in-text call site (`locateWord`, `packSurfaces`, `gapMatch`, `exampleSentences`,
`highlightParts`, `searchFields`, `passageSegments`) and a `gapChoices` distractor guard (`fits`)
that drops any pool word whose own w/alt surface equals the blanked text; both are read-time-only
over pack word data, not stored progress. Grep of the diff for `storageKey`/`migrateLegacy`/
`localStorage`/`vocab_`/`hsk_pinyin`/`prog.read`/`parseStored`/`defaultProg`/`validateProgShape`/
`normalizeProg`/`bootProg` hits only the unchanged `API` export list (one line adds `textForms` to
that list; no other match). No new top-level key, no renamed key, no stored progress-record field
touched. The zh pack has no `forms` field and was not rebuilt: `pack/*.js` md5s identical before and
after `./build.sh`. `validateReadShape` (accepts absent `l`, rejects a non-number `l`, unchanged from
the e370698 wave) and `bootProg` (keeps `.bak` and starts fresh on a validation failure) were
re-read at 0e2bb0c and confirmed unchanged by this diff. `tests/migration_checks.js` (279 passed, 0
skipped, including the `[read.done.l]` suite) green at 0e2bb0c in vocab-engine (tree already at
0e2bb0c, clean except the untracked, unrelated `langs/sw.py`; read-only, not modified). Rollback
hash (pre-republish HEAD): 9e8e927cdd1a3c319abc2ebc1dc9f91841e4d135. Pre-republish live/local md5s:
index.html ea0fe40912c4b3950bddc9a6ebb14d8b, sw.js 159917cf742cc8aac2cfcf9379e2e8d1 (live and local
checkout matched before the build). `./check.sh` green (`validate_pack.py` 1193 words, 882
sentences, 12 lessons, 60 passages, 1193 character units, 0 errors, 0 warnings) after the build;
only `engine`, `index.html`, `sw.js` changed in the working tree (pack files md5 unchanged). Browser proof (Playwright, .cache/live/proof-0e2bb0c/, 2026-09-27 ~11:40): migration seeds byte-equal (vocab_zh, hsk_pinyin + .bak, read.done with/without l), cloze 4 options with no distractor equal to the blank, typed pinyin accepted 7/7, Read tab highlights + gloss, passage audio and listening pass unchanged, no TTS leak on tab switch, offline boot from SW cache, 0 console errors. Verdict KEEP; rollback 9e8e927 not needed.

Migration proof 2026-09-28 for the 4230306 republish (engine 0e2bb0c -> 4230306, missed-kind
reviews: optional word field `k` remembering the item kind (recall/type/hear/read) a word was last
missed in so the next review asks it the same way, look-back weight `reopened` 2 -> 0 (shown on
results but no longer weakens a word), Today screen re-entry restore, Test-tab unlock notes, typed
second-miss fallback, forms-aware articles): storage/migration diff audit (`git -C engine diff
0e2bb0c..4230306 -- engine/core.js engine/app.html engine/sw.js`, 713 diff lines, app.html 187 +
core.js 146 changed, `engine/sw.js` unchanged, 0 diff lines) found exactly ONE stored-shape change:
`markRec(map, key, ok, isWord, kind, reqKind)` calls the new `setMissKind(p, ok, kind, reqKind)`,
which writes an optional `p.k` (one of `MISS_KINDS`) on a word's `prog.w[id]` record — a miss sets
`p.k = kind`; a pass in that exact kind, or in `reqKind` (the fallback kind the plan actually
asked for), deletes `k`. `normalizeProg` gains a `merged.w = dropBadMissKinds(merged.w)` call:
`dropBadMissKinds` walks `prog.w`, drops any `k` outside `MISS_KINDS` (unknown string, number,
null, object) and keeps the rest of that record, leaving records without `k`, or with a valid one,
as the same object (byte-identical round trip). No new top-level key, no renamed key, no other
field touched; `storageKey`/`migrateLegacy`/`parseStored`/`defaultProg`/`validateProgShape` are
untouched (grep of the diff for `storageKey|migrateLegacy|localStorage|vocab_|hsk_pinyin|
validateProgShape|normalizeProg|bootProg|defaultProg|parseStored` hits only the unchanged export
list, the one new `normalizeProg` line above, and comments). The `reopened` look-back weight
(`READ_WEIGHT.reopened` 2 -> 0) is a constant change read by `applyWeakWords`, not a stored-shape
change — the existing `prog.w[id].w` weight field is untouched. `tests/migration_checks.js` (292
passed, 0 skipped — 279 from the e370698/0e2bb0c baseline plus a new `[w.k]` missed-kind-marker
suite: records without `k` boot/save/import unchanged, a typed miss writes `k:"type"` on that
record only, `k` survives save/boot and export/import round trips, a pass in the missed kind
removes `k`, and each bad `k` shape (string/number/null/object) is dropped on boot and import while
a valid `k` on another word is kept) and `tests/characters_app_checks.js` (179 passed, 0 failed)
green at 4230306 in vocab-engine (tree already at 4230306, read-only, not modified; only the
pre-existing untracked `tools/packbuilder/langs/sw.py` present, unrelated). The zh pack was not
rebuilt: `pack/*.js` md5s identical before and after `./build.sh` (`b27794f9...` characters,
`30ed7362...` legacy, `cf734230...` lessons, `2aa874b7...` pack, `52745388...` sentences,
`080e9903...` words — same before/after). `./check.sh` green (`validate_pack.py` 1193 words, 882
sentences, 12 lessons, 60 passages, 1193 character units, 0 errors, 0 warnings); only `engine`,
`index.html`, `sw.js` changed in the working tree. Rollback hash (pre-republish HEAD):
2dfdc8cbffa574623fb11a647c75b340e3df3ff7. Pre-republish live/local md5s: index.html
935b59ef31bae72437837a6126fdf8ba, sw.js 5095f7fd29b2ec48a56504fb8890b2c7 (live and local checkout
matched before the build). Browser proof (Playwright, .cache/live/proof-4230306/, 2026-09-28 ~22:55): migration seeds byte-equal incl. k kept / bogus k dropped, missed-kind review item shown as hear and k cleared on pass, look-back row without checkbox and no w increment, Read-tab re-entry silent with same option order, Test-tab unlock note, offline boot, 0 console errors; 0e2bb0c regression checks all pass. Verdict KEEP; rollback 2dfdc8c not needed.

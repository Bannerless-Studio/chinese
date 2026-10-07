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

### TTS carriers for polyphonic characters
38 words carry a `say` carrier (another character the TTS reads with the
intended reading; spoken, never displayed). The carrier record and how to
regenerate it live in vocab-engine `docs/ZH_SAY.md` (`engine/docs/ZH_SAY.md`
here; `tools/zh_say_scan.py`). Re-check it when the vocabulary or the
browser voices change.

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
5. Scope of step 3 (owner 2026-10-07, "why so long?"): the live proof is the storage round-trip only —
   owner seed byte-equal after boot/reload/Progress, one session on live, the record boots on the
   previous build and back, no backup keys, 0 console errors — plus one smoke screenshot (~5 min).
   Feature checks run once, on the pre-push scratch site (the feature browser check); they are not
   repeated on live. Drivers: reuse chinese/.cache/live/proof-<prev>/ scripts (browser-playbook: scripted
   Playwright, no snapshots).

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

Migration proof 2026-09-28 for the 53eb630 republish (engine 4230306 -> 53eb630, learned words
derived from progress records instead of the level set-counter prefix, plus what-comment
pruning fa598bc/b63900e, tokens identical): storage/migration diff audit (`git -C engine diff
4230306..53eb630 -- engine/core.js engine/app.html engine/sw.template.js`, 4247 diff lines)
found ZERO new/renamed stored fields. Grep of the diff for
`storageKey|migrateLegacy|localStorage|vocab_|hsk_pinyin|prog\.read|prog\.w\[|PROG_VERSION|
normalizeProg|bootProg|defaultProg|validateProgShape|parseStored`, filtered to actual +/- lines,
hits only: (1) comment-only removals (what-comments above `migrateLegacy`, `storageKey`,
localStorage doc lines etc. — the fa598bc/b63900e prune, zero behaviour change), and (2) the two
real code changes, both touching `prog.w` writes only: `pinPrefixRecords(prog, words, pack, lv,
counters)` (new) writes `prog.w[w.id] = {r:1,w:0,s:1,prov:1}` for every word in a records-less
level's counted prefix that has no record yet, called once before that level's first taught
record lands; `ensureWordRec(prog, words, pack, id)` (new) returns an existing `prog.w[id]` or
creates a plain `{r:0,w:0,s:0}` and is now the single entry point `markWord`/`applyWeakWords`/
the Words-tab d-flag/`applyPlacement` go through before writing a record (the diff removes three
inline duplicates of this same create-if-missing pattern at app.html `markWord`/Words-tab d-flag
and core.js `applyWeakWords`, now routed through `ensureWordRec`). The functions
`storageKey`/`migrateLegacy`/`PROG_VERSION`/`normalizeProg`/`bootProg`/`defaultProg`/
`validateProgShape`/`parseStored` are themselves byte-unchanged (only comment lines above them
were touched). No new top-level key, no renamed key, no `PROG_VERSION` bump. `engine/sw.template.js`
0 diff lines. Browser proof (Playwright, .cache/live/proof-53eb630/, 2026-09-29 ~00:15): live md5 matched; vocab_zh seed byte-equal after boot and reload, read.done with/without l and k kept/bogus dropped as before, hsk_pinyin migrates with .bak; Progress rows equal proof-4230306 except the predicted HSK 1 30 -> 27 (records rule) on the synthetic seed; records-less level (sets 1:2, w empty): boot writes nothing, one review answer pins exactly the 20 prefix records (19 prov), still 20 learned; Learn taught w0009/w0010 + next 8 unlearned in rank order, never a recorded word, Words tab set 1 no tick; regression checks (hear kind + k cleared, look-back no checkbox, re-entry silent, Test-tab note) pass; offline boot ok; 0 console errors. Nit logged: Today "set N" label counts the counter, not the taught slice. Verdict KEEP; rollback ec3282d not needed.

`tests/migration_checks.js` 292 passed, 0 skipped, green at 53eb630 in vocab-engine (tree
already at 53eb630, read-only, not modified; only the pre-existing untracked
`tools/packbuilder/langs/sw.py`, unrelated). Byte-equal-after-boot check (chinese/.cache/live/
compare-53eb630.js, comparing `git show 4230306:engine/core.js` vs `53eb630:engine/core.js`):
`legacy-migrated-d612e63.json` (an already-native `vocab_zh`-shape export, 27 word records) boots
to an identical `prog` object on both cores — confirms `bootProg`/`normalizeProg`/
`validateProgShape` are unaffected. `learnedWords` check on `legacy-hsk_pinyin.json` (a real
pre-engine `hsk_pinyin` export, `sets:{"1":3,...}` i.e. 3 counted sets = 30 words in level 1, but
only 27 individual `w` records) surfaced an expected, reviewed DIVERGENCE, not a stored-shape
bug: old core's prefix-counting `learnedWords` reports 30 words learned; new core's
records-based `learnedWords` reports 27, because level 1 already has some records (`taughtRec`
true for at least one word), so `pinPrefixRecords`'s "no taught record yet" guard never fires for
that level and the 3 sets-counted-but-unrecorded words (w0028-w0030) are not credited. This is
the exact, intended tradeoff of engine commit e757e38 ("a republish that reorders/edits a level
shifted the counter prefix... a word counted as learned untaught, a learned word taught again" —
TODO.md-equivalent note in vocab-engine, DONE 2026-09-28 branch engine-learned) and is covered by
`tests/engine_checks.js` case [29] ("legacy + one set's records written directly -> the records
rule applies (just those words)"). No progress record is deleted or corrupted: `w0028-w0030`
simply stop counting as learned until re-taught, at which point Learn/Words-tab/placement writes
a normal record for them via `ensureWordRec` (confirmed: `ensureWordRec(prog, WORDS, PACK,
'w0028')` on the migrated prog raises the count from 27 to 28, i.e. that specific word's record
is created; `pinPrefixRecords` itself is correctly a no-op here per its own "no taught record in
this level yet" guard, since the level already has 27 taught records — w0029/w0030 stay
un-recredited until Learn reaches them, same as any other never-answered word). Live-user impact:
narrow — this path only fires for a learner whose `hsk_pinyin` key was never migrated by an
earlier republish (0e2bb0c/122d88a/e370698 already migrate most active users to `vocab_zh`) AND
whose old per-word records lagged their old sets counter; for them, up to a handful of
previously-"learned" words may resurface as new-to-learn after this republish. Flagging for
awareness, not blocking: this is upstream, reviewed engine behaviour (not introduced by this
republish's build step) and the alternative (reverting to the old prefix rule) reintroduces the
reorder bug e757e38 fixed. The zh pack was not rebuilt: `pack/*.js` md5s identical before and
after `./build.sh` (`b27794f9...` characters, `30ed7362...` legacy, `cf734230...` lessons,
`2aa874b7...` pack, `527453a8...` sentences, `080e9903...` words — same before/after). `./check.sh`
green (`validate_pack.py` 1193 words, 882 sentences, 12 lessons, 60 passages, 1193 character
units, 0 errors, 0 warnings); only `engine`, `index.html`, `sw.js` changed in the working tree.
Rollback hash (pre-republish HEAD): ec3282d0547fad9a2461b131061b6b125b03fb27. Pre-republish
live/local md5s: index.html 053dc8cb60495bdb1ee470c1222bf3ea, sw.js
1b98802070536800c0b6960fa64beb3f (live and local checkout matched before the build). Browser
proof pending (separate worker).

Migration proof 2026-09-29 for the dbbf541 republish (engine 53eb630 -> dbbf541, "set N" labels
naming the taught slice instead of the sets counter, inline data-URI favicon, cloze blank
extension over hyphen-joined repeats/clitics, example picker covering forms, meaningOpts pos
tiering, optional pack fields soundsHint/placementItems/clitics): storage/migration diff audit
(`git -C engine diff 53eb630..dbbf541 -- engine/core.js engine/app.html engine/sw.template.js`,
285 diff lines) found ZERO new/renamed stored fields; `engine/sw.template.js` is unchanged (0
diff lines). Grep of the diff for
`storageKey|migrateLegacy|localStorage|vocab_|hsk_pinyin|prog\.read|prog\.w\[|prog\.sets|
PROG_VERSION|normalizeProg|bootProg|defaultProg|validateProgShape|parseStored`, filtered to
actual +/- lines, hits exactly one real write-path change: the Today Learn drill-completion
callback, which used to unconditionally write
`prog.sets[nn.lv] = Math.max(prog.sets[nn.lv]||0, nn.set+1)`, now writes
`prog.sets[nn.lv] = stillFresh ? Math.max(prog.sets[nn.lv]||0, nn.set+1) : VC.nSets(...)` where
`stillFresh = VC.levelNewSet(WORDS, PACK, prog, nn.lv)` — a WRITE to the existing `prog.sets[lv]`
counter (no new field, no renamed key), landing on the level's true total set count instead of
one below it when a records-less prefix or inserted word makes this teach the level's last
unlearned set even though the rank-position `nn.set` is short of the total. `storageKey`,
`migrateLegacy`, `PROG_VERSION`, `normalizeProg`, `bootProg`, `defaultProg`, `validateProgShape`,
`parseStored` are themselves untouched (no match in the diff besides the one line above and the
unrelated favicon/soundsHint/clitics/forms/pos-tiering diff noise). No `PROG_VERSION` bump.
`tests/migration_checks.js` (292 passed, 0 skipped) green at dbbf541 in vocab-engine (tree
already at dbbf541, clean except the pre-existing untracked `tools/packbuilder/langs/sw.py`,
unrelated; read-only, not modified). The zh pack was not rebuilt: `pack/*.js` md5s identical
before and after `./build.sh` (`b27794f9...` characters, `30ed7362...` legacy, `cf734230...`
lessons, `2aa874b7...` pack, `527453a8...` sentences, `080e9903...` words — same before/after).
`./check.sh` green (`validate_pack.py` 1193 words, 882 sentences, 12 lessons, 60 passages, 1193
character units, 0 errors, 0 warnings); only `engine`, `index.html`, `sw.js` changed in the
working tree. Rollback hash (pre-republish HEAD): 3fa1c0c27fb7499df666b862760009095a6f3dd8.
Pre-republish live/local md5s: index.html b48d57fda1c40e5138ed6ba33926ce76, sw.js
06fd11968eb23d3a8c1765ff8a0958d7 (live and local checkout matched before the build). A browser
worker runs the live snapshot-diff proof (progress intact, "set N" label behaviour, no console
errors) separately.
 Browser proof (Playwright, .cache/live/proof-dbbf541/, 2026-09-29 ~06:20): live md5 matched; vocab_zh byte-equal after boot, Progress rows equal proof-53eb630, read.done/k variants and hsk_pinyin .bak as before; plan label "set 1" for a level with records at ranks 1–8/11–12 and the teach covered exactly w0009 w0010 w0013–w0020 (no double teach); favicon served as data: URI, no favicon request, 0 4xx; zh has no pos so distractor tiering N/A (distractors all same level); regression checks (pin, look-back, re-entry, Test note, hear kind) identical; offline boot ok; 0 console errors. Finding: after that teach prog.sets["1"] stayed 1 (counter lags by one; learned count is record-based so nothing lost) — logged as engine follow-up. Verdict KEEP; rollback 3fa1c0c not needed.
Migration proof 2026-09-30 for the 2f2bf02 republish (engine dbbf541 -> 2f2bf02, typed drills from
the target side (pack.json `typedFrom: ["written","pron"]`, `glossFocus: true`: chars->pinyin,
chars->meaning, pinyin->meaning), settleSetCounter (fixes the proof-dbbf541 "counter lags by one"
finding), no-voice planner (hear items become read with reqKind "hear" when the word cannot be
played), sentence `spans`, word popover offset): storage/migration diff audit (`git -C engine diff
dbbf541..2f2bf02 -- engine/core.js engine/app.html engine/sw.template.js`, 407+/67-, core.js +
app.html; `engine/sw.template.js` 0 diff lines) found ZERO new/renamed stored fields. Grep of the
diff +/- lines for `storageKey|migrateLegacy|localStorage|vocab_|hsk_pinyin|PROG_VERSION|
normalizeProg|bootProg|defaultProg|validateProgShape|parseStored|prog.<field> =|sets[` hits only
`prog.sets[lv]` writes: (1) Today Learn completion: the old
`prog.sets[nn.lv] = stillFresh ? Math.max(prog.sets[nn.lv]||0, nn.set+1) : VC.nSets(...)` is
replaced by `VC.settleSetCounter(prog, WORDS, PACK, nn.lv)`; (2) Words-tab set drill: the old
`if(wordsSet === (prog.sets[wordsLv]||0)){ prog.sets[wordsLv] = wordsSet+1; } else { ...d = 1 }`
becomes `if(wordsSet !== (prog.sets[wordsLv]||0)) set.forEach(... ensureWordRec(...).d = 1)` then
`VC.settleSetCounter(prog, WORDS, PACK, wordsLv)` (same existing `d` flag, same condition);
(3) `applyPlacement` ends with `ids.forEach(lv => settleSetCounter(out, words, pack, lv))`.
settleSetCounter rule (core.js): n = nSets(level); if the level has no new set left,
`prog.sets[lv] = n`; else `prog.sets[lv] = max(min(prog.sets[lv]||0, n), lead)` where lead = the
number of leading sets whose every word has a `prog.w` record. So it never lowers a counter unless
it exceeds nSets (then clamps to n), and raises it only to the fully-recorded leading-set count. It
is not called at boot: only on those three write paths. Typed-from items record through the
existing `markWord(id, ok, "type", reqKind)` -> unchanged `markRec`/`setMissKind`
(`MISS_KINDS = ["recall","type","hear","read"]`, unchanged); 2nd-miss MC fallbacks record kind
"recall"/"type". `PROG_VERSION = 1` unchanged; no `localStorage` line touched. `tests/migration_checks.js`
292 passed, 0 skipped, and `tests/characters_app_checks.js` 179 passed at 2f2bf02 in vocab-engine
(tree already at 2f2bf02, clean, read-only). The zh pack WAS rebuilt (`pack_from_hsk.py` from an
`engine` archive at 2f2bf02 into a scratch dir, run twice, byte-identical, equal to
vocab-engine/packs/zh): only pack.json/pack.js (+`typedFrom`, +`glossFocus`, no other key changed)
and sentences.json/sentences.js (+`spans` on all 882 sentences, no other field changed) differ;
words, lessons, characters, legacy, passages, passages_src, gloss_display byte-identical.
`validate_pack.py pack`: 1193 words, 882 sentences (882 with spans), 12 lessons, 60 passages, 1193
character units, 0 errors, 1 WARN (138 of 4946 linked words have no span; located by w/alt/forms).
Build deterministic (two builds: index.html ae28fb37c4199f44ddcdcfd9bc394a61, sw.js
0b3db60173a3f5c4486a165bfbcca579). Rollback hash (pre-republish HEAD):
8d76a4a884148c607b3b793050a944b581ea343a. Pre-republish live/local md5s: index.html
c781bc58a2d638c36ab895d25d384c2d, sw.js 889158cea9b48edcf281ce81b6fda0ee (live and local matched).
A browser worker runs the live snapshot-diff proof (progress intact, set counter, typed-from drills,
no console errors) separately.
 Browser proof (Playwright, .cache/live/proof-2f2bf02/, 2026-09-30): live md5 matched (index.html ae28fb37..., sw.js 0b3db601...); vocab_zh byte-equal after boot and reload, Progress rows equal proof-dbbf541, read.done with/without l, k kept/bogus dropped, hsk_pinyin migrates with .bak as before; prog.sets on the synthetic seed {1:3,2:0,3:0,4:0} unchanged by boot (no write; settleSetCounter would also give 3, not called at boot). Set counter: the proof-dbbf541 scenario (records at ranks 1–8/11–12) teaches exactly w0009 w0010 w0013–w0020 once, prog.sets["1"] now 2 (was stuck at 1), Today "set 3" and Words tab "Set 3 / 15" follow. No-voice (getVoices stubbed to en-US only, hasSpeech false): Review plan has 0 hear items (6 read items with reqKind hear), Today Listen row "no items until a voice or recording is available", Test Listen button hidden with the note; seeded k:"hear" on w0001 cleared by a pass of its read stand-in. Typed drills (Test Recall; written kinds need mastered character units, seeded in a second profile): writtenMeaning 27, pronMeaning 16+54, writtenPron 29 seen, 0 leaks (no ruby/pinyin on a characters stimulus, no characters with a pinyin stimulus, no audio before answering, no tap targets or popover); "first" accepted for "first (of multiple parts); ..."; reveal of 谁 shows "also pr. [shuí]" dimmed; 2nd-miss fallbacks ("What does it mean?" x2, "How is it said?") silent until answered, k stays "type". Glosses: Words tab qualifiers dimmed (opacity .6); Read popover qualifiers dimmed, sticky top 14px (rect top 14 when scrolled), 2px border, light and dark. Regressions (cloze 4 options, typed pinyin accepted, Read tab highlight + gloss, passage audio, look-back row, re-entry silent, offline boot) pass; 0 console errors, 0 4xx. Verdict KEEP; rollback 8d76a4a not needed.

Migration proof 2026-10-01 for the 3d66aea republish (engine 2f2bf02 -> 3d66aea: session resume,
silent characters item for meaning->characters, typed rotation 6:3, `say` TTS carriers, character
hints): storage/migration diff audit (`git -C engine diff 2f2bf02..3d66aea -- engine/core.js
engine/app.html engine/sw.template.js build.sh`, 438+/58-; `engine/sw.template.js` 0 diff lines)
found ZERO new/renamed/differently-written fields in `vocab_zh`. Grep of the diff +/- lines for
`storageKey|migrateLegacy|localStorage|sessionStorage|vocab_|hsk_pinyin|_session|VE_BUILD|
PROG_VERSION|normalizeProg|parseStored|defaultProg|validateProgShape|bootProg|prog.<field> =|sets[`:
no `localStorage` line, no `PROG_VERSION`/`parseStored`/`migrateLegacy`/`storageKey` change. The
three existing progress writes are moved verbatim into named done-callbacks (`rzTag`) so a resumed
drill can rebuild them: `todayLearnDone(lv)` = `settleSetCounter(prog, WORDS, PACK, lv); store.save()`
(was inline with `nn.lv`); `lessonDone(i)` = `prog.lessons[LESSON_LIST[i].id] = 1; store.save()`;
`wordsSetDone(lv, set, untaught)` = `if(wordsSet !== (prog.sets[wordsLv]||0)) untaught.forEach(id =>
ensureWordRec(...).d = 1)` + `settleSetCounter` (was `set.forEach(w => if(!got.has(w.id)) ...)`;
`untaught` = the same `!got.has` filter computed when the drill starts; resume restores
`wordsLv`/`wordsSet` from the record before calling it). settleSetCounter rule unchanged from
2f2bf02 (never lowers except clamping above nSets; raises only to the fully-recorded leading-set
count; not called at boot). New storage: sessionStorage key `vocab_zh_session` only (core.js
`sessionKey(pack) = storageKey(pack) + "_session"`, app.html `sessStore` with in-memory fallback;
record `{v, build, t, fp, tab, today?, drill?|rd?}`; dropped on build/fingerprint mismatch, >12 h,
corrupt JSON; resume and boot never write `prog`). `VE_BUILD` = build.sh cksum of the page sources
(index.html carries `1625184988-1728638`). `tests/migration_checks.js` 295 passed 0 skipped (incl.
[session]: key differs from progress/legacy/backup keys, migrated progress has no session field),
`tests/session_resume_checks.js` 67 passed, `tests/characters_app_checks.js` 201 passed at 3d66aea
in vocab-engine (tree clean, read-only). The zh pack WAS rebuilt (`pack_from_hsk.py` from an
`engine` archive at 3d66aea into two scratch dirs, byte-identical, equal to vocab-engine/packs/zh):
pack.json, sentences, lessons, legacy, passages, passages_src, gloss_display byte-identical vs the
2f2bf02 pack; words.json +`say` on 38 words, characters.json +`hint` on 1164 units and +`say` on
38, no other field changed; new pack/attribution.json. `validate_pack.py pack`: 1193 words, 882
sentences (882 with spans), 12 lessons, 60 passages, 1193 character units, 0 errors, 1 WARN (138
of 4946 linked words have no span). Build deterministic (two builds: index.html
69e0292b46085c10f08f21f8678411c6, sw.js 3cabe66a9cf02141543d20b088f0ce00). LICENSES/ (LGPL-3.0,
GPL-3.0) and a README Credits section added. Rollback hash (pre-republish HEAD):
2034e744feaaa2c9182dc849facb5e99bbb5a093. Pre-republish live/local md5s: index.html
ae28fb37c4199f44ddcdcfd9bc394a61, sw.js 0b3db60173a3f5c4486a165bfbcca579 (live and local matched).
A browser worker runs the live snapshot-diff proof (progress intact, session resume, no console
errors) separately.
 Browser proof (Playwright, .cache/live/proof-3d66aea/, 2026-10-01): live md5 matched (index.html 69e0292b..., sw.js 3cabe66a...); vocab_zh byte-equal after boot and reload, Progress rows equal proof-2f2bf02, read.done with/without l, k kept/bogus dropped, hsk_pinyin migrates with .bak as before; boot writes nothing and sessionStorage stays empty until a drill starts (then only vocab_zh_session). Session resume live: Today Review after 3 answers reloads to the same item/options/score (17 left), tab switch Words->Today same item, Test Recall reload mid-way same item/seen, Read Q1 answered -> reload shows Q1 revealed with the same answer record (no re-mark), Q2 after reload unrevealed; progress unchanged by every reload; a session record planted with a fake build id is dropped on boot (key removed, Today plan shown). Silent meaning->characters card: 21 seen, 0 audio before answering, 1 on reveal. Rotation (Test Recall, units mastered, 60 typed cards): written 21 + writtenMeaning 18 = 39 vs pron 6 + pronMeaning 9 + writtenPron 6 = 21 (1.86x). TTS carriers: 还 -> 孩, 长 -> 常, 老师 -> 老师 (Words row, reveal auto + tap), Read sentence with 还 spoken as written; carrier never visible. Hints: teach cards 你/好/我 show the hint after the gloss; none on question cards or options (charSound/charRead/charPick, learn plan); reveal and written-word popover (叫) show it; pinyin-shown popover (Wǒ) none. Regressions identical to proof-2f2bf02 (set counter teach w0009 w0010 w0013-w0020, sets 1->2, "set 3"; no-voice 0 hear items, 6 reqKind hear, Test Listen hidden; typed drills 0 leaks; popover 2px border, sticky 14px, light and dark; cloze 4 options; offline boot from SW cache); 0 console errors, 0 4xx. Verdict KEEP; rollback 2034e74 not needed.

Migration proof 2026-10-02 for the ea62a45 republish (engine 3d66aea -> ea62a45: session record in
localStorage with per-tab parking, dayAware planner, typed character mastery, helpClose,
readAnswerBlock, synonym-safe meanings): storage/migration diff audit (`git -C engine diff
3d66aea..ea62a45 -- engine/core.js engine/app.html engine/sw.template.js build.sh`, 703+/120-,
core.js + app.html; `engine/sw.template.js` and `build.sh` 0 diff lines). `storageKey`,
`defaultProg`, `validateProgShape`, `validateRecMap`, `normalizeProg`, `parseStored`, `bootProg`,
`dropUnknownSets`, `applyImport`, `migrateLegacy`, `defaultCharsProg`, `validateCharsShape`,
`normalizeCharsProg`, `ensureChars`, `markRec`, `setMissKind`, `markMissKind`, `validateReadShape`,
`dropBadMissKinds`, `sessionKey`, `sessionStale`, `sessionHash` byte-identical at both shas;
`PROG_VERSION`/`CHARS_PROG_VERSION`/`SESSION_VERSION` = 1, `SESSION_MAX_AGE_MS` 12 h, unchanged.
New stored writes, all ADDITIVE and all gated by pack.json `dayAware: true` or
`characters.bareBy: "typed"`: core.js:1194 `prog.sn` (session ordinal, daySessionStart);
core.js:1199/1216 `prog.day = {d, n, a}` (dayStart/noteDay; dayLog never validates it at boot, a
malformed or other-date log reads as a fresh day); core.js:1218-1232 log entries `a[key].{r, c, u,
m, mk, ms, ma}`, core.js:1184 carry `ag`; core.js:1238-1239 `t`, `u` on the answered
`prog.w`/`prog.s`/`prog.chars.c` record (`c:` keys log kind "type" from markUnitTyped,
app.html:485). Existing field, same meaning: core.js:1877 markChar under bareBy typed keeps a
mastered unit's miss at `s = mastered` instead of markRec's reset, and a held unit's right choice
answer adds `r` without `s` (runtime writes only; boot never touches unit records). `chars.defer`
keeps its meaning ("later"); `choiceSeen` is no longer read with withWords, still written by
setCharOrder as before. None of the new fields is checked by validateProgShape/validateRecMap
(`day`/`sn` are unvalidated top-level keys kept by normalizeProg's Object.assign; `t`/`u` are not
among the checked `r/w/s/prov/d`), so none can trigger the `.bak` path; the backup triggers stay
parse failure or a shape failure of the existing fields (bootProg), plus the import/reset
backups. Session record: same key `vocab_zh_session`, moved from sessionStorage to localStorage
(app.html:1307), new fields `park` (other tabs' records) and `view` ({tab, live}); fingerprint
re-stamped on every progress save (app.html:1559 sessionRefp via store.save); import and reset
clear it (app.html:2877, 2909); the old sessionStorage record is never read. Rollback (3d66aea
reading ea62a45 progress): migration_checks "[day] previous engine 3d66aea boots day + sn + u
progress with no backup, fields kept" PASS. vocab-engine tests at ea62a45 (tree clean, read-only):
migration_checks 342 passed 0 skipped, session_resume_checks 109, day_sim_checks 59,
typed_mastery_checks 56, characters_app_checks 202, 0 failed. The zh pack WAS rebuilt
(`pack_from_hsk.py` from an `engine` archive at ea62a45 into two scratch dirs, byte-identical,
equal to vocab-engine/packs/zh): pack.json +`dayAware`, +`helpClose`, +`readAnswerBlock`,
characters +`bareBy: "typed"`, +`bareWords`, +`withWords`, stages split per level 字1-字4 (was
after 3: 1-3, after 4: 4); words.json `en` changed on 477 words, +`syn` 612, +`typedSyn` 180,
+`noTypedMeaning` 26, +`pronInGloss` 3, ids/order and every other field unchanged;
attribution.json +`gloss_overrides` (CC-CEDICT, CC-BY-SA-4.0); characters, sentences, lessons,
legacy, passages, passages_src, gloss_display, REPORT_passages byte-identical. `validate_pack.py
pack`: 1193 words, 882 sentences (882 with spans), 12 lessons, 60 passages, 1193 character units,
0 errors, 1 WARN (138 of 4946 linked words have no span). Build deterministic (two builds:
index.html 96d7b14aef0290517f3f4e178153b663, sw.js b7f176248c18b59816c9681cab8d598e). Rollback
hash (pre-republish HEAD): 41a6a8f32d05ecd6d12f0d5c0f48641a08bedc4e. Pre-republish live/local
md5s: index.html 69e0292b46085c10f08f21f8678411c6, sw.js 3cabe66a9cf02141543d20b088f0ce00 (live
and local matched). Known open items on ea62a45, carried by a follow-up republish: alternation
turn `chars.turn`, synonym unit credit, 北京-type giveaways, ~45 gloss tidy-ups. A browser worker
runs the live snapshot-diff proof separately.
 Browser proof (Playwright chromium 390x844 mobile, .cache/live/proof-ea62a45/, 2026-10-02): live md5 matched (index.html 96d7b14a..., sw.js b7f17624...). Migration: proof-3d66aea seeds (full vocab_zh, read.done with/without l, k kept/bogus dropped in memory, hsk_pinyin -> .bak) byte-equal after boot and reload, 0 bytes written at boot, no .bak for valid seeds, Progress rows equal proof-3d66aea; old-build (41a6a8f served locally) Today session + mid-session sessionStorage record copied to live: byte-equal after boot and reload, same counts, no backup, 34 mastered units not lowered, old sessionStorage record ignored (Today plan shown, no resume), Today starts. Rollback: live Today session (day, sn 2, t/u on 40 words, typed unit credit on 17 units, localStorage vocab_zh_session) copied to the old build: byte-equal at boot, no backup, same counts, 5-item drill runs. Resume, scheduler (0 same-kind repeats over 3 sessions, misses return as recall/type, sn +1 per session, reload keeps sn), typed mastery (19/19 +1 with dots, miss at 4 -> 3), per-level chars/chips, popover x/outside/8 s, Read answer block, glosses (啊, anxious, 担心 also right, give) all PASS on live; regressions identical to proof-3d66aea (silent characters card 0 pre-audio, 还 -> 孩 hidden carrier, teach hints, set counter, no-voice, offline SW boot); 0 console errors, 0 failed requests. Verdict KEEP; rollback 41a6a8f not needed.

Migration proof 2026-10-02 for the 590af86 republish (engine ea62a45 -> 590af86: characters order
first / with words / later, Learn turn, synonym-safe unit credit, no reading giveaways,
one-script word options, gloss tidy-up): storage/migration diff audit (`git -C engine diff
ea62a45..590af86 -- engine/core.js engine/app.html engine/sw.template.js build.sh`, 92+/30-,
core.js + app.html; `engine/sw.template.js` and `build.sh` 0 diff lines). `validateProgShape`,
`validateRecMap`, `parseStored`, `bootProg`, `applyImport`, `migrateLegacy`, `defaultCharsProg`,
`validateCharsShape`, `normalizeCharsProg`, `ensureChars`, `sessionKey`, `sessionStale`
byte-identical at 3d66aea, ea62a45 and 590af86; `PROG_VERSION`/`CHARS_PROG_VERSION`/
`SESSION_VERSION` = 1, `SESSION_MAX_AGE_MS` 12 h, unchanged. New stored fields, both ADDITIVE,
both inside `prog.chars` and only with pack `characters.withWords`: (1) `chars.order` "first" |
"with" — core.js:1920 seedCharOrder, called from normalizeProg (core.js:894, every load incl.
import) and defaultProg (core.js:846); a stored "first"/"with" is kept, otherwise derived:
any `chars.c` record -> "first", none -> "with". It is set on the in-memory progress at load;
boot itself calls no store.save, so it reaches vocab_zh with the learner's first save of any
kind (nothing else in the stored record changes by it; `chars.c`, `defer`, `choiceSeen`, `mix`
untouched). Also written by the Progress chips (app.html:2965 setCharMode, core.js:1929: "later"
sets `defer: true` only; "first"/"with" set `order` and `defer: false`); `chars.defer: true`
keeps its meaning ("later") and wins over `order`. (2) `chars.turn` "c" | "w" — core.js:2027
learnTurnDone, from app.html:2064 todayLearnDone (words taught -> "c") and app.html:2066
todayCharsDone (characters taught -> "w"); not written under "later". Session record: same key,
new resume origin `todayChars` (app.html:1505/1513); a record from another build is dropped as
before. Runtime-only: a typedSyn hit moves no character unit (app.html:1264-1265), pronInGloss
words get no reading<->meaning cards (core.js pronMeaning gate), pack.json `optsOneScript`
(app.html:813) is UI only. Neither new field is checked by validateCharsShape (only `v`, `c`,
`defer`, `choiceSeen`, `mix`), and normalizeCharsProg's Object.assign keeps unknown fields at
3d66aea and ea62a45 (byte-identical), so neither can trigger the `.bak` path. Rollback:
migration_checks [order] "engine ea62a45 / 3d66aea boots chars.order first / with: no backup,
order, turn and records kept" and [turn] "engine 3d66aea boots progress with chars.turn: no
backup" PASS. vocab-engine tests at 590af86 (tree clean, read-only): migration_checks 358 passed
0 skipped, session_resume_checks 109, day_sim_checks 59, typed_mastery_checks 77,
characters_app_checks 202, 0 failed. The zh pack WAS rebuilt (`pack_from_hsk.py` from an
`engine` archive at 590af86 into two scratch dirs, byte-identical, equal to vocab-engine/packs/zh):
pack.json +`optsOneScript: true`; words.json `en` changed on 52 words, `syn` +1/changed 6/
removed 5, `typedSyn` +2/removed 1, ids/order and every other field unchanged; attribution,
characters, sentences, lessons, legacy, passages, passages_src, gloss_display, REPORT_passages
byte-identical. `validate_pack.py pack`: 1193 words, 882 sentences (882 with spans), 12 lessons,
60 passages, 1193 character units, 0 errors, 1 WARN (138 of 4946 linked words have no span).
Build deterministic (two builds: index.html e94fe2f9d236a11540a68614d4933559, sw.js
1ca754fde7d20f637eb4930413068e3f; VE_BUILD 420245799-1806959). Rollback hash (pre-republish
HEAD): 908c5285fb5559900c3d2749a6f6e2c1e83ea906. Pre-republish live/local md5s: index.html
96d7b14aef0290517f3f4e178153b663, sw.js b7f176248c18b59816c9681cab8d598e (live and local
matched). The ea62a45 open items (alternation turn, synonym unit credit, 北京-type giveaways,
gloss tidy-ups) ship here. Known open items on 590af86: next batch = a single lag rule replacing
the three order chips (teach characters when at least one set of learned words lacks its
characters, else words). A browser worker runs the live snapshot-diff proof separately.
 Browser proof (Playwright chromium 390x844 mobile, .cache/live/proof-590af86/, 2026-10-02): KEEP, 7/8 PASS. Live md5 matched (index.html e94fe2f9..., sw.js 1ca754fd...; ve-build marker 201767736-1806282). Migration: proof-ea62a45 seeds byte-equal after boot/reload/offline, no .bak, Progress rows equal; chars.order reaches vocab_zh at the first save (tapping Start today: +chars.order with sn/day, nothing else); 908c528 session -> live and live (order, turn, parked todayChars session) -> 908c528 both byte-equal, no backup, same counts, 0 units lowered, drills run. Owner shape on "first": 4+ Learn steps all 字3 (incl. closing after Learn), one set left -> 字3 then HSK 4. Synonym 两 on 二 no unit move, 二 +1; 0 北京/元/人民币 giveaways over >=41 cards per word per tier, voices on/off; 353 option sets, 0 mixed-script; glosses OK; c1-c7/r3 regressions PASS; 0 console errors / failed requests. FAIL (not a regression, 908c528 worse): on "with words", closing on the Learn results screen without Continue never writes chars.turn, so Learn stays on words (HSK 4 x4, 0 字3); follow-up: flip the turn when Learn results show, or the lag rule. Report: vocab-engine/.cache/briefs/chinese-proof-w11-report.md.

Migration proof 2026-10-02 for the 36aee02 republish (engine 590af86 -> 36aee02: one lag rule for
Learn, pack `characters.learn: "lag"`): storage/migration diff audit (`git -C engine diff
590af86..36aee02 -- engine/core.js engine/app.html engine/sw.template.js build.sh`, 41+/7-,
core.js + app.html; `engine/sw.template.js` and `build.sh` 0 diff lines). No hunk touches
`validateProgShape`, `validateRecMap`, `parseStored`, `bootProg`, `applyImport`, `migrateLegacy`,
`normalizeProg`, `defaultProg`, `normalizeCharsProg`, `validateCharsShape`, `ensureChars`,
`sessionKey`, `sessionStale`, `PROG_VERSION`/`CHARS_PROG_VERSION`/`SESSION_VERSION`; no new
`store.save`, `localStorage` or `sessionStorage` call. New stored fields in vocab_zh: NONE.
`charsConfig` sets `withWords` false under `learn: "lag"` (core.js:1834), so `seedCharOrder`
(core.js:1921, gated on `withWords`) does not run: boot writes nothing, `chars.order` is never
derived; `learnTurnDone` returns false (no `chars.turn`), `charStages` is empty so
`charsUnlocked`/`showCharChoice` are false (no order chips, no choice card, no `defer`/
`choiceSeen` writes). Stored `order`/`turn`/`defer`/`choiceSeen` are left byte-identical. Session
record only: `vocab_zh_session` `today.cu` (unit ids of the planned lag set, app.html:1555),
read back by `lagResume` (app.html:1600; an id not in the pack -> plan re-derived). Rollback:
migration_checks [lag] "engine 590af86 / ea62a45 / 3d66aea boots lag progress: no backup, records
kept" PASS (and the reverse direction, nothing re-taught). vocab-engine tests at 36aee02 (main
checkout, tree clean, read-only): migration_checks 371 passed 0 skipped, lag_checks 25,
session_resume_checks 109, day_sim_checks 59, typed_mastery_checks 77, characters_app_checks 202,
0 failed. The zh pack WAS rebuilt (`pack_from_hsk.py` from an `engine` archive at 36aee02 into two
scratch dirs, byte-identical, equal to vocab-engine/packs/zh): pack.json characters `withWords:
true` -> `learn: "lag"` (withWords dropped; stages 字1-字4 kept, unused under lag), pack.js to
match; every other pack file byte-identical. Built index.html carries
`"learn":"lag"`. `validate_pack.py pack`: 1193 words, 882 sentences (882 with spans), 12 lessons,
60 passages, 1193 character units, 0 errors, 1 WARN (138 of 4946 linked words have no span).
Build deterministic (two builds: index.html 007e3ad757a83973690d5c337e0797bf, sw.js
3f481e27bbc01b5bf356fd10a0d5230e; VE_BUILD 1776095305-1810270, ve-build marker
949799161-1809594). Rollback hash (pre-republish HEAD): a3fe564969a753fc0b2a55155ee2d9a6c02337ce.
Pre-republish live/local md5s: index.html e94fe2f9d236a11540a68614d4933559, sw.js
1ca754fde7d20f637eb4930413068e3f (live and local matched). The 590af86 open item (lag rule;
also fixes the "with words" turn FAIL above) ships here. Known open items on 36aee02: next
batch = "New material: paused" toggle, word popover timer 20 s, Session-done reopen recount fix.
A browser worker runs the live snapshot-diff proof separately.
 Browser proof (Playwright chromium 390x844 mobile, .cache/live/proof-36aee02/, fb3 harness against live, 2026-10-02): KEEP, 6/6 PASS. Live md5 matched (index.html 007e3ad7..., sw.js 3f481e27...; SW cache ve:/chinese/:949799161-1809594). Migration: proof-ea62a45 seeds + proof-590af86 first-save shapes (chars.order with/first, sn, day) byte-equal after boot/reload/Progress on live and on a3fe564, keys vocab_zh only, no backup, non-字 Progress rows equal, 字 counts equal (live merges 字1-4 into one row); hsk_pinyin migrates with .bak == raw. Owner shape + one a3fe564 session (order first, turn w) -> live byte-equal, 0 backup, counts equal (字1 150 + 字2 110 = 字 260/595); 4 Learn steps 字 sets 27-30, 0 re-taught, 0 lowered, no HSK 4, stored order/turn/defer/choiceSeen untouched. Rollback: live progress + parked Learn-字 session (today.cu c0261-c0270) -> a3fe564 byte-equal, no backup, same counts, 字2 set 12 drill ran (34 answers, units 263 -> 270). Lag: fresh W C W C; 12-untaught -> 字, HSK 4, 字, HSK 4; all taught -> "everything covered", Today runs; every session matched the records oracle. No chips/choice card; one 字 row, one HSK 1-4 strip. Resume at teach screen and mid-drill keeps the same unit ids. fb2 c1-c5 same as fb3 scratch run (c2 176 px scroll as before; c5 c.pass now true); offline boot from SW cache. 0 console errors / failed requests (offline Google Fonts only). Session-done reopen recount (pre-existing) seen again (k6 sessions 81 -> 84 -> 87). Report: vocab-engine/.cache/briefs/chinese-proof-w12-report.md.

Migration proof 2026-10-02 for the 68930bd republish (engine 36aee02 -> 68930bd: pack `pauseNew`
"New material: on / paused" chip, word popover 20 s, Session done no longer recounts on reopen;
68930bd = 44db17a + tools/pack_from_hsk.py emitting `pauseNew`, `git -C engine diff
44db17a..68930bd --stat` touches tools/pack_from_hsk.py only): storage/migration diff audit (`git
-C engine diff 36aee02..68930bd -- engine/core.js engine/app.html engine/sw.template.js build.sh`,
78+/30-, core.js + app.html; `engine/sw.template.js` and `build.sh` 0 diff lines). No hunk touches
`validateProgShape`, `normalizeProg`, `parseStored`, `applyImport`, `migrateLegacy`, `session*` or
the `*_VERSION` constants; no new `localStorage` or `sessionStorage` call. One new vocab_zh field,
additive: `prog.pause = 1`, written only by `setPause` (core.js:1071; unpause deletes the field),
called from the Progress chip (app.html:2926) and the paused-idle Today button "Turn new material
on" (app.html:2067, delete only). Boot writes nothing. `validateProgShape` ignores unknown keys and
`normalizeProg` keeps it, so export/import carry it. Session record `vocab_zh_session`: shape
unchanged (`snap.reviewExtra` is not serialized; resume recomputes it). `todayFinish` now clears
`rzFin`/`todayStepState` (all packs), no stored-field change. Rollback: migration_checks [pause]
(engines 36aee02, 590af86, ea62a45, 3d66aea boot paused progress, no backup, field kept) PASS.
vocab-engine tests at 44db17a (engine/ identical at 68930bd; main checkout, read-only):
migration_checks 381 passed 0 skipped, pause_checks 49, lag_checks 25, session_resume_checks 117,
day_sim_checks 67, help_close_checks 41, 0 failed. The zh pack WAS rebuilt (`pack_from_hsk.py`
from an `engine` archive at 68930bd into two scratch dirs, byte-identical, equal to
vocab-engine/packs/zh): pack.json gains `"pauseNew": true` (`characters.learn: "lag"` kept),
pack.js to match; every other pack file byte-identical. Built index.html carries
`"pauseNew":true` and `"learn":"lag"`. `validate_pack.py pack`: 1193 words, 882 sentences (882
with spans), 12 lessons, 60 passages, 1193 character units, 0 errors, 1 WARN (138 of 4946 linked
words have no span). Build deterministic (two builds: index.html 035c143d4d14eaf016c13d8ae90e1633,
sw.js f51a37c7ee7632de1ac112d9fa493a5b; VE_BUILD 1574599848-1814950, ve-build marker
1611774630-1814274). Rollback hash (pre-republish HEAD): df15d65519b12f588fbb2f1365698dd2ad5a8368.
Pre-republish live/local md5s: index.html 007e3ad757a83973690d5c337e0797bf, sw.js
3f481e27bbc01b5bf356fd10a0d5230e (live and local matched). The 36aee02 open items (paused toggle,
popover 20 s, Session-done recount) ship here. Known open items on 68930bd: next batch = wrong
choices mixed from learned and not-yet-learned words (no level slotting). A browser worker runs
the live snapshot-diff proof separately.
 Browser proof (Playwright chromium 390x844 mobile, .cache/live/proof-68930bd/, fb4 harness against live, 2026-10-02): KEEP, 7/7 PASS. Live md5 matched (index.html 035c143d..., sw.js f51a37c7...; SW cache ve:/chinese/:1611774630-1814274). Migration: proof-36aee02 / proof-590af86 / proof-ea62a45 seeds + snapshot-d612e63 byte-equal after boot/reload/Progress on live and df15d65, keys vocab_zh only, no backup, Progress counts equal; hsk_pinyin migrates with .bak == raw. Owner shape + one df15d65 session (字 set 26) -> live byte-equal, counts equal (字 260/595), 0 lowered, Today unpaused ("字, set 27 of 120"). Rollback: live `pause: 1` + session parked mid-Review -> df15d65 byte-equal, no backup, same counts, session ran (字 set 27, +10 units, pause kept); back on live still paused. Pause: chip on/paused toggles + persists over reload, export/import carry it; paused owner 4 sessions (2 same day): "Review only · new material paused.", Review 40 items, 0 Learn, 0 new words/units/first reads; paused Read results list tapped unlearned duì/yíng without checkbox, learned 595 -> 595; unpause -> 字 set 27 c0261-c0270 = pre-pause plan, only `pause` removed; fresh paused "Nothing to review yet." + "Turn new material on". Lag: fresh W C W C W C, owner 字 27-30 oracle match, owner12/all7/alldone match. Popover open at 19 s, closed by 21 s, × / outside / Escape close at once (passage + sentence). Recount: Session done 3 reopens sessions/sn 4/1 unchanged; k6 sessions 81 -> 82 -> 83 -> 84 (F1 fixed live). fb2 c1-c5 identical to fb4 scratch run; offline boot from SW cache, 0 site hits. 0 console errors / failed requests (offline Google Fonts only). Report: vocab-engine/.cache/briefs/chinese-proof-w13-report.md.

Migration proof 2026-10-03 for the a32c1fc republish (engine 68930bd -> a32c1fc: pack `optsMix`,
wrong choices from the answer's own stage (new/weak answers: own learn-order set, then adjacent
sets, then other weak items; known answers: known items; never taught last), placement keeps level
tiers; Progress under `learn: "lag"` shows one Characters row per level in its own table, CSS
`table.stats.nw td:last-child{white-space:nowrap}`, display only): storage/migration diff audit
(`git -C engine diff 68930bd..a32c1fc -- engine/core.js engine/app.html engine/sw.template.js
build.sh`, 155+/34-, core.js + app.html; `engine/sw.template.js` and `build.sh` 0 diff lines). No
hunk touches `validateProgShape`, `normalizeProg`, `parseStored`, `bootProg`, `applyImport`,
`migrateLegacy`, `session*` or the `*_VERSION` constants; no added line calls `localStorage`,
`sessionStorage` or `store.save` or assigns a `prog.*` field. No new vocab_zh field; boot and
option building write nothing (mixPick / wordMix / sentMix / charCtx / mixSetOf only read prog).
Session record `vocab_zh_session`: shape unchanged, no new key; the Today record's existing
`today.cu` (68930bd app.html:1560/1605, a32c1fc 1608/1653, unchanged lines) now also feeds the
unit option bucket for the rest of the session (`todayCharSet` reads `todayStepState.snap.cset`).
Rollback: scratch check, progress booted and written by a32c1fc (owner seed proof-68930bd/k4-owner-
prev + snapshot-d612e63, plus word and unit answers) boots on 68930bd, 36aee02, 590af86, ea62a45
and 3d66aea with no backup, byte-equal (10/10 PASS). vocab-engine tests at a32c1fc (main checkout,
read-only): engine_checks 704, migration_checks 381 (0 skipped), opts_mix_checks 40 (312 s; incl.
flag-off app session byte-identical to 68930bd), lag_checks 38, pause_checks 49,
session_resume_checks 117, day_sim_checks 67, 0 failed. The zh pack WAS rebuilt
(`pack_from_hsk.py --out` at a32c1fc into two scratch dirs, byte-identical; every pack file equal
to vocab-engine/packs/zh): pack.json gains `"optsMix": true` (`pauseNew: true`, `characters.learn:
"lag"` kept), pack.js to match; every other pack file byte-identical. Built index.html carries
`"optsMix":true`, `"pauseNew":true` and `"learn":"lag"`. `validate_pack.py pack`: 1193 words, 882
sentences (882 with spans), 12 lessons, 60 passages, 1193 character units, 0 errors, 1 WARN (138
of 4946 linked words have no span). Build deterministic (two builds: index.html
d927caf572c90ca6cf60fb05d64450ed, sw.js 10c91794f31cc7b882295121a53f06b0; VE_BUILD
420410691-1824758, ve-build marker 3106599268-1824081). Rollback hash (pre-republish HEAD):
7fbbf86432d246e16ccbb00747edc1b2149d2f06. Pre-republish live/local md5s: index.html
035c143d4d14eaf016c13d8ae90e1633, sw.js f51a37c7ee7632de1ac112d9fa493a5b (live and local matched).
The 68930bd open item (wrong choices mixed from learned and not-yet-learned words) ships here.
Known open items on a32c1fc: optsMix follow-up — bucket wrong choices by the session an item was
learned in (new record field `f`), see vocab-engine/TODO.md. A browser worker runs the live
snapshot-diff proof separately.
 Browser proof (Playwright chromium 390x844 mobile, .cache/live/proof-a32c1fc/, fb5 harness against live, prev 7fbbf86 served locally, 2026-10-03): KEEP, 6/6 PASS. Live md5 matched (index.html d927caf5..., sw.js 10c91794...; SW cache ve:/chinese/:3106599268-1824081). Migration: proof-68930bd / proof-36aee02 / proof-590af86 / proof-ea62a45 seeds + snapshot-d612e63 byte-equal after boot/reload/Progress, keys vocab_zh only, no backup, word/sentence/reading rows equal to 7fbbf86, per-level 字 rows sum to 7fbbf86's single row (e.g. 260/1193/166/82); hsk_pinyin migrates with .bak == raw. Owner + one 7fbbf86 session (字 set 26) -> live byte-equal, 4 sessions 字 27-30, 0 lowered. Rollback: live paused + parked Today -> 7fbbf86 byte-equal, no backup, counts equal, session ran. Progress at 390 px (fresh, mid, owner, owner40, all, worst, owner68k4, ownerDf, SEED, 2 paused): 0 word value cells wrap (7fbbf86 wraps only its 字 value), Characters rows one line, docW 390, 0 overflow; fresh (only no-block case) word table text/geometry/pixels identical to 7fbbf86. Wrong choices: Learn-drill set-mates 63/63, 54/54, 57/57, 0 mastered / never-taught; outside-set only where the set has < 3 right-length mates (charPick 鞋/难, How is it said? w0599/w0602); known answers 654/654 known; character drills 0 wrong-length sets (guess 0.25), 1885 sets 0 mixed script, 4 distinct. Placement 120/120 identical. Regressions k1/k6/p2/p8/p7/c1-c5 booleans equal to fb5/w13 runs (random-item diffs only); offline boot from SW cache, 0 site hits. 0 console errors / failed requests (offline Google Fonts only). Report: vocab-engine/.cache/briefs/chinese-proof-w14-report.md.

Migration proof 2026-10-03 for the 37f0b08 republish (engine a32c1fc -> 37f0b08 = ffd506e code + one
TODO line: 15 s help popovers (`HELP_MS`; audio toast stays 3.5 s), Learn row/card under
`learn: "lag"` reads "字 HSK n, set k of m" per level (display only), dayAware weak-word floor
(`DAY_WEAK_FLOOR` 0.4, consolidation keeps ⌈0.15 n⌉, misses pending longest first, a production
answer settles any miss, a unit pending hear + recall asked in recall, `DAY_TYPED_CONSOLIDATE_SHARE`
0.35) and pack `characters.bare` 6 -> 5): storage/migration diff audit (`git -C engine diff
a32c1fc..37f0b08 -- engine/core.js engine/app.html engine/sw.template.js build.sh`, 42+/21-,
core.js + app.html; `engine/sw.template.js` and `build.sh` 0 diff lines). VERDICT PASS: no hunk
touches `validateProgShape`, `normalizeProg`, `parseStored`, `bootProg`, `applyImport`,
`migrateLegacy`, `session*` or the `*_VERSION` constants; grep of added lines for `localStorage`,
`sessionStorage`, `store.save`, `prog.* =`, VERSION, backup, `.bak`, storageKey, normalize,
`vocab_`: 0 hits. NO new progress field, NO day-log shape change; boot writes nothing (dayPick /
dayItemKind / daySettles only choose items; `lagCharSet` adds read-only `lv/lvIndex/lvTotal`).
Bare-5: stored units at streak 5 read as bare on the new pack (owner has 14 at boot, no write):
record byte-equal, no backup (migration_checks [bare5]). Older engines (a32c1fc, 68930bd,
36aee02, 590af86) boot a record written by 37f0b08 with no backup. A parked session from the
previous build is dropped by `sessionStale` "build" as on every republish. vocab-engine tests at
37f0b08 (main checkout, read-only): engine_checks 704, migration_checks 384 (0 skipped),
day_sim_checks 76, typed_mastery_checks 77, lag_checks 45, pause_checks 49, help_close_checks 42,
session_resume_checks 117, opts_mix_checks 40, 0 failed. The zh pack WAS rebuilt
(`pack_from_hsk.py . --out` at 37f0b08 into two scratch dirs, byte-identical): the only differing
file vs the committed pack is pack.json (`characters.bare` 6 -> 5), pack.js to match; every pack
file equal to vocab-engine/packs/zh. Built index.html carries `"bare":5`, `"optsMix":true`,
`"pauseNew":true`, `"learn":"lag"`. `validate_pack.py pack`: 1193 words, 882 sentences (882 with
spans), 12 lessons, 60 passages, 1193 character units, 0 errors, 1 WARN (138 of 4946 linked words
have no span). Build deterministic (two builds: index.html 251c8634da231b7dc6af98dcb4f8bc85, sw.js
c574e511c080cd08e499a4e820859e89; VE_BUILD 277737539-1827171, ve-build marker
3635404196-1826494). Rollback hash (pre-republish HEAD, includes the a32c1fc browser-proof line):
b84fd960bd35e077a5522c4a360d35c9264fc858. Pre-republish live/local md5s: index.html
d927caf572c90ca6cf60fb05d64450ed, sw.js 10c91794f31cc7b882295121a53f06b0 (live and local matched).
Known open items on 37f0b08: optsMix follow-up — bucket wrong choices by the session an item was
learned in (new record field `f`); dayAware `owns()` is dead code under the new settle rule, and
lag/pause/opts_mix controls swallow a day_rules_patch no-match as "control skipped" (fb10 review
M2/M3), see vocab-engine/TODO.md. A browser worker runs the live snapshot-diff proof separately.
 Browser proof (Playwright chromium 390x844 mobile, .cache/live/proof-37f0b08/, fb10 + w14 harness against live, prev b84fd96 served locally, 2026-10-03): KEEP, 5/5 PASS. Live md5 matched at start and end (index.html 251c8634..., sw.js c574e511...; SW cache ve:/chinese/:3635404196-1826494). Migration: owner + proof-a32c1fc / proof-68930bd / proof-36aee02 seeds + SEED/SEED2/SK/legacyWith/snapshot (16) byte-equal after boot/reload/Progress, keys vocab_zh only, no backup, word/sentence/reading rows equal b84fd96, 字 per level taught/total/mastered equal, bare = prev + streak-5 units (owner +14 = 4/9/1); hsk_pinyin migrates with .bak == raw. Owner + one b84fd96 session -> live byte-equal, Today ran, 0 lowered. Rollback: live session with a settled Listen miss (w0527 hear miss -> type right, day log r:[type], no mk) -> b84fd96 byte-equal, no backup, counts equal, session ran, 0 errors. Weak floor (owner, today / day+1): Review weak 12/9/8 and 11/9/8 of 20 words, Recall 3/3/4 and 3/3/3 of 8; Listen miss w0428 back as type in the same session's Recall, never by ear again; repeats 0/0/0 (prev 4/1 by session 3, 1 hear repeat). Bare 5: 喜欢/做 ruby.bare rt hidden, streak-4 的/人/汉语 keep ruby, 喜欢 drill stimulus no reading. Popovers passage + sentence open 14.9 s, closed 15.02 s; toast closed 3.51 s; Learn row = card header = Progress level row (字 HSK 3, set 18/19 of 30); pause chip, recount, k1/k6 lag oracle, o1/o3 own-set wrong choices as w14. Offline boot from SW cache, 0 site hits. 0 console errors / failed requests (offline Google Fonts only). Report: vocab-engine/.cache/briefs/chinese-proof-w15-report.md.

Migration proof 2026-10-03 for the 6c067b4 republish (engine 37f0b08 -> 6c067b4: (A) under
`characters.bareBy: "typed"` a unit miss at or above mastered steps the streak down by one (5->4,
4->3, never below 3; below mastered still 0), core.js `markChar` only; (B) pack flag
`listenQuestions: "all"`: every question of a listening pass is audio-only, "Show question" tap and
logging unchanged): storage/migration diff audit (`git -C engine diff 37f0b08..6c067b4 --
engine/core.js engine/app.html engine/sw.template.js build.sh`, 6+/5-, core.js 9 lines + app.html 2
lines; `engine/sw.template.js` and `build.sh` 0 diff lines). VERDICT PASS: hunks are `markChar`
(`p.s = Math.max(m, p.s - 1)` instead of `p.s = m`), `listenAudioOnly` (new `pack` argument) and its
one caller in `startPassage`; grep of added/removed lines for `localStorage`, `sessionStorage`,
`store.save`, `prog.* =`, VERSION, backup, `.bak`, storageKey, normalize, `vocab_`, migrateLegacy: 0
hits. NO new progress field, NO day-log change, boot writes nothing; streak values stay in range
(>= mastered 3, <= previous), so 37f0b08 reads a record written by 6c067b4 unchanged
(typed_mastery_checks, migration_checks). vocab-engine tests at 6c067b4 (main checkout, clean,
read-only): engine_checks 704, migration_checks 384 (0 skipped), typed_mastery_checks 81,
listen_mode_checks 100, day_sim_checks 76, lag_checks 45, pause_checks 49, session_resume_checks
117, 0 failed. The zh pack WAS rebuilt (`pack_from_hsk.py . --out` twice at 6c067b4, byte-identical):
the only differing file vs the committed pack is pack.json (`listenQuestions: "all"` added to the
pack flags), pack.js to match; pack/ now equals vocab-engine/packs/zh. Built index.html carries
`"bare":5`, `"optsMix":true`, `"pauseNew":true`, `"learn":"lag"`, `"listenQuestions":"all"`.
`validate_pack.py pack`: 1193 words, 882 sentences (882 with spans), 12 lessons, 60 passages, 1193
character units, 0 errors, 1 WARN (138 of 4946 linked words have no span). Build deterministic (two
builds: index.html fe4893be4eeb20b7b92a5f3770ed6540, sw.js 50d6c53b46a968d8ddf61d8d983205b7;
VE_BUILD 4225833799-1827346, ve-build marker 2955851144-1826670). Rollback hash (pre-republish HEAD,
includes the 37f0b08 browser-proof line): 2f0a15b383ff869370f7e623979a249c519b6872. Pre-republish
live/local md5s: index.html 251c8634da231b7dc6af98dcb4f8bc85, sw.js c574e511c080cd08e499a4e820859e89
(live and local matched).
Known open items on 6c067b4: optsMix follow-up — bucket wrong choices by the session an item was
learned in (new record field `f`); dayAware `owns()` is dead code under the new settle rule, and
lag/pause/opts_mix controls swallow a day_rules_patch no-match as "control skipped" (fb10 review
M2/M3), see vocab-engine/TODO.md. A browser worker runs the live snapshot-diff proof separately.
 Browser proof (Playwright chromium 390x844 mobile, .cache/live/proof-6c067b4/, proof-37f0b08 + fb10 harness against live, prev 2f0a15b served locally, 2026-10-03): KEEP, 5/5 PASS. Live md5 matched at start and end (index.html fe4893be..., sw.js 50d6c53b...; SW cache ve:/chinese/:2955851144-1826670). Migration: owner + 18 earlier seeds (proof-a32c1fc/68930bd/36aee02/37f0b08 records and ls dumps, SEED/SEED2/SK/legacyWith/snapshot) byte-equal after boot/reload/Progress, no backup, every Progress row and 字 per-level taught/total/mastered/bare equal 2f0a15b (stale parked sessions aged out on both builds alike); hsk_pinyin migrates with .bak == raw. Owner + one 2f0a15b session -> live byte-equal, Today ran, 0 lowered. Rollback: live session with listening pass p0010 (l:1) + a unit miss c0058 5->4 -> 2f0a15b byte-equal, no backup, counts equal, session ran (0 lowered), back on live equal. Miss step (Test -> Characters): live 5->4, 4->3, 3->3, 2->0; prev 5->3, 4->3, 3->3, 2->0; typed misses 5->4 (dots 4/5), 4->3 (3/5), 3->3 (3/5); typed right afterwards w0004 4->5 (dots 5/5, bareWord). Choice misses on held units >= 3 show no dots on both builds, as designed. Listening pass: all 5 questions behind Show question, each spoken on mount, Q1 shown before answering -> " · question shown" on Q1 only, answering reveals the text, results "Listening pass", record l:1; prev hides 3 of 5; l:1 seed -> "1 passage to re-read", read mode. Weak floor Review 12/9/8 of 20 words; bare 5, popovers 14.9 s open / 15.01 s closed, toast 3.51 s, Learn label, pause chip, recount, offline boot all as on 37f0b08. 0 console errors / failed requests (offline Google Fonts only). Report: vocab-engine/.cache/briefs/chinese-proof-w16-report.md.

Migration proof 2026-10-03 for the 812511a republish (engine 6c067b4 -> 812511a: pack flag
`rereadPerfectDays: 30`, a passage read with a perfect score returns as a Today re-read after 30
days, only when no imperfect re-read (7 days) is due; reason "reread", so the listening alternation,
paused mode, results and the done record are unchanged; `core.js` `nextReadItem` only): storage/migration
diff audit (`git -C engine diff 6c067b4..812511a -- engine/core.js engine/app.html engine/sw.template.js
build.sh`, core.js 16 lines; app.html, `engine/sw.template.js`, `build.sh` 0 diff lines). VERDICT PASS:
the only hunk is `nextReadItem` (perfect-score branch + `perfDays`); grep of added/removed lines for
`localStorage`, `sessionStorage`, `store.save`, `prog.* =`, VERSION, backup, `.bak`, storageKey, normalize,
`vocab_`, migrateLegacy: 0 hits. NO new progress field, NO day-log change, boot writes nothing. vocab-engine
tests at 812511a (main checkout, clean, read-only): engine_checks 704, migration_checks 384 (0 skipped),
listen_mode_checks 120, passage_audio_checks 43, pause_checks 49, session_resume_checks 117,
day_sim_checks 76, 0 failed. The zh pack WAS rebuilt (`pack_from_hsk.py . --out` twice at 812511a,
byte-identical): the only differing files vs the committed pack are pack.json (`rereadPerfectDays: 30`
added to the pack flags) and pack.js to match; pack/ equals vocab-engine/packs/zh. Built index.html
carries `"rereadPerfectDays":30`, `"listenQuestions":"all"`, `"bare":5`, `"optsMix":true`, `"pauseNew":true`,
`"learn":"lag"`. `validate_pack.py pack`: 0 errors, 1 WARN (138 of 4946 linked words have no span). Build
deterministic (two builds: index.html 5ba024d314b605b70286edc9b8f0237a, sw.js 07872497aea56a3ce1845237a6cf7e49;
VE_BUILD 1488100429-1827793, ve-build marker 4261304518-1827117). Rollback hash (pre-republish HEAD, includes
the 6c067b4 browser-proof line): 686d08b7f521d6664f11c77cf467e08e27e99259. Pre-republish live/local md5s:
index.html fe4893be4eeb20b7b92a5f3770ed6540, sw.js 50d6c53b46a968d8ddf61d8d983205b7 (live and local matched).
Known open items on 812511a: optsMix follow-up — bucket wrong choices by the session an item was
learned in (new record field `f`); dayAware `owns()` is dead code under the new settle rule, and
lag/pause/opts_mix controls swallow a day_rules_patch no-match as "control skipped" (fb10 review
M2/M3), see vocab-engine/TODO.md. A browser worker runs the live snapshot-diff proof separately.
 Browser proof (Playwright chromium 390x844 mobile, .cache/live/proof-812511a/, proof-6c067b4 + fb10 harness against live, prev 686d08b served locally, 2026-10-03): KEEP, 4/4 PASS. Live md5 matched at start and end (index.html 5ba024d3..., sw.js 07872497...; SW cache ve:/chinese/:4261304518-1827117). Migration: owner + 24 earlier-proof seeds + legacy hsk_pinyin byte-equal after boot/reload/Progress, no backups, every Progress and 字 count equal to 686d08b; prev->live session byte-equal, Today ran, 0 lowered; rollback after a live Today whose Read was the 30-day perfect re-read of p0010 (record -> {sc:5,n:5,d:2026-10-03,x:2,l:1}) boots on 686d08b byte-equal, no backup, counts equal, a session ran (0 lowered). Perfect re-read: 29 d no Read row (plan == prev), 30 d and 60 d "Listen | 1 passage to listen to", imperfect 8 d p0011 offered instead, paused still offers; prev never offers. Regressions (miss step 5->4, listening all by ear, weak floor 9-11 of 20, bare 5, 15 s popovers, Learn label, pause chip, recount, offline SW boot) PASS. 0 console errors / failed requests except offline Google Fonts.

Migration proof 2026-10-03 for the 491d470 republish (engine 812511a -> 491d470: under pack flag
`rereadPerfectDays`, a perfect passage read once and never listened to (record x 1, no l) is a
7-day re-read candidate like an imperfect one, its return runs as a listening pass; x >= 2 or l keeps
the 30-day rule; `core.js` `nextReadItem` only): storage/migration diff audit (`git -C engine diff
812511a..491d470 -- engine/core.js engine/app.html engine/sw.template.js build.sh`, core.js 2+/1-;
app.html, `engine/sw.template.js`, `build.sh` 0 diff lines). VERDICT PASS: hunks are one comment and
the `if(r.sc < r.n || (perfDays && r.x === 1 && !r.l))` condition; grep of added/removed lines for
`localStorage`, `sessionStorage`, `store.save`, `prog.* =`, VERSION, backup, `.bak`, storageKey,
normalize, `vocab_`, migrateLegacy: 0 hits. NO new progress field, NO day-log change, boot writes
nothing. vocab-engine tests at 491d470 (main checkout, clean, read-only): engine_checks 704,
migration_checks 384 (0 skipped), listen_mode_checks 133, passage_audio_checks 43, pause_checks 49,
session_resume_checks 117, 0 failed. The zh pack was rebuilt (`pack_from_hsk.py . --out` twice at
491d470, byte-identical): NO file differs from the committed pack (pack.json, words, characters,
sentences, passages, lessons, legacy all identical); pack/ equals vocab-engine/packs/zh. Built
index.html carries `"rereadPerfectDays":30`, `"listenQuestions":"all"`, `"bare":5`, `"optsMix":true`,
`"pauseNew":true`, `"learn":"lag"`. `validate_pack.py pack`: 0 errors, 1 WARN (138 of 4946 linked
words have no span). Build deterministic (two builds: index.html 2355842378b5e3774f1a67822906aa34,
sw.js 2ed8c66fcbd5bffd197fbacf0f267918; VE_BUILD 2783621412-1827986, ve-build marker
1907031811-1827310). Rollback hash (pre-republish HEAD, includes the 812511a browser-proof line):
54aab8749ad5790de99860905d326c5fd6de06b9. Pre-republish live/local md5s: index.html
5ba024d314b605b70286edc9b8f0237a, sw.js 07872497aea56a3ce1845237a6cf7e49.
Known open items on 491d470: optsMix follow-up — bucket wrong choices by the session an item was
learned in (new record field `f`); dayAware `owns()` is dead code under the new settle rule, and
lag/pause/opts_mix controls swallow a day_rules_patch no-match as "control skipped" (fb10 review
M2/M3), see vocab-engine/TODO.md. A browser worker runs the live snapshot-diff proof separately.
 Browser proof (Playwright chromium 390x844 mobile, .cache/live/proof-491d470/, proof-812511a + fb10 harness against live, prev 54aab87 served locally, 2026-10-03): KEEP, 4/4 PASS. Live md5 matched at start and end (index.html 23558423..., sw.js 2ed8c66f...; SW cache ve:/chinese/:1907031811-1827310). Migration: owner + 35 earlier-proof seeds (incl. 11 from proof-812511a) + legacy hsk_pinyin byte-equal after boot/reload/Progress, no backups, every Progress and 字 count equal to 54aab87; prev->live session byte-equal, Today ran, 0 lowered; rollback after a live Today whose Read was the 30-day perfect re-read of p0010 ({x:2,l:1} -> {sc:5,n:5,d:2026-10-03,x:3}) boots on 54aab87 byte-equal, no backup, counts equal, a session ran (0 lowered). First listening pass: perfect x:1 6 d no Read row; 7 d "Listen | 1 passage to listen to", ran as listening pass, record -> {x:2,l:1}; that record at 7 d no Read row, at 30 d "Read | 1 passage to re-read"; imperfect 9 d beats perfect-once 7 d, perfect-once 9 d beats imperfect 7 d; prev: perfect x:1 7 d no Read row, 30 d listening pass. Regressions (miss step 5->4, listening all by ear, weak floor 8-11 of 20, bare 5, 15 s popovers, Learn label, pause chip, recount, offline SW boot) PASS. 0 console errors / failed requests except offline Google Fonts.

Migration proof 2026-10-03 for the 0ae962d republish (engine 491d470 -> 0ae962d: pack flag `readRotation`
(zh, needs dayAware): the Today Read stage alternates by session between a new passage and a listening pass of a
random already-read passage (never-listened first, then listened longest ago in sessions); out of new passages,
re-reads alternate with listening; every pass shuffles the question order (seeded by passage id + attempt); the
7/30-day gates no longer apply on zh, `rereadPerfectDays` removed from the zh pack (still supported for other packs);
content: every passage has 8 questions, 5 mc + 3 tf): storage/migration diff audit (`git -C engine diff
491d470..0ae962d -- engine/core.js engine/app.html engine/sw.template.js build.sh`: core.js 63 lines, app.html 22,
`engine/sw.template.js` and `build.sh` 0). VERDICT PASS: three NEW OPTIONAL stored fields, all additive and only
under the flag: `prog.read.done[id].s` (session number of the latest pass) and `.ls` (session number of the latest
listening pass), both written only in `markPassageDone` (core.js), and `rd.qx` (question-order seed) in the parked
session record `vocab_zh_session` (set in `startPassage`, read in `sessionResume`; a record without `qx` resumes in
pack order). `validateReadShape` accepts `s`/`ls` as numbers. Passage records keep `{sc, n, d, x, l?}`; old records
with n 4-5 stay valid against the 8-question passages (display only). Boot writes nothing, no backup path touched,
no day-log change, no changed meaning. vocab-engine tests at 0ae962d (main checkout, clean, read-only):
engine_checks 704, migration_checks 390 ([rotation-s]: 491d470 boots a record with s/ls with no backup and keeps
them), listen_mode_checks 169, session_resume_checks 121 (parked session without `qx` resumes in pack order),
passage_audio_checks 43, pause_checks 49, day_sim_checks 76, sentence_spans_checks 15, 0 failed. Pack: generator
output (`pack_from_hsk.py . --out` twice, byte-identical) + passages files from vocab-engine packs/zh == packs/zh;
differs from the committed pack only in pack.json/pack.js (`readRotation: true` added, `rereadPerfectDays: 30`
removed), passages.json, passages_src.json (question rules and content), sentences.js (embedded PASSAGES) and
REPORT_passages.md; words, characters, sentences.json, lessons, legacy, attribution, gloss_display identical. Built
index.html carries `"readRotation":true`, `"listenQuestions":"all"`, `"bare":5`, `"optsMix":true`, `"pauseNew":true`,
`"learn":"lag"`, `"dayAware":true`, no `rereadPerfectDays` in the pack (the engine code still reads the field); all
60 passages have 8 questions. `validate_pack.py pack`: 0 errors, 1 WARN (138 of 4946 linked words have no span).
Build deterministic (two builds: index.html c36196e5d3a8f229e17b590c6329f0f5, sw.js 7db0176a68b14865df4a3b10107ab7f4;
VE_BUILD 1735442090-1921117, ve-build marker 4287942796-1920441). Rollback hash (pre-republish HEAD, includes the
491d470 browser-proof line): 868ef907a11f35fc6031beae7906d92b926826f1. Pre-republish live/local md5s: index.html
2355842378b5e3774f1a67822906aa34, sw.js 2ed8c66fcbd5bffd197fbacf0f267918.
Known open items on 0ae962d: optsMix follow-up (bucket wrong choices by the session an item was learned in, new
record field `f`); dayAware `owns()` dead code and lag/pause/opts_mix controls swallowing a day_rules_patch no-match
(fb10 review M2/M3), see vocab-engine/TODO.md. A browser worker runs the live snapshot-diff proof separately.
 Browser proof (Playwright chromium 390x844 mobile, .cache/live/proof-0ae962d/, proof-491d470 + fb16 harness against live, prev 868ef90 served locally, 2026-10-03): KEEP, 5/5 PASS. Live md5 matched at start and end (index.html c36196e5..., sw.js 7db0176a...; SW cache ve:/chinese/:4287942796-1920441). Migration: owner + 51 earlier-proof seeds (incl. 16 from proof-491d470) + legacy hsk_pinyin byte-equal after boot/reload/Progress, no backups, every Progress row (reading "15 / 15 passages · avg 94%" etc.) and 字 count equal to 868ef90; prev->live session byte-equal, Today ran (Read p0042 new, 8 questions), 0 lowered; parked Today drill and parked Read-tab passage from 868ef90 both dropped cleanly on live (sessionStale "build", session key removed, Start today, p0042 reopens fresh with 8 shuffled questions); rollback after two live sessions (p0041 {x:1,s:9}, listening p0034 {x:2,l:1,s:10,ls:10}) + Read-tab p0001 parked with qx 1 boots on 868ef90 byte-equal, no backup, counts equal, parked passage dropped ("build"), a session ran (0 lowered), Read tab p0001 opens in pack order (5 q), 0 errors. Rotation on owner: Read p0041 new -> Listen p0034 -> Read p0042 new -> Listen p0019 (never-listened), row stable over 3 tab switches + reload; prev new only. Questions: 8 per pass (read + listen), order differs x0 vs x1, reload/tab park keep order + answers, results in shown order. Regressions (miss step, listening 8/8 by ear, weak floor 9-12 of 20, bare 5, 15 s popovers, Learn label, pause chip aria-pressed false when paused / true when on = prev, recount, offline SW boot) PASS. 0 console errors / failed requests except offline Google Fonts.

Migration proof 2026-10-04 for the 2a76e72 republish (engine 0ae962d -> 2a76e72: under `listenQuestions: "all"` a
listening-pass question's look-back is "Replay passage" (play rows, Play all/Stop, a plain "Show text" toggle); for
every pack looking back is no longer tracked or shown: `reopened`/`peekText` never written, results drop " · looked
back" / "Text shown while listening", `READ_WEIGHT` lost `reopened` (weight 0 before, weak-word outcomes identical)):
storage/migration diff audit (`git -C engine diff 0ae962d..2a76e72 -- engine/core.js engine/app.html
engine/sw.template.js build.sh`: core.js 9 lines, app.html 48, `engine/sw.template.js` and `build.sh` 0). VERDICT PASS,
no storage field change: nothing new is written to `vocab_zh` (boot writes nothing, no backup path touched, no
day-log change; byte-equal round trip both ways). Only removals of writes (`reopened`, `peekText`); the only
new state is `rd.qv[i].lkText` (look-back text toggle) inside the parked session record `vocab_zh_session`, restored by
`sessionResume`; old records carrying `reopened`/`peekText` still resume. vocab-engine tests at 2a76e72 (main checkout,
clean, read-only): engine_checks 704, migration_checks 390, listen_mode_checks 192, session_resume_checks 125,
help_close_checks 42, 0 failed. Pack: generator output (`pack_from_hsk.py . --out` twice, byte-identical) matches;
vocab-engine packs/zh == committed pack (`diff -rq` empty), so the pack diff is EMPTY. `validate_pack.py pack`: 0
errors, 1 WARN (138 of 4946 linked words have no span). Build deterministic (two builds: index.html
d8c08a9cd2eb98f25fdefbee20835d45, sw.js 94cb0a601c9b5eb5d8dbe683e0369038; VE_BUILD 541528795-1922373, ve-build marker
2439318870-1921696). Rollback hash (pre-republish HEAD, includes the 0ae962d browser-proof line):
1524ea35937c2a1768399d26cd19569560d9c5ae. Pre-republish live md5s: index.html c36196e5d3a8f229e17b590c6329f0f5, sw.js
7db0176a68b14865df4a3b10107ab7f4.
 Browser proof (Playwright chromium 390x844 mobile, .cache/live/proof-2a76e72/, live vs 1524ea3 served locally, 2026-10-04): KEEP, all PASS. Live md5s match; 53 seeds byte-equal after boot/reload/Progress, no backups, Progress counts equal to 1524ea3; parked drill and parked passage from 1524ea3 dropped cleanly on live (stale build), rollback boots byte-equal with 0 errors; listening look-back shows "Replay passage" rows with no hanzi, results lack " · looked back"/"Text shown while listening", weak list same word as 1524ea3; reading pass unchanged; pause chip, 15 s popover, Learn label, offline boot OK.
Known open items on 2a76e72: optsMix follow-up (bucket wrong choices by the session an item was learned in, new
record field `f`); dayAware `owns()` dead code and lag/pause/opts_mix controls swallowing a day_rules_patch no-match
(fb10 review M2/M3), see vocab-engine/TODO.md. A browser worker runs the live snapshot-diff proof separately.

Migration proof 2026-10-04 for the a2f2426 republish (engine 2a76e72 -> a2f2426: pack flag `wordsBy: "typed"` (zh, needs
dayAware + typing): from streak 2 a word advances only by a right typed answer, choice/ear rights hold, a miss steps the
streak down one, no retry credit after such a miss, one typed ask per word per session, Review/Recall ask held words
typed, Recall stage 12 items instead of 8): storage/migration diff audit (`git -C engine diff 2a76e72..a2f2426 --
engine/core.js engine/app.html engine/sw.template.js build.sh`: core.js 78 lines, app.html 42, `engine/sw.template.js`
and `build.sh` 0). VERDICT PASS: `vocab_zh` UNCHANGED (no new field; `markWordRec` only moves existing `r`/`w`/`s`,
streak never below 1 from the s>=2 hold; boot writes nothing, no backup path touched; byte-equal round trip both ways,
migration_checks [wordsBy]). Session record `vocab_zh_session` gains optional `today.tw` (word ids typed this session) and
`drill.dn` (words stepped down this drill), written only under the flag; a parked record from 2a76e72 resumes
(session_resume_checks). vocab-engine tests at a2f2426 (main checkout, clean, read-only): engine_checks 704,
migration_checks 395, words_typed_checks 57, day_sim_checks 77, session_resume_checks 125, 0 failed. Pack diff vs
committed: pack.json/pack.js ONLY (`wordsBy: "typed"` added; every w19 flag present: readRotation, listenQuestions "all",
characters.bare 5, optsMix, pauseNew, characters.learn "lag", dayAware); vocab-engine packs/zh == pack by `diff -rq`
after the copy. `validate_pack.py pack`: 0 errors, 1 WARN (138 of 4946 linked words have no span). Build deterministic
(two builds: index.html 95f78686049ae6ab43d45b1f5b0ec834, sw.js 5bbe6e673599b78f5cee34c1abb1885e; VE_BUILD
447700362-1929920, ve-build marker 2095466342-1929243). Rollback hash (pre-republish HEAD, includes the 2a76e72 browser-proof
line): 08149e3a5dbc1720134411b90e58f6b16ba5ea8a. Pre-republish live md5s: index.html d8c08a9cd2eb98f25fdefbee20835d45,
sw.js 94cb0a601c9b5eb5d8dbe683e0369038.
Known open items on a2f2426: optsMix follow-up (bucket wrong choices by the session an item was learned in, new
record field `f`); dayAware `owns()` dead code and lag/pause/opts_mix controls swallowing a day_rules_patch no-match
(fb10 review M2/M3), see vocab-engine/TODO.md. A browser worker runs the live snapshot-diff proof separately.
Browser proof (Playwright chromium 390x844 mobile, .cache/live/proof-a2f2426/, live vs 08149e3 served locally, 2026-10-04): KEEP, all PASS. Live md5s match (index.html 95f78686..., sw.js 5bbe6e67...). 53-seed migration byte-equal (3 seeds differ only by a dropped stale session key), parked prev drill dropped, rollback of a completed and a parked (today.tw) live session boots on 08149e3 byte-equal; Recall row 12; typed/choice streak table and one typed ask per word per session as specified; 0 console errors.

Migration proof 2026-10-04 for the 2412992 republish (engine a2f2426 -> 2412992: pack flag `progressMap: true` (zh, needs
dayAware): Today row `You ▸ [bar] ▸ follow a drama without pausing` + pace line ("pace: — (after 14 sessions)" until 14
session entries exist, then "≈ N sessions to go"); position = 0.5 known words + 0.25 bare units + 0.25 passages passed by
listening; tap opens Progress): storage/migration diff audit (`git -C engine diff a2f2426..2412992 -- engine/core.js
engine/app.html engine/sw.template.js build.sh`: core.js 35 lines, app.html 15, `engine/sw.template.js` and `build.sh` 0).
VERDICT PASS: ONE NEW OPTIONAL top-level field `prog.pm` = [{sn, p}] (max 14 entries), appended by `recordProgressMap` at
Session done only under the flag (app.html todayFinish); boot writes nothing, no backup path touched; `validateProgShape`
accepts `pm`; a2f2426 boots a record carrying `pm` with no backup and keeps it (migration_checks [progressMap], both
directions). Session record unchanged. vocab-engine tests at 2412992 (main checkout, clean, read-only): engine_checks 704,
migration_checks 400, progress_map_checks 40, session_resume_checks 125, 0 failed. Pack diff vs committed: pack.json/pack.js
ONLY (`progressMap: true` added; every w21 flag present: wordsBy "typed", readRotation, listenQuestions "all",
characters.bare 5, optsMix, pauseNew, characters.learn "lag", dayAware); vocab-engine packs/zh == pack by `diff -rq`.
`validate_pack.py pack`: 0 errors, 1 WARN (138 of 4946 linked words have no span). Build deterministic (two builds:
index.html 655babc7284ec9fe0d1b80d2f83476e6, sw.js 73f6037855b388cd0ba6c7e02b42ba1e; VE_BUILD 666862095-1933268, ve-build
marker 869822592-1932591). Rollback hash (pre-republish HEAD, includes the a2f2426 browser-proof line):
6fcb7bdb01fb96b2a4d628540b2b6d4ed12c3011. Pre-republish live md5s: index.html 95f78686049ae6ab43d45b1f5b0ec834, sw.js
5bbe6e673599b78f5cee34c1abb1885e.
Known open items on 2412992: optsMix follow-up (bucket wrong choices by the session an item was learned in, new
record field `f`); dayAware `owns()` dead code and lag/pause/opts_mix controls swallowing a day_rules_patch no-match
(fb10 review M2/M3), see vocab-engine/TODO.md. A browser worker runs the live snapshot-diff proof separately.

Browser proof (Playwright chromium 390x844 mobile, .cache/live/proof-2412992/, live vs 6fcb7bd served locally, 2026-10-04): KEEP, all PASS. Live md5s match (index.html 655babc7..., sw.js 73f60378...). Owner seed byte-equal after boot/reload/Progress, no backup keys, Progress rows equal to 6fcb7bd; parked 6fcb7bd drill dropped at boot; rollback of a live-written record (pm with one entry) boots on 6fcb7bd byte-equal and a session runs. Progress map row one line each (324 px of 390), bar 2/10 from p 0.2039 (479/1193 words, 15/1193 bare units, 0/60 listened), pace "—" until 14 entries, "≈ N sessions to go" matches ceil((1-p)/rate); pm appends per session, trims to 14. Regressions (Recall 12, one typed ask per word, Replay passage, pause chip, 15 s popover, recount, offline boot) equal to 6fcb7bd; 0 console errors.

Migration proof 2026-10-05 for the 1c035f3 republish (engine 2412992 -> 1c035f3: pack flag `progressMap` becomes
`{ goals: [{upTo, label} x3] }` (upTo "2"/"3"/"4"): the Today row shows ONE goal at a time ("Goal 1 of 3 ▸ [bar] ▸ survive a
trip: ..."), scoped to levels <= upTo (0.6 words known + 0.2 units mastered + 0.2 passages listened), switches at 90%, pace
to the 90% point; Progress tab gains a 3-line Goals block): storage/migration diff audit (`git -C engine diff
2412992..1c035f3 -- engine/core.js engine/app.html engine/sw.template.js build.sh`: core.js 52 lines, app.html 17,
`engine/sw.template.js` and `build.sh` 0). VERDICT PASS: NO new storage key; `prog.pm` entries gain an optional `g` (goal
index, number); `validateProgShape` now accepts `{sn, p, g?}`; boot writes nothing, no backup path touched. 2412992 and
a2f2426 boot a record with `g` entries with no backup, byte-equal, and back (migration_checks 406). Session record
unchanged. vocab-engine tests at 1c035f3 (main checkout, clean, read-only): engine_checks 704, migration_checks 406,
progress_map_checks 94, lag_checks 45, 0 failed. Pack diff vs committed: pack.json/pack.js ONLY (progressMap shape);
every w22 flag present (wordsBy "typed", readRotation, listenQuestions "all", characters.bare 5, optsMix, pauseNew,
characters.learn "lag", dayAware); generator x2 identical. `validate_pack.py pack`: 0 errors, 1 WARN (138 of 4946 linked
words have no span). Build deterministic (two builds: index.html 590d4f966ef7d34137d6ebfaee1c954d, sw.js
91f4496cebf6f1dbe2587d4f2b3c5baf; VE_BUILD 847348977-1937480, ve-build marker 257463149-1936803). Rollback hash
(pre-republish HEAD, includes the 2412992 browser-proof line): 4acc55d1dd4c30d9dbf231aaf4cf21c27146618a. Pre-republish live
md5s: index.html 655babc7284ec9fe0d1b80d2f83476e6, sw.js 73f6037855b388cd0ba6c7e02b42ba1e.
Known open items on 1c035f3 unchanged from 2412992 (optsMix follow-up, dayAware `owns()` dead code, fb10 review M2/M3; see
vocab-engine/TODO.md). A browser worker runs the live snapshot-diff proof separately.
- 2026-10-05 browser proof, live 1c035f3 (32b39f9) vs 4acc55d: KEEP, all PASS. Owner seed byte-equal after boot/reload/Progress, no backup keys, Progress rows equal to prev; fb20-style pm (no g) boots byte-equal (pace "—", entries without g ignored for a 3-goal pack); rollback (live record pm [{sn:9,p:0.762,g:0}]) boots on 4acc55d byte-equal, g kept, no backup, 0 errors, session runs. Goal row 390x844: `Goal 1 of 3 ▸ [■■■■■■■■□□] ▸ survive a trip: …` (76% / 60% / 30%, independently recomputed), no overflow; pace, goal switch (Goal 2 of 3, All goals) and Recall 12 / Replay passage / pause chip / 15 s popover / recount / offline boot pass, 0 console errors. Evidence chinese/.cache/live/proof-1c035f3/.

Migration proof 2026-10-05 for the 0ee3c71 republish (engine 1c035f3 -> 0ee3c71: under `optsMix` (already on zh) wrong
choices are bucketed by the session a word/unit was learned (new OPTIONAL record field `f` = session number) instead of by
position; the group filling the last slots rotates its subset per session; `charSound` ranks options by reading syllable
count; unit-hint pinyin gets per-syllable tone colours under `tones`): storage/migration diff audit (`git -C engine diff
1c035f3..0ee3c71 -- engine/core.js engine/app.html engine/sw.template.js build.sh`: core.js 33 lines, app.html 52,
`engine/sw.template.js` and `build.sh` 0). VERDICT PASS: NO new storage key; ONE NEW OPTIONAL numeric field `f` on NEW
records only: `prog.w[id].f` (app.html markWord, only when the record did not exist) and `prog.chars.c[id].f` (markChar, new
unit records), written only under optsMix and only when a session number (`prog.sn`) exists; existing records are never
touched; boot writes nothing, no backup path touched; `validateRecMap` accepts a numeric `f`. 1c035f3 boots a record
carrying `f` with no backup, byte-equal, and back (migration_checks 412). Session record unchanged. vocab-engine tests at
0ee3c71 (main checkout, clean, read-only): engine_checks 704, migration_checks 412, characters_app_checks 206,
progress_map_checks 94, 0 failed. Pack diff vs committed: EMPTY (generator x2 identical, == committed pack and
vocab-engine packs/zh by `diff -rq`); every w23 flag present (wordsBy "typed", readRotation, listenQuestions "all",
characters.bare 5, optsMix, pauseNew, characters.learn "lag", dayAware, progressMap goals x3). `validate_pack.py pack`: 0
errors, 1 WARN (138 of 4946 linked words have no span). Build deterministic (two builds: index.html
d66bdf14ba137eadf911903c1848c5e7, sw.js aff570050dd2349a2c60a603a5afadd3; VE_BUILD 657590939-1940945, ve-build marker
352079373-1940268). Rollback hash (pre-republish HEAD, includes the 1c035f3 browser-proof line):
33cb3665e83ee6af697dd58cd86a10b8f04c5702. Pre-republish live md5s: index.html 590d4f966ef7d34137d6ebfaee1c954d, sw.js
91f4496cebf6f1dbe2587d4f2b3c5baf.
Known open items on 0ee3c71: dayAware `owns()` dead code and lag/pause/opts_mix controls swallowing a day_rules_patch
no-match (fb10 review M2/M3), see vocab-engine/TODO.md (the optsMix `f` follow-up is done by this release). A browser worker
runs the live snapshot-diff proof separately.
- 2026-10-05 browser proof, live 0ee3c71 (ccbc636) vs 33cb366: KEEP, all PASS. md5s match; owner seed byte-equal after boot/reload/Progress, no backups, no existing record gains f; owner session learned 10 units f=9 (sn), fresh seed learned 10 words f=1; both roll back to 33cb366 byte-equal, f kept, session runs. Option sets: 200 Characters-test draws differ from prev in 82 of 200 sets (same seed); 8 carried sessions: 0 repeated answers, 0 identical-wrong repeats. charSound 一会儿: wrong readings 2-syllable in 894/900 (6 fell back to 3), prev 0/900; hint tone spans on 679/679 marked-sound units (prev 0). Goal row, pause chip, Recall 12, Replay passage, 15 s popover, recount, offline SW boot unchanged; 0 console errors, 0 failed requests (fonts offline excepted). Evidence chinese/.cache/live/proof-0ee3c71/.

Migration proof 2026-10-05 for the fbb0d54 republish (engine 0ee3c71 -> fbb0d54: NEW PACK FLAG `pairs: true` (zh, needs dayAware): every word/unit is three pairs (W-M, S-M, W-S) with its own streak; Review, Recall, Listen and Test Characters pick the lowest pair streak first, oldest first, with a 10% refresh share of mastered pairs; a miss resets its pair to 0; 2 -> 3 only by a production answer; plan lines say "weakest pairs first"): storage/migration diff audit (`git -C engine diff 0ee3c71..fbb0d54 -- engine/core.js engine/app.html engine/sw.template.js build.sh`: core.js 139 lines, app.html 69, `engine/sw.template.js` and `build.sh` 0). VERDICT PASS: NO new storage key; ONE NEW OPTIONAL field `p` on word records (`prog.w[id].p`) and unit records (`prog.chars.c[id].p`), shape `{wm|sm|ws: [streak, session]}`, written only by `notePair` (core.js) under the flag and only for a pair that was answered; every existing field is written exactly as before; boot writes nothing, no backup path touched; `validateRecMap` / `validateProgShape` do not reject `p`. 2412992 and 3901e2e boot a record carrying `p` byte-equal with no backup, and back (migration_checks 421 [pairs]). Session record unchanged. vocab-engine tests at fbb0d54 (main checkout, read-only): engine_checks 704, migration_checks 421, pairs_checks 48, words_typed_checks 57, session_resume_checks 125, 0 failed. Pack diff vs committed: pack.json (`"pairs": true` added) and pack.js only; generator x2 identical and == vocab-engine packs/zh pack.json; every w24 flag present (pairs, optsMix, pauseNew, dayAware, readRotation, listenQuestions "all", wordsBy "typed", progressMap goals x3, characters.bare 5, learn "lag", bareBy "typed"). `validate_pack.py pack`: 0 errors, 1 WARN (138 of 4946 linked words have no span). Build deterministic (two builds: index.html 97f27e2a20e361d9c68b4676641b94c3, sw.js 2736df1d41290c9c38c39d1bbc2605bf; VE_BUILD 1819630182-1955433, ve-build marker 665877208-1954757). Rollback hash (pre-republish HEAD, includes the 0ee3c71 browser-proof line): 8ca7f0efd9c93825da8273478c55fa0e19738e76. Pre-republish live md5s: index.html d66bdf14ba137eadf911903c1848c5e7, sw.js aff570050dd2349a2c60a603a5afadd3.
Known open items on fbb0d54: dayAware `owns()` dead code and lag/pause/opts_mix controls swallowing a day_rules_patch no-match (fb10 review M2/M3), see vocab-engine/TODO.md. A browser worker runs the live snapshot-diff proof separately.
- 2026-10-06 browser proof, live fbb0d54 (41b02b1) vs 8ca7f0e: KEEP, all PASS. md5s + build marker match. Owner seed (vocab_zh_progress_8) byte-equal after boot/reload/Progress, no backup keys, Progress rows equal to prev, 0 records with `p` before an answer. Unpaused live session: 62 records carry `p`, only on answered pairs (9-12 units get p via typed word answers, same pair as the word item); 8ca7f0e boots that record byte-equal, p kept 62/62, session runs, 0 errors; back to live byte-equal. Plan lines say "weakest pairs first" (Review, Recall, paused Review); Review holds wm/sm/ws (s1 9/8/3; prev all typed); missed unit c0460 (charRecall wm, streak [0,20]) returns in s2 Review as charRecall wm -> [1,21]. No (item, pair) asked twice, no word typed twice (3 sessions). Goal row, pause chip, paused session pairs, Replay passage, 15 s popover, recount, Test Characters, offline boot from SW cache all equal prev; 0 console errors, 0 failed requests (fonts excepted). Evidence chinese/.cache/live/proof-fbb0d54/.

Migration proof 2026-10-06 for the b21ee93 republish (engine fbb0d54 -> b21ee93: fb24 one global CSS rule `ruby.bare rt{visibility:hidden}` so bare-tier words hide pinyin in passage question stems, options, titles, list buttons and results as in the passage body (display only); fb25 under `pairs` a paused session's Review stays at 20 (the pauseNew growth `o.extra` is ignored)): storage/migration diff audit (`git -C engine diff fbb0d54..b21ee93 -- engine/core.js engine/app.html engine/sw.template.js build.sh`: core.js 9 lines, app.html 2, `engine/sw.template.js` and `build.sh` 0). VERDICT PASS, no storage change: NO new key, NO new field, no changed write; the diff has no localStorage/sessionStorage/vocab_ reference; boot writes nothing, no backup path touched; progress and session records byte-identical to fbb0d54 (migration_checks 421 unchanged). vocab-engine tests at b21ee93 (main checkout, read-only): engine_checks 704, migration_checks 421, pairs_checks 49, pause_checks 49, characters_app_checks 211, 0 failed. Pack diff vs committed: EMPTY (generator x2 identical, == committed pack and vocab-engine packs/zh; jsonify js identical); all w25 flags present incl. `pairs: true`. `validate_pack.py pack`: 0 errors, 1 WARN (138 of 4946 linked words have no span). Build deterministic (two builds: index.html c4e516d4497f36691052b16997c9bd63, sw.js 86852ab765edbb68969ada5809066b05; VE_BUILD 1650971515-1955428, ve-build marker 3644599825-1954752). Rollback hash (pre-republish HEAD, includes the fbb0d54 browser-proof line): 083343e5867b1423f35106b47abea228ce5e8490. Pre-republish live md5s: index.html 97f27e2a20e361d9c68b4676641b94c3, sw.js 2736df1d41290c9c38c39d1bbc2605bf.
- 2026-10-06 browser proof, live b21ee93 (cf82f83) vs 083343e: KEEP, all PASS. md5s match. Owner seed byte-equal after boot/reload/Progress, no backup keys, Progress rows + 字 counts equal to prev; one unpaused Today session on live boots on 083343e byte-equal, no backup, 0 errors, session runs, back to live byte-equal. fb24: p0014/p0012 question stems, options, results and list/title (p0007) render bare-tier words as `ruby.bare` with rt computed hidden (prev: visible); ruby-tier rt visible, passage body HTML identical. fb25: paused plan "Review only · new material paused." Review 20 items (prev 40; paused session 29 Review answers vs 55); unpaused plan 20 + Learn unchanged. Goal row, pairs plan lines, Replay passage, 15 s popover, recount, Test Characters, offline SW boot equal to prev; 0 console errors, 0 failed requests (fonts offline excepted). Evidence chinese/.cache/live/proof-b21ee93/.
Known open items on b21ee93: dayAware `owns()` dead code and lag/pause/opts_mix controls swallowing a day_rules_patch no-match (fb10 review M2/M3), see vocab-engine/TODO.md. A browser worker runs the live snapshot-diff proof separately.

Migration proof 2026-10-07 for the dbcaf9c republish (engine b21ee93 -> dbcaf9c: fb26 `freqTiers` three frequency tiers ambient/core/peripheral from wordfreq, words and characters ordered frequent-first within each level, peripheral words known at every askable pair >= 2, refresh slot every other session, ambient excluded from refresh; fb27 `characters.start: 60` + `ramp: [3,5,8]` under `learn: "lag"`, sets never straddle a level; review/browser fixes; fb30 opts-mix bound): storage/migration diff audit (`git -C engine diff b21ee93..dbcaf9c -- engine/core.js engine/app.html engine/sw.template.js build.sh tools/pack_from_hsk.py`: core.js 202 lines, app.html 40, sw.template.js and build.sh 0). VERDICT PASS, no storage change: NO new key, NO new progress field (`ft` lives in the pack, not in progress); boot writes nothing, no backup path touched; progress and session records byte-identical to b21ee93 (migration_checks [freqTiers]: records written under the flag boot on b21ee93 and 2412992 byte-equal and back, no backup). One write site changes rule, not shape: under the flag `settleProv` (core.js, called from app.html markWord) drops the existing `prov` marker at answer time once the word is known by its tier rule, where b21ee93 dropped it at the legacy streak in markRec; same field, same delete, old engines treat prov as optional. vocab-engine tests at dbcaf9c (main checkout, read-only): engine_checks 704, migration_checks 426, pairs_checks 49, freq_tiers_checks 79, lag_checks 62, characters_app_checks 211, flagoff_snapshot --check 26, 0 failed. Pack diff vs committed (generator from an engine archive at dbcaf9c into two scratch dirs seeded with pack/, byte-identical, == vocab-engine packs/zh): pack.json adds `freqTiers: true`, `characters.start: 60`, `characters.ramp: [3,5,8]`, all earlier flags incl. `pairs: true` kept; words.json and characters.json differ only in `ft` on all 1193 entries and in order within levels (per-id field diff other than `ft`: none; id sets equal); legacy.json same id map, key order only; attribution.json frequency source text; sentences, passages, lessons byte-identical. `ft` counts per level (ambient/core/peripheral), words and characters equal: HSK1 45/95/10, HSK2 27/96/24, HSK3 14/180/104, HSK4 14/315/269. `validate_pack.py pack`: 0 errors, 1 WARN (138 of 4946 linked words have no span). Build deterministic (two builds: index.html 12dbe35b6b6b769a0d579c7f2e017ab2, sw.js 7078181576b2dc7a7e78b40c823b4dc7; VE_BUILD 1035341010-1984091, ve-build marker 640818714-1983415). Rollback hash (pre-republish HEAD, includes the b21ee93 browser-proof line): c3f2596a076d99a733f27a785893757c11e1d8e8. Pre-republish live md5s: index.html c4e516d4497f36691052b16997c9bd63, sw.js 86852ab765edbb68969ada5809066b05.
- 2026-10-07 browser proof, live dbcaf9c (0f49aa7) vs c3f2596: KEEP, all PASS. md5s match. Owner seed byte-equal after boot/reload/Progress, no backup keys, session record boots on c3f2596 and back byte-equal, 0 errors. Progress known 491 vs 455 expected (mastered counts up per tier rule, 字 rows "15/33/16 done"). Next word set live 与 而 等 以 之 过 由 发展 社会 进行 vs prev 一切 不仅 不但 ...; no ambient refresh asks. Fresh ramp: words to 60 then "字 HSK 1, set 1 of 17" (prev 字 at 50). Regressions equal. Evidence chinese/.cache/live/proof-dbcaf9c/.
Known open items on dbcaf9c: dayAware `owns()` dead code and lag/pause/opts_mix controls swallowing a day_rules_patch no-match (fb10 review M2/M3), see vocab-engine/TODO.md. A browser worker runs the live snapshot-diff proof separately.

Migration proof 2026-10-07 for the b41a85b republish (engine dbcaf9c -> b41a85b: fb29 pack flag `patterns: true` + patterns.json, 27 grammar patterns with 177 cloze sentences (HSK 2-4, from data/hsk_patterns.js incl. PATTERN_EXTRA); the Sentences step asks 3 pattern clozes of 8, Test Sentences 8 of 20; a pattern opens when its key words are learned, its level is reached and 80% of its sentence words are learned; Progress row "Patterns"; plan line "8 items · 3 patterns"; opts_mix test-only fixes e2f8ffe): storage/migration diff audit (`git -C engine diff dbcaf9c..b41a85b -- engine/core.js engine/app.html engine/sw.template.js build.sh tools/pack_from_hsk.py`: core.js 93 lines, app.html 76, pack_from_hsk.py 121, sw.template.js and build.sh 0). VERDICT PASS, ADDITIVE storage change only: NO new key; ONE new optional top-level progress key `prog.pt = {patternId: {s: streak, a: session last answered}}`, written only by `notePattern` (core.js:1817, creates `prog.pt` at :1821) when a pattern cloze is answered under the flag (app.html:1867, then store.save); ONE new optional session-record field `today.pt` (list of pattern ids planned in the running Today session; written app.html:1676, read on resume :1723). `validateProgShape` never looks at `pt`; a malformed `pt` entry reads as empty. Boot writes nothing; a record without `pt` is untouched until a pattern is answered; no backup path touched. migration_checks [patterns]: a record WITH `pt` boots on the previous build (engine dbcaf9c, live 0f49aa7) and on b21ee93 and 2412992 unchanged, no backup key, `pt` preserved through a mark, and boots back here byte-equal. After a rollback to fec2da7 / 0f49aa7 a record carrying `pt` is harmless on the old build. vocab-engine tests at b41a85b (main checkout, read-only): engine_checks 704, migration_checks 435, patterns_checks 79, pairs_checks 49, freq_tiers_checks 79, lag_checks 62, session_resume_checks 125, flagoff_snapshot --check 26, 0 failed. Pack diff vs committed (generator from an engine archive at b41a85b into two scratch dirs seeded with pack/, byte-identical, == vocab-engine packs/zh): pack.json adds `patterns: true` only (all earlier flags kept, `compounds` identical); NEW patterns.json; sentences.js gains the PATTERNS const (sentences.json byte-identical); attribution.json gains the patterns source; words, characters, lessons, legacy byte-identical. `validate_pack.py pack`: 0 errors, 1 WARN (138 of 4946 linked words have no span), 27 patterns (177 sentences). Build deterministic (two builds: index.html 4db7c12e74d0171175bf99f98091559c, sw.js a0cfe0d95ffe5d73861406cbb7a90bd4; VE_BUILD 618333713-2067497, ve-build marker 3595847669-2066820). Rollback hash (pre-republish HEAD; fec2da7 is a data-only commit above the dbcaf9c browser-proof line): fec2da7a13eb64823b8d3c0d450902e603c0e13c. Pre-republish live md5s: index.html 12dbe35b6b6b769a0d579c7f2e017ab2, sw.js 7078181576b2dc7a7e78b40c823b4dc7.
- 2026-10-07 browser proof, live b41a85b (cbdc492) vs fec2da7: KEEP, all PASS. md5s match (index 4db7c12e, sw a0cfe0d9). Owner seed byte-equal at boot/reload/Progress, only key vocab_zh, no pt and no backups; unpaused live session adds prog.pt {p01 s0, p02 s1, p03 s1} plus pm (also written by fec2da7) and today.pt in the session record; fec2da7 boots that record byte-equal incl pt, runs a session, pt unchanged; back on live byte-equal, streaks intact. Plan 8 items · 3 patterns, Progress Patterns 0 done / 19 open (of 27), Test Sentences 8 pattern of 20, reload mid-cloze resumes same item and option order. Regular gap clozes identical on 882 of 882 sentences (incl 16 with 下雪/一下). 0 console errors. Evidence chinese/.cache/live/proof-b41a85b/.
Known open items on b41a85b: dayAware `owns()` dead code and lag/pause/opts_mix controls swallowing a day_rules_patch no-match (fb10 review M2/M3), see vocab-engine/TODO.md. A browser worker runs the live snapshot-diff proof separately.

Migration proof 2026-10-07 for the 34c5df3 republish (engine b41a85b -> 34c5df3: fb31 `patternCue: "after"` (English sentence behind a "meaning" tap until answered) and `characters.bareByPair: true` (pinyin hidden once the unit's or its word's W<->M pair streak >= 2 by the most recent answer; a miss restores it); fb32 `glossStyle: "primary"` (first sense plain, rest bracketed and muted; reveal/rows add "also: <typedSyn>"); fb33 per-compound hint meanings + 24 hand hints; fb34 15 new HSK 3/4 passages p0061-p0075, zh uses TTS so no audio to build; teach-screen hint dedupe keyed on character + hint text): storage/migration diff audit (`git -C engine diff b41a85b..34c5df3 -- engine/core.js engine/app.html engine/sw.template.js build.sh tools/pack_from_hsk.py`: app.html 66 lines, core.js 49, pack_from_hsk.py 35, sw.template.js and build.sh 0). VERDICT PASS, NO STORAGE CHANGE: the only added line touching storage vocabulary is the compare-time API export list (`BARE_PAIR, bareByPairOn, pairBare`); no write path, no new key or field, no change to `storageKey`/`migrateLegacy`/`parseStored`/`defaultProg`/`validateProgShape`/`normalizeProg`, no `localStorage`/`sessionStorage`/`vocab_` string touched, no backup path touched. Boot writes nothing; the "meaning" tap writes nothing; pair-bare is derived from existing `p` streaks at render time. migration_checks [bareByPair]: a pair-bare unit's records boot on 3044601 byte-equal and back. vocab-engine tests at 34c5df3 (main checkout, read-only): engine_checks 704, migration_checks 438, bare_pair_checks 25, patterns_checks 92, gloss_display_checks 29, pairs_checks 49, freq_tiers_checks 79, characters_app_checks 219, passage_audio_checks 43, listen_mode_checks 192, session_resume_checks 125, flagoff_snapshot --check 26, 0 failed. Pack diff vs committed (generator from an engine archive at 34c5df3, seeded with vocab-engine packs/zh because passages come from packbuilder, run twice into scratch dirs: byte-identical to each other and to vocab-engine packs/zh): pack.json adds `glossStyle: "primary"`, `characters.bareByPair: true`, `patternCue: "after"` (all earlier flags kept, `compounds` identical); characters.json: `hint` only, on 854 of 1193 units (the brief estimated ~566; no other field changed); words.json: 上午 `en` drops "a.m." and, as the derived consequence, the spurious synonym link 是 -> 上午 (the "am" of 是's gloss matched "a.m.") is gone from both 是 and 上午 `syn` (not in the brief's list; `syn` is pack data, not stored progress); patterns.json: near lists + rewritten sentences; passages.json: 60 existing passages byte-identical as records, +15 (p0061-p0075, levels 3/4: 20 and 25 passages); attribution.json hints source line; sentences.js carries the passages const; sentences.json, lessons.json, legacy.json, gloss_display.json identical. `validate_pack.py pack`: 0 errors, 1 WARN (138 of 4946 linked words have no span), 75 passages, 27 patterns. Build deterministic (two builds: index.html b7a1110154cab393124b2b01dd27a28e, sw.js e709320655bc7749975c6b490074d14c; VE_BUILD 141735627-2250130, ve-build marker 2630939348-2249453). Rollback hash (pre-republish HEAD): d143e8d358ceaa116b0db830306cfc39de0d1386. Pre-republish live md5s: index.html 4db7c12e74d0171175bf99f98091559c, sw.js a0cfe0d95ffe5d73861406cbb7a90bd4. A browser worker runs the live snapshot-diff proof separately.
- 2026-10-07 browser proof, live 34c5df3 (f05b176) vs d143e8d: KEEP, all PASS. md5s match (index b7a11101, sw e7093206). Owner seed byte-equal at boot/reload/Progress, only key vocab_zh, no backups; an unpaused live session (pattern cloze answered via the "meaning" tap, one miss) adds only pt and pm; d143e8d boots that record byte-equal, runs a session, no backup; back on live byte-equal. Pattern cloze shows no English until the "meaning" tap or reveal (prev shows it up front); primary sense plain with muted bracket, 4 long options fit at 360px; 服务员 "服 to serve / 务 duty / 员 staff", 有 and 那 now hinted; pair-bare flips on one right W->M, ruby returns on a miss (prev stays ruby); HSK 3 "12 / 20", 20 buttons, p0063 plays; regressions equal, 0 console errors. Evidence: .cache/live/proof-34c5df3/.
Known open items on 34c5df3: p0041 一只熊 ruby shows zhǐ (the passage builder has no per-sentence polyphone fix); dayAware `owns()` dead code and lag/pause/opts_mix controls swallowing a day_rules_patch no-match (fb10 review M2/M3), see vocab-engine/TODO.md.
Migration proof 2026-10-07 for the 806ad57 republish (engine 34c5df3 -> 806ad57: fb35 `characters.bareByPair` rule: the ruby unit's pinyin hides only when BOTH the written<->meaning and written<->sound pairs are >= 2, each judged by the latest answer among the unit's and its word's records): storage/migration diff audit (`git -C engine diff 34c5df3..806ad57 -- engine/core.js engine/app.html engine/sw.template.js build.sh tools/pack_from_hsk.py`: core.js 27 lines inside `pairBare`, pack_from_hsk.py comment only, app.html/sw.template.js/build.sh 0). VERDICT PASS, NO STORAGE CHANGE: display rule only, reads existing `p.wm`/`p.ws` streaks, no write path, key, field or backup touched. vocab-engine tests at 806ad57 (main, read-only): engine_checks 704, migration_checks 438, bare_pair_checks 27, pairs_checks 49, flagoff_snapshot --check 26, 0 failed. Pack diff EMPTY (generator from an 806ad57 archive run twice, identical to each other and to chinese/pack). Build deterministic: index.html 9a25e1698c08ae14c89042cf76bc3da5, sw.js 34a836c06e9014c359065535dabc4424, build id / ve-build marker 848211297-2249703. Rollback hash (pre-republish HEAD): 9bc3afe3ec615e95e26dbeaf7f20d81043b590c1. Pre-republish live md5s: index.html b7a1110154cab393124b2b01dd27a28e, sw.js e709320655bc7749975c6b490074d14c. Slim live proof follows.
- 2026-10-07 browser proof (slim), live 806ad57 (25d0619) vs 9bc3afe/f05b176: KEEP, all PASS. Live md5s match (index 9a25e169, sw 34a836c0, marker 848211297-2249703). Owner seed byte-equal at boot/reload/Progress, only key vocab_zh, no backups; one live Today session (52 answers) changes the record; f05b176 boots it byte-equal (boot/reload/Progress), runs a session, no backup keys; back on live byte-equal at boot/reload; plan lines render (Review 20, Listen 12, Recall 12, Sentences 8 + 3 patterns, Read 1); 0 console errors and no failed requests on any build. Evidence: .cache/live/proof-806ad57/.

Migration proof 2026-10-07 for the 9667a81 republish (engine 806ad57 -> 9667a81: fb36 `characters.bareByPair` Review plan reserves up to 3 slots (BARE_BOOST) for sound asks (ws direction) on ruby units whose meaning pair is known): storage/migration diff audit (`git -C engine diff 806ad57..9667a81 -- engine/core.js engine/app.html engine/sw.template.js build.sh tools/pack_from_hsk.py`: core.js only, bareBoost + pairJudge + pairPlan boost arg, Review plan order; app.html/sw.template.js/build.sh/pack_from_hsk.py 0). VERDICT PASS, NO STORAGE CHANGE: greps for localStorage/sessionStorage/storageKey/vocab_/backup/.bak/migrate/normalize/prog. writes hit only the API export list; no new field, key, write or backup path. vocab-engine tests at 9667a81: engine_checks 704, migration_checks 438, bare_pair_checks 38, pairs_checks 49, flagoff_snapshot --check 26, 0 failed. Pack diff EMPTY (generator from a 9667a81 archive run twice, identical to chinese/pack). Build deterministic (two builds): index.html 93b5ecb5db65ed11193a308ecae6fdc1, sw.js e59063ce2cecc42706b36e91024c94e8. Rollback hash (pre-republish HEAD): 6ee04c234a1e1b46eee27488aeebd00ef0017487. Pre-republish live md5s: index.html 9a25e1698c08ae14c89042cf76bc3da5, sw.js 34a836c06e9014c359065535dabc4424. Slim live proof follows.
- 2026-10-07 browser proof (slim), live 9667a81 (5825429) vs 6ee04c2/25d0619: KEEP, all PASS. Live md5s match (index 93b5ecb5, sw e59063ce, marker 3175658930-2251499). Owner seed byte-equal at boot/reload/Progress, only key vocab_zh, no backups; one live Today session (52 answers) changes the record; 25d0619 boots it byte-equal (boot/reload/Progress), runs a session, no backup keys; back on live byte-equal at boot/reload; plan lines render (Review 20, Listen 12, Recall 12, Sentences 8 + 3 patterns, Read 1); 0 console errors and no failed requests on any build. Evidence: .cache/live/proof-9667a81/.

Migration proof 2026-10-07 for the ef788da republish (engine 9667a81 -> ef788da: fb37 Progress v2 (`progressView`), fb38 `levelGate` 0.7 + `levelExam`, w32 fixes): storage/migration diff audit (`git -C engine diff 9667a81..ef788da -- engine/core.js engine/app.html engine/sw.template.js build.sh tools/pack_from_hsk.py`: core.js + app.html (Progress tab, level gate, levelExam, helpers), pack_from_hsk.py three flags, sw.template.js/build.sh 0). VERDICT PASS, storage: additive `prog.pv` {sn,m,co,p} written only on leaving the Progress tab / visibility hidden / pagehide, never at boot; previous build carries it untouched (unknown field; migration_checks [pv]). vocab-engine tests at ef788da: engine_checks 704, migration_checks 446, progress_view_checks 48, level_gate_checks 63, pairs_checks 49, flagoff_snapshot --check 26, 0 failed. Pack diff: exactly `progressView: "v2"`, `levelGate: 0.7`, `levelExam` {1,2 pinyin; 3,4 characters}; no other change. Build deterministic (two builds): index.html 3c1fd5f258e0b71782e4fbb63f53bac8, sw.js f73654cd3532150aa044394518ae7dab, marker 1315296599-2273067. Rollback hash (pre-republish HEAD): 09af3c8baba6b3cf4cf826ba4feb21adfb39b74e. Pre-republish live md5s: index.html 93b5ecb5db65ed11193a308ecae6fdc1, sw.js e59063ce2cecc42706b36e91024c94e8. Slim live proof follows.

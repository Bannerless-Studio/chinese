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

#!/bin/sh
# Runs every check that must pass before shipping the Chinese pack/site:
#   1. engine/tools/validate_pack.py - engine's schema, referential-integrity,
#      and generated-.js-in-sync checks
#   1b. tools/check_patterns.py - the hand-authored grammar patterns (data/hsk_patterns.js)
#      against the vocabulary, the same rules as the sentences plus marks and notes
#   2. stale-build guard (engine/tools/check_site.sh) - rebuilds index.html and sw.js
#      to a scratch dir and byte-compares them against the committed files, and checks
#      both are tracked by git and committed, so a forgotten `./build.sh` or a page
#      published without its sw.js is caught here rather than shipping stale.
# No packbuilder check: the zh pack is produced by vocab-engine/tools/pack_from_hsk.py
# from this repo's data/, not by packbuilder.
# Usage: ./check.sh
set -e
cd "$(dirname "$0")"

echo "== engine/tools/validate_pack.py =="
PYTHONPATH=engine/tools python3 engine/tools/validate_pack.py pack

echo
echo "== tools/check_patterns.py =="
python3 tools/check_patterns.py

echo
echo "== stale-build guard =="
sh engine/tools/check_site.sh pack        # [page], default index.html

echo
echo "All checks passed."

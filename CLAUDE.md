# CLAUDE.md — Peacock Reef fish table

Read this first, every session. Copy this file to the root of the GitHub repo (Flovash/Myprojext-Fishing-).

## What this is
A custom 10-seat fish arcade game (Peacock Reef) for a home fish table cabinet. Points only, played by friends. Two weapons: gun (shared odds) and fishing pole. Weekly table payback target 97-98%.

## Laws that never change
- Law zero: movement, routes and timing NEVER change catch chances or pays.
- Gun catch chance per hit = group payback / average multiplier.
- Group paybacks: tiny/small 98%, medium 97%, big 95%, boss 90%, special 95%.
- No per-player or per-type odds, ever. The director controls the show (which fish, where, when, pace), not the odds.
- Max 3 big fish on screen. One Shark per big-fish wave (60-75 s).

## Where things live
- GitHub repo = code and tools: game/, simulator/ (player lab), route_library/ (fish routes, laws), playbook/ (Reef Playbook page), director/ (code).
- Google Drive "Fish Game Table" = data and documents: reports, LOG.csv, director memory/journal/theories, PLAN_*.md files, notes. Never put player names, PINs or play data in the repo (it is public).

## How to work
- Before changing the game, run the player lab: 12+ simulated hours, at least 3 seeds. 4-hour runs are too noisy to judge.
- Every run writes reports/<date>_<label>_seed<N>/ with summary.md, and appends a line to LOG.csv.
- Make changes on a branch, open a pull request, describe what changed and the lab results.
- Add a dated line to CHANGES.md for every change, saying who made it (Claude Code, chat Claude, or the owner).

## Current priorities (in order)
1. Merge patterns_part2 (Drive inbox) into the route library.
2. Build the redesigned medium routes and flow rules (counterflow, lane reservation, 2 fast crossers, split rule) into the game.
3. Director training: follow PLAN_director_tracking.md, then PLAN_director_brain.md, PLAN_director_memory.md, PLAN_director_theories.md.
4. Fix master strategy waves 2-10: mediums swimming inside the Shark's 200 px ring.

## Open questions for the owner (ask, don't guess)
- Season length: 3, 6 or 9 waves (test in the lab).
- Should missed shots stay pure losses for beginners?
- Player name/PIN at the seat for tracking returns.

# Handoff for Claude Code

This folder came from a Claude chat where we designed and built the Peacock Reef fish table game. Read this first, then README.md.

## The project
- A custom 10-seat fish arcade game (points only, friends in a garage), running on a Batman Dark Knight fish table cabinet (hardware I/O still unresolved).
- Two weapons: gun (shared odds) and fishing pole (personal, strategic). Target payback about 97-98% weekly.
- `game/peacock_reef.html` is the full game (version 7). `window.__reef` is the test hook used by the simulator.
- `design/fish_table_design_spec.pdf` (and .md) is the full design spec: odds, groups, director, fishing.
- `route_library/` holds every fish's routes and purpose (`fish/*.json`, readable in `OPEN_ME.html` and `ROUTES.md`), the director's laws (`laws/laws.json`), waves 8-16, and `tools/sketch_waves.py`.

## Key rules
- Law zero: movement never changes catch chances or pays. Catch chance per hit = group payback / average multiplier.
- Group paybacks: tiny/small 98%, medium 97%, big 95%, boss 90%, special 95%.
- Big fish (Shark, Manta, Hammerhead, Marlin) are scheduled per big-fish wave (60-75 s): one Shark per wave, Manta every other wave, Shark gate during meetings, max 3 big fish on screen. In the game since version 6.
- Medium routes in `route_library/fish/` (homes, signature shapes, Corner hook, Side loop) are designed but NOT yet in the game; the game still has an older medium set. Counterflow, lane reservation, 2 fast crossers and the split rule are also designed only.

## Simulator
- Needs Node.js. `node simulator/medharness.js game/peacock_reef.html 60` runs 60 simulated minutes with 6 bot seats and prints gun/pole payback, per-group results, big-fish and medium stats.
- `simulator/exp.js <game> <minutes> base` prints catch pace, dry spells and wager share as JSON.
- Payback over 10-12 simulated hours swings about +/-4% because of bosses; compare several runs.

## Next job: the player lab
Build player types on top of the simulator and write a report after every run:
- Types: Sniper (big fish only, lock-on), Sprayer (max fire, closest fish, small bets), Chaser (raises bet after losses), Grinder (low steady bet, mediums), Whale (high bets on bosses and Sharks), Fisher (mostly pole), Casual (pauses, leaves when down a set amount), Newbie (misses a lot, slow).
- Each run writes `reports/YYYY-MM-DD_HHMM_<label>/` with `report.html` (readable page), `numbers.csv`, and `settings.json` (game version, laws, seed), and appends a line to `reports/LOG.csv` and `reports/index.html`.
- Per player type: payback, how long credits last, biggest win, time between wins, longest dry spell, fish caught by group, seat fairness.
- Also write a short `summary.md` in each report folder (plain text, a few lines) so the chat Claude can read results quickly through Google Drive.

## Then
1. Build the new medium routes and rules into the game and confirm with the lab.
2. Medium Rush (quick, big, themed), triggered right after the Shark leaves.
3. Small fish routes, specials, bosses.

## Player lab: built 2026-10-18
- `node lab/playerlab.js --minutes 240 --seed 1 --label <name>` (run from this folder). Same seed = same night, so A/B tests can rerun the exact night.
- Loads the game like `simulator/medharness.js`, but patches it to 10 seats (the old harness only gets 6, because seats are built before it sets 10) and lets the lab drive every bot seat. It also counts credits in and out per seat.
- Players sit down with a buy-in, leave when they bust, quit (Casual) or reach their time limit, and the next type in the rotation takes the seat, so every type plays every seat.
- Each run writes `reports/<date>_<time>_<label>_s<seed>/` with report.html, summary.md, numbers.csv and settings.json, appends to `reports/LOG.csv` and rebuilds `reports/index.html`.
- Checks itself: the lab's per-player totals must match the game's own ledger ("ledger check ok").

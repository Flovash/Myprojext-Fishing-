# Player lab: season-9 (seed 1)

2026-10-18 0419 · Peacock Reef v8 (03ad1c21a379) · 720 simulated min · 10 seats · 205 sessions · errors 0

- Table payback 102.0% (gun 103.6%, pole 97.6%); seat spread 62.1 pts
- By type: Sniper 80.1%, Sprayer 94.1%, Chaser 94.6%, Grinder 95.4%, Whale 107.4%, Fisher 98.8%, Casual 82.5%, Newbie 77.9%
- Bust rate: Sniper 92.6%, Sprayer 0.0%, Chaser 28.6%, Grinder 44.4%, Whale 73.9%, Fisher 78.3%, Casual 0.0%, Newbie 100.0%
- Gun per-hit payback by group (designed in brackets): tiny 102.8% [98.0%], small 99.0% [98.0%], medium 93.3% [97.0%], big 102.6% [95.0%], boss 119.6% [90.0%], special 149.8% [95.0%]
- Plays: after_boss_reset 0, after_shark_release 0, cold_seat_octopus 0, cold_table_tuna 0, hot_table_spread 0

- Whole table paid back 102.0% (gun 103.6%, pole 97.6%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Whale at 107.4%. Worst: Newbie at 77.9%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 seats spans 62.1 points (64.4% to 126.5%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 23,198 schools tracked; plays off (0 fired); seasons every 9 waves (40 seen); changes: season_length_waves 6 → 9. Average session 34.8 min, time between wins p90 13 s, longest dry spell p90 65 s.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 1 --label season-9 --plays off --law season_length_waves=9`

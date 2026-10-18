# Player lab: season-6 (seed 1)

2026-10-18 0413 · Peacock Reef v8 (03ad1c21a379) · 720 simulated min · 10 seats · 207 sessions · errors 0

- Table payback 89.6% (gun 86.3%, pole 96.3%); seat spread 53.9 pts
- By type: Sniper 103.9%, Sprayer 96.9%, Chaser 102.5%, Grinder 96.9%, Whale 79.1%, Fisher 97.2%, Casual 91.5%, Newbie 89.3%
- Bust rate: Sniper 85.2%, Sprayer 0.0%, Chaser 38.5%, Grinder 57.7%, Whale 88.5%, Fisher 83.3%, Casual 0.0%, Newbie 88.5%
- Gun per-hit payback by group (designed in brackets): tiny 96.7% [98.0%], small 94.6% [98.0%], medium 95.9% [97.0%], big 78.5% [95.0%], boss 74.9% [90.0%], special 89.6% [95.0%]
- Plays: after_boss_reset 0, after_shark_release 0, cold_seat_octopus 0, cold_table_tuna 0, hot_table_spread 0

- Whole table paid back 89.6% (gun 86.3%, pole 96.3%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Sniper at 103.9%. Worst: Whale at 79.1%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 seats spans 53.9 points (60.8% to 114.7%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 23,052 schools tracked; plays off (0 fired); seasons every 6 waves (60 seen); changes: season_length_waves 6 → 6. Average session 34.5 min, time between wins p90 13 s, longest dry spell p90 73 s.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 1 --label season-6 --plays off --law season_length_waves=6`

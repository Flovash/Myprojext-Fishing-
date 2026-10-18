# Player lab: season-9 (seed 3)

2026-10-18 0418 · Peacock Reef v8 (03ad1c21a379) · 720 simulated min · 10 seats · 208 sessions · errors 0

- Table payback 95.1% (gun 94.9%, pole 95.7%); seat spread 66.8 pts
- By type: Sniper 93.1%, Sprayer 94.5%, Chaser 98.6%, Grinder 93.9%, Whale 95.0%, Fisher 96.6%, Casual 93.5%, Newbie 71.5%
- Bust rate: Sniper 77.8%, Sprayer 0.0%, Chaser 30.8%, Grinder 57.7%, Whale 84.6%, Fisher 84.0%, Casual 0.0%, Newbie 100.0%
- Gun per-hit payback by group (designed in brackets): tiny 96.4% [98.0%], small 101.5% [98.0%], medium 98.8% [97.0%], big 97.9% [95.0%], boss 90.9% [90.0%], special 77.7% [95.0%]
- Plays: after_boss_reset 0, after_shark_release 0, cold_seat_octopus 0, cold_table_tuna 0, hot_table_spread 0

- Whole table paid back 95.1% (gun 94.9%, pole 95.7%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Chaser at 98.6%. Worst: Newbie at 71.5%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 seats spans 66.8 points (70.7% to 137.5%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 23,295 schools tracked; plays off (0 fired); seasons every 9 waves (41 seen); changes: season_length_waves 6 → 9. Average session 34.3 min, time between wins p90 13 s, longest dry spell p90 70 s.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 3 --label season-9 --plays off --law season_length_waves=9`

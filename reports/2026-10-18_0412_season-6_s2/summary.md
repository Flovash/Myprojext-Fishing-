# Player lab: season-6 (seed 2)

2026-10-18 0412 · Peacock Reef v8 (03ad1c21a379) · 720 simulated min · 10 seats · 200 sessions · errors 0

- Table payback 88.0% (gun 83.9%, pole 96.4%); seat spread 42.4 pts
- By type: Sniper 90.4%, Sprayer 98.0%, Chaser 93.8%, Grinder 97.0%, Whale 77.9%, Fisher 97.6%, Casual 85.3%, Newbie 86.2%
- Bust rate: Sniper 84.6%, Sprayer 0.0%, Chaser 48.1%, Grinder 54.2%, Whale 91.7%, Fisher 70.8%, Casual 0.0%, Newbie 91.7%
- Gun per-hit payback by group (designed in brackets): tiny 100.5% [98.0%], small 99.6% [98.0%], medium 98.6% [97.0%], big 79.0% [95.0%], boss 62.5% [90.0%], special 62.4% [95.0%]
- Plays: after_boss_reset 0, after_shark_release 0, cold_seat_octopus 0, cold_table_tuna 0, hot_table_spread 0

- Whole table paid back 88.0% (gun 83.9%, pole 96.4%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Sprayer at 98.0%. Worst: Whale at 77.9%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 seats spans 42.4 points (63.8% to 106.2%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 23,264 schools tracked; plays off (0 fired); seasons every 6 waves (61 seen); changes: season_length_waves 6 → 6. Average session 35.7 min, time between wins p90 13 s, longest dry spell p90 78 s.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 2 --label season-6 --plays off --law season_length_waves=6`

# Player lab: tuna-formations (seed 2)

2026-10-18 0400 · Peacock Reef v8 (03ad1c21a379) · 720 simulated min · 10 seats · 209 sessions · errors 0

- Table payback 85.3% (gun 80.2%, pole 96.5%); seat spread 35.9 pts
- By type: Sniper 90.8%, Sprayer 94.6%, Chaser 89.7%, Grinder 94.3%, Whale 72.1%, Fisher 97.7%, Casual 91.4%, Newbie 84.8%
- Bust rate: Sniper 85.2%, Sprayer 0.0%, Chaser 39.3%, Grinder 63.0%, Whale 88.0%, Fisher 79.2%, Casual 0.0%, Newbie 92.0%
- Gun per-hit payback by group (designed in brackets): tiny 96.0% [98.0%], small 95.8% [98.0%], medium 95.6% [97.0%], big 92.9% [95.0%], boss 48.2% [90.0%], special 68.3% [95.0%]
- Plays: after_boss_reset 0, after_shark_release 0, cold_seat_octopus 0, cold_table_tuna 0, hot_table_spread 0

- Whole table paid back 85.3% (gun 80.2%, pole 96.5%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Fisher at 97.7%. Worst: Whale at 72.1%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 seats spans 35.9 points (61.0% to 96.9%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 22,972 schools tracked; plays off (0 fired); seasons off; changes: season_length_waves 6 → 0. Average session 34.1 min, time between wins p90 13 s, longest dry spell p90 76 s.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 2 --label tuna-formations --plays off --law season_length_waves=0`

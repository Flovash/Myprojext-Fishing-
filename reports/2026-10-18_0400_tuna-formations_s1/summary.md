# Player lab: tuna-formations (seed 1)

2026-10-18 0400 · Peacock Reef v8 (03ad1c21a379) · 720 simulated min · 10 seats · 202 sessions · errors 0

- Table payback 90.9% (gun 91.0%, pole 90.6%); seat spread 42.3 pts
- By type: Sniper 98.0%, Sprayer 98.3%, Chaser 97.8%, Grinder 98.5%, Whale 87.8%, Fisher 92.7%, Casual 95.0%, Newbie 84.8%
- Bust rate: Sniper 80.0%, Sprayer 0.0%, Chaser 29.6%, Grinder 32.0%, Whale 80.0%, Fisher 96.0%, Casual 0.0%, Newbie 87.5%
- Gun per-hit payback by group (designed in brackets): tiny 97.3% [98.0%], small 100.0% [98.0%], medium 100.9% [97.0%], big 69.1% [95.0%], boss 89.5% [90.0%], special 51.0% [95.0%]
- Plays: after_boss_reset 0, after_shark_release 0, cold_seat_octopus 0, cold_table_tuna 0, hot_table_spread 0

- Whole table paid back 90.9% (gun 91.0%, pole 90.6%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Grinder at 98.5%. Worst: Newbie at 84.8%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 seats spans 42.3 points (69.2% to 111.5%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 23,419 schools tracked; plays off (0 fired); seasons off; changes: season_length_waves 6 → 0. Average session 35.3 min, time between wins p90 13 s, longest dry spell p90 66 s.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 1 --label tuna-formations --plays off --law season_length_waves=0`

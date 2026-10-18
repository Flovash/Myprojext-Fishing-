# Player lab: routes-v8 (seed 1)

2026-10-18 0349 · Peacock Reef v8 (8b48ca78bcd6) · 720 simulated min · 10 seats · 198 sessions · errors 0

- Table payback 99.4% (gun 100.4%, pole 96.5%); seat spread 54.6 pts
- By type: Sniper 89.6%, Sprayer 93.1%, Chaser 97.0%, Grinder 98.4%, Whale 102.5%, Fisher 97.2%, Casual 89.7%, Newbie 78.2%
- Bust rate: Sniper 84.6%, Sprayer 0.0%, Chaser 30.8%, Grinder 45.8%, Whale 79.2%, Fisher 75.0%, Casual 0.0%, Newbie 100.0%
- Gun per-hit payback by group (designed in brackets): tiny 100.6% [98.0%], small 93.4% [98.0%], medium 100.6% [97.0%], big 84.8% [95.0%], boss 113.2% [90.0%], special 135.8% [95.0%]
- Plays: after_boss_reset 0, after_shark_release 0, cold_seat_octopus 0, cold_table_tuna 0, hot_table_spread 0

- Whole table paid back 99.4% (gun 100.4%, pole 96.5%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Whale at 102.5%. Worst: Newbie at 78.2%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 seats spans 54.6 points (73.5% to 128.2%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 25,558 schools tracked; plays off (0 fired); seasons off; changes: season_length_waves 6 → 0. Average session 36.1 min, time between wins p90 13 s, longest dry spell p90 72 s.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 1 --label routes-v8 --plays off --law season_length_waves=0`

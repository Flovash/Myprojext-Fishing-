# Player lab: routes-v8 (seed 3)

2026-10-18 0349 · Peacock Reef v8 (8b48ca78bcd6) · 720 simulated min · 10 seats · 208 sessions · errors 0

- Table payback 89.6% (gun 87.4%, pole 95.7%); seat spread 54.8 pts
- By type: Sniper 94.8%, Sprayer 96.6%, Chaser 92.5%, Grinder 93.3%, Whale 84.1%, Fisher 96.2%, Casual 93.4%, Newbie 94.5%
- Bust rate: Sniper 84.6%, Sprayer 3.6%, Chaser 46.4%, Grinder 53.6%, Whale 91.7%, Fisher 80.0%, Casual 0.0%, Newbie 91.7%
- Gun per-hit payback by group (designed in brackets): tiny 103.3% [98.0%], small 93.4% [98.0%], medium 92.0% [97.0%], big 57.4% [95.0%], boss 88.5% [90.0%], special 54.0% [95.0%]
- Plays: after_boss_reset 0, after_shark_release 0, cold_seat_octopus 0, cold_table_tuna 0, hot_table_spread 0

- Whole table paid back 89.6% (gun 87.4%, pole 95.7%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Sprayer at 96.6%. Worst: Whale at 84.1%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 seats spans 54.8 points (57.7% to 112.5%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 25,213 schools tracked; plays off (0 fired); seasons off; changes: season_length_waves 6 → 0. Average session 34.3 min, time between wins p90 13 s, longest dry spell p90 69 s.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 3 --label routes-v8 --plays off --law season_length_waves=0`

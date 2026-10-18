# Player lab: routes-v8 (seed 2)

2026-10-18 0349 · Peacock Reef v8 (8b48ca78bcd6) · 720 simulated min · 10 seats · 200 sessions · errors 0

- Table payback 92.1% (gun 90.0%, pole 97.3%); seat spread 55.6 pts
- By type: Sniper 87.5%, Sprayer 97.8%, Chaser 86.3%, Grinder 93.3%, Whale 89.6%, Fisher 98.2%, Casual 96.4%, Newbie 77.1%
- Bust rate: Sniper 88.5%, Sprayer 0.0%, Chaser 53.6%, Grinder 46.4%, Whale 85.7%, Fisher 77.3%, Casual 0.0%, Newbie 100.0%
- Gun per-hit payback by group (designed in brackets): tiny 99.3% [98.0%], small 98.7% [98.0%], medium 97.3% [97.0%], big 98.4% [95.0%], boss 76.6% [90.0%], special 53.0% [95.0%]
- Plays: after_boss_reset 0, after_shark_release 0, cold_seat_octopus 0, cold_table_tuna 0, hot_table_spread 0

- Whole table paid back 92.1% (gun 90.0%, pole 97.3%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Fisher at 98.2%. Worst: Newbie at 77.1%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 seats spans 55.6 points (63.8% to 119.4%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 24,894 schools tracked; plays off (0 fired); seasons off; changes: season_length_waves 6 → 0. Average session 35.7 min, time between wins p90 13 s, longest dry spell p90 71 s.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 2 --label routes-v8 --plays off --law season_length_waves=0`

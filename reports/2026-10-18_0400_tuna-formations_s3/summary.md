# Player lab: tuna-formations (seed 3)

2026-10-18 0400 · Peacock Reef v8 (03ad1c21a379) · 720 simulated min · 10 seats · 212 sessions · errors 0

- Table payback 90.5% (gun 88.6%, pole 96.0%); seat spread 55.9 pts
- By type: Sniper 87.1%, Sprayer 98.1%, Chaser 99.8%, Grinder 94.4%, Whale 86.1%, Fisher 96.7%, Casual 96.2%, Newbie 73.6%
- Bust rate: Sniper 92.6%, Sprayer 0.0%, Chaser 32.1%, Grinder 61.5%, Whale 84.6%, Fisher 84.6%, Casual 0.0%, Newbie 100.0%
- Gun per-hit payback by group (designed in brackets): tiny 101.2% [98.0%], small 96.8% [98.0%], medium 99.9% [97.0%], big 79.3% [95.0%], boss 77.4% [90.0%], special 74.2% [95.0%]
- Plays: after_boss_reset 0, after_shark_release 0, cold_seat_octopus 0, cold_table_tuna 0, hot_table_spread 0

- Whole table paid back 90.5% (gun 88.6%, pole 96.0%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Chaser at 99.8%. Worst: Newbie at 73.6%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 seats spans 55.9 points (66.5% to 122.4%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 22,905 schools tracked; plays off (0 fired); seasons off; changes: season_length_waves 6 → 0. Average session 33.6 min, time between wins p90 13 s, longest dry spell p90 69 s.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 3 --label tuna-formations --plays off --law season_length_waves=0`

# Player lab: season-3 (seed 1)

2026-10-18 0406 · Peacock Reef v8 (03ad1c21a379) · 720 simulated min · 10 seats · 201 sessions · errors 0

- Table payback 92.2% (gun 90.8%, pole 96.2%); seat spread 65.7 pts
- By type: Sniper 100.3%, Sprayer 95.4%, Chaser 97.3%, Grinder 95.2%, Whale 87.3%, Fisher 97.1%, Casual 100.4%, Newbie 82.1%
- Bust rate: Sniper 81.5%, Sprayer 0.0%, Chaser 37.0%, Grinder 45.8%, Whale 91.3%, Fisher 83.3%, Casual 0.0%, Newbie 96.0%
- Gun per-hit payback by group (designed in brackets): tiny 95.3% [98.0%], small 94.4% [98.0%], medium 97.6% [97.0%], big 91.2% [95.0%], boss 85.8% [90.0%], special 69.8% [95.0%]
- Plays: after_boss_reset 0, after_shark_release 0, cold_seat_octopus 0, cold_table_tuna 0, hot_table_spread 0

- Whole table paid back 92.2% (gun 90.8%, pole 96.2%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Casual at 100.4%. Worst: Newbie at 82.1%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 seats spans 65.7 points (67.4% to 133.1%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 23,196 schools tracked; plays off (0 fired); seasons every 3 waves (121 seen); changes: season_length_waves 6 → 3. Average session 35.5 min, time between wins p90 13 s, longest dry spell p90 64 s.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 1 --label season-3 --plays off --law season_length_waves=3`

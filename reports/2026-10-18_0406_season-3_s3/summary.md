# Player lab: season-3 (seed 3)

2026-10-18 0406 · Peacock Reef v8 (03ad1c21a379) · 720 simulated min · 10 seats · 204 sessions · errors 0

- Table payback 90.9% (gun 89.7%, pole 94.8%); seat spread 55.1 pts
- By type: Sniper 88.9%, Sprayer 97.2%, Chaser 91.8%, Grinder 93.2%, Whale 88.6%, Fisher 96.2%, Casual 87.4%, Newbie 75.3%
- Bust rate: Sniper 84.6%, Sprayer 0.0%, Chaser 32.0%, Grinder 57.7%, Whale 88.0%, Fisher 84.0%, Casual 0.0%, Newbie 96.0%
- Gun per-hit payback by group (designed in brackets): tiny 98.6% [98.0%], small 101.1% [98.0%], medium 95.4% [97.0%], big 99.5% [95.0%], boss 76.1% [90.0%], special 53.7% [95.0%]
- Plays: after_boss_reset 0, after_shark_release 0, cold_seat_octopus 0, cold_table_tuna 0, hot_table_spread 0

- Whole table paid back 90.9% (gun 89.7%, pole 94.8%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Sprayer at 97.2%. Worst: Newbie at 75.3%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 seats spans 55.1 points (64.4% to 119.5%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 23,180 schools tracked; plays off (0 fired); seasons every 3 waves (119 seen); changes: season_length_waves 6 → 3. Average session 35.0 min, time between wins p90 13 s, longest dry spell p90 75 s.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 3 --label season-3 --plays off --law season_length_waves=3`

# Player lab: plays-on (seed 1)

2026-10-18 0425 · Peacock Reef v8 (03ad1c21a379) · 720 simulated min · 10 seats · 205 sessions · errors 0

- Table payback 91.6% (gun 89.4%, pole 96.9%); seat spread 41.8 pts
- By type: Sniper 69.2%, Sprayer 97.6%, Chaser 96.9%, Grinder 94.3%, Whale 89.0%, Fisher 97.8%, Casual 89.7%, Newbie 77.6%
- Bust rate: Sniper 100.0%, Sprayer 0.0%, Chaser 35.7%, Grinder 57.7%, Whale 87.5%, Fisher 76.0%, Casual 0.0%, Newbie 95.8%
- Gun per-hit payback by group (designed in brackets): tiny 99.3% [98.0%], small 100.9% [98.0%], medium 97.4% [97.0%], big 89.4% [95.0%], boss 78.4% [90.0%], special 70.0% [95.0%]
- Plays: after_boss_reset 136, after_shark_release 3, cold_seat_octopus 11, cold_table_tuna 0, hot_table_spread 55

- Whole table paid back 91.6% (gun 89.4%, pole 96.9%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Fisher at 97.8%. Worst: Sniper at 69.2%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 seats spans 41.8 points (68.8% to 110.6%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 22,942 schools tracked; plays all on (205 fired); seasons every 6 waves (60 seen); changes: season_length_waves 6 → 6. Average session 34.8 min, time between wins p90 13 s, longest dry spell p90 68 s.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 1 --label plays-on --law season_length_waves=6`

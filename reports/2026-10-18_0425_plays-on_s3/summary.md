# Player lab: plays-on (seed 3)

2026-10-18 0425 · Peacock Reef v8 (03ad1c21a379) · 720 simulated min · 10 seats · 196 sessions · errors 0

- Table payback 96.6% (gun 96.2%, pole 98.0%); seat spread 43.3 pts
- By type: Sniper 103.1%, Sprayer 95.3%, Chaser 90.7%, Grinder 93.1%, Whale 96.4%, Fisher 99.1%, Casual 83.3%, Newbie 76.0%
- Bust rate: Sniper 84.0%, Sprayer 0.0%, Chaser 40.0%, Grinder 52.0%, Whale 83.3%, Fisher 66.7%, Casual 0.0%, Newbie 100.0%
- Gun per-hit payback by group (designed in brackets): tiny 100.2% [98.0%], small 94.2% [98.0%], medium 101.2% [97.0%], big 87.4% [95.0%], boss 99.4% [90.0%], special 102.8% [95.0%]
- Plays: after_boss_reset 133, after_shark_release 2, cold_seat_octopus 8, cold_table_tuna 0, hot_table_spread 74

- Whole table paid back 96.6% (gun 96.2%, pole 98.0%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Sniper at 103.1%. Worst: Newbie at 76.0%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 seats spans 43.3 points (69.7% to 112.9%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 22,907 schools tracked; plays all on (217 fired); seasons every 6 waves (59 seen); changes: season_length_waves 6 → 6. Average session 36.4 min, time between wins p90 13 s, longest dry spell p90 79 s.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 3 --label plays-on --law season_length_waves=6`

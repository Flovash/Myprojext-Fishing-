# Player lab: season-9 (seed 2)

2026-10-18 0419 · Peacock Reef v8 (03ad1c21a379) · 720 simulated min · 10 seats · 201 sessions · errors 0

- Table payback 93.5% (gun 92.6%, pole 95.8%); seat spread 68.2 pts
- By type: Sniper 71.0%, Sprayer 96.7%, Chaser 94.7%, Grinder 97.4%, Whale 93.2%, Fisher 96.3%, Casual 94.3%, Newbie 89.1%
- Bust rate: Sniper 100.0%, Sprayer 0.0%, Chaser 38.5%, Grinder 48.0%, Whale 80.0%, Fisher 91.3%, Casual 0.0%, Newbie 92.0%
- Gun per-hit payback by group (designed in brackets): tiny 96.0% [98.0%], small 99.2% [98.0%], medium 96.3% [97.0%], big 115.1% [95.0%], boss 81.3% [90.0%], special 43.9% [95.0%]
- Plays: after_boss_reset 0, after_shark_release 0, cold_seat_octopus 0, cold_table_tuna 0, hot_table_spread 0

- Whole table paid back 93.5% (gun 92.6%, pole 95.8%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Grinder at 97.4%. Worst: Sniper at 71.0%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 seats spans 68.2 points (65.1% to 133.3%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 23,254 schools tracked; plays off (0 fired); seasons every 9 waves (40 seen); changes: season_length_waves 6 → 9. Average session 35.5 min, time between wins p90 13 s, longest dry spell p90 68 s.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 2 --label season-9 --plays off --law season_length_waves=9`

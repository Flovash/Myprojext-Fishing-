# Player lab: season-3 (seed 2)

2026-10-18 0406 · Peacock Reef v8 (03ad1c21a379) · 720 simulated min · 10 seats · 202 sessions · errors 0

- Table payback 97.9% (gun 99.0%, pole 93.9%); seat spread 69.7 pts
- By type: Sniper 81.9%, Sprayer 95.2%, Chaser 102.0%, Grinder 99.4%, Whale 101.2%, Fisher 94.9%, Casual 88.1%, Newbie 75.8%
- Bust rate: Sniper 92.0%, Sprayer 0.0%, Chaser 22.2%, Grinder 34.6%, Whale 82.6%, Fisher 91.7%, Casual 0.0%, Newbie 92.0%
- Gun per-hit payback by group (designed in brackets): tiny 97.5% [98.0%], small 97.4% [98.0%], medium 92.4% [97.0%], big 78.2% [95.0%], boss 117.9% [90.0%], special 63.5% [95.0%]
- Plays: after_boss_reset 0, after_shark_release 0, cold_seat_octopus 0, cold_table_tuna 0, hot_table_spread 0

- Whole table paid back 97.9% (gun 99.0%, pole 93.9%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Chaser at 102.0%. Worst: Newbie at 75.8%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 seats spans 69.7 points (66.4% to 136.1%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 23,448 schools tracked; plays off (0 fired); seasons every 3 waves (120 seen); changes: season_length_waves 6 → 3. Average session 35.3 min, time between wins p90 13 s, longest dry spell p90 71 s.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 2 --label season-3 --plays off --law season_length_waves=3`

# Player lab: season-6 (seed 3)

2026-10-18 0412 · Peacock Reef v8 (03ad1c21a379) · 720 simulated min · 10 seats · 200 sessions · errors 0

- Table payback 93.3% (gun 91.2%, pole 97.8%); seat spread 85.6 pts
- By type: Sniper 100.7%, Sprayer 97.9%, Chaser 93.6%, Grinder 96.5%, Whale 88.0%, Fisher 98.5%, Casual 84.4%, Newbie 85.6%
- Bust rate: Sniper 80.8%, Sprayer 0.0%, Chaser 39.3%, Grinder 42.3%, Whale 91.3%, Fisher 72.7%, Casual 0.0%, Newbie 95.8%
- Gun per-hit payback by group (designed in brackets): tiny 99.9% [98.0%], small 100.0% [98.0%], medium 95.3% [97.0%], big 54.8% [95.0%], boss 98.0% [90.0%], special 108.1% [95.0%]
- Plays: after_boss_reset 0, after_shark_release 0, cold_seat_octopus 0, cold_table_tuna 0, hot_table_spread 0

- Whole table paid back 93.3% (gun 91.2%, pole 97.8%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Sniper at 100.7%. Worst: Casual at 84.4%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 seats spans 85.6 points (62.5% to 148.1%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 22,986 schools tracked; plays off (0 fired); seasons every 6 waves (59 seen); changes: season_length_waves 6 → 6. Average session 35.7 min, time between wins p90 13 s, longest dry spell p90 72 s.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 3 --label season-6 --plays off --law season_length_waves=6`

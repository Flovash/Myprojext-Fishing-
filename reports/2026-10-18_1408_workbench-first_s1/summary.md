# Player lab: workbench-first (seed 1)

2026-10-18 1408 · Peacock Reef v8 (2c2f69e89953) · 60 simulated min · 10 seats · 19 sessions · errors 0

- Table payback 90.2% (gun 89.0%, pole 97.0%); seat spread 37.4 pts
- By type: Sniper 50.6%, Sprayer 98.4%, Chaser 83.5%, Grinder 94.0%, Whale 91.2%, Fisher 95.1%, Casual 103.1%, Newbie 58.8%
- Bust rate: Sniper 100.0%, Sprayer 0.0%, Chaser 0.0%, Grinder 0.0%, Whale 100.0%, Fisher 50.0%, Casual 0.0%, Newbie 100.0%
- Gun per-hit payback by group (designed in brackets): tiny 105.9% [98.0%], small 98.5% [98.0%], medium 101.2% [97.0%], big 31.6% [95.0%], boss 92.8% [90.0%], special 176.3% [95.0%]
- Plays: after_boss_reset 7, after_shark_release 1, cold_seat_octopus 0, cold_table_tuna 0, hot_table_spread 7

- Whole table paid back 90.2% (gun 89.0%, pole 97.0%) over 60 simulated minutes. The weekly target is about 97–98%; one night of 1 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Casual at 103.1%. Worst: Sniper at 50.6%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 played seats spans 37.4 points (64.8% to 102.2%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 2,015 schools tracked; plays all on (15 fired); seasons every 6 waves (6 seen); changes: none. Average session 31.4 min, time between wins p90 11 s, longest dry spell p90 65 s.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 60 --seed 1 --label workbench-first`

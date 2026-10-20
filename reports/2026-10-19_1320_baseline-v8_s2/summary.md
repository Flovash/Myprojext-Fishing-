# Player lab: baseline-v8 (seed 2)

2026-10-19 1320 · Peacock Reef v8 (2c2f69e89953) · 720 simulated min · 10 seats · 210 sessions · errors 0

- Table payback 91.6% (gun 91.0%, pole 93.6%); seat spread 68.2 pts
- By type: Sniper 91.0%, Sprayer 96.1%, Chaser 102.5%, Grinder 92.6%, Whale 88.5%, Fisher 94.6%, Casual 88.0%, Newbie 78.8%
- Bust rate: Sniper 85.2%, Sprayer 0.0%, Chaser 31.0%, Grinder 64.3%, Whale 83.3%, Fisher 95.8%, Casual 0.0%, Newbie 96.0%
- Gun per-hit payback by group (designed in brackets): tiny 95.8% [98.0%], small 99.6% [98.0%], medium 92.5% [97.0%], big 79.5% [95.0%], boss 91.1% [90.0%], special 49.4% [95.0%]
- Plays: after_boss_reset 137, after_shark_release 4, cold_seat_octopus 7, cold_table_tuna 0, hot_table_spread 57

- Whole table paid back 91.6% (gun 91.0%, pole 93.6%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Chaser at 102.5%. Worst: Newbie at 78.8%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 played seats spans 68.2 points (70.2% to 138.4%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 23,452 schools tracked; plays all on (205 fired); seasons every 6 waves (61 seen); changes: none. Average session 34.0 min, time between wins p90 13 s, longest dry spell p90 72 s.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 2 --label baseline-v8 --game 'backups/2026-10-19_before_pole_market/peacock_reef.html' --no-library`

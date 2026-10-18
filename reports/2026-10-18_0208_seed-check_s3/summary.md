# Player lab: seed-check (seed 3)

2026-10-18 0208 · Peacock Reef v7 (334ed68cdd76) · 240 simulated min · 10 seats · 71 sessions · errors 0

- Table payback 83.7% (gun 77.2%, pole 98.7%); seat spread 37.9 pts
- By type: Sniper 85.3%, Sprayer 94.6%, Chaser 99.1%, Grinder 92.1%, Whale 66.0%, Fisher 100.1%, Casual 102.5%, Newbie 107.8%
- Bust rate: Sniper 75.0%, Sprayer 0.0%, Chaser 55.6%, Grinder 60.0%, Whale 100.0%, Fisher 60.0%, Casual 0.0%, Newbie 66.7%
- Gun per-hit payback by group (designed in brackets): tiny 98.1% [98.0%], small 90.0% [98.0%], medium 104.2% [97.0%], big 41.3% [95.0%], boss 53.4% [90.0%], special 72.4% [95.0%]

- Whole table paid back 83.7% (gun 77.2%, pole 98.7%) over 240 simulated minutes. The weekly target is about 97–98%; one night of 4 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Newbie at 107.8%. Worst: Whale at 66.0%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 seats spans 37.9 points (55.3% to 93.2%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 240 --seed 3 --label seed-check`

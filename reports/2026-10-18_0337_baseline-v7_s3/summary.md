# Player lab: baseline-v7 (seed 3)

2026-10-18 0337 · Peacock Reef v7 (334ed68cdd76) · 720 simulated min · 10 seats · 205 sessions · errors 0

- Table payback 85.2% (gun 79.4%, pole 97.0%); seat spread 31.6 pts
- By type: Sniper 80.8%, Sprayer 96.0%, Chaser 97.6%, Grinder 94.5%, Whale 69.6%, Fisher 98.1%, Casual 96.2%, Newbie 81.3%
- Bust rate: Sniper 92.3%, Sprayer 0.0%, Chaser 41.4%, Grinder 53.6%, Whale 95.7%, Fisher 70.8%, Casual 0.0%, Newbie 95.8%
- Gun per-hit payback by group (designed in brackets): tiny 96.8% [98.0%], small 96.5% [98.0%], medium 96.7% [97.0%], big 67.8% [95.0%], boss 52.4% [90.0%], special 94.3% [95.0%]

- Whole table paid back 85.2% (gun 79.4%, pole 97.0%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Fisher at 98.1%. Worst: Whale at 69.6%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 seats spans 31.6 points (67.5% to 99.0%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 3 --label baseline-v7`

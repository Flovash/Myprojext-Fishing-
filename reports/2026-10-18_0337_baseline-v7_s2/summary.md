# Player lab: baseline-v7 (seed 2)

2026-10-18 0337 · Peacock Reef v7 (334ed68cdd76) · 720 simulated min · 10 seats · 201 sessions · errors 0

- Table payback 92.5% (gun 91.5%, pole 94.9%); seat spread 66.8 pts
- By type: Sniper 102.5%, Sprayer 97.3%, Chaser 97.9%, Grinder 95.1%, Whale 87.5%, Fisher 96.4%, Casual 90.1%, Newbie 79.3%
- Bust rate: Sniper 80.8%, Sprayer 0.0%, Chaser 40.7%, Grinder 50.0%, Whale 91.3%, Fisher 78.3%, Casual 0.0%, Newbie 100.0%
- Gun per-hit payback by group (designed in brackets): tiny 99.4% [98.0%], small 97.1% [98.0%], medium 91.2% [97.0%], big 74.5% [95.0%], boss 95.9% [90.0%], special 81.1% [95.0%]

- Whole table paid back 92.5% (gun 91.5%, pole 94.9%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Sniper at 102.5%. Worst: Newbie at 79.3%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 seats spans 66.8 points (67.2% to 134.0%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 2 --label baseline-v7`

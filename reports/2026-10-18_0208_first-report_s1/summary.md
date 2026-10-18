# Player lab: first-report (seed 1)

2026-10-18 0208 · Peacock Reef v7 (334ed68cdd76) · 240 simulated min · 10 seats · 71 sessions · errors 0

- Table payback 82.2% (gun 74.6%, pole 97.7%); seat spread 27.6 pts
- By type: Sniper 60.8%, Sprayer 97.0%, Chaser 92.3%, Grinder 94.6%, Whale 66.8%, Fisher 98.9%, Casual 79.3%, Newbie 80.8%
- Bust rate: Sniper 100.0%, Sprayer 10.0%, Chaser 33.3%, Grinder 40.0%, Whale 100.0%, Fisher 60.0%, Casual 0.0%, Newbie 85.7%
- Gun per-hit payback by group (designed in brackets): tiny 95.0% [98.0%], small 97.1% [98.0%], medium 95.5% [97.0%], big 52.8% [95.0%], boss 42.7% [90.0%], special 128.3% [95.0%]

- Whole table paid back 82.2% (gun 74.6%, pole 97.7%) over 240 simulated minutes. The weekly target is about 97–98%; one night of 4 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Fisher at 98.9%. Worst: Sniper at 60.8%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 seats spans 27.6 points (62.1% to 89.7%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 240 --seed 1 --label first-report`

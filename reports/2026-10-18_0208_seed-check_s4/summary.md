# Player lab: seed-check (seed 4)

2026-10-18 0208 · Peacock Reef v7 (334ed68cdd76) · 240 simulated min · 10 seats · 68 sessions · errors 0

- Table payback 99.3% (gun 99.9%, pole 95.4%); seat spread 80.6 pts
- By type: Sniper 111.5%, Sprayer 102.6%, Chaser 91.0%, Grinder 90.2%, Whale 100.2%, Fisher 97.1%, Casual 84.7%, Newbie 85.3%
- Bust rate: Sniper 62.5%, Sprayer 0.0%, Chaser 22.2%, Grinder 60.0%, Whale 50.0%, Fisher 75.0%, Casual 0.0%, Newbie 75.0%
- Gun per-hit payback by group (designed in brackets): tiny 97.6% [98.0%], small 93.7% [98.0%], medium 90.1% [97.0%], big 152.7% [95.0%], boss 90.1% [90.0%], special 112.1% [95.0%]

- Whole table paid back 99.3% (gun 99.9%, pole 95.4%) over 240 simulated minutes. The weekly target is about 97–98%; one night of 4 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Sniper at 111.5%. Worst: Casual at 84.7%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 seats spans 80.6 points (57.9% to 138.5%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 240 --seed 4 --label seed-check`

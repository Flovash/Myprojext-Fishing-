# Player lab: seed-check (seed 2)

2026-10-18 0208 · Peacock Reef v7 (334ed68cdd76) · 240 simulated min · 10 seats · 66 sessions · errors 0

- Table payback 100.5% (gun 101.9%, pole 94.8%); seat spread 88.0 pts
- By type: Sniper 127.5%, Sprayer 95.1%, Chaser 92.4%, Grinder 89.6%, Whale 100.9%, Fisher 96.5%, Casual 101.3%, Newbie 68.1%
- Bust rate: Sniper 57.1%, Sprayer 0.0%, Chaser 33.3%, Grinder 66.7%, Whale 87.5%, Fisher 66.7%, Casual 0.0%, Newbie 71.4%
- Gun per-hit payback by group (designed in brackets): tiny 103.4% [98.0%], small 94.3% [98.0%], medium 88.8% [97.0%], big 69.1% [95.0%], boss 130.4% [90.0%], special 38.2% [95.0%]

- Whole table paid back 100.5% (gun 101.9%, pole 94.8%) over 240 simulated minutes. The weekly target is about 97–98%; one night of 4 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Sniper at 127.5%. Worst: Newbie at 68.1%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 seats spans 88.0 points (61.3% to 149.4%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 240 --seed 2 --label seed-check`

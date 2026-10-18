# Player lab: baseline-v7 (seed 1)

2026-10-18 0354 · Peacock Reef v7 (334ed68cdd76) · 720 simulated min · 10 seats · 206 sessions · errors 0

- Table payback 88.1% (gun 85.4%, pole 95.1%); seat spread 47.3 pts
- By type: Sniper 80.1%, Sprayer 97.1%, Chaser 99.5%, Grinder 94.6%, Whale 81.3%, Fisher 96.1%, Casual 88.9%, Newbie 77.4%
- Bust rate: Sniper 88.5%, Sprayer 3.6%, Chaser 28.6%, Grinder 48.1%, Whale 91.7%, Fisher 87.5%, Casual 0.0%, Newbie 96.0%
- Gun per-hit payback by group (designed in brackets): tiny 96.3% [98.0%], small 96.0% [98.0%], medium 101.3% [97.0%], big 89.6% [95.0%], boss 62.0% [90.0%], special 77.8% [95.0%]

- Whole table paid back 88.1% (gun 85.4%, pole 95.1%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Chaser at 99.5%. Worst: Newbie at 77.4%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 seats spans 47.3 points (66.4% to 113.7%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 1 --label baseline-v7 --game 'backups/2026-10-18_before_director/game/peacock_reef.html'`

# Player lab: v9-market (seed 1)

2026-10-19 1332 · Peacock Reef v9 (763acc0a564c) · 720 simulated min · 10 seats · 190 sessions · errors 0

- Table payback 101.4% (gun 102.8%, pole 97.6%); seat spread 63.7 pts
- By type: Sniper 95.6%, Sprayer 97.3%, Chaser 89.1%, Grinder 96.1%, Whale 106.2%, Fisher 98.7%, Casual 90.4%, Newbie 84.4%
- Bust rate: Sniper 79.2%, Sprayer 0.0%, Chaser 37.5%, Grinder 52.2%, Whale 82.6%, Fisher 70.8%, Casual 0.0%, Newbie 87.0%
- Gun per-hit payback by group (designed in brackets): tiny 98.0% [98.0%], small 94.2% [98.0%], medium 95.5% [97.0%], big 73.6% [95.0%], boss 134.4% [90.0%], special 72.4% [95.0%]
- Plays: after_boss_reset 150, after_shark_release 1, cold_seat_octopus 10, cold_table_tuna 0, hot_table_spread 93

- Whole table paid back 101.4% (gun 102.8%, pole 97.6%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Whale at 106.2%. Worst: Newbie at 84.4%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 played seats spans 63.7 points (67.4% to 131.1%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 23,397 schools tracked; plays all on (254 fired); seasons every 6 waves (60 seen); changes: none. Average session 37.6 min, time between wins p90 13 s, longest dry spell p90 2.2 min.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 1 --label v9-market --game '/private/tmp/claude-501/-Users-subash-Library-CloudStorage-GoogleDrive-subashbiswa2781-gmail-com-My-Drive-Fish-Game-Table/d3370797-cc51-4756-926f-7d1663adb861/scratchpad/v9_market.html' --no-library`

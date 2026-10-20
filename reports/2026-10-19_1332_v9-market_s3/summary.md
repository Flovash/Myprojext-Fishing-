# Player lab: v9-market (seed 3)

2026-10-19 1332 · Peacock Reef v9 (763acc0a564c) · 720 simulated min · 10 seats · 202 sessions · errors 0

- Table payback 96.2% (gun 96.5%, pole 95.0%); seat spread 49.7 pts
- By type: Sniper 92.1%, Sprayer 97.0%, Chaser 100.5%, Grinder 90.3%, Whale 97.0%, Fisher 96.0%, Casual 91.5%, Newbie 84.0%
- Bust rate: Sniper 80.8%, Sprayer 0.0%, Chaser 37.0%, Grinder 61.5%, Whale 75.0%, Fisher 83.3%, Casual 0.0%, Newbie 91.7%
- Gun per-hit payback by group (designed in brackets): tiny 96.1% [98.0%], small 98.9% [98.0%], medium 102.0% [97.0%], big 104.9% [95.0%], boss 92.2% [90.0%], special 60.9% [95.0%]
- Plays: after_boss_reset 132, after_shark_release 1, cold_seat_octopus 11, cold_table_tuna 0, hot_table_spread 79

- Whole table paid back 96.2% (gun 96.5%, pole 95.0%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Chaser at 100.5%. Worst: Newbie at 84.0%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 played seats spans 49.7 points (74.3% to 123.9%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 23,281 schools tracked; plays all on (223 fired); seasons every 6 waves (59 seen); changes: none. Average session 35.3 min, time between wins p90 13 s, longest dry spell p90 1.9 min.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 3 --label v9-market --game '/private/tmp/claude-501/-Users-subash-Library-CloudStorage-GoogleDrive-subashbiswa2781-gmail-com-My-Drive-Fish-Game-Table/d3370797-cc51-4756-926f-7d1663adb861/scratchpad/v9_market.html' --no-library`

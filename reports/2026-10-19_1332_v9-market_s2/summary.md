# Player lab: v9-market (seed 2)

2026-10-19 1332 · Peacock Reef v9 (763acc0a564c) · 720 simulated min · 10 seats · 193 sessions · errors 0

- Table payback 93.0% (gun 90.8%, pole 97.5%); seat spread 46.8 pts
- By type: Sniper 93.1%, Sprayer 97.3%, Chaser 94.2%, Grinder 96.7%, Whale 89.2%, Fisher 98.0%, Casual 81.6%, Newbie 73.7%
- Bust rate: Sniper 80.8%, Sprayer 0.0%, Chaser 36.0%, Grinder 39.1%, Whale 90.9%, Fisher 73.9%, Casual 0.0%, Newbie 100.0%
- Gun per-hit payback by group (designed in brackets): tiny 95.8% [98.0%], small 100.5% [98.0%], medium 93.0% [97.0%], big 93.5% [95.0%], boss 86.8% [90.0%], special 99.3% [95.0%]
- Plays: after_boss_reset 145, after_shark_release 3, cold_seat_octopus 21, cold_table_tuna 0, hot_table_spread 74

- Whole table paid back 93.0% (gun 90.8%, pole 97.5%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Fisher at 98.0%. Worst: Newbie at 73.7%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 played seats spans 46.8 points (70.8% to 117.5%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 23,117 schools tracked; plays all on (243 fired); seasons every 6 waves (59 seen); changes: none. Average session 37.0 min, time between wins p90 13 s, longest dry spell p90 2.2 min.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 2 --label v9-market --game '/private/tmp/claude-501/-Users-subash-Library-CloudStorage-GoogleDrive-subashbiswa2781-gmail-com-My-Drive-Fish-Game-Table/d3370797-cc51-4756-926f-7d1663adb861/scratchpad/v9_market.html' --no-library`

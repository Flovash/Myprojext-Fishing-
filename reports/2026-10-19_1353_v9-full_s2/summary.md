# Player lab: v9-full (seed 2)

2026-10-19 1353 · Peacock Reef v9 (02a495f4ff40) · 720 simulated min · 10 seats · 194 sessions · errors 0

- Table payback 88.4% (gun 88.4%, pole 88.6%); seat spread 41.8 pts
- By type: Sniper 82.7%, Sprayer 94.4%, Chaser 93.0%, Grinder 95.0%, Whale 86.9%, Fisher 89.2%, Casual 95.4%, Newbie 93.2%
- Bust rate: Sniper 88.0%, Sprayer 3.8%, Chaser 23.1%, Grinder 47.8%, Whale 87.0%, Fisher 79.2%, Casual 0.0%, Newbie 79.2%
- Gun per-hit payback by group (designed in brackets): tiny 99.2% [98.0%], small 95.3% [98.0%], medium 93.7% [97.0%], big 81.0% [95.0%], boss 79.6% [90.0%], special 87.0% [95.0%]
- Plays: after_boss_reset 108, after_shark_release 2, cold_seat_octopus 50, cold_table_tuna 0, hot_table_spread 42

- Whole table paid back 88.4% (gun 88.4%, pole 88.6%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Casual at 95.4%. Worst: Sniper at 82.7%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 played seats spans 41.8 points (66.4% to 108.2%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 25,210 schools tracked; plays all on (202 fired); seasons every 6 waves (71 seen); changes: none. Average session 36.8 min, time between wins p90 13 s, longest dry spell p90 2.5 min.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 2 --label v9-full --game '/private/tmp/claude-501/-Users-subash-Library-CloudStorage-GoogleDrive-subashbiswa2781-gmail-com-My-Drive-Fish-Game-Table/d3370797-cc51-4756-926f-7d1663adb861/scratchpad/v9_full.html' --no-library`

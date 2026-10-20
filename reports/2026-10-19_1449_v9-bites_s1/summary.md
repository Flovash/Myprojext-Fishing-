# Player lab: v9-bites (seed 1)

2026-10-19 1449 · Peacock Reef v9 (be75419ce06a) · 720 simulated min · 10 seats · 166 sessions · errors 0

- Table payback 88.1% (gun 86.6%, pole 96.1%); seat spread 22.3 pts
- By type: Sniper 106.3%, Sprayer 97.9%, Chaser 89.5%, Grinder 98.6%, Whale 81.5%, Fisher 96.2%, Casual 94.5%, Newbie 89.5%
- Bust rate: Sniper 75.0%, Sprayer 0.0%, Chaser 50.0%, Grinder 35.0%, Whale 95.2%, Fisher 36.4%, Casual 0.0%, Newbie 71.4%
- Gun per-hit payback by group (designed in brackets): tiny 100.9% [98.0%], small 98.0% [98.0%], medium 96.9% [97.0%], big 123.5% [95.0%], boss 35.3% [90.0%], special 132.0% [95.0%]
- Plays: after_boss_reset 98, after_shark_release 3, cold_seat_octopus 89, cold_table_tuna 0, hot_table_spread 60

- Whole table paid back 88.1% (gun 86.6%, pole 96.1%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Sniper at 106.3%. Worst: Whale at 81.5%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 played seats spans 22.3 points (74.2% to 96.5%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 47,864 schools tracked; plays all on (250 fired); seasons every 6 waves (75 seen); changes: none. Average session 43.1 min, time between wins p90 14 s, longest dry spell p90 3.9 min.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 1 --label v9-bites --game '/private/tmp/claude-501/-Users-subash-Library-CloudStorage-GoogleDrive-subashbiswa2781-gmail-com-My-Drive-Fish-Game-Table/d3370797-cc51-4756-926f-7d1663adb861/scratchpad/v9_bites.html' --no-library`

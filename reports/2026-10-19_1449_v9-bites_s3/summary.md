# Player lab: v9-bites (seed 3)

2026-10-19 1449 · Peacock Reef v9 (be75419ce06a) · 720 simulated min · 10 seats · 171 sessions · errors 0

- Table payback 99.8% (gun 100.5%, pole 95.1%); seat spread 86.7 pts
- By type: Sniper 84.3%, Sprayer 95.2%, Chaser 105.6%, Grinder 96.1%, Whale 103.0%, Fisher 94.9%, Casual 91.3%, Newbie 85.4%
- Bust rate: Sniper 90.5%, Sprayer 0.0%, Chaser 21.7%, Grinder 29.2%, Whale 85.0%, Fisher 80.0%, Casual 0.0%, Newbie 80.0%
- Gun per-hit payback by group (designed in brackets): tiny 97.8% [98.0%], small 99.1% [98.0%], medium 97.3% [97.0%], big 101.5% [95.0%], boss 114.7% [90.0%], special 93.4% [95.0%]
- Plays: after_boss_reset 101, after_shark_release 4, cold_seat_octopus 72, cold_table_tuna 0, hot_table_spread 84

- Whole table paid back 99.8% (gun 100.5%, pole 95.1%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Chaser at 105.6%. Worst: Sniper at 84.3%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 played seats spans 86.7 points (69.5% to 156.2%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 48,399 schools tracked; plays all on (261 fired); seasons every 6 waves (77 seen); changes: none. Average session 41.8 min, time between wins p90 13 s, longest dry spell p90 4.1 min.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 3 --label v9-bites --game '/private/tmp/claude-501/-Users-subash-Library-CloudStorage-GoogleDrive-subashbiswa2781-gmail-com-My-Drive-Fish-Game-Table/d3370797-cc51-4756-926f-7d1663adb861/scratchpad/v9_bites.html' --no-library`

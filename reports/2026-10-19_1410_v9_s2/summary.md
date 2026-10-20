# Player lab: v9 (seed 2)

2026-10-19 1410 · Peacock Reef v9 (84c64a295e5a) · 720 simulated min · 10 seats · 197 sessions · errors 0

- Table payback 82.2% (gun 79.3%, pole 93.4%); seat spread 25.5 pts
- By type: Sniper 99.1%, Sprayer 93.2%, Chaser 89.4%, Grinder 94.8%, Whale 67.8%, Fisher 95.0%, Casual 88.2%, Newbie 95.6%
- Bust rate: Sniper 73.1%, Sprayer 0.0%, Chaser 40.7%, Grinder 36.0%, Whale 100.0%, Fisher 91.3%, Casual 0.0%, Newbie 83.3%
- Gun per-hit payback by group (designed in brackets): tiny 97.8% [98.0%], small 97.1% [98.0%], medium 95.4% [97.0%], big 85.9% [95.0%], boss 38.7% [90.0%], special 65.7% [95.0%]
- Plays: after_boss_reset 117, after_shark_release 3, cold_seat_octopus 11, cold_table_tuna 0, hot_table_spread 33

- Whole table paid back 82.2% (gun 79.3%, pole 93.4%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Sniper at 99.1%. Worst: Whale at 67.8%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 played seats spans 25.5 points (63.0% to 88.6%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 25,182 schools tracked; plays all on (164 fired); seasons every 6 waves (71 seen); changes: none. Average session 36.2 min, time between wins p90 13 s, longest dry spell p90 2.4 min.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 2 --label v9 --game '/private/tmp/claude-501/-Users-subash-Library-CloudStorage-GoogleDrive-subashbiswa2781-gmail-com-My-Drive-Fish-Game-Table/d3370797-cc51-4756-926f-7d1663adb861/scratchpad/v9_final.html' --no-library`

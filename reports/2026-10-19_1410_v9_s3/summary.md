# Player lab: v9 (seed 3)

2026-10-19 1410 · Peacock Reef v9 (84c64a295e5a) · 720 simulated min · 10 seats · 178 sessions · errors 0

- Table payback 98.2% (gun 99.0%, pole 94.2%); seat spread 60.1 pts
- By type: Sniper 99.6%, Sprayer 94.2%, Chaser 93.9%, Grinder 99.7%, Whale 99.3%, Fisher 95.5%, Casual 96.6%, Newbie 100.0%
- Bust rate: Sniper 82.6%, Sprayer 0.0%, Chaser 12.5%, Grinder 22.7%, Whale 85.0%, Fisher 81.0%, Casual 0.0%, Newbie 77.3%
- Gun per-hit payback by group (designed in brackets): tiny 98.2% [98.0%], small 96.9% [98.0%], medium 96.0% [97.0%], big 130.8% [95.0%], boss 88.6% [90.0%], special 49.4% [95.0%]
- Plays: after_boss_reset 119, after_shark_release 4, cold_seat_octopus 26, cold_table_tuna 0, hot_table_spread 80

- Whole table paid back 98.2% (gun 99.0%, pole 94.2%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Newbie at 100.0%. Worst: Chaser at 93.9%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 played seats spans 60.1 points (75.3% to 135.4%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 25,252 schools tracked; plays all on (229 fired); seasons every 6 waves (68 seen); changes: none. Average session 40.1 min, time between wins p90 13 s, longest dry spell p90 2.2 min.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 3 --label v9 --game '/private/tmp/claude-501/-Users-subash-Library-CloudStorage-GoogleDrive-subashbiswa2781-gmail-com-My-Drive-Fish-Game-Table/d3370797-cc51-4756-926f-7d1663adb861/scratchpad/v9_final.html' --no-library`

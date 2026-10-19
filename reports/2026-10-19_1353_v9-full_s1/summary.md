# Player lab: v9-full (seed 1)

2026-10-19 1353 · Peacock Reef v9 (02a495f4ff40) · 720 simulated min · 10 seats · 175 sessions · errors 0

- Table payback 98.1% (gun 99.0%, pole 93.5%); seat spread 66.7 pts
- By type: Sniper 86.2%, Sprayer 95.5%, Chaser 88.9%, Grinder 95.3%, Whale 101.6%, Fisher 94.5%, Casual 99.5%, Newbie 93.4%
- Bust rate: Sniper 87.0%, Sprayer 0.0%, Chaser 26.1%, Grinder 36.4%, Whale 80.0%, Fisher 57.1%, Casual 0.0%, Newbie 76.2%
- Gun per-hit payback by group (designed in brackets): tiny 95.3% [98.0%], small 100.8% [98.0%], medium 98.3% [97.0%], big 116.6% [95.0%], boss 94.2% [90.0%], special 91.0% [95.0%]
- Plays: after_boss_reset 92, after_shark_release 1, cold_seat_octopus 62, cold_table_tuna 0, hot_table_spread 69

- Whole table paid back 98.1% (gun 99.0%, pole 93.5%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Whale at 101.6%. Worst: Sniper at 86.2%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 played seats spans 66.7 points (65.6% to 132.3%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 26,257 schools tracked; plays all on (224 fired); seasons every 6 waves (79 seen); changes: none. Average session 40.8 min, time between wins p90 13 s, longest dry spell p90 3.3 min.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 1 --label v9-full --game '/private/tmp/claude-501/-Users-subash-Library-CloudStorage-GoogleDrive-subashbiswa2781-gmail-com-My-Drive-Fish-Game-Table/d3370797-cc51-4756-926f-7d1663adb861/scratchpad/v9_full.html' --no-library`

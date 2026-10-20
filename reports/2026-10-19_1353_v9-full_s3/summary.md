# Player lab: v9-full (seed 3)

2026-10-19 1353 · Peacock Reef v9 (02a495f4ff40) · 720 simulated min · 10 seats · 189 sessions · errors 0

- Table payback 90.3% (gun 90.2%, pole 90.7%); seat spread 42.2 pts
- By type: Sniper 79.2%, Sprayer 95.9%, Chaser 97.2%, Grinder 94.8%, Whale 89.1%, Fisher 91.9%, Casual 104.1%, Newbie 92.9%
- Bust rate: Sniper 100.0%, Sprayer 0.0%, Chaser 43.5%, Grinder 54.5%, Whale 81.8%, Fisher 87.0%, Casual 0.0%, Newbie 78.3%
- Gun per-hit payback by group (designed in brackets): tiny 98.0% [98.0%], small 91.5% [98.0%], medium 96.2% [97.0%], big 105.6% [95.0%], boss 75.6% [90.0%], special 114.5% [95.0%]
- Plays: after_boss_reset 99, after_shark_release 3, cold_seat_octopus 53, cold_table_tuna 0, hot_table_spread 64

- Whole table paid back 90.3% (gun 90.2%, pole 90.7%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Casual at 104.1%. Worst: Sniper at 79.2%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 played seats spans 42.2 points (65.2% to 107.4%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 24,939 schools tracked; plays all on (219 fired); seasons every 6 waves (69 seen); changes: none. Average session 37.8 min, time between wins p90 14 s, longest dry spell p90 3.8 min.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 3 --label v9-full --game '/private/tmp/claude-501/-Users-subash-Library-CloudStorage-GoogleDrive-subashbiswa2781-gmail-com-My-Drive-Fish-Game-Table/d3370797-cc51-4756-926f-7d1663adb861/scratchpad/v9_full.html' --no-library`

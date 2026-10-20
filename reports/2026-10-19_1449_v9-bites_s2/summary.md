# Player lab: v9-bites (seed 2)

2026-10-19 1449 · Peacock Reef v9 (be75419ce06a) · 720 simulated min · 10 seats · 172 sessions · errors 0

- Table payback 102.6% (gun 103.6%, pole 95.0%); seat spread 78.4 pts
- By type: Sniper 111.7%, Sprayer 97.7%, Chaser 90.7%, Grinder 94.2%, Whale 105.1%, Fisher 95.4%, Casual 94.5%, Newbie 87.9%
- Bust rate: Sniper 56.5%, Sprayer 0.0%, Chaser 34.8%, Grinder 40.0%, Whale 70.0%, Fisher 80.0%, Casual 0.0%, Newbie 90.5%
- Gun per-hit payback by group (designed in brackets): tiny 99.5% [98.0%], small 97.9% [98.0%], medium 99.1% [97.0%], big 95.6% [95.0%], boss 133.1% [90.0%], special 60.8% [95.0%]
- Plays: after_boss_reset 82, after_shark_release 7, cold_seat_octopus 70, cold_table_tuna 0, hot_table_spread 89

- Whole table paid back 102.6% (gun 103.6%, pole 95.0%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Sniper at 111.7%. Worst: Newbie at 87.9%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 played seats spans 78.4 points (80.4% to 158.9%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 49,057 schools tracked; plays all on (248 fired); seasons every 6 waves (80 seen); changes: none. Average session 41.5 min, time between wins p90 14 s, longest dry spell p90 2.9 min.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 2 --label v9-bites --game '/private/tmp/claude-501/-Users-subash-Library-CloudStorage-GoogleDrive-subashbiswa2781-gmail-com-My-Drive-Fish-Game-Table/d3370797-cc51-4756-926f-7d1663adb861/scratchpad/v9_bites.html' --no-library`

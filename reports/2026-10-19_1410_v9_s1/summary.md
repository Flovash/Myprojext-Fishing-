# Player lab: v9 (seed 1)

2026-10-19 1410 · Peacock Reef v9 (84c64a295e5a) · 720 simulated min · 10 seats · 198 sessions · errors 0

- Table payback 92.2% (gun 90.8%, pole 99.3%); seat spread 32.2 pts
- By type: Sniper 95.9%, Sprayer 96.7%, Chaser 92.8%, Grinder 96.8%, Whale 88.7%, Fisher 100.4%, Casual 92.9%, Newbie 81.2%
- Bust rate: Sniper 85.2%, Sprayer 0.0%, Chaser 28.0%, Grinder 52.2%, Whale 87.0%, Fisher 91.3%, Casual 0.0%, Newbie 100.0%
- Gun per-hit payback by group (designed in brackets): tiny 98.3% [98.0%], small 96.4% [98.0%], medium 92.8% [97.0%], big 73.2% [95.0%], boss 97.4% [90.0%], special 76.3% [95.0%]
- Plays: after_boss_reset 114, after_shark_release 4, cold_seat_octopus 20, cold_table_tuna 0, hot_table_spread 56

- Whole table paid back 92.2% (gun 90.8%, pole 99.3%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Fisher at 100.4%. Worst: Newbie at 81.2%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 10 played seats spans 32.2 points (75.5% to 107.7%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 25,578 schools tracked; plays all on (194 fired); seasons every 6 waves (72 seen); changes: none. Average session 36.0 min, time between wins p90 13 s, longest dry spell p90 2.0 min.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 1 --label v9 --game '/private/tmp/claude-501/-Users-subash-Library-CloudStorage-GoogleDrive-subashbiswa2781-gmail-com-My-Drive-Fish-Game-Table/d3370797-cc51-4756-926f-7d1663adb861/scratchpad/v9_final.html' --no-library`

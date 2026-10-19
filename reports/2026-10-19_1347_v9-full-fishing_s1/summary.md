# Player lab: v9-full-fishing (seed 1)

2026-10-19 1347 · Peacock Reef v9 (02a495f4ff40) · 720 simulated min · 6 seats (fishing_club) · players fisher, fisher, casual, fisher, grinder · 99 sessions · errors 0

- Table payback 92.1% (gun 96.7%, pole 91.1%); seat spread 16.7 pts
- By type: Sniper –, Sprayer –, Chaser –, Grinder 94.9%, Whale –, Fisher 91.6%, Casual 96.3%, Newbie –
- Bust rate: Sniper –, Sprayer –, Chaser –, Grinder 55.0%, Whale –, Fisher 81.4%, Casual 0.0%, Newbie –
- Gun per-hit payback by group (designed in brackets): tiny 97.6% [98.0%], small 97.4% [98.0%], medium 94.3% [97.0%], big 115.9% [95.0%], boss 120.8% [90.0%], special 170.9% [95.0%]
- Plays: after_boss_reset 99, after_shark_release 2, cold_seat_octopus 85, cold_table_tuna 9, hot_table_spread 88

- Whole table paid back 92.1% (gun 96.7%, pole 91.1%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Casual at 96.3%. Worst: Fisher at 91.6%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 6 played seats spans 16.7 points (86.3% to 103.0%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 22,075 schools tracked; plays all on (283 fired); seasons every 6 waves (69 seen); changes: table fishing_club. Average session 43.3 min, time between wins p90 18 s, longest dry spell p90 5.8 min.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 1 --label v9-full-fishing --game '/private/tmp/claude-501/-Users-subash-Library-CloudStorage-GoogleDrive-subashbiswa2781-gmail-com-My-Drive-Fish-Game-Table/d3370797-cc51-4756-926f-7d1663adb861/scratchpad/v9_full.html' --env fishing_club --no-library`

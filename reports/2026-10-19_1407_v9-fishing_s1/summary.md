# Player lab: v9-fishing (seed 1)

2026-10-19 1407 · Peacock Reef v9 (84c64a295e5a) · 720 simulated min · 6 seats (fishing_club) · players fisher, fisher, casual, fisher, grinder · 116 sessions · errors 0

- Table payback 96.2% (gun 95.0%, pole 96.4%); seat spread 5.9 pts
- By type: Sniper –, Sprayer –, Chaser –, Grinder 95.5%, Whale –, Fisher 96.4%, Casual 93.3%, Newbie –
- Bust rate: Sniper –, Sprayer –, Chaser –, Grinder 45.8%, Whale –, Fisher 92.8%, Casual 0.0%, Newbie –
- Gun per-hit payback by group (designed in brackets): tiny 98.5% [98.0%], small 98.7% [98.0%], medium 98.0% [97.0%], big 84.3% [95.0%], boss 79.5% [90.0%], special 89.9% [95.0%]
- Plays: after_boss_reset 102, after_shark_release 0, cold_seat_octopus 15, cold_table_tuna 4, hot_table_spread 63

- Whole table paid back 96.2% (gun 95.0%, pole 96.4%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Fisher at 96.4%. Worst: Casual at 93.3%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 6 played seats spans 5.9 points (91.2% to 97.1%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 22,490 schools tracked; plays all on (184 fired); seasons every 6 waves (70 seen); changes: table fishing_club. Average session 36.9 min, time between wins p90 17 s, longest dry spell p90 3.7 min.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 1 --label v9-fishing --game '/private/tmp/claude-501/-Users-subash-Library-CloudStorage-GoogleDrive-subashbiswa2781-gmail-com-My-Drive-Fish-Game-Table/d3370797-cc51-4756-926f-7d1663adb861/scratchpad/v9_final.html' --env fishing_club --no-library`

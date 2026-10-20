# Player lab: v9-bites-fishing (seed 1)

2026-10-19 1445 · Peacock Reef v9 (be75419ce06a) · 720 simulated min · 6 seats (fishing_club) · players fisher, fisher, casual, fisher, grinder · 88 sessions · errors 0

- Table payback 99.4% (gun 95.0%, pole 100.3%); seat spread 9.8 pts
- By type: Sniper –, Sprayer –, Chaser –, Grinder 95.3%, Whale –, Fisher 100.2%, Casual 88.8%, Newbie –
- Bust rate: Sniper –, Sprayer –, Chaser –, Grinder 64.7%, Whale –, Fisher 72.2%, Casual 0.0%, Newbie –
- Gun per-hit payback by group (designed in brackets): tiny 97.4% [98.0%], small 99.0% [98.0%], medium 96.6% [97.0%], big 95.2% [95.0%], boss 89.4% [90.0%], special 109.2% [95.0%]
- Plays: after_boss_reset 107, after_shark_release 0, cold_seat_octopus 121, cold_table_tuna 16, hot_table_spread 72

- Whole table paid back 99.4% (gun 95.0%, pole 100.3%) over 720 simulated minutes. The weekly target is about 97–98%; one night of 12 hours can swing about ±4% because of bosses, so compare several seeds before changing anything.
- Best-paid type: Fisher at 100.2%. Worst: Casual at 88.8%. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).
- Seat fairness: gun payback across the 6 played seats spans 9.8 points (91.1% to 100.9%). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.
- Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.
- No errors during the run.
- Director: 41,587 schools tracked; plays all on (316 fired); seasons every 6 waves (73 seen); changes: table fishing_club. Average session 48.8 min, time between wins p90 19 s, longest dry spell p90 6.1 min.

Full page: report.html · numbers: numbers.csv · rerun: `node lab/playerlab.js --minutes 720 --seed 1 --label v9-bites-fishing --game '/private/tmp/claude-501/-Users-subash-Library-CloudStorage-GoogleDrive-subashbiswa2781-gmail-com-My-Drive-Fish-Game-Table/d3370797-cc51-4756-926f-7d1663adb861/scratchpad/v9_bites.html' --env fishing_club --no-library`

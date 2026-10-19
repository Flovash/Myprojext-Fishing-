# Plan: the director's brain (missions, plans, memory, adapting)

Written by chat Claude, 2026-10-18. Builds on PLAN_director_tracking.md (do that first). For Claude Code to build.

## The idea
The owner gives the director a mission ("this week: hook new players and bring players back"). The director runs the night by picking a ready-made plan, adding tweaks and buffers, watching what happens, and adjusting. It records every request, play, risk, win and loss, and gets smarter from that record.

## 1. Missions (what the owner wants)
Folder `director/missions/`. The owner says it in plain words (to chat Claude or in MISSION.md); it is turned into a mission file:
```json
{ "name": "Hook week",
  "from": "2026-10-20", "days": 3,
  "goals": [
    {"metric": "new_player_first_session_min", "target": ">= 25", "weight": 3},
    {"metric": "return_within_7_days_pct", "target": ">= 60", "weight": 2},
    {"metric": "dry_spell_p90_s_new_players", "target": "<= 15", "weight": 2}
  ],
  "payback_band": [96, 99],
  "risk_budget_pct": 1.5,
  "experiment_share": 0.10,
  "notes": "Friends night Friday, expect 6-8 players" }
```
Only one mission is active at a time; the newest active one wins. Every mission start, change and end is logged.

## 2. Plan library (what we already designed)
Folder `director/plans/`. Ready-made night plans built from the route library: wave sequences like waves 8-16, season orders, Medium Rush timings. Each plan says what it is good for ("warm start", "big-fish night", "calm recovery").
At the start of a night the director picks the plan that best fits the mission, then adds:
- tweaks: swap a wave, change a season, move a rush
- buffers: an "up" stretch (hot scene, easy schools) and a "down" stretch (calm, spread out) placed so the night lands inside the payback band

## 3. Reading players
- Each seat gets a live guess of player type after 2-3 minutes, from targets chosen, bet pattern, fire rate, accuracy and pole use, compared with the 8 lab types. The guess keeps updating.
- To bring players back the director must know who is who across nights: add a simple player name or 4-digit PIN at the seat (points card style). Without it, "return" goals cannot be measured.

## 4. What the director may change (and what it may not)
Locked laws, never broken, never experimented with:
- Law zero: every shot costs the same and has the same catch chance for every player. No per-player or per-type odds.
- Group paybacks stay as designed (tiny/small 98, medium 97, big 95, boss 90, special 95).
- Night payback stays inside the mission's payback band; week lands at 97-98%.
Levers it may use: which fish, routes, formations, group sizes, where schools pass (seats), scene and season order, timing of big moments and rushes, pace.

Risk budget: the house margin (about 2.5 of every 100 credits) is what it may spend. It may run hot (up to 101% for an hour) to create moments when the mission calls for it, and must pay it back with calm stretches before the night ends. Every "spend" and "pay back" is logged with its cost.

## 5. Soft rules can be challenged
Every rule in laws.json except the locked laws is marked `soft`. The director may break a soft rule as an experiment, within `experiment_share` of waves (for example 10%), logging it as an experiment. Example: "allow 3 fast crossers in one wave" or "season of 3 waves".
After enough data the director writes a challenge report: the rule, what happened when it was broken, and a recommendation (keep, loosen, drop). The owner approves before the default changes. This is how the director "reasons out" rules that hold the game back.

## 6. Memory: the journal
Folder `data/journal/`, one file per night plus a running file:
- `requests.csv` every owner request and mission change
- `decisions.csv` every play fired: time, wave, play, why (which signal), expected cost, expected gain
- `outcomes.csv` per wave and per seat: wagered, paid, catches, dry spells, big moments, player type guess
- `risk.csv` running payback vs band, budget spent and repaid
- `experiments.csv` every soft-rule break and its result
- `night_summary.md` short plain-language summary for chat Claude and the owner

## 7. Learning loop
- Every wave: observe -> score progress against the mission -> pick a play (mostly the best known, sometimes a new one to learn: about 10% exploration) -> log.
- Every night: update each play's score per player type: session minutes gained, dry spells cut, payback cost. Plays that buy the most session time per point of payback rise to the top.
- Every mission end: mission report (goals met or not, what worked, what to try next) written to `reports/`.

## 8. Build order (after the tracking steps)
1. Mission files + journal files, with a mission switch in the game's settings panel.
2. Player type guessing per seat (check it against the lab's known types: how often is the guess right?).
3. Risk budget with spend/pay back, logged.
4. Plan library: turn waves 8-16 and the Medium Rush ideas into the first plans.
5. Play scores per player type + 10% exploration.
6. Soft-rule experiments + challenge reports.
7. Player name/PIN at the seat for return tracking.
Test every step in the lab first: run a "Hook week" mission with the 8 player types and report whether session lengths and dry spells moved, and what it cost in payback.

# Plan: tracking, plays and seasons for the director

Written by chat Claude, 2026-10-18. For Claude Code to build. Read with HANDOFF.md.

## Goal
Give the director tools (routes, formations, group sizes), memory (a record of every school it sent and what happened) and rules ("if" plays) so it can steer the night, e.g. help a cold table quickly.

Law zero still holds: plays change WHAT is sent and WHEN, never catch odds or pays. Catch chance per hit stays group payback / average multiplier.

## 1. Time layers
| Layer | Length | What changes |
|---|---|---|
| Scene | 20-40 s | Mix of fish (existing director scenes) |
| Wave | 60-75 s | One Shark, Manta every other wave (existing big-fish clock) |
| Season | `season_length_waves` waves | Look and habits: which routes and formations are in favor, background tint, music |
| Night | session | Weekly payback target |

`season_length_waves` is a law. Test 3, 6 and 9 in the lab; keep the one with longer average sessions and shorter p90 dry spells. Start value: 6.

## 2. Folder structure (restructure route_library)
```
route_library/
  fish/
    tuna/
      fish.json            role, home, habit, group sizes allowed, formations allowed
      formations.json      arc, echelon, line, ball: offsets and size limits
      routes/
        corner_run/
          route.json       points, duration, pauses, crosser flag, allowed flips
          rules.json       the "ifs": when the director may pick it, weights, limits
          stats.csv        tracked results, updated after every lab run
          sketch.svg
        crisscross/ ...
    shark/ ...            same layout for every fish (big, medium, small, tiny)
  director/
    laws.json             (move from laws/)
    seasons.json          season list: favored routes/formations, length law
    plays/                one file per play (see 4)
  data/
    dispatch_log.csv      every school sent, every lab run (see 3)
    route_scoreboard.csv  one row per fish+route+formation+size with averages
```
Keep `OPEN_ME.html` and `ROUTES.md` generated from these files.

## 3. Dispatch log (one line per school sent)
Game side: every spawn of a school (any fish with a route) creates a dispatch record in `window.__reef.dispatches`; fish carry its id; hits, catches and exits update it.

Columns:
`run_id, t_sent, wave, season, scene, fish, route, variant (mx/my/rev/lane), formation, size, seats_passed (seat numbers within reach), shark_on_screen, manta_on_screen, hits, caught, escaped, first_catch_s, credits_wagered_on_it, credits_paid, players_shooting_it`

Lab side: write `data/dispatch_log.csv` (append per run) and rebuild `route_scoreboard.csv`:
`fish, route, formation, size, sends, avg_caught_per_send, catch_rate_per_fish, avg_first_catch_s, avg_hits_to_catch, payback_on_it`
Also append each route's own rows to its `stats.csv`.

## 4. Plays ("if" rules)
One JSON file per play in `director/plays/`. Format:
```json
{ "id": "cold_table_tuna",
  "if": { "seconds_since_medium_catch": ">45", "shark_on_screen": false, "season": "any" },
  "then": { "send": "tuna", "route": "cornerSwing", "formation": "arc", "size": [4,6], "aim_at": "coldest_seats" },
  "limits": { "cooldown_s": 90, "max_per_wave": 1 },
  "why": "Give a cold table an easy, readable school to work on." }
```
Starter plays:
- cold_table_tuna (above)
- cold_seat_octopus: one seat no catch for 60 s -> Octopus Seat crawl or Rise and sink at that seat
- hot_table_spread: rolling payback > target + 3% -> calm season routes, mediums spread out, no Crisscross
- after_shark_release: Shark just left -> Tuna Crisscross (later: Medium Rush)
- after_boss_reset: boss ended -> 2 easy schools (Tuna arc size 4, Turtle Lazy S)
Every play logs when it fired, so the scoreboard can compare "with play" vs "without".

## 5. Group sizes and formations as variables (start with Tuna)
- Tuna size 2-6 (now 2-4). Formations: arc, echelon, line (single file), ball (tight cluster).
- Barracuda 1-3: single, pair, trio line.
- Turtle 1-2, Octopus 1, Swordfish 1.
Each combination is tracked separately in the scoreboard.

## 6. Build order for Claude Code
1. Restructure route_library into the folders above (no behavior change). Log in CHANGES.md.
2. Dispatch tracking in the game + lab writes dispatch_log.csv and route_scoreboard.csv. Run 12 h x 3 seeds, report.
3. Tuna sizes 2-6 and the 4 formations. Run, report scoreboard rows for Tuna.
4. Season clock as a law (3/6/9). Run each, compare sessions and dry spells.
5. Plays engine with the 5 starter plays, each switchable on/off. Run with and without, compare.

Runs: 12 simulated hours or more, at least 3 seeds per setting. Write summary.md every time so chat Claude can read results through Google Drive.

# Plays

One file per play. Every `plays_check_seconds` (laws.json) the director checks each enabled play; when every condition in `if` is true and `limits` allow it, it does `then`. Plays decide what is sent and when. They never touch catch chances or pays (law zero).

## if (all must be true)
Values are a number test (`">45"`, `"<3"`, `">=2"`), `true`/`false`, a name (`"Monsoon"`), or `"any"`.

| Signal | Meaning |
|---|---|
| `seconds_since_medium_catch` | Seconds since anyone caught a medium fish (gun or pole) |
| `coldest_seat_seconds` | The longest any playing seat has gone without a catch (counted from when they started playing) |
| `active_seats` | Seats that fired or cast in the last 15 s |
| `shark_on_screen`, `manta_on_screen`, `boss_on` | What is in the water right now |
| `season` | Current season name (seasons.json) |
| `payback_vs_target` | Rolling payback (last ~10 min) minus the target, in points (+3 = players 3 points ahead) |
| `seconds_since_shark_left` | Seconds since the main Shark left the screen |
| `seconds_since_boss_ended` | Seconds since a boss scene ended |

## then
- Send a school: `{"send": "tuna", "route": "cornerSwing" or a list, "formation": "arc", "size": [4, 6], "aim_at": "coldest_seats" | "cold_seat"}`. A list of these sends several.
- Start an effect: `{"effect": {"seconds": 120, "ban_routes": ["tuna.crisscross"], "route_weights": {"turtle.lazyS": 2}, "spread": true}}`.

A school is only sent into water that passes the medium laws (lane reservation, split rule, fast crossers); if none fits, the play waits for the next check.

## limits
`cooldown_s` (seconds before it may fire again), `max_per_wave` (per big-fish wave).

Set `"enabled": false` to switch a play off, or run the lab with `--plays off`, `--plays only:a,b` or `--plays except:a`.

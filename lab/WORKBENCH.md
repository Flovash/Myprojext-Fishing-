# Director workbench

Everything for designing the director and testing it: every test run is stored, every run can be watched again, and the
current version can be tried in different table setups with different settings. Ask Claude Code in plain words ("test the
current version on every table", "try seasons of 3 waves against now", "let me watch the run where the Kraken came") or use
the commands below.

## 1. Store everything
Every lab run writes a dated folder in `reports/` (in this Google Drive folder, so it is kept and synced):

| File | What it is |
|---|---|
| `report.html` | The full report: paybacks, player types, seats, the director section |
| `replay.html` | **The night itself, watchable** (see 2) |
| `summary.md` | A few plain lines chat Claude can read |
| `settings.json` | Every setting the run used, and the exact command to run it again |
| `numbers.csv`, `dispatches.csv` | Every number, and every school the director sent |

`reports/index.html` lists every run with links to its report and replay. `reports/LOG.csv` is the running log.

## 2. Play it back
Open any run's `replay.html` in a browser. It plays that night exactly as the lab played it: same fish, same shots, same
catches, same director decisions. It carries its own copy of the game as it was for that run, so later game changes never spoil
an old replay.

- Speeds 1×, 4×, 16×, 64× and Max; Pause (or the space bar); the slider jumps to any minute.
- **Jump to**: every play the director fired and every season change, one tap away.
- **Director, live**: each school as it finishes (fish, route, formation, size, how many were caught), and each play.
- **Seats**: who is sitting where (player type) and their credits.
- The green line under the controls checks the replay against the lab run every minute. If it ever turns red, the replay
  has drifted from the run; tell Claude Code.

Replays exist for runs from 2026-10-18 on (older runs used a game file that has changed since).
On a phone: ask Claude Code to publish a replay and you get a private link to open it.

## 3. Test with different environments and variables

**Table setups** live in `lab/environments.json`: how many seats are taken, which player types sit down, and the game's own
settings (difficulty, fish amount, fish speed, boss waves, fire rate). Now there are:
full_house, quiet_afternoon, high_rollers, fishing_club, beginners_night, pros, busy_fast_table. Add more by copying one.

**Variables** you can change for a run without editing the library:

| Option | Changes |
|---|---|
| `--law season_length_waves=3` | Any director law (value is JSON) |
| `--fish tuna.group_sizes=[2,6]` | Any fish setting |
| `--plays off`, `--plays only:after_shark_release`, `--plays except:x` | Which plays may fire |
| `--env quiet_afternoon` | A table setup |
| `--seats 4`, `--mix whale,casual,casual`, `--set density=lots` | Seats, players and game settings by hand |
| `--seed 3`, `--minutes 120` | Which night, and how long |

One run:

```
node lab/playerlab.js --env high_rollers --law season_length_waves=3 --minutes 120 --seed 1 --label my-idea
```

**The test bench** runs the current version in every table setup (several seeds each), next to any changes you want to try,
and writes one page comparing them all (`reports/testbench_<name>.md`):

```
node lab/testbench.js --name seasons --try "seasons-3: --law season_length_waves=3" --try "no-plays: --plays off"
```

Options: `--envs full_house,quiet_afternoon` (default all), `--seeds 3`, `--minutes 120`, `--jobs 4`, `--no-now` (skip the unchanged
version), `--out folder` (a trial: nothing is added to LOG.csv or the route library).

## 4. Design the director
The director's design is in `route_library/director/`: `laws.json` (the rules), `seasons.json`, and `plays/` (one file per play).
Fish and routes are in `route_library/fish/`. The loop:

1. Try an idea with `--law`, `--fish` or `--plays` on the test bench, without changing anything.
2. Watch the replays of the runs that look interesting.
3. When an idea wins, change the file in `route_library/`, then `node route_library/tools/build_library.js` puts it in the game.
4. Run the test bench again to confirm, and add a line to CHANGES.md.

## How it stays exact
The game's dice come from the run's seed. Two more things are pinned so a browser replays exactly what node played:
`lab/detmath.js` gives sin, cos, atan2, exp and log2 the same last digit everywhere (browsers differ from node there), and it
sorts short lists the way node does (the game shuffles Hammerhead candidates with a random sort). Both match node's own
results exactly, so runs from before this change still replay the same in the lab. The shared player code is in `lab/sim.js`;
`lab/replay.js` builds the replay pages.

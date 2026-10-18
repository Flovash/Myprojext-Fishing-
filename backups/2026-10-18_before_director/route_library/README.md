# Peacock Reef fish route library

One folder for every fish route, the rules the director follows, and the waves those rules produce.
The director (or anyone tuning the game) can load these files, change a law, re-run the sketches and compare.

## What is in here

| Folder or file | What it holds |
|---|---|
| `OPEN_ME.html` | The whole library as one page: open it in any browser |
| `ROUTES.md` | Readable index: every fish, every route, what each route is for |
| `fish/*.json` | One file per fish: role, home zone, habit, status, and each route's points, timing, pauses and purpose. This is the data the director loads |
| `fish/_not_designed_yet.json` | Fish that still need routes (small fish, specials, bosses) |
| `sketches/*.svg` | A picture of every route for each fish |
| `laws/laws.json` | The director's rules with their current values, what each one does, whether it is in the game yet, and ideas to try |
| `waves/plan_waves_08_16.json` | Where the big fish go in waves 8-16 |
| `waves/wave_08.json` ... `wave_16.json` | Each wave in full: big fish, every medium visit with start, end, direction and points, and rule checks |
| `waves/waves.html` | The sketches of waves 8-16 (open in a browser) |
| `tools/sketch_waves.py` | Re-builds the waves from the plan and the laws |

## Testing a different law

1. Copy `laws/laws.json` to a new file, for example `laws/three_crossers.json`.
2. Change a value, for example `fast_crossers_max` from 2 to 3.
3. Run, from this folder:

   ```
   python3 tools/sketch_waves.py --laws laws/three_crossers.json --out waves/three_crossers
   ```

4. Open `waves/three_crossers/waves.html` and compare it with `waves/waves.html`. Each wave file also has a `checks` block (medium visits, crossings against or with the Shark, peak fast crossers) so runs can be compared in numbers.

`--seed` changes the medium choices while keeping the same laws, which shows how much a wave varies by chance.

## Status

| Part | Status |
|---|---|
| Shark, Manta, Hammerhead, Marlin routes and scheduler | In the game (version 6) |
| Medium routes in this folder (homes, signatures, Corner hook, Side loop) | Designed; the game (version 7) still has the older medium set |
| Counterflow, lane reservation, 2 fast crossers, split rule | Designed; used by the sketch tool, not yet in the game |
| Sardine and Angelfish paths | In the game (version 5) |
| Small fish, specials, bosses | Not designed yet |

Law zero: movement never changes catch chances or pays.

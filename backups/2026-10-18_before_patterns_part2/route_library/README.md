# Peacock Reef fish route library

One folder for every fish route, the rules the director follows, the plays it can call, and what happened every time it sent a school.
The director loads these files (copied into the game by `tools/build_library.js`), and the player lab writes its results back into them.

Law zero: movement never changes catch chances or pays. Routes, formations, seasons and plays decide what is sent and when, never the odds.

## What is in here

```
route_library/
  fish/
    tuna/
      fish.json            role, home, habit, school sizes allowed, formations allowed, route order
      formations.json      arc, echelon, line, ball ...: spacing and size limits
      sketch.svg           all of this fish's routes in one picture
      routes/
        corner_run/
          route.json       points, duration, pauses, crosser flag, allowed flips
          rules.json       the "ifs": weight, attitude, fast-crosser count, split-safe, season weights
          stats.csv        tracked results, one row per formation and size, added after every lab run
          sketch.svg
        crisscross/ ...
    shark/ ...             the same layout for every fish (big, medium, tiny, small)
    _not_designed_yet.json fish that still need routes
  director/
    laws.json              the director's rules, their values, and whether each is in the game
    seasons.json           the seasons: which routes and formations are in favor, background tint
    plays/                 one file per play ("if this, then send that")
  data/
    dispatch_log.csv       every school sent in every lab run
    route_scoreboard.csv   one row per fish + route + formation + size, with averages over all runs
  waves/                   waves 8-16: the plan, each wave in full, and their sketches (waves.html)
  tools/
    build_library.js       rebuilds ROUTES.md, the route sketches and the game's copy of the library
    sketch_waves.py        rebuilds the waves from the plan and the laws
  ROUTES.md                readable index of every fish and route (made by build_library.js)
  OPEN_ME.html             the library as one illustrated page (a snapshot from before the folder split; the data in it has not changed)
```

## Changing something

1. Edit the JSON file (a route's `route.json` or `rules.json`, a fish's `fish.json`, `director/laws.json`, a play).
2. From the Fish Game Table folder, run `node route_library/tools/build_library.js`. This updates ROUTES.md, the sketches and the copy inside the game.
3. Test it in the player lab, for example `node lab/playerlab.js --minutes 720 --seed 1 --label my-change`.

The lab can also try a law without editing any file: `--law season_length_waves=3`, or turn plays off with `--plays off`.

## Testing a different law in the wave sketches

1. Copy `director/laws.json` to a new file, for example `director/three_crossers.json`.
2. Change a value, for example `fast_crossers_max` from 2 to 3.
3. Run, from this folder:

   ```
   python3 tools/sketch_waves.py --laws director/three_crossers.json --out waves/three_crossers
   ```

4. Open `waves/three_crossers/waves.html` and compare it with `waves/waves.html`. Each wave file also has a `checks` block (medium visits, crossings against or with the Shark, peak fast crossers) so runs can be compared in numbers.

`--seed` changes the medium choices while keeping the same laws, which shows how much a wave varies by chance.

# Fish Table Lab

Everything for the Peacock Reef fish table in one place.

| Folder | What is in it |
|---|---|
| `game/` | The game itself (open `peacock_reef.html` in a browser) |
| `route_library/` | Every fish's routes, the director's laws, waves 8-16 (open `OPEN_ME.html`) |
| `design/` | The design spec and the wave sketches |
| `lab/` | The player lab: `node lab/playerlab.js --minutes 240 --seed 1 --label my-test` plays a night with 8 player types and writes a report |
| `simulator/` | Headless test runs of the game (needs Node.js): `node simulator/medharness.js game/peacock_reef.html 60` runs 60 simulated minutes |
| `reports/` | One dated report per test run, plus a running log (the player lab writes here) |

The player lab is built. Open `reports/index.html` to see every run.

## Working together
- This folder lives in Google Drive so it is the same on the computer, the phone and for both Claudes.
- Claude Code (terminal) runs the simulator and the player lab and writes reports into `reports/`.
- Claude in the chat app reads the reports through the Google Drive connector, reviews them and can add design files here.
- Whoever changes something adds a dated line to CHANGES.md so the other can see it.

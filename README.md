# Fish Table Lab

Everything for the Peacock Reef fish table in one place.

**Where the project is now: read `STATUS_NOW.md` first (updated 2026-10-20).** Background:  "Fish Game Table - Start Here" and the Google Sheet "Fish & Routes" in this folder.** They are the readable versions (phones and chat Claude can open them; .json/.csv/.md files here are for Claude Code). New fish designs go in `new_fish_inbox/`.

| Folder | What is in it |
|---|---|
| `game/` | The game itself, v9 (open `peacock_reef.html` in a browser) |
| `route_library/` | Every fish's routes (one folder per route), the director's laws, seasons and plays, the dispatch log and route scoreboard, waves 8-16 (see its README) |
| `design/` | The design spec and the wave sketches |
| `lab/` | The director workbench (see `lab/WORKBENCH.md`): the player lab plays a night with 8 player types and writes a report and a replay you can watch; `lab/testbench.js` tests the current version in every table setup (`lab/environments.json`) |
| `simulator/` | Headless test runs of the game (needs Node.js): `node simulator/medharness.js game/peacock_reef.html 60` runs 60 simulated minutes |
| `reports/` | One dated report per test run, a running log (LOG.csv) and comparisons (`compare_*.md`, made by `lab/compare.js`) |
| `new_fish_inbox/` | Drop new fish + route designs here (template and instructions inside); Claude Code imports them with `route_library/tools/import_fish.js` |
| `backups/` | Copies from before big changes |
| `PLAN_director_*.md` | The director plans from chat Claude (tracking is built; brain, memory, theories next) |

Open `reports/index.html` to see every run, with its report and its replay.

## Website and GitHub
Everything in this folder is also on GitHub at https://github.com/Flovash/Myprojext-Fishing- (public), except the Google Docs/Sheets shortcut files. The website https://flovash.github.io/Myprojext-Fishing-/ opens the Reef Playbook, the game, and the lab reports with their replays. This Drive folder is the working copy: Claude Code copies it to the repo with `sync_from_drive.sh` (in `~/Projects/Myprojext-Fishing-` on the Mac) and pushes.

## Working together
- This folder lives in Google Drive so it is the same on the computer, the phone and for both Claudes.
- Claude Code (terminal) runs the simulator and the player lab and writes reports into `reports/`.
- Claude in the chat app reads the reports through the Google Drive connector, reviews them and can add design files here.
- Whoever changes something adds a dated line to CHANGES.md so the other can see it.

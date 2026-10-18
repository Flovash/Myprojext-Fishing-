# Peacock Reef

A 10-seat fish table game (gun and fishing pole), its route library and the tools around it.

**Website:** the repo's GitHub Pages site opens `index.html`, with links to the Reef Playbook and the game.

| Folder / file | What it is |
|---|---|
| `game/peacock_reef.html` | The game. One file, opens in any browser. |
| `reef_playbook.html` | Reef Playbook: fish pages, routes, rules, and the master strategy timeline. |
| `route_library/` | Every fish, its routes, formations and rules, plus the director's laws, seasons and plays. `tools/build_library.js` rebuilds ROUTES.md, the sketches and the game's copy of the library. |
| `simulator/` | Older test harnesses for the game. |

## Where the rest lives

Data and reports are kept in the "Fish Game Table" Google Drive folder, not here: lab reports, LOG.csv, the dispatch log, the route scoreboard, each route's tracked stats, plans and notes.

## Updating from Drive

The Drive folder is the working copy. To bring changes here:

```
./sync_from_drive.sh
git add -A && git commit -m "Sync from Drive" && git push
```

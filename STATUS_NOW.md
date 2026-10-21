# Peacock Reef: where the project is now

**Read this first.** It is the current state of the project for any person or AI joining without the chat history.
Last updated 2026-10-20 by Claude Code. If anything here disagrees with the code, the code wins.
Older background: `PROJECT_OVERVIEW.md` (written for v8, 2026-10-18; still good for history and the director plans).

---

## 1. What it is
Peacock Reef is a custom 10-seat fish arcade game for the owner's home fish table cabinet, played by friends for
**points only** (no money, no prizes). The whole game is one HTML file: `game/peacock_reef.html` (GAME_VERSION 9,
features through "v9.2"). Two ways to play, kept as **separate worlds** with separate odds and separate banks:
- **Gun:** every shot costs the bet; a catch pays the fish's multiplier × bet.
- **Fishing pole:** buy bait at the Bait Shack, cast, a fish under the water bites, win a short timing fight, the fish
  goes in your bag; sell it any time or keep it to the season end for a weight bonus.

A **director** runs the show: which fish come, where, when, how fast, scenes, waves, seasons, rituals. It never
changes the odds.

## 2. Where things live
| What | Where |
|---|---|
| Working copy (everything) | Google Drive folder "Fish Game Table" (this folder) |
| Code repo (public) | https://github.com/Flovash/Myprojext-Fishing- , work branch `build/pole-market`, pull request #1 (not merged; merges only when the owner says "merge it") |
| Website | https://flovash.github.io/Myprojext-Fishing-/ (Reef Playbook, game, lab reports) |
| Phone test build (private to the owner) | https://claude.ai/artifact/HG7mGx4wsMG11bh5XLxtbk (version 10 = everything below) |
| Feature guide (most detailed, current) | `docs/V9_GUIDE.md` |
| Every change, dated, with who made it | `CHANGES.md` |
| Rules for Claude Code | `CLAUDE.md` |
| Fish routes, laws, seasons, rituals, pole tables | `route_library/` (JSON; `node route_library/tools/build_library.js` embeds it in the game) |
| Player lab (simulated players) | `lab/` (`lab/playerlab.js`, `lab/sim.js`, `lab/environments.json`) |
| Lab reports | `reports/` (not in the public repo) |

## 3. Laws that never change
- **Law zero:** movement, routes, speed and timing never change catch chances or pays.
- Gun catch chance per hit = group payback ÷ average multiplier. Group paybacks: tiny/small 98%, medium 97%, big 95%,
  boss 90%, special 95%.
- No per-player odds, ever. The director controls the show, not the odds. Banks decide **when** something may
  happen, never how likely a catch is.
- Gun and pole are separate algorithms with separate banks and must not affect each other.
- Max 3 big fish on screen; one Shark per big-fish wave (60-75 s).
- Weekly table payback target 97-98%.

## 4. What is built (as of 2026-10-20)
**Gun side**
- 25+ species in 6 groups, library routes and formations for every fish, Shark-led big-fish waves, bosses, Bomb Crab
  and Lightning Eel (chain catches), Golden Sardine.
- Fast gun: 6 shots/s, bullets 1,050 px/s.
- **v9.1 Streams:** small fish sometimes come one at a time in ribbon, twin (X), wheel (loop), parallel (two lanes)
  or scatter (individuals at different paces) formations; school sizes vary.
- **v9.2 (built today):**
  - **Rush:** once or twice a wave, one kind of fish dashes in one at a time from different edges, fast (capped at 3× its normal speed), with a "Tuna Rush!" card.
  - **King Puffer:** a rare crowned puffer (special group). It puffs up to 1.6× for 3-4.5 s. Calm it pays 20-40×, puffed 40-150×, each state at the same fixed 95% return.
  - **Fish sizes:** tiny, small and medium fish vary 0.88-1.1×, and about 1 in 8 is 1.2-1.35×. The hit area matches the drawing.
  - **Quick schools:** small groups are smaller (mostly 1-5) and up to 1.3× faster.
  - **Darts:** 2-4 fish swing in from an edge on a round turn and leave within 4.5-7 s.
  - **Fixes:** the formation settings file was hiding two formations; the parallel lanes slid into each other on turns.

**Pole side**
- Bait Shack market: a small stall per seat, joystick + 2 buttons. Bait stock, a bag, sell all or keep for the season-end weight bonus.
- Fish live under the water and bite by bait tables. One roll per cast; each bait row pays about 97%.
- Golden Koi (golden lure, bank-gated) and deep visitors.
- **v9.1:**
  - **Pole runs:** each wave favors small fry, a mix, midwater or big water, with season favorites. A bank decides when the bigger runs may come.
  - **Strays:** extra published rows at the same 97%.
  - **Line depth:** Shallow, Mid or Deep. Deeper means bigger fish and longer waits; the Lock/Enhance button changes depth.

**Show**
- Scenes, big-fish waves, seasons of 6 waves (Winter / Monsoon / Summer reef), and a market that moves with the season.
- Wave and season cards on screen.
- **Rituals** that change the ocean when triggered, with "forming…" and effect cards: Bait Ball (fish part around it), Giants' Pass, and others.
- Fish tempo.

**Lab (simulated players)**
- 8 player types (Sniper, Sprayer, Chaser, Grinder, Whale, Fisher, Casual, Newbie) plus **Angler** (pole only, added today).
- Table setups in `lab/environments.json`, including **half_and_half** (5 pole-only, 5 gun-only).
- **Bankroll study** (new): `--buyin`, `--betcap` and `--maxmin` options; `lab/bankroll_study.js` reports how often a player goes up, doubles, triples, reaches +500 or 10,000.

## 5. Happening right now
- v9.2 lab runs are done (results below) and v9.2 is pushed to PR #1 on GitHub (not merged).
- Waiting on the owner: the missed-shot decision, and whether to act on the bankroll findings ("Bank it?" nudge, more shots per credit).

## 6. Numbers so far
v9.2 lab, 12 h each, errors 0, ledger ok:

| Table | Table payback | Gun | Pole |
|---|---|---|---|
| Normal table, seeds 1-3 | 87.3 / 89.3 / 94.2% | 86.0 / 89.0 / 93.7% | 99.3 / 91.3 / 98.8% |
| Half and half (5 pole-only, 5 gun-only) | 100.4 / 96.3 / 88.3% | 103.8 / 99.3 / 85.5% | 92.1 / 90.9 / 93.1% |

- Gun per-hit payback by group is on design (tiny 96-99%, small 95-99%, medium 94-100%).
- **Known gap:** gun realized payback (~90%) is under the 97-98% target because missed shots are pure losses (fast gun, fast fish). That is the owner's open missed-shot decision.
- Special group per-hit swings a lot run to run (49-132% even before v9.2); the King Puffer formula returns exactly 95%. Watch it.
- **Bankroll study** (`reports/bankroll_2026-10-20/STUDY.md`; everyone starts with 10 / 100 / 500, bet cap 1 / 3 / 10, 60 min max, simulated players fire nonstop):

  | | Start 10 | Start 100 | Start 500 |
  |---|---|---|---|
  | Ever ahead | 91% | 80% | 82% |
  | Reached 2× | 80% | 28% | 21% |
  | Reached 3× | 65% | 18% | 13% |
  | Reached +500 | 4% | 9% | 21% |
  | Reached 10,000 | 0% | 0% | 0% |
  | Broke if they kept playing | 98% (about 1 min) | 99% (about 2 min) | 90% (about 11 min) |

  Pole players double about twice as often as gun players.
- **Proposed** (not built): more shots per credit or slower fire at low bets, and a "Bank it?" nudge at 2×.

## 7. Open decisions for the owner (ask, don't guess)
1. **Missed shots:** stay pure losses, bounce for a second chance, or something else? (Biggest effect on payback.)
2. Season length: 3, 6 or 9 waves.
3. Tempo numbers, boss bait deal, weight bonus size, leaver bonus, leftover bait, bite/tease numbers, Koi timing.
4. Depth upgrades proposed: a fish finder (sonar strip on the seat plate) and an Upwelling pole ritual. Not built yet.
5. A signature environment-triggered special, e.g. a Whale Shark that comes when a Bait Ball forms (instead of random golden jackpot fish). Not built yet.
6. Player name/PIN at the seat for tracking returns.
7. Merging PR #1.

## 8. Roadmap (rough estimate: 60-65% to a version 1 for the cabinet)
| Part | Done |
|---|---|
| Fish, routes, director, waves | ~85% |
| Pole, market, depth | ~85% |
| Specials and moments | ~75% |
| Math and payback | ~60% |
| Look, sound, win celebrations | ~50% |
| Real playtesting | ~5% |
| Cabinet readiness | ~25% |

Cabinet readiness still needs:
- An attract mode.
- An owner menu with a PIN, meters and bookkeeping.
- Power-cut resume.
- Real joystick and button mapping.
- 60 fps on the cabinet PC with 10 seats.

Next steps, in order:
1. Missed-shot decision, then tune payback.
2. A playtest with friends: half pole, half gun, then swap.
3. Fix what the playtest shows, then build win celebrations.
4. Cabinet readiness.
5. A second playtest, then lock v1.0.

## 9. How the owner works (please follow)
- Works mostly from a **phone**: give links that open on a phone (Artifact, Google Docs), not local file paths.
- Writes fast and informally; plain language back, short.
- **Cabinet controls:** joystick + **"Go"** (button 1: fire/buy) + **"Enhance"** (button 2: bet/market). Everything must work with those.
- **Seat UI stays small**, about the seat plate's width. Big overlays were rejected because they disturb neighbours.
- Prefers environmental, "fish follow each other" design over copying other games' random golden fish.
- Odds are fixed. The director is show only.
- Claude Code: branch + PR, 12h+ lab on 3 seeds before game changes, and a dated CHANGES.md line saying who made each change.
- No player names, PINs or play data in the public repo; `reports/` stays out of the repo. Keep the owner's email out of public files.

## 10. How to run things (Claude Code, on the Mac)
- Lab: `node lab/playerlab.js --minutes 720 --seed 1 --label NAME --no-library` (add `--env half_and_half`, or `--buyin 100 --betcap 3 --maxmin 60 --out reports/bankroll_DATE`).
- Pole audit: `node lab/pole_audit.js`. Market math: `node lab/market_calc.js`.
- Rebuild the library into the game: `node route_library/tools/build_library.js`.
- Repo clone: `~/Projects/Myprojext-Fishing-` (copy changed files from this folder, commit on `build/pole-market`, push).

## 11. Which documents are current
| Document | State |
|---|---|
| **Current** | This file, `docs/V9_GUIDE.md`, `CHANGES.md`, `CLAUDE.md`, `route_library/` |
| **Older, still useful** | `PROJECT_OVERVIEW.md` (v8), `docs/GAME_MATH.md`, `docs/plans/PLAN_director_*.md`, `docs/BAIT_MARKET.md` |
| **Stale** | `docs/V9_EVERYTHING_SO_FAR.md`, the Google Doc "Peacock Reef v9 — Everything So Far", "Fish Game Table - Start Here" (all from before the Bait Shack, tempo and v9.1/v9.2) |

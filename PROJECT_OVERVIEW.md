# Peacock Reef: project overview

**Read this first.** It explains the whole project in one place, so any person or AI can understand it,
review it and give advice without the earlier chat history.
Written 2026-10-18 by chat Claude from the repo, the Drive folder and the game code.
If anything here disagrees with the code, the code wins. For the exact payout math see `docs/GAME_MATH.md`.

---

## 1. What this is

**Peacock Reef** is a custom fish table arcade game the owner is building for a home fish table cabinet
(a 10-seat cabinet, converted from a Batman Dark Knight machine; the hardware controls are not hooked up yet).
It's played by friends in a garage, for **points only**: no money, no prizes.

- Up to 10 seats (5 on the top edge of the screen, 5 on the bottom).
- Two ways to play:
  - **Gun:** shoot fish. Every shot costs your bet; a catch pays the fish's multiplier × bet.
  - **Fishing pole:** cast a bait (fixed price), a fish bites, you win a short timing fight, it pays from a table.
- The whole game is one HTML file (`game/peacock_reef.html`, currently **v8**) that runs in any browser.
- A **director** (the game's AI host) decides what the show looks like: which fish come, where they swim, which
  scenes and waves run, and it keeps the table's long-run payback on target.
- **Payback target:** about 97–98% over a week (on "normal" difficulty the game targets 97.5%).

The owner's main goals right now:
1. Make every fish move in a natural, varied, readable way (routes, formations, rituals).
2. Build a director that learns from experience and runs time-boxed "missions" the owner gives it
   (for example "3 days: hook new players and bring them back").
3. Test everything with simulated players before real people play it.

---

## 2. Laws that never change

1. **Law zero:** movement, routes, timing, formations, waves and rituals NEVER change catch chances or pays.
   They only decide where and when fish swim.
2. **Same odds for everyone.** No per-player or per-player-type odds, ever. The director controls the show,
   not who wins. (Reasons: fairness between friends, and per-player odds would count as rigging if money were
   ever involved.)
3. **Gun catch chance per hit = group payback ÷ the fish's average multiplier.** So every hit returns the group
   payback on average, whatever fish it hits and whatever the bet.
4. **Group paybacks:** tiny 98%, small 98%, medium 97%, big 95%, boss 90%, special 95%.
5. **Gun and pole are two separate math systems.** Never mix them (details in `docs/GAME_MATH.md`).
6. **Hot and cold systems must average out** (gun moods, the Sardine/Minnow see-saw, pole moods and their jars,
   the golden pocket).
7. **Points only.** Several planned director tools (payback tides, payout decks) adjust payouts based on past
   results. That is fine for a points game; it would be regulated or banned in many places if money or prizes
   were ever involved.

---

## 3. How the game pays (short version)

Full numbers: `docs/GAME_MATH.md`.

**Gun**
- One roll per bullet hit: chance = P ÷ average multiplier, where P = group payback × difficulty × scene factor.
- **Moods per group:** Stable (pays stay low in the range) or Swingy (pays anywhere), switching every 1–3 min.
- **Hot/cold see-saw:** Sardines and Minnows take turns being "hot" (better P) and "cold", every 15–30 s.
- Golden Sardine (about 1 in 700 Sardine hits, pays 50×). Bomb Crab (blast) and Lightning Eel (chain).

**Fishing pole**
- One roll per cast: nibble chance = bite ÷ 0.9; the average player lands 90% of fights.
- 13 baits, each attracting certain fish with their own bite rates and pay tables.
- **Moody fish** (Sardine, Clownfish, Pufferfish, Tuna, Shark) switch between Low (cold: bites a lot, pays small),
  Normal and Wild (hot: bites rarely, pays big). A **mood jar** per fish means hot moods are only allowed when
  earlier cold casts have paid for them.
- **Golden pocket:** every cast tops it up; it pays for the Golden Koi (5,000 points, Golden lure only).

---

## 4. The fish

25 fish in 6 groups. Each fish has a **role, a home area, a habit, routes, and "if" rules** for each route.
The route library has **24 fish and 99 routes** (`route_library/`); the Golden Koi swims to the player's lure.

| Group (pays) | Fish |
|---|---|
| Tiny (2–6×) | Sardine, Anchovy, Clownfish, Butterflyfish |
| Small (2–15×) | Minnow, Angelfish, Pufferfish, Lionfish, Seahorse |
| Medium (8–50×) | Tuna, Barracuda, Octopus, Swordfish, Sea Turtle |
| Big (80–500×) | Hammerhead, Shark, Marlin, Manta Ray |
| Boss (300–1,200×) | Healer Jellyfish, Megalodon, Giant Squid, Kraken |
| Special | Bomb Crab (blast), Lightning Eel (chain), Golden Koi (fishing only, 5,000) |

### Big fish (in the game)
- Big-fish waves of 60–75 s (the clock pauses during boss scenes). One Shark per wave; never more than 3 big fish on screen.
- The **Shark** picks an attitude (King 45%, Hungry 20%, Curious 20%, Aggressive 15%), then a route that fits it
  (14 routes). It enters from a new edge each wave. If players hit it hard it can Snap back or go into a Frenzy (show only).
- The **Manta** comes every other wave. About 1 visit in 3 becomes a **meeting** with the Shark; then the Shark
  may only use calm routes that stay 200 px from the Manta, or it waits off screen.
- A second Shark sometimes follows (Shadow) or mirrors it (Pincer); 6 more two-Shark moves are designed.
- **Hammerhead** in 2 of 3 waves (sometimes a pair on both seat rows); **Marlin** every wave.

### Medium fish (in the game since v8)
Each species has a home and a signature: Tuna own the corners, Barracuda the sharp middle, Octopus the seat edges,
Swordfish the only vertical/hard-angle runs, Turtle the center and the only circles. Flow rules: at most 2 fast
crossers at once, mediums flow against the Shark (counterflow), water a big fish is about to use is reserved,
and nothing crosses the middle while the Shark splits the screen. Tuna come in schools of 2–6 in 4 formations.

### Tiny, small, specials, bosses
All designed with routes and rules (patterns part 2); most still use the older drifting movement in the game.

### Waves
The **master strategy** is 10 planned waves (about 12 minutes), shown on one timeline in the Reef Playbook and
listed row by row in the sheet "Reef Playbook - Master Strategy (waves 1-10)".

---

## 5. The director

### Built (game v8)
- Picks each wave's **shape** from the rolling payback: players ahead → quieter "recover"; bank ahead → "spike"
  or "roller" to spend it on fun; 12% experiments.
- **Scenes:** Morning Reef, The Hunt, Bait Ball, Turtle Parade, Night Water, The Current, Giants, Boss.
- **Tracking:** every school it sends is logged (dispatch log, route scoreboard, per-route stats).
- **Seasons:** Winter, Monsoon, Summer reef, each favoring routes and formations and tinting the water (never the odds).
- **Plays:** 5 starter plays (after_shark_release, after_boss_reset, cold_seat_octopus, cold_table_tuna,
  hot_table_spread), each can be switched off.

### Planned (in `docs/plans/`, nothing built yet)
| Plan | What it adds |
|---|---|
| PLAN_director_tracking.md | Built (steps 1–5). |
| PLAN_director_brain.md | Missions from the owner, a plan library with tweaks and buffers, reading player types, a risk budget inside a payback band, soft rules it may test, a journal, a learning loop. |
| PLAN_director_memory.md | A memory that survives data wipes: beliefs with confidence, notable moments, crowd profiles, an odds watch. |
| PLAN_director_theories.md | Every session the director writes theory cards; nothing becomes official until the owner discusses, tests and signs it. |
| PLAN_director_toolkit.md | Wave recipes, formation decks, soft/hard schools, a "payback tide" that must come back to square, dry-spell types, tracking by bet size, a risk check before big moments, payout decks, intensity pacing, a bank per fish, a pattern audit. |
| PLAN_rituals.md | Moments when the whole ocean reacts (Bait Ball, Sardine Run, Feeding Frenzy, Make Way…): a role for every fish in every ritual, triggered when certain routes line up, with rarities. The toolkit plan suggests cutting to 6 natural rituals. |

---

## 6. Testing: the player lab and workbench

- `lab/playerlab.js` plays a simulated night with **8 player types**: Sniper, Sprayer, Chaser, Grinder, Whale,
  Fisher, Casual, Newbie. Every run writes a dated report, a **replay you can watch**, and a line in `reports/LOG.csv`.
- `lab/environments.json` has table setups (full_house, quiet_afternoon, high_rollers, fishing_club,
  beginners_night, pros, busy_fast_table). `lab/testbench.js` runs a version in every setup.
- Rule: judge changes on **12+ simulated hours × at least 3 seeds**; 4-hour runs are too noisy.

### Latest results (12 h × 3 seeds each, from reports/compare_director-build.md)
| Run | Table payback | Gun | Pole |
|---|---|---|---|
| baseline v7 | 88.6% | 85.4% | 95.7% |
| routes v8 | 93.7% | 92.6% | 96.5% |
| seasons of 9 waves | 96.9% | 97.1% | 96.4% |
| plays on | 93.3% | 92.2% | 96.2% |

### Known issues
1. **Gun payback runs below target** in most runs (85–97% against 97.5%), with big swings between seeds.
   Needs explaining before the director is trusted with money-like decisions.
2. **Newbies get much less back** (about 77% in recent runs). Missed shots are pure losses, which hits beginners
   hardest. Open owner decision: protect beginners or not.
3. **Seat spread** is wide (45–65 points between best and worst seat).
4. The wave plan has 1–3 mediums per wave swimming inside the Shark's 200 px ring.
5. `route_library/data/dispatch_log.csv` is about 51 MB and grows ~3 MB per 12-hour run; GitHub refuses files over 100 MB.

---

## 7. Where everything lives

| Place | What | Who can open it |
|---|---|---|
| Google Drive folder **"Fish Game Table"** | The working copy of everything (code, data, docs) | Owner, terminal Claude, chat Claude |
| GitHub **github.com/Flovash/Myprojext-Fishing-** | A copy of the Drive folder (synced by `sync_from_drive.sh`), **public** | Anyone |
| Website **flovash.github.io/Myprojext-Fishing-** | The game, the Reef Playbook, lab reports and replays | Anyone |
| Reef Playbook in the owner's Claude app | Fish pages, routes, rules, the master strategy timeline | Owner (private) |

Never put player names, PINs or real play data in the repo; it's public.

### Folder map (Drive = repo)
```
Fish Game Table/
  PROJECT_OVERVIEW.md     this file
  CLAUDE.md               rules terminal Claude reads every session
  README.md               folder guide
  CHANGES.md              dated log of every change and who made it
  Reef Playbook.html      the playbook page (repo: reef_playbook.html)
  Fish Game Table - Start Here (Google Doc), Fish & Routes (Sheet), Master Strategy (Sheet)
  docs/
    GAME_MATH.md          exact gun and pole math
    HANDOFF.md            older handoff notes
    plans/                PLAN_director_*.md, PLAN_rituals.md
  game/                   peacock_reef.html (v8)
  route_library/          fish/<fish>/routes/<route>/, director/ (laws, seasons, plays), data/, waves/, tools/
  lab/                    player lab, replays, environments, test bench
  simulator/              older headless test harnesses
  reports/                one folder per lab run, LOG.csv, comparisons, index.html
  design/                 design spec, wave sketches
  new_fish_inbox/         template for new fish designs
  backups/                copies from before big changes (incl. the merged patterns_part2_inbox)
```

---

## 8. Who does what

- **Owner:** decides. Gives missions, approves theories and any change to odds or pays.
- **Terminal Claude (Claude Code on the owner's Mac):** builds and runs things: edits the game and tools, runs the
  lab, writes reports, syncs Drive to GitHub and pushes.
- **Chat Claude (Claude app):** designs and reviews: fish routes, plans, the Reef Playbook, reading reports, writing
  handoff files into Drive. It can read the GitHub repo but not push to it.
- Workflow: test in the lab before changing the game; one dated line in CHANGES.md per change; the owner signs off
  on anything that touches odds or pays.

---

## 9. Open decisions for the owner

1. Season length: 3, 6 or 9 waves (9 tested best for payback so far).
2. Should missed gun shots stay pure losses for beginners?
3. Player name or PIN at the seat, so the director can tell returning players apart.
4. Rituals: 24 (one per fish) or the 6 natural ones? Warnings before them? Natural only, or may the director set the stage?
5. Toolkit: tide window (60 or 90 min) and swing range, dry-spell limit per seat (60/75/90 s), a guaranteed minimum
   of easy fish for 1-token players, payout deck width, tide cycle length (15–25 min).

---

## 10. Glossary

- **Payback (RTP):** points paid back ÷ points bet. 97% means 97 back per 100 bet on average.
- **Group:** fish value class (tiny, small, medium, big, boss, special).
- **Multiplier (×):** what a gun catch pays per point bet.
- **Route:** the path a fish swims. **Formation:** the shape a school holds. **Wave:** a 60–75 s big-fish cycle.
- **Scene:** a stretch with its own fish mix and a payback factor. **Shape:** the order of scenes the director picks.
- **Play:** a director move (e.g. send an Octopus to a cold seat). **Season:** a theme lasting several waves.
- **Ritual:** (planned) a moment when the whole ocean reacts to one fish or event.
- **Mood / see-saw / jar / pocket:** the hot-and-cold systems; all must average out.
- **Seed:** the random number start for a lab run; same seed = same night.

---

## 11. How to review this project (for another AI)

Good questions to look at:
1. Why does gun payback land below target in the lab? (Bot aim, missed shots, scene factors, rolling-payback steering?)
2. Do the hot/cold systems really average out over a night and over a week?
3. Is the director's planned "payback tide" safe, and does it keep law zero and "same odds for everyone"?
4. Are the fish routes varied enough that players can't learn patterns?
5. What is the simplest next step that makes the director better?

Start with: this file → `docs/GAME_MATH.md` → `CLAUDE.md` → `CHANGES.md` → `reports/compare_director-build.md`
→ the plan you care about in `docs/plans/`.

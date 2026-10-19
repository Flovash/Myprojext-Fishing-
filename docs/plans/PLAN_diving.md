# Plan: diving fish (look like they go deep, come back up on the same route)

Written 2026-10-19 by Claude Code from the owner's answer to ChatGPT's underwater plan. Idea stage, nothing built.
Follows `FINDINGS_underwater_plan.md`.

## What the owner wants (their words, cleaned up)

"Hidden" means some fish **seem to go under water** sometimes and later **come back up on the same route** they were
following. Not all of them, just sometimes, so it looks like there are fish going down underneath. When a player
uses the fishing pole, it feels like "maybe I can catch the Megalodon or whatever".

## Correction from the owner (2026-10-19, second answer)

**The gun and the fishing pole are different algorithms, and the fish under the water are a different world from the
fish on the screen.** So ChatGPT's "separate underwater population" is right after all:

- **On screen = the gun's world.** Visible fish, gun math (group payback ÷ multiplier).
- **Under water = the pole's world.** Its own population and its own math (bait tables, bites, fights).
- **Diving is the bridge you can see.** A fish that dives leaves the gun's world and joins the underwater pool. When it
  comes back up on its route, it's a gun fish again. Deep visitors (Megalodon…) live only underwater and show as shadows.
- The pole rolls against the **underwater pool near the bobber**, with fixed published weights per bait (see
  `docs/BAIT_MARKET.md`), not only the fish that happen to swim into the circle on screen.
- **Bait market:** players pick bait from a shop screen. The underwater pool decides what's around; the bait decides
  what can bite and at what odds.

The sections below were written before this answer. The look of diving and the fairness rules still hold; the bite
rule is replaced by the underwater pool.

## Banks: one or two? (recommendation)

**Two banks (gun bank and pole bank) plus one total the director reads.** Reasons:

1. The two sides pay very differently. The gun pays lots of small wins and its long run is smooth. The pole pays
   rarely and big (Marlin 2400, boss 15000 off a 700 bait), so it needs its own reserve to plan big moments.
2. Each side keeps its own target (gun ~97.5%, pole TBD), so one side can't quietly pay for the other.
3. The director still sees the whole table (total in, total out) to plan pacing: "the pole bank is full, a deep
   visitor tonight is affordable".
4. ChatGPT's ledger list fits: gun ledger, pole ledger, each bank's balance, and the total.

Answered: odds are fixed. The director reads the banks and only decides the show (what comes, when, how many).

## How it works (first draft, before the correction)

1. **A dive is part of the route, not a new route.** A fish keeps moving along its route at the same speed while it's
   down. It sinks (shrinks a little, goes darker and bluer, a few bubbles), swims as a faint **shadow**, then rises back
   up further along the same path. Nothing about where it goes changes.
2. **While it's down:**
   - **Gun:** can't hit it. Bullets pass over the shadow.
   - **Pole:** the shadow is still a fish. If it swims into a bobber's circle, it can bite. That's the same
     "first fish that eats the bait and enters the circle" rule as today, so there is no separate underwater
     population and no new selection rule.
3. **Same odds.** A bite from a diving fish uses the same bite table, fight and pay as when it's on top. Diving only
   changes *when the fish can be shot* and *what it looks like*, never the chance or the pay (law zero).
4. **Deep visitors (the Megalodon feeling).** Rarely, a big or boss fish passes **only as a deep shadow** across the
   screen and never surfaces. It's catchable on the pole with the right bait while it's crossing. That's the
   "maybe I can catch the Megalodon" moment, and the shadow makes it honest: a player can see something is down there.

## Who dives (first draft)

| Fish | Dives? | Notes |
|---|---|---|
| Turtle, Manta, Octopus, Tuna, Swordfish, Marlin, Hammerhead, Shark | Sometimes | One dive at most per trip, 3-8 s under |
| Sardine, Minnow, Anchovy (whole school together) | Rarely | The whole school dips at once, like a bait ball dropping |
| Clownfish, Angelfish, Butterflyfish, Seahorse, Puffer, Lionfish | No | Reef fish stay up top |
| Megalodon, Giant Squid, Kraken, Healer | Deep visitor only | Shadow crossings outside boss waves, rare |
| Golden Koi, Bomb Crab, Lightning Eel | No | Specials stay visible |

Draft frequency: about **1 trip in 6** for divers. Deep visitors about **2-4 per hour**.

## Rules to keep it fair and readable

- A fish never dives while it's hooked, chained or in a ritual's lead role, and never in the last 2 s before leaving the screen.
- It never dives **because** someone is shooting at it. Dive points are picked when the route starts, before anyone aims.
- Divers come back up on the same route. If the route ends while it's down, it surfaces just before leaving
  (players should see it go).
- Max 3 big fish on screen: a diving big fish still counts, but a deep visitor doesn't.
- Every dive, surface and pole bite from a shadow goes in the dispatch log and cast log, so the lab can audit it.

## Things that change the current math (owner decisions)

1. **Gun exposure.** Diving fish are shootable for less time. Per-hit odds stay the same, but players get fewer
   chances at divers, so a bit more of the gun's spend goes to reef fish. The lab will measure it.
2. **Boss bait outside boss waves.** Today Chum+Golden only works during a boss. For deep visitors to be catchable it
   would have to be allowed any time (it returns 86% per bite either way). If not, deep visitors could only bite on
   Chum (Shark tier) and pay like a Shark. **Owner's call.**
3. **Pole share.** If diving makes the pole more exciting, more players fish. The pole returns 93-98%, slightly under
   the gun's target, so the table payback shifts a little. The lab will measure it.

## Build and test plan (after the owner says go)

1. Branch, then add a `dive` step to the route system and the shadow drawing (look only).
2. Add the pole bite from shadows and deep visitors.
3. Run the lab: 12 h × 3 seeds, before vs after. Check payback (gun, pole, table), pole spoiled rate, how often a
   shadow bites, Megalodon pole catches per night, and that `lab/pole_audit.js` still passes.
4. Replay a night in the workbench to watch it.
5. Open a pull request with the results.

## Open questions

1. Is about 1 trip in 6 the right amount for divers, and 2-4 deep visitors an hour?
2. Boss bait any time, or deep visitors bite on Chum only?
3. Should whole sardine/minnow schools dive sometimes?
4. ~~Fixed odds or table-wide tide?~~ Answered: fixed odds. The director controls the show only.

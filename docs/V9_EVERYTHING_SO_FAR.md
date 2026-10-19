# Peacock Reef v9 — Everything So Far

As of 2026-10-19. Written by Claude Code for the owner.

## Status: ready for testing

Yes, v9 is ready to test. It passed 12-hour lab runs on 3 seeds with no errors, and the books balanced on every run.

- **Where it lives:** branch `build/pole-market`, [pull request #1](https://github.com/Flovash/Myprojext-Fishing-/pull/1), latest commit 4dabc15.
- **Not on the website yet.** GitHub Pages serves the main branch, which still has v8. Say "merge it" and v9 goes live.
- **Game version:** GAME_VERSION 9.
- **Next step:** real play on the table, then tweak the numbers in the open-decisions list.

## The rules you set

The director runs the show, never the odds. Everything in v9 is built around that.

1. **Fixed odds.** Catch chances never change. Movement, routes and timing never change catch chances or pays.
2. **The director controls the show:** which fish, where, when, and the pace. That show is what makes players win and lose.
3. **Banks decide when, never how likely.** Example: the Golden Koi only swims in when the golden pocket is big enough that the bank is safe.
4. **Gun and pole are separate worlds.** Each has its own algorithm, its own bank and its own fish. They don't affect each other. The fish under the water aren't the fish on the screen.
5. **Same odds for every player.** One player can still get a bigger Tuna than the player across from them. That comes from the fish's mood and weight roll, not a per-player chance.
6. **Season bonus is by weight only.** Hold your fish to the season end and you get a bonus per lb. Sell early and you only get the catch value.
7. **Rare, natural events.** Dives, rituals and deep visitors happen "sometimes, sometimes", so nothing feels busy or predictable.

## What v9 built

Ten build steps, all done and in the game file `game/peacock_reef.html`.

| # | Feature | What it does | Key numbers |
| --- | --- | --- | --- |
| 1 | Two banks | Gun bank and pole bank, each with deposits, payouts, money owed in bags, and tracking by fish and bet size | Every lab run writes `banks.md` |
| 2 | Fixed odds | Scene boosts removed from catch chances. Golden Koi chance fixed. | Koi 8.8%; Koi swims in when pocket ≥ 5,000 (25% risk check at 4,000–5,000) |
| 3 | Market calculator | `lab/market_calc.js` works out sell-now vs hold returns and bonus rates on paper | Reads `route_library/pole/market.json` |
| 4 | Bait market | Shop at every fishing seat: BUY / SELL / BAG tabs. Closes when you switch back to the gun. | Season end pays value + lb × bonus (about 5% of a fish's value) |
| 5 | Underwater world | The pole's own fish. Screen fish don't bite. Middle box where you can't cast. | No-cast box: middle 40% wide × 30% tall |
| 6 | Diving | Some fish sink, swim as a shadow, and come back up on the same route. Some dive and never return. | About 30 dives an hour, one at a time; about 25% are gone for good |
| 7 | Deep visitors | Boss shadows under the water. Boss bait is on sale only while one is there. | Every 12–25 min; needs pole bank ≥ 15,000 (or ≥ 9,000 with 30% risk) |
| 8 | Gun show tools | Pacing so high runs don't come back to back, and a boss risk check | No two high runs in a row |
| 9 | Rituals | Bait Ball, Turtle Parade, The Current, Night Water. A Bait Ball can chain into a Feeding Frenzy. | 5–6 an hour, 8–14 min apart |
| 10 | Bites and feeding | Each fish bites its own way; big fish feed in time windows (next section) | Odds now sit in the bite |

**Market controls:** Button 2 (pole mode) opens it. Left/right scrolls. Button 1 buys (hold to repeat) or sells (hold to sell all). The lock key changes tab. On the keyboard: Q pole, S market, D scroll, W buy and cast, E tab.

**Selling:** sell now = the catch value. Hold to season end (about every 7 min) = value + weight bonus. A player who leaves sells at value.

## Bites under the water

The odds now sit in the bite, because players win most tap fights. The math assumes players land 97% of fights.

| Bite style | Fish | What the player sees |
| --- | --- | --- |
| Peck | Sardine, Anchovy, Minnow | 2–4 quick pecks |
| Nibble | Clownfish, Angelfish, Butterflyfish, Seahorse, Lionfish | 1–3 gentle nibbles |
| Puff | Pufferfish | Slow pokes |
| Strike | Tuna, Barracuda | Hits right away |
| Munch | Turtle | 3–5 slow bites |
| Slash | Swordfish, Marlin | 1–2 slashes |
| Wrap | Octopus | One long pull |
| Circle | Shark, Hammerhead, Manta | Circles the bait 2–4 s first |
| Deep | Megalodon, Kraken, other bosses | Circles far below 4–6 s |

**How a bite plays out:**

1. The bobber dips on each nibble, and the fish shows as a shadow at the bait.
2. **Tease:** some fish sniff and swim off. The bait stays in the water and the cast goes on. Each tease makes the next one half as likely.
3. **Commit:** the fish either takes the bait (you fight it) or bites and leaves with it ("hit it and ran").

**Feeding times (the pole show):**

- Sharks, Hammerheads, Mantas and Marlins feed in windows of 60–150 s. A tag shows "Sharks are feeding below".
- Windows come every 3–5 min when the pole bank is ≥ 5,000, otherwise every 5–9 min.
- During a window those fish are 4× more likely to show up; outside it, 0.15×. Big baits wait longer outside windows.
- Small-fish feeding spells: every 2–4 min, lasting 40–90 s.
- The catch chance itself never changes, only when the fish are around.

## Route library and catalog

Every fish, route, formation and show setting now has its own folder, and the game reads its numbers from there. Change a number in one file and the game picks it up.

| Folder | What's in it |
| --- | --- |
| `route_library/<fish>/` | One folder per fish: `fish.json` (now with bite style and dive chance) and its routes |
| `route_library/pole/` | Bite styles, feeding times, underwater world, deep visitors, market |
| `route_library/rituals/` | One file per ritual (Bait Ball, Parade, Current, Night, Frenzy) and what triggers each |
| `route_library/director/` | Show tools and dive limits |
| `route_library/CATALOG.html` | The scrollable list, rebuilt every time the library changes |

- **Dive spots:** each route marks where its fish can dive, on stretches through open water. 46 routes can dive; 13 that hug an edge or a seat row can't.
- **Small fish on routes:** Anchovy, Clownfish, Butterflyfish, Minnow, Pufferfish, Lionfish and Seahorse now swim their designed routes and formations.
- **Catalog:** [Reef Library Catalog](https://claude.ai/artifact/VrrXNVoeM1xQHSr2DJduso), with tabs for Fish (24), Routes (99, with drawings), Formations (27), Pole, Rituals (5) and Director, plus search and a group filter.

## Lab results

The latest build pays back 88–103% on the table over 12 hours, and the pole holds steady at 95–96%. The target is 97–98% for a week.

| 12-hour run | Table | Gun | Pole |
| --- | --- | --- | --- |
| Seed 1 | 88.1% | 86.6% | 96.1% |
| Seed 2 | 102.6% | 103.6% | 95.0% |
| Seed 3 | 99.8% | 100.5% | 95.1% |
| Fishing-heavy table | 99.4% | 95.0% | 100.3% |

- Tiny, small and medium gun fish land on their design numbers. The gun's swings come from boss and big-fish luck.
- Seed 1 bites: 13,849 started, 2,958 teases, 4,384 taken and fought, 6,494 bit and left.
- Checks: no errors, the books balanced on every run, and the bait-odds audit passes.
- Re-checked 2026-10-19: a 1-hour run plays clean, and the audit passes again (worst z-score 3.2, within chance).

## How to test it

Play it on the computer or the table now; it reaches the website after the merge.

**Where to open it:**

- **Computer or table:** open `game/peacock_reef.html` from the Fish Game Table folder in Google Drive in Chrome.
- **Phone:** watch a recorded lab session in the [Reef v9 Replay](https://claude.ai/artifact/1CwHURp5vZdFPaACHN8fu8), and browse fish and routes in the [catalog](https://claude.ai/artifact/VrrXNVoeM1xQHSr2DJduso).
- **Lab (ask terminal Claude):** 12-hour runs on 3 seeds, or other setups from `lab/environments.json`.

**What to try:**

- [ ] Switch to the pole, open the market, buy bait, cast, sell a fish, and check the bag
- [ ] Cast into the middle box and see it push you to the edge
- [ ] Watch each bite style: pecks, nibbles, circling sharks, teases that leave the bait
- [ ] Wait for a feeding window tag and see big fish bite more
- [ ] Hold fish to the season end and check the weight bonus
- [ ] Watch for dives: a shadow that comes back up on the same route, and some that never return
- [ ] Wait for a deep visitor and buy the boss bait while it's there
- [ ] Catch a ritual: Bait Ball, Turtle Parade, The Current, Night Water
- [ ] Switch back to the gun and check the market closes

## Your decisions and what's left

**Decisions waiting on you:**

- [ ] Merge PR #1 to put v9 on the website (say "merge it")
- [ ] Boss bait: returns 86% by its table, and 17% of casts spoil when the deep shadow leaves. Give it a better deal?
- [ ] Weight bonus size: about 5% of a fish's value, only about 1% of what the pole pays. Bigger?
- [ ] Does a player who leaves keep their bonus? (Now: no, they sell at value.)
- [ ] What happens to leftover bait at the season end?
- [ ] No-cast box: size, and push to the edge vs block the cast
- [ ] Season length: 3, 6 or 9 waves
- [ ] Bite pace, tease chance and feeding-window numbers

**Not built yet:**

- Make Way (fish moving aside for others)
- Ritual routes for every fish (rare rituals when routes line up)
- Wave recipes and formation decks with percentages
- Planned dry-spell types (very high vs very stable stretches)
- Routes that follow another fish (the Anchovy's "Wake rider")
- Bomb Crab, Lightning Eel and boss routes from the library
- Lab players that buy the Golden lure
- Tracking 1-token players and time frames (the director's time advantage)

**Housekeeping:** the play log (dispatch_log.csv) is 51 MB, about half of GitHub's 100 MB limit.

## Links and where this is saved

| What | Where |
| --- | --- |
| This summary (live doc) | [Claude doc](https://claude.ai/code/artifact/a47406f2-b8b4-4d38-90ef-b4e14186d6c1) |
| Google Drive | `Fish Game Table/docs/V9_EVERYTHING_SO_FAR.md` plus a Google Doc copy in the Fish Game Table folder |
| Dropbox | `Peacock Reef — Command Center/04 Claude Responses/` |
| GitHub | `docs/V9_EVERYTHING_SO_FAR.md` on branch `build/pole-market` |
| Pull request | [PR #1](https://github.com/Flovash/Myprojext-Fishing-/pull/1) |
| Catalog | [Reef Library Catalog](https://claude.ai/artifact/VrrXNVoeM1xQHSr2DJduso) |
| Replay | [Reef v9 Replay](https://claude.ai/artifact/1CwHURp5vZdFPaACHN8fu8) |
| Full detail on every number | `docs/V9_GUIDE.md` |

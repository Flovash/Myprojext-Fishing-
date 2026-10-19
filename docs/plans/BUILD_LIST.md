# Build list: market, underwater world, diving, director tools

Written 2026-10-19 by Claude Code from the owner's direction. Order = suggested build order. Nothing built yet.
Plans behind it: `PLAN_bait_market.md`, `PLAN_diving.md`, `PLAN_director_toolkit.md`, `FINDINGS_underwater_plan.md`.

## Owner decisions in this round

- **The director controls the show only. It never changes any odds** (corrected by the owner the same day). The fish
  odds are fixed. The director reads the banks and uses the show (which fish, how many, where, when, diving, deep
  visitors, pace) to shape the night. This answers "fixed odds or tide": **fixed odds.**
- **A no-cast box in the middle of the screen.** Players can fish anywhere outside it, and can't cast inside it.
- **Dive points per fish.** A timer tracks where the fish would be on its route, and it comes back up there.
- **Some dives never come back.** That needs its own rule.
- **Keep it rare:** "just sometimes, sometimes", so the screen never feels busy.
- **The marketplace is the main thing.**

## The list

### A. Foundations (needed by everything else)
1. **Fixed odds; the banks decide *when*, not *how likely*** (owner, 2026-10-19):
   - **Golden Koi:** fixed catch chance. The golden pocket decides **when the Koi is allowed to come**: only when the
     pocket is almost full enough that the bank is safe. The director may take a risk and send it a little early.
     In the market, the Golden lure is only for sale while a Koi is in the water, so nobody buys a 500 bait for nothing.
   - **Wild moods:** same pattern. Each fish's jar decides when a Wild spell may start; while it's Wild, its table is fixed.
   - **Scenes:** drop the gun payback multipliers (Bait Ball ×1.06, Hunt ×0.975, Current ×0.98, Giants ×0.97). Scenes
     stay as show.
   - **Gun and pole never affect each other:** separate algorithms, separate banks. The gun's show reads only the gun
     bank, the pole's show only the pole bank. Today the director's rolling payback mixes both, and a waiting bobber
     sends schools onto the gun's screen (spawn assist). The underwater world replaces that.
2. **Two banks + one total:** gun bank and pole bank, each with balance, in/out, a target, and **reserved** (fish in
   bags not yet sold). The director reads both plus the total.
3. **Tracking:** per fish (points spent on it, points paid), per bait, per seat, per bet size (incl. 1-token), per time
   window. Logged in every lab run.
4. **Math calculator** (`lab/market_calc.js`): put in bait prices, bite chances, pay tables and lb bonus rates, and it
   prints each bait's return, the pole's overall payback, and how much the bonus costs. The lab confirms the numbers.
   This is how we "learn to calculate whatever makes sense" before touching the game.

### B. The marketplace (main feature)
5. **Seat market panel:** opens only in pole mode, beside that seat. Tabs Buy / Sell / Bag. Scroll with the joystick.
   Switching to the gun closes it.
6. **Bait stock:** buy baits ahead. Each cast uses one. Buying is the pole wager.
7. **Fish bag:** every catch is its own fish (kind, mood, weight, catch value).
8. **Sell now:** pays the catch value. **Hold to season end:** catch value + weight-only lb bonus (rate per group,
   or one rate, the owner's call).
9. **Season-end market close:** auto-sell every bag, banner, coins to seats, ledger lines.
10. **Edge rules:** player leaves mid-season, leftover bait at season end, bag limit (if any).
11. **Lab fishers that shop:** buy bait, hold or sell (some patient, some sell right away), so the lab can measure the market.

### C. Underwater world (the pole's side)
12. **Underwater pool:** the pole's own fish population, separate from the gun's screen fish. A cast picks from the
    underwater fish near the bobber, with published weights per bait.
13. **No-cast box:** an invisible box in the middle (draft: the middle 40% wide × 30% tall). Casts aimed inside get
    pushed to the nearest edge of the box, or blocked with a "Too deep here" message. Shown only as a faint outline
    while aiming the pole.
14. **Director pole show tools:** which fish are in the underwater pool and how many, when deep visitors come, when
    fish dive. Odds stay fixed.

### D. Diving fish (the bridge you can see)
15. **Dive points per fish:** each diving fish's routes get 1-2 marked spots where a dive is allowed (`dive` in
    route.json, like `hold`).
16. **Dive and return:** sink at the dive point → shadow → the timer keeps the fish moving along its route underwater →
    it comes back up at the spot the timer has reached. While down, it's in the underwater pool (pole only).
17. **Dive and gone:** a separate rule. The fish sinks and joins the pool for the rest of its life. Draft: only fish
    whose route is near its end, about 1 dive in 4, and the route's last part is freed for other fish.
18. **Deep visitors:** Megalodon, Giant Squid, Kraken, Healer as shadow crossings only.
19. **Rarity budget** ("sometimes, sometimes"), shared by all dives:
    - Max 1 fish diving on screen at a time (2 during a ritual).
    - A table-wide cooldown of about 20-40 s between dives, random so players can't time it.
    - About 1 trip in 6 for divers, deep visitors 2-4 per hour.
    - Never during a boss intro or a big banner.
    - Quiet stretches of a few minutes with no dives at all.

### E. Director tools (after the market works)
20. Wave recipes and formation decks with percentages.
21. Show tide: calm stretches (small, steady fish) and wild stretches (big fish, deep visitors, rituals), not odds.
22. Planned dry spells, soft/hard schools, risk check before big moments.
23. Payout decks for repeated events, intensity pacing (high, then calm), pattern audit.
24. The 6 rituals.

### F. Every step
- Build on a branch → lab 12 h × 3 seeds before vs after → replay to watch → pull request → CHANGES.md.

## Still to decide
1. lb bonus: one rate for all fish, or per group?
2. Player leaves mid-season: keep the bonus or not?
3. Leftover bait at season end: carry over or spoil?
4. No-cast box size, and whether a cast into it is moved to the edge or blocked.
5. Boss bait outside boss waves (for deep visitors)?
6. Season length: 3, 6 or 9 waves?
7. Do item 1 now, or together with the market?

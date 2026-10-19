# Plan: the bait market (shop and sell at each fishing seat)

Written 2026-10-19 by Claude Code from the owner's idea. Idea stage, nothing built.
Related: `docs/BAIT_MARKET.md` (today's baits), `docs/plans/PLAN_diving.md` (underwater world, two banks).

## What the owner wants (their words, cleaned up)

- The market sits **right by each player's fishing hole** (their weapon). It's only there in **fishing mode**; switching
  back to the gun closes it.
- In fishing mode the player can open the **shop and sell** screen, scroll through **their inventory** and the **baits
  they can buy**.
- **Caught fish go into the inventory** instead of paying right away.
- **At the end of every season, the fish sell automatically at the average price.**
- **A player can sell early, but early sales get less.**

## How it would look (per seat, small panel above the seat plate)

```
 ┌─ MARKET ─────────── Season 2 · 1:40 left ─┐
 │  [ BUY ]   SELL    BAG                    │
 │  ◀  Squid        60   ·  you have 2   ▶   │
 │     Puffer, Lionfish, Tuna                │
 │  Button 1 buy · Button 2 next tab         │
 └───────────────────────────────────────────┘
 ┌─ MARKET ──────────────────────────────────┐
 │   BUY   [ SELL ]   BAG                    │
 │  ◀  Turtle 31 lb   season-end 260  ▶      │
 │     sell now: 221  (85%)                  │
 │  Button 1 sell now · hold = sell all      │
 └───────────────────────────────────────────┘
```

- **Controls (joystick):** in pole mode, **Button 2 opens/closes the market** (today it cycles bait).
  - Left/right scrolls.
  - Button 1 buys or sells.
  - Pushing forward switches tabs.
  - **Button 3 (back to gun) closes it.**
  - Aiming and casting work again as soon as it's closed.
- **Tabs:**
  - **Buy:** baits with price, what they catch, and how many you hold.
  - **Sell:** your fish, showing season-end price vs sell-now price.
  - **Bag:** everything you hold, with the total season-end value.
- **Bait inventory:** buy bait ahead (e.g. 5 worms). Each cast uses one from the bag. No points are charged at the
  moment of the cast.
- Only seats in fishing mode show the panel, so the screen doesn't fill with 10 shops at once.

## How the money works

1. **Buying bait** is the pole wager. It goes into the pole bank when bought, not when cast.
2. **A catch** goes into the bag with its size (weight). Nothing is paid yet.
3. **Season-end price** = that fish's **average pay** from its pay table. Optionally, bigger fish of the same kind get a
   bit more and smaller ones a bit less, so weight still matters.
4. **Season end:** everything in every bag sells automatically at the season-end price. Coins fly to each seat, and a
   banner shows "Market closed: Player 3 sold 4 fish for 1,240".
5. **Sell early:** pays a lower share now. Draft: **85%** of the season-end price. Maybe 70% at the start of a season,
   rising to 95% near the end, so waiting pays.

## What this changes in the math (important)

- **Season-end selling at the average price removes the size luck.** Today a Tuna pays 100-300 by weight. In the
  market every Tuna sells for about its average (unless weight-based prices are kept). The pole gets steadier.
- **Early selling lowers the pole's payback.** If everyone always sells early at 85%, the pole pays back 15 points
  less (about 95% → 81%). Two fixes:
  1. **Raise base catch chances so full price comes out a bit above target and early sales land near it.**
  2. **Keep the tables, and treat early selling as the player paying for "points now".**
  The lab will measure how often players sell early.
- **Players who leave mid-season:** unsold fish must not be lost. Draft: cashing out or leaving sells the bag at
  season-end price (or at the early price, if you prefer).
- **Bank:** fish in bags are **owed** points. The pole bank tracks "reserved: fish in bags at season-end price" so the
  director knows what it has to pay at the market close. That's ChatGPT's "reserved payouts" ledger.

## Questions for the owner

1. **Season-end price:** the plain average for that fish, or the average adjusted by its weight?
2. **Early price:** a flat 85%, or rising through the season (70% → 95%)?
3. **Player leaves mid-season:** sell at full season-end price, or at the early price?
4. **Bait bought ahead:** keep it across seasons, or does it spoil at season end?
5. **Market prices:** fixed, or can the director run "market days" (e.g. Tuna sells for +20% this season)? That
   would be the director moving pays, which ties back to the fixed-odds-or-tide question.
6. **Season length** (still open from CLAUDE.md: 3, 6 or 9 waves). It sets how long fish sit in the bag.

## Build and test plan (after go)

1. Lab first: add the bag, bait inventory, season-end sale and early-sell choice to the simulated fishers (some sell
   early, some wait). Measure pole payback, how long points sit in bags, and bank reserve peaks.
2. Then the game: seat panel UI, controls, season-end sale banner, ledger lines (bait sales, fish sold, reserved).
3. 12 h × 3 seeds before vs after, workbench replay, pull request.

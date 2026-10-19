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

## Owner's correction (2026-10-19): the season-end extra is a weight bonus

- A caught fish goes into the bag with its **catch value** (what it's worth today, its normal pay).
- **Sell any time → the catch value.** No penalty, no discount.
- **Keep it until the season ends → catch value + a weight (lb) bonus.** Bigger fish of that kind get a bigger bonus.
- So "selling early gets less" means **you give up the lb bonus**, not that the fish sells below its value.

This replaces the "85% early price" draft below.

**Every catch is its own fish (owner, 2026-10-19).** Two players can both catch a Tuna and get different amounts: one
might be a Wild 110 lb Tuna, the other a Low-mood 25 lb one. Each fish in the bag keeps its own mood, weight and catch
value, rolled from the same tables for everyone. The lb bonus scales with that fish's own weight, so a big Wild fish
is worth more now *and* gets a bigger bonus at season end. Same chances for every player; different luck per catch.

**Where the bonus comes from (math).** Today's pays already average about what the pole should return. If the bonus
is added on top, the pole pays more than now. Options:
1. **Split today's pay into catch value + bonus:** e.g. catch value = 85-90% of today's average, and the lb bonus
   averages the other 10-15% for someone who holds. Holders get today's return; sellers get a bit less, for their points now.
2. **Bonus on top, funded by the pole bank:** pole payback rises by the bonus share for holders. It needs a lower base
   elsewhere to stay on target.

Recommended: option 1. Bonus = (fish's lb ÷ that kind's average lb) × bonus share × catch value, so an average-size fish
gets the average bonus, a big one more, a small one less.

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
 │  ◀  Turtle 31 lb   sell now 225     ▶     │
 │     keep to season end: 225 + 38 lb bonus │
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

1. ~~Season-end price~~ Answered: catch value + lb bonus at season end.
2. ~~Early price~~ Answered: selling early pays the catch value, without the bonus.
3. **Player leaves mid-season:** the bag sells at catch value (no bonus), or they keep the bonus?
3b. **Bonus size:** about 10-15% of a fish's value on average for an average-size fish? Split from today's pay (option 1) or added on top (option 2)?
4. **Bait bought ahead:** keep it across seasons, or does it spoil at season end?
5. **Market prices:** fixed, or can the director run "market days" (e.g. Tuna sells for +20% this season)? That
   would be the director moving pays, which ties back to the fixed-odds-or-tide question.
6. **Season length** (still open from CLAUDE.md: 3, 6 or 9 waves). It sets how long fish sit in the bag.

## Build and test plan (after go)

1. Lab first: add the bag, bait inventory, season-end sale and early-sell choice to the simulated fishers (some sell
   early, some wait). Measure pole payback, how long points sit in bags, and bank reserve peaks.
2. Then the game: seat panel UI, controls, season-end sale banner, ledger lines (bait sales, fish sold, reserved).
3. 12 h × 3 seeds before vs after, workbench replay, pull request.

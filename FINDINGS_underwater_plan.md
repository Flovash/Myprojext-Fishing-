# Findings: ChatGPT's underwater fishing plan vs the current game

Written 2026-10-19 by Claude Code, answering ChatGPT's planning brief (step 7: inspect first, report, test plan, test-only harness).
**No game code was changed.** Checked against `game/peacock_reef.html` (v8). The code is the truth.

## Short answer

- **There is no underwater fish system yet.** The pole only ever bites fish that are on screen and swim into the bobber's circle. Nothing dives, hides or resurfaces. So ChatGPT's sections 2 and 6.7 (diving, invisible shark, resurfacing) are all new work.
- **The pole's dice are honest.** A test-only harness (`lab/pole_audit.js`) re-rolled every bait × fish 200,000 times on 3 seeds. Results match the game's own tables within normal chance (worst z 3.2 out of 120 runs; PASS).
- **Three things in the current game break ChatGPT's director limits (section 4).** Two of them also stretch our own CLAUDE.md rule "the director controls the show, not the odds". They are listed below. They are table-wide, never per player, but they do depend on the bank. **This is the owner's call**, because the director toolkit ideas (tide, payout decks) go further in the same direction.

## 1. How the pole works today (what the code does)

1. **Cast:** the seat pays the bait cost. It is booked as a pole wager (`bookWager('pole')`). The bobber lands with a circle (radius 72-140 px by bait) and waits **30 s**.
2. **Who bites:** the **first on-screen fish that eats that bait and swims into the circle** decides the cast. One roll only (`bobberTick`). Fish that eat the bait steer toward a bobber within 4× its circle radius.
3. **Spawn assist:** if nothing that eats the bait is near for 5 s, the game sends a small school of a fish that does (weighted pick).
4. **The roll** (`biteRow`): nibble chance = bite ÷ 0.9 (max 97%). Miss → "X took the bait" (cast lost). Hit → timing fight.
5. **Fight:** 2-6 green presses by group. A press on yellow or a missed green → "Got away". Swordfish has a 20% "thrashed free" after landing.
6. **Pay:** from the fish's pay table, or lb × points-per-lb. Angelfish has a 5% Golden Angelfish swap (300).
7. **Nothing came in 30 s** → "Bait spoiled" (cast lost).
8. **Specials:** Golden lure spawns its own Golden Koi 2-6 s after the cast. Boss bait (Chum+Golden) only during a boss.

This matches GAME_MATH.md.

## 2. What the pole pays (test-only harness, 3 seeds × 200,000 casts per row)

Return = points paid per cast ÷ bait cost, once that fish has reached the bobber.

| Kind of bait | Returns |
|---|---|
| Base baits (worms, shrimp, squid, combos) | 96-105% on Normal mood |
| Medium (crab, live, squid+crab) | 93-98% |
| Big (mackerel, chum, live+mackerel) | 88-91% |
| Boss bait | 86% |
| Moods | Low 82-92%, Wild 110-119%, Shark Frenzy 88% |

In the 12-hour lab runs the pole as a whole paid **93.6-98.0%** (last 11 runs). Full table: `reports/pole_audit_2026-10-19.md`.

## 3. Conflicts with ChatGPT's plan (and with "the director controls the show, not the odds")

| # | What the code does | Bank-dependent? | ChatGPT's rule it breaks |
|---|---|---|---|
| A | **Golden Koi chance depends on the golden pocket balance:** 5% when it's under 5,000, 8.8% normal, 11% over 15,000 (`koiChance`). | Yes | "Must not change fishing math to protect the bank" |
| B | **Pole moods are capped by each fish's jar:** Wild mood (110-119% return) is only allowed when that fish's jar can pay for it; otherwise the fish stays Normal (`directorTick`). | Yes | Same |
| C | **Scenes scale gun catch chances:** Bait Ball ×1.06, The Hunt ×0.975, The Current ×0.98, Giants ×0.97 (`liveP`). The director picks spike/roller shapes when the bank is ahead and "recover" when players are ahead (`chooseShape`, reads `rollingPB`). | Yes | "Must not secretly change catch probability based on bank balance" |
| D | **Which fish bites depends on movement.** On worms, a sardine in Normal mood returns 104%, an anchovy 98%. So routes decide part of a cast's value. | No | Law zero (mild) and ChatGPT §2 "routes must not alter odds" |

Fine under ChatGPT's rules: the per-cast rolls (no player identity, no recent-win checks), bait prices and pay tables (fixed), and the Sardine/Minnow seesaw (it averages to 1 and is on a timer, not the bank).

**My read:** A, B and C are the game's "bank" features. They are honest in one sense: everyone at the table gets the same odds at the same moment. But they are exactly what ChatGPT says not to do. They are also what your director toolkit plan builds on (tide, payout decks). Since it's points only between friends, nothing legal forces either way. It's a design choice: **a fixed-odds game where the director only runs the show**, or **a director with a table-wide tide**. You need to pick one before the underwater system is built, because it decides whether hidden fish can be part of the tide.

## 4. Accounting today vs ChatGPT §3

| ChatGPT wants | Today |
|---|---|
| Gun ledger | ✅ `ledger.gunW / gunP`, plus per group (`byGroup`) |
| Pole ledger | ✅ `ledger.poleW / poleP`, plus per bait: cast, spoiled, took, lost, landed, wagered, paid |
| Shared bank: deposits, withdrawals, balance | ⚠️ Only totals (`totW / totP`) and a rolling payback that fades over ~10 min. Credits added at a seat aren't booked as a deposit. There is no opening/closing balance. |
| Side pockets | Golden pocket (Koi) and one jar per moody fish exist, but aren't in a ledger report |
| Reserved / outstanding payouts | ❌ none |
| "Bank can't cover a payout" policy | Not needed so far: points only, so the game always pays |
| Operating expenses (electricity) | ❌ none. Should stay outside the game. |
| Ledger reconciliation | ✅ the lab checks its per-player totals against the game's ledger every run |

## 5. ChatGPT's §5 "first fish into the circle" vs an underwater population

They conflict. Today the cast is decided by **visible movement**. An independent underwater population means the cast is decided by **a roll over hidden fish**. A cleaner version that keeps law zero:

1. At the cast, the game builds the **eligible list**: fish that eat this bait, visible in the circle **or** in the underwater pool near that spot.
2. It picks one with **fixed published weights** (not by bank).
3. Then the **same `biteRow` roll and fight** as today.
4. It logs everything (ChatGPT §6.2).

It's still a proposal, waiting on your answers below.

## 6. Test plan (test-only, before any game change)

1. ✅ **Pole roll audit** (`node lab/pole_audit.js`): every bait × fish, theory vs simulation, 3 seeds. Done: PASS.
2. **Cast log** in the lab: one row per cast with bait, cost, eligible fish, chosen fish, nibble, fight, escape, pay, bank before/after. It would add to the lab only, not the game.
3. **Ledger with balances:** opening + in − out = closing, per night, plus golden pocket and jars as sub-ledgers.
4. **Same-conditions check:** identical seeds with different seat orders and players give identical per-cast odds.
5. **Edge cases in an isolated harness:** no eligible fish, several at once, fish leaves mid-cast, hidden shark, resurface, 30 s timeout, seat leaves mid-fight.
6. **Prototype the underwater pool in the harness only.** 12 h × 3 seeds against today's pole: payback, spoiled rate, wait time.
7. **Tolerance:** pass if every row is within 4 standard errors and the pole as a whole sits within its target ±1.5 points over 3 × 12 h.

## 7. Questions for you (the owner)

1. **Fixed odds or table-wide tide?** Keep A/B/C (and build the toolkit's tide), or make the director show-only like ChatGPT says?
2. **Underwater pool or first-fish-into-the-circle?**
3. **Can a fish bite while hidden?** Including the Shark?
4. **Which fish dive at all?** E.g. Turtle, Manta, Shark, Octopus yes; schools no?
5. **Pole target:** big baits return 88-91% and boss bait 86%. Is that on purpose, or should the pole aim at 97% like the gun?
6. Do you want **credits added** booked as deposits so the shared bank has a real balance?

Nothing will be built until you answer.

## Owner's answer (2026-10-19)

Questions 2-4: "hidden" means some fish **look like they dive** and come back up on the **same route**, not all of them,
just sometimes, so pole players feel "maybe I can catch the Megalodon". So: no separate underwater population. A diving
fish is a shadow that can still bite a bobber under the existing "first fish into the circle" rule. Design:
`docs/plans/PLAN_diving.md`.

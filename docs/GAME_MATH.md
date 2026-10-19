# GAME_MATH.md — how Peacock Reef pays (gun and fishing pole)

For terminal Claude. Every number here is taken from game/peacock_reef.html (the code is the truth;
if this file and the code disagree, the code wins, and fix this file).
Put this file in the repo at docs/GAME_MATH.md and point CLAUDE.md to it.

THE GUN AND THE FISHING POLE ARE TWO DIFFERENT MATH SYSTEMS. Never mix them.
- Gun: every bullet that hits is a separate roll. Odds come from group payback / average multiplier.
- Pole: every cast costs a fixed bait price and gets ONE roll. Odds come from bite tables per bait.

---------------------------------------------------------------------------------------------------

## LAW ZERO (never changes)

- Movement, routes, waves and the director's show NEVER change catch chances or pays.
- No per-player odds. Everyone at the table gets the same math at the same moment.
- Payback targets: gun ~97.5% on normal (TARGET easy .995 / normal .975 / hard .945).
  Owner goal: about 97–98% weekly.

---------------------------------------------------------------------------------------------------

## PART 1 — THE GUN

### 1.1 Group paybacks (P)
| group   | pb   | pays      |
|---------|------|-----------|
| tiny    | 0.98 | 2–6x      |
| small   | 0.98 | 2–15x     |
| medium  | 0.97 | 8–50x     |
| big     | 0.95 | 80–500x   |
| boss    | 0.90 | 300–1200x |
| special | 0.95 | chain     |

Each fish has its own range (lo–hi), e.g. Shark 100–400x, Tuna 8–15x.

### 1.2 The live P for a fish (function liveP)
P = group pb × difficulty × scene pb × seesaw (Sardine/Minnow only), clamped 0.80–1.15
- difficulty DIFF: easy 1.02, normal 1.00, hard 0.97
- scene pb: Morning Reef 1.0, The Hunt 0.975, Bait Ball 1.06, Turtle Parade 1.0, Night Water 1.0,
  The Current 0.98, Giants 0.97, Boss 1.0
  (scenes are short; the director balances hot and cold scenes so the night lands on target)

### 1.3 Gun moods — "Stable" vs "Swingy" (per group)
Each group flips mood on its own clock (every 60–180 s): Stable 60% of the time, Swingy 40%.
- Stable (k=3): pays stay near the low end of the range.
- Swingy (k=1): pays land anywhere in the range.
- average multiplier = lo + (hi − lo) / (k + 1)
- paid multiplier   = lo + (hi − lo) × random^k

### 1.4 Catch roll on every hit (function resolveHit)
chance = min(0.95, P / averageMultiplier(mood))
If caught: pay = paid multiplier × bet.
So whatever the mood, expected return per hit = P. A swingy fish pays bigger but is caught less often.

### 1.5 HOT and COLD — the Sardine/Minnow see-saw
Every 15–30 s the see-saw picks: cold 25%, even 50%, hot 25%.
| state | Sardine P × | Minnow P × |
|-------|-------------|------------|
| cold  | 0.8776      | 1.1224     |
| even  | 1.0         | 1.0        |
| hot   | 1.1224      | 0.8776     |
When Sardines are hot, Minnows are cold, and the other way round. The states average to 1,
so the long-run payback does not move; it only makes the table feel alive ("the Sardines are hot!").

### 1.6 Golden Sardine
About 1 in 700 Sardine hits (0.0014) pays 50x. Normal Sardines give up 0.07 of P to fund it.

### 1.7 Specials (Bomb Crab, Lightning Eel)
chance = min(0.9, P / (own value + sum of average multipliers of everything it would catch))
- Crab: own 10x, catches everything within radius 150.
- Eel: own 12x, chains to up to 6 nearby fish.
A crowded crab pays more but hits less. Expected return stays P (0.95).
Never chains big fish, bosses, specials or pole-only fish.

### 1.8 Ledger and the director
- Every bet and pay is booked (gun and pole separately) plus a rolling payback that decays
  (10-minute half-life style: ×exp(−dt/600)).
- Each wave the director picks a shape from the rolling payback:
  - players ahead (pb > target + 3%) → "recover" (quieter)
  - bank ahead (pb < target − 3%) → "spike" or "roller" (spend it on fun)
  - else a weighted mix; 12% of waves are experiments ("storm" / "giants").
- The director changes the SHOW (scenes, which fish swim), never a single shot's math beyond the
  scene pb values above.

---------------------------------------------------------------------------------------------------

## PART 2 — THE FISHING POLE

### 2.1 How a cast works
1. Pick a bait; the cast costs the bait price (points, booked as "pole" wager).
2. The bobber waits up to 30 s. The FIRST fish that eats this bait and swims into the circle decides the cast.
3. ONE roll: nibble chance = bite / 0.9 (capped 0.97).
4. If it nibbles, a timing fight starts. The average player lands ~90% of fights (FIGHT_AVG = 0.9),
   so overall chance ≈ bite.
5. Landed → pay from that fish's pay table. Swordfish can still thrash free (escape 20%).
6. Missed fight → "Got away". A cast where no fish comes is "spoiled".

Fight difficulty by group (hits needed, green-zone size): tiny 2/0.72, small 3/0.62, medium 4/0.52,
big 5/0.44, boss 6/0.36, special 6/0.36.

### 2.2 Baits (cost → fish it attracts: bite, pays in points)
- Worms 15: Sardine (moody), Minnow .40 [35/38/40], Anchovy .25 [55/60/65], Clownfish .28 [30–100]
- Shrimp 30: Clownfish (moody), Angelfish .35 [70/75/80, 5% Golden Angelfish = 300], Butterfly .25 [110–130], Puffer .27 [60–200]
- Squid 60: Puffer (moody), Lionfish .20 [290], Tuna .29 [20–60 lb × 5]
- Crab 80: Tuna (moody), Turtle .30 [250/260/270]
- Live bait 120: Barracuda .60 [170–210], Swordfish .255 [500–900, escape 20%]
- Mackerel 160: Hammerhead .15 [900–1000]
- Chum 200: Shark (moody), Manta .30 [580–620]
- Golden lure 500: Golden Koi only (pocket, see 2.5)
- Combos: Worms+Shrimp 45, Squid+Crab 140, Shrimp+Crab 110, Live+Mackerel 280 (Marlin .117 [2000–2400]),
  Chum+Golden 700 (bosses only, during boss scenes: bite .04, pays 15000)

### 2.3 HOT and COLD on the pole — fish moods on their home bait
Five "moody" fish change mood every 15–30 s, each on its own clock:
| fish      | bait  | Low (cold)           | Normal               | Wild / Frenzy (hot)        |
|-----------|-------|----------------------|----------------------|----------------------------|
| Sardine   | Worms | 25%, bite .80, 15–30 | 50%, .58, 15–50      | 25%, .26, 45–130           |
| Clownfish | Shrimp| 25%, .77, 30–60      | 50%, .56, 30–100     | 25%, .245, 90–260          |
| Pufferfish| Squid | 40%, .75, 60–120     | 20%, .54, 60–200     | 40%, .245, 180–520         |
| Tuna      | Crab  | 30%, .72, 80–160     | 40%, .39, 20–60 lb×5 | 30%, .195, 60–120 lb×5     |
| Shark     | Chum  | —                    | 75%, .12, 1400–1600  | Frenzy 25%, .45, 350–450   |
Low = bites a lot, pays small (cold). Wild = bites rarely, pays big (hot).

### 2.4 The mood jar (keeps hot moods paid for)
Each moody fish has a jar.
- Every cast in Low mood puts the difference (Normal EV − Low EV) into the jar.
- Every cast in Wild mood takes the difference out.
- A Wild mood is only allowed if that fish's jar holds at least 1.5 × bait cost; otherwise it stays Normal.
So hot streaks are always funded by earlier cold streaks. Payback holds over time.

### 2.5 Golden pocket (Golden Koi)
- Starts at 5000. Every cast feeds it: medium baits 2% of cost, big/boss baits 4%, Golden lure 100%.
- Golden lure: a Koi arrives 2–6 s after the cast, only for the player who cast.
- Bite chance depends on the pocket: under 5000 → 5%, 5000–15000 → 8.8%, over 15000 → 11%.
- A Koi pays 5000, taken from the pocket.

### 2.6 What the lab has measured (terminal Claude's runs)
- Pole payback steady at 95–99%. Gun table payback 82–100% over 4 h (needs 12 h+ runs with several seeds).
- Open design question for the owner: missed gun shots are lost bets, which hits Newbies hardest.
  Do not change this without the owner's approval.

---------------------------------------------------------------------------------------------------

## Rules for any change to this math
1. Never change odds or pays without the owner saying so. The director changes the show only.
2. Any change: run the player lab for 12 h × at least 4 seeds, before and after, and report gun and
   pole payback separately, per group, per bait.
3. Hot/cold systems (see-saw, gun moods, pole moods, jars, pocket) must average out. If a change
   makes one side stop averaging out, it's a bug.

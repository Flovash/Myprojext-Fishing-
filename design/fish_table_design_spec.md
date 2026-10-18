# Fish Table Game Design Spec

October 17, 2026

## 1. Overview

A custom 10-seat fish table game for home use, points only, built to keep friends coming back. The bank targets 97–98% payback over a week.

- Two weapons: the gun (fast, shared, thrill side, same odds for everyone) and the fishing pole (personal, strategic, survival and income).
- 1 coin = 100 points.
- The one balance rule everywhere: chance × average pay = payback × cost. Change one side and the other follows.
- Moods, seesaws, jars and scenes only change when things pay, never the average.
- The director picks scenes and timing; it never changes a shot or cast after it happens.

## 2. Controls and table layout

| Control | Gun | Pole |
| --- | --- | --- |
| Joystick | Aim | Aim the cast |
| Double push forward | Lock on to nearest fish; left/right switches target; double forward again releases. Free, no odds change | — |
| Double pull back | Switch gun / pole | Switch pole / gun |
| Shoot | Fire | Cast |
| Enhance | Bet 1–100 per shot | — |
| Type | — | Cycle bait; press again to add a second bait (combo) |
| Up / down during a cast | — | Shrink or loosen the scent circle |

- No weak spots. Bullets bounce off walls and off fishing bubbles.
- Fire rate starting point: about 1.5 shots/sec.
- Screen layers: the pond (center, never moves), the frame (sketch paper edges or visor), the world outside (slow, dim, at the corners). A cast gives a local half-second slow-mo ring on that seat only.

## 3. Gun: groups, ranges and catch chances

Payout = multiplier × bet. Catch chance per shot = group payback ÷ average multiplier. Same odds for every player at every bet; no boosts, no bet checks.

| Group | Payback | Fish | Range | Avg | Catch |
| --- | --- | --- | --- | --- | --- |
| Tiny | 98% | Sardine | 2–3x | 2.4x | 41% |
| Tiny | 98% | Anchovy | 2–5x | 3.3x | 30% |
| Tiny | 98% | Clownfish | 3–5x | 3.8x | 26% |
| Tiny | 98% | Butterflyfish | 3–6x | 4.2x | 23% |
| Small | 98% | Minnow | 2–10x | 4x | 24.5% |
| Small | 98% | Angelfish | 3–8x | 4.8x | 20% |
| Small | 98% | Pufferfish | 4–7x | 5.2x | 19% |
| Small | 98% | Lionfish | 5–10x | 7x | 14% |
| Small | 98% | Seahorse | 6–15x | 9.5x | 10.3% |
| Medium | 97% | Tuna | 8–15x | 11x | 8.8% |
| Medium | 97% | Barracuda | 10–25x | 16x | 6.1% |
| Medium | 97% | Octopus | 12–30x | 19x | 5.1% |
| Medium | 97% | Swordfish | 15–35x | 23x | 4.2% |
| Medium | 97% | Turtle | 20–50x | 32x | 3.0% |
| Big | 95% | Hammerhead | 80–150x | 108x | 0.88% |
| Big | 95% | Shark | 100–400x | 200x | 0.48% |
| Big | 95% | Manta ray | 150–300x | 210x | 0.45% |
| Big | 95% | Marlin | 150–500x | 280x | 0.34% |
| Boss | 90% | Healer Jellyfish | 300–500x | 380x | 0.24% |
| Boss | 90% | Megalodon | 400–800x | 560x | 0.16% |
| Boss | 90% | Giant Squid | 500–1,000x | 700x | 0.13% |
| Boss | 90% | Kraken | 800–1,200x | 960x | 0.094% |

- Moods: Stable (~60% of the time; pays near the low end, higher catch) and Swingy (~40%; pays up to the top, lower catch). Same average either way. Each group can switch on its own clock every 1–3 min.
- Wild fish: hot pays ~3x more and is ~3x harder; cold is the reverse.
- Sardine ↔ Minnow seesaw: Sardine cold 25% (36% catch, ~86%), even 50% (~98%), Sardine hot 25% (46% catch, ~110%); Minnow mirrors.
- Golden Sardine: normal Sardine 38% catch (~91%) plus ~1 in 700 shots at Sardines becomes a 50x Golden Sardine (+7%) = ~98%.
- Specials: Bomb Crab (20–150x total), Lightning Eel (30–200x), Treasure Turtle (50–300x), golden variants (2x). Chance = payback ÷ average total multiplier.
- Hot patterns are kept short and hidden (15–30 sec) or capped near 105% so players can't time big bets into them.
- Thrill targets (20-min session): 10–30x about every minute, 100x+ about every 5 min, 300x+ about once a session, 1,000x rarely.

## 4. Gun balance engine (the director)

| Layer | Length | Controls |
| --- | --- | --- |
| Pattern / scene | 15–90 sec | Hot, Dry, Tease, Spotlight, Bait Ball |
| Wave | 2–5 min (avg ~3) | Shape: Calm, One spike, Rollercoaster, Tension build |
| Arc | 3–6 waves | Boss Saga, Rising Tide, Journey, Comeback, Season Opener |
| Cycle | ~30 min | Short-term ledger |
| Block | 3 hours | Main balance target |
| Week | — | Final target: 97–98% |

- Per wave (10 players, avg bet 8, 1.5 shots/sec, 70% active): ~15,000 points wagered; bank keeps ~3% on average; short stretches swing hard.
- Risk budget: about −3,000 per wave, −10,000 per cycle, back on target by end of each 3-hour block. Any shortfall carries forward; never written off.
- Recovery is gentle (calm, hunt, boss scenes). Floor ~92% for any scene.
- Surplus is spent on fun (Bait Balls, spotlights, hot seesaws).
- Experiments: 10–15% of waves are wild tries (All Giants, Double Boss, Tiny Storm, Silent Recovery, Surprise Spike) with fixed payback; stop early if people leave or the bank drops fast.
- Long game (needs weeks of logs): generous openings, save for the weekend, comeback nights, multi-day events, bigger risk budget once variance is known.
- Decision rhythm: every shot is logged; the director re-evaluates every 2–5 sec and at scene ends.
- Settings sliders: volatility, chaos frequency, boss rhythm, arc length, wildcard rate, predator aggression, biome mix, tells on/off, movement speed, pattern variety, bank target, risk budget.
- Engagement signals: seats filled/joining/leaving, shots per minute, bet changes, idle seats, session length, return visits. Train on return visits as well as session length.

## 5. Scenes, roles and movement

Waves are built from premade scenes (20–40 sec) assembled live. Example wave: Morning Reef (~99%) → The Hunt (~96%) → Bait Ball (~108%) → Boss (~90%) ≈ 96%.

| Role | Fish | Behavior |
| --- | --- | --- |
| Swarm | Sardine, Anchovy | Big fast schools, flocking |
| Reef | Clownfish, Butterflyfish | Slow drifting loops |
| Runner | Minnow | Zigzag |
| Glow | Angelfish | Golden flashes |
| Blocker | Pufferfish | Soaks bullets |
| Escort | Lionfish | Guards big fish |
| Drifter | Seahorse | Rare, slow |
| Hunters | Barracuda, Swordfish | Chase swarms |
| Cruisers | Tuna, Turtle, Octopus | Evolving sine waves, figure-8s |
| Giants | Big fish, boss | Grand paths, U-turns |

- Temperaments: Anchors (Sardine, Clownfish, Tuna, Turtle, Hammerhead), Swingers (Minnow, Angelfish, Barracuda, Shark, Marlin), Wildcards (specials).
- Group rules (same range): seesaw, shared mood, spotlight, golden variant.
- Cross-group rules: escort, predator chase, chain, jar link.
- Regulars: Ghost Marlin (returns bigger each wave up to 3, same average), Lucky Seven (catch all 7 for a 30x bonus), Old Turtle.
- Tells: lantern fish → Night Water; bird shadows → Bait Ball; remoras → Shark; bubbles from the bottom → Boss.
- Linked fish: mates (catch one, its mate panics and pays double briefly), rivals (Barracuda vs Swordfish fight; winner pays more), followers (catching them slows the big fish).
- One wildcard slot per scene (Golden fish, Treasure Turtle, Bomb Crab, Lightning Eel, Mystery Egg), max once per wave.
- Per wave (~3 min): Tiny 210, Small 190, Medium 90, Big 30, Boss 1 (~521 total, ~37 on screen).
- Spawn in schools: Tiny 5–8 every 5–6 sec; Small 3–6 every 4–5 sec; Medium 1–3 every ~4 sec; Big 1 (+escorts) every ~6 sec.
- Crossing times: Tiny/Small 8–12 sec; Medium 15–20 sec; Big 20–30 sec; boss 60–90 sec. Next group enters when the current one is ~2/3 across. Max 2 big fish on screen.
- Movement types: fixed signature formations, adaptive behaviors (flocking, flee, chase, bait pull, avoid bubbles), evolving loops that change every 2–3 waves (speed, side, direction, height, size).
- Pattern library: straight, sine, zigzag, circle, figure-8, spiral, V-formation, curtain, scatter burst, U-turn, dive and rise.
- Boss fix: the boss is caught only ~1 in 10 waves at 5% of shots; use focus fire during boss waves, a longer stay, or a team-raid health bar.

## 6. Fishing pole: baits and fish

One bite per cast. "Bite" = the chance a fish takes the bait and is landed when it swims into the circle.

| Bait | Fish | Style | Bite | Pays | Payback |
| --- | --- | --- | --- | --- | --- |
| Worms (15) | Sardine | Moody | see below | 15 → 130 | ~105% |
| Worms (15) | Minnow | Steady | 40% | 35 / 38 / 40 | ~100% |
| Worms (15) | Anchovy | Steady | 25% | 55 / 60 / 65 | ~100% |
| Shrimp (30) | Clownfish | Moody | see below | 30 → 260 | ~100% |
| Shrimp (30) | Angelfish | Steady + Golden | 35% | 70 / 75 / 80; 1 in 20 Golden 300 | ~100% |
| Shrimp (30) | Butterflyfish | Steady | 25% | 110 / 120 / 130 | ~98% |
| Squid (60) | Pufferfish | Big swings | see below | 60 → 520 | ~97% |
| Squid (60) | Lionfish | All or nothing | 20% | 290 flat | ~97% |
| Crab (80) | Tuna | Moody, sizes | see below | 80 → ~450 | ~97% |
| Crab (80) | Turtle | Steady | 30% | 250 / 260 / 270 | ~97% |
| Live bait (120) | Barracuda | Hustler | 60% | 170 / 190 / 210 | ~93% |
| Live bait (120) | Swordfish | The Price | 25.5% | 500 / 600 / 750 / 900; 1 in 5 escapes | ~95% |
| Mackerel (160) | Hammerhead | Steady big | 15% | 900 / 950 / 1,000 | ~89% |
| Chum (200) | Shark | Frenzy moods | see below | 350 → 1,600 | ~89% |
| Chum (200) | Manta ray | Gentle giant | 30% | 580 / 600 / 620 | ~90% |
| Golden lure (500) | Golden Koi | Pocket | 8.8% | 5,000 | ~88% |

Three-amount pays split 40 / 40 / 20%. Ladders split 20 / 30 / 30 / 10 / 10% unless noted.

Moods:

| Fish | Low (busy) | Normal | Wild |
| --- | --- | --- | --- |
| Sardine | 25% of time; 80% bite; 15 (85%) / 30 (15%) | 50%; 58%; 15/20/30/40/50 | 25%; 26%; 45/55/70/90/130 |
| Clownfish | 25%; 77%; 30 (85%) / 60 (15%) | 50%; 56%; 30/40/60/80/100 | 25%; 24.5%; 90/110/140/180/260 |
| Pufferfish | 40%; 75%; 60 (90%) / 120 (10%) | 20%; 54%; 60/80/120/160/200 | 40%; 24.5%; 180/220/280/360/520 |
| Tuna | 30%; 72%; 80 (85%) / 160 (15%) | 40%; 39%; 20–60 lb → ~200 | 30%; 19.5%; 60–120 lb → ~450 |
| Shark | — | 75%; 12%; 1,400 / 1,500 / 1,600 | Frenzy 25%; 45%; 350 / 400 / 450 |

- Moods switch quietly every 15–30 sec in no set order.
- Jars: each moody fish has its own jar. Low casts feed it (~2 points per Worm cast); Wild only turns on when the jar can pay for it.
- Squid is the crossroads: players either level up to medium bait or drop back down.
- Risk is the balance, not the odds: keep ~20 casts' worth of balance (Worms ~300, Shrimp ~600, Squid ~1,200).

Exceptions (only cross-bait bites): Clownfish on Worms, Pufferfish on Shrimp, Tuna on Squid. A fish won't bite bait worth more than it pays.

Combos (two baits on one hook; cost = both):

| Combo | Fish | Bite | Pays | Payback |
| --- | --- | --- | --- | --- |
| Worms + Shrimp (45) | Seahorse (combo only) | 30% | 140 / 150 / 160 | ~100% |
| Worms + Shrimp (45) | Angelfish | 53% | 70–80; 1 in 20 Golden 300 | ~100% |
| Worms + Shrimp (45) | Butterflyfish | 38% | 110 / 120 / 130 | ~100% |
| Squid + Crab (140) | Octopus (combo only) | 28% | 460 / 480 / 500 | ~96% |
| Squid + Crab (140) | Lionfish | 46% | 290 flat | ~96% |
| Squid + Crab (140) | Turtle | 52% | 250 / 260 / 270 | ~96% |
| Shrimp + Crab (110) | Swordfish | 23% | 500–900; 1 in 5 escapes | ~95% |
| Live bait + Mackerel (280) | Marlin (combo only) | 11.7% | 2,000 / 2,200 / 2,400 | ~92% |
| Live bait + Mackerel (280) | Hammerhead | 27% | 900 / 950 / 1,000 | ~92% |
| Chum + Golden (700) | Wave boss | 4% | ~15,000 | ~85% |

Combos scare off small fish. Unlisted pairs act like the more expensive bait.

## 7. Fishing systems

- Scent circle radius: base ~150 px, medium ~200, big ~250, golden ~300. Long Rod adds 30%.
- Circle overlap: under 25% nothing special; 25–60% combo zone (even across players); over 60% crowded, bites drop unless it's a combo pair.
- Repel rules: Chum scares small fish; Golden lure scares everything except the Koi; Squid next to Worms scares Sardines.
- Fight: fish icon flashes green / yellow. Press on green, let go on yellow. Miss a green or press on yellow and it escapes. Greens needed: small 2, steady 3, big hitter 4, medium 4, big 5, Koi/boss 6. Several fish fight one at a time, smallest first. Skill nudges landing about ±5%.
- Bait spoils after 30 sec. The timer pauses while bullets spook the fish.
- Bubbles: bullets bounce off a fishing bubble; fish inside are safe.
- Rods (pick one per session): Swift beats Fast fish, struggles with Heavy; Heavy beats Heavy, struggles with Tricky; Flex beats Tricky, struggles with Fast. In shared circles a fish picks a line 3 : 2 : 1 by rod match. Matched rod: greens 20% wider; wrong rod: 20% narrower. Rods never change bite chances.
- Fish types: Fast (Sardine, Anchovy, Butterflyfish, Barracuda, Swordfish, Marlin, Megalodon), Heavy (Pufferfish, Tuna, Turtle, Hammerhead, Shark, Kraken), Tricky (Minnow, Clownfish, Angelfish, Lionfish, Seahorse, Octopus, Manta ray, Giant Squid, Healer Jellyfish).
- Fisher upgrades: Long Rod (bigger circle) and Bait Saver (escaped fish don't eat the bait).
- Golden lure pocket (hidden): fed by 2% of medium bait, 4% of big bait and every lure bought. Koi odds about 1 in 11 normally, about 1 in 20 if the pocket is under 5,000, about 1 in 9 if over 15,000. Pays 5,000 from the pocket.
- Inventory and market: catches go to inventory; sell any time. Sell price changes by season demand: Hot +25%, Normal, Low −20%. Fish spoil after 2 seasons. Base values sit about 5% lower to pay for patient sellers.
- Selling bonuses are off for now. Later version: rod bonus +3%, weight bonus only for heavy fish, no minimum per fish.
- During dream drops, fishing pauses: lines reel in, bait timers freeze.

## 8. World

- Lore: the world is a digital ocean that's glitching. Fishing is survival and income; the gun is a stabilizer that locks glitched creatures back into place and turns them into points.
- Seasons (2–4 waves each): Winter (Japan, Hokkaido; calm, Heavy rod season, Tuna in demand), Monsoon (Bay of Bengal; best fishing season, about +3% for fishing, funded by the gun running cooler), Summer reef (Australia; lively, more golden fish, reef fish in demand).
- The background stays the same ocean; seasons show through overlays (light, weather particles, colors, music).
- Captain Rio flies a seaplane between stops; 8–12 sec cutscenes play over the ocean while fish keep swimming. Guest pilots sometimes take other routes. Sometimes a transition turns into a mission (bonus round with a fixed payback).
- Sketch Man: the ocean is his drawing; his hands and paper edges show at the corners. Scene changes are page turns (pencil lines, then color fills in). Glitches are ink smudges.
- Dream drops (rare, short): On top of the TV, Kingdom Gates → Space (the king turns into an alien), Cloud Kingdom, bathtub, kid's aquarium, desert mirage, lava lamp.
- Dream drop rules: same sizes and hitboxes, value ring on every creature, paths fair to all 10 seats, calm background under the fish, same odds, 2–3 sec teleport.
- Toy box: every creature has fixed stats wherever it appears. New creatures copy an ocean fish's stats (UFO = Octopus, Rubber Duck = Clownfish, Wind-up Fish = Pufferfish, Comet = Marlin, Alien King = Kraken).
- Value rings: gray tiny, green small, blue medium, gold big, red boss. Glowing trail = hot/wild; sparkle trail = golden.
- Art hand-off: PNG with transparency or SVG, facing right, one consistent view; sizes roughly tiny 32 px, small 48, medium 80, big 160, boss 320+; ring drawn by the game; 4–8 frame swim loops; names like medium_ufo_01.png.

## 9. Algorithms

Gun, per shot:

```
on_shot(seat, bet):
  balance[seat] -= bet
  fish = first creature the bullet hits (lock-on just aims)
  P = group payback adjusted by current state (states average to group P)
  avg_m = average multiplier for this fish in the current mood
  chance = P / avg_m
  if random() < chance:
      m = draw multiplier from fish's range for this mood
      pay seat m × bet; remove fish
  log(seat, bet, fish, hit, pay)
```

Director, every 2–5 sec and at scene ends:

```
ledger = total_wagered × target − total_paid
if ledger < risk floor    → recovery shapes (Calm, Hunt, Boss)
if ledger > comfort level → spikes, Bait Balls, spotlights
read table energy → choose next scene and dials
10–15% of choices are experiments with fixed payback
hot states only turn on when their jar can pay
settle at wave → cycle → block → week
```

Fishing, per cast:

```
on_cast(seat, bait):
  balance[seat] -= bait cost
  radius = bait size (+30% Long Rod)
  for each fish entering the circle:
      skip if it doesn't eat this bait
      if random() < bite(fish, bait, mood):
          run the green/yellow fight (skill ±5%)
          pay = draw from the fish's pay table
          Swordfish: 1 in 5 escapes → 0
          add to inventory; end the cast
  bait spoils at 30 sec (paused while spooked)
```

Logging: every shot and cast (seat, bet or bait, fish, hit or miss, pay), every wave (shape, scenes, in/out), every seat (session length, start/end balance, style), every block (payback vs target), and engagement signals.

## 10. Open items and next steps

1. Build the simulator: thousands of fake sessions across settings to confirm the bank lands on target.
2. Godot prototype: one screen, a few creatures, one seat.
3. Boss raid design (health bar, phases, assist rewards).
4. Net / laser / technologies (Fish Train) are parked.
5. Hardware: I/O board model number still needed; power supply short not yet found.
6. Train the director from logs once real play data exists.

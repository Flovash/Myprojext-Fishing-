# Bait market: what each bait costs and what it catches

Taken from `game/peacock_reef.html` (v8) on 2026-10-19 by Claude Code. The code is the truth.
Starting point for the owner's bait market idea (a shop screen where players pick bait).

**How to read it.** Catch % = the chance a cast lands that fish once it reaches the bobber. The game rolls a nibble
(catch % ÷ 0.9), then the player has to win the fight; an average player wins about 90% of fights. Pays are in points.
Return = average points back per point spent on that bait, once that fish arrives (bait that spoils in 30 s with no
fish isn't counted).

## Today's baits

| Bait | Cost | Tier | Catches (catch % · pays) | Return |
|---|---|---|---|---|
| Worms | 15 | base | Sardine (moody, see below) · Minnow 40% · 35-40 · Anchovy 25% · 55-65 · Clownfish 28% · 30-100 | 98-104% |
| Shrimp | 30 | base | Clownfish (moody) · Angelfish 35% · 70-80, 5% chance of a Golden Angelfish 300 · Butterflyfish 25% · 110-130 · Pufferfish 27% · 60-200 | 97-101% |
| Squid | 60 | base | Pufferfish (moody) · Lionfish 20% · 290 · Tuna 29% · 100-300 (by weight) | 97% |
| Crab | 80 | medium | Tuna (moody) · Turtle 30% · 250-270 | 97% |
| Live bait | 120 | medium | Barracuda 60% · 170-210 · Swordfish 26% · 500-900 (20% thrash free) | 93-95% |
| Mackerel | 160 | big | Hammerhead 15% · 900-1000 | 88% |
| Chum | 200 | big | Shark (moody) · Manta 30% · 580-620 | 89% |
| Golden lure | 500 | special | Golden Koi only, 8.8% once it comes · 5000. On sale any time; the Koi always comes while it's in the water, otherwise 4-50% by how full the golden pocket is | varies |
| Worms + Shrimp | 45 | base | Seahorse 30% · 140-160 · Angelfish 53% · 70-80 (+ golden) · Butterflyfish 38% · 110-130 | 99-100% |
| Squid + Crab | 140 | medium | Octopus 28% · 460-500 · Lionfish 46% · 290 · Turtle 52% · 250-270 | 95-96% |
| Shrimp + Crab | 110 | medium | Swordfish 23% · 500-900 (20% thrash free) | 94% |
| Live + Mackerel | 280 | big | Marlin 12% · 2000-2400 · Hammerhead 27% · 900-1000 | 90-91% |
| Chum + Golden | 700 | boss | Healer, Megalodon, Giant Squid, Kraken: 4% each · 15000 (boss waves only) | 86% |

## Moody fish (on their home bait)

Each switches mood every 15-30 s, the same for the whole table. Wild is only allowed when that fish's jar can pay for it.

| Fish | Home bait | Low | Normal | Wild |
|---|---|---|---|---|
| Sardine | Worms (15) | 80% · 15-30 | 58% · 15-50 | 26% · 45-130 |
| Clownfish | Shrimp (30) | 77% · 30-60 | 56% · 30-100 | 25% · 90-260 |
| Pufferfish | Squid (60) | 75% · 60-120 | 54% · 60-200 | 25% · 180-520 |
| Tuna | Crab (80) | 72% · 80-160 | 39% · 100-300 | 20% · 300-600 |
| Shark | Chum (200) | – | 12% · 1400-1600 | Frenzy 45% · 350-450 |

Moods change the feel (Low = easy small fish, Wild = hard big fish). Returns by mood: Low 82-92%, Normal 97-104%,
Wild 110-119%.

## Patterns worth knowing for the market design

- Cheap bait is close to break-even (97-104%). Expensive bait returns less (86-91%). So the pole leans on its big
  baits for the house edge, the opposite of "bigger bet, same odds" on the gun.
- Combos are the "better bait": a higher catch chance on the same fish (Angelfish 35% → 53%, Turtle 30% → 52%).
- Several fish can only be caught on a combo: Seahorse, Octopus, Marlin, and the bosses.

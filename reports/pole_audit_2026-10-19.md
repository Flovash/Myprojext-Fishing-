# Pole math audit

Game file: game/peacock_reef.html  ·  200,000 casts per row per seed  ·  seeds 1, 2, 3

Return = average points paid per cast ÷ bait cost, once that fish has reached the bobber. Spoiled bait (nothing came in 30 s) is not counted here; the lab counts it.

Worst z = the largest gap between theory and a seed, measured in standard errors of that seed. Under 3 means the game rolls exactly what its tables say; rare big pays (Swordfish, bosses) swing more in points but not in z.

| Bait | Cost | Fish | Theory | Seed 1 | Seed 2 | Seed 3 | Worst z |
|---|---|---|---|---|---|---|---|
| worms | 15 | sardine (Low) | 92.0% | 91.8% | 92.1% | 92.0% | 1.7 |
| worms | 15 | sardine (Normal) | 104.4% | 104.5% | 104.4% | 104.7% | 1.2 |
| worms | 15 | sardine (Wild) | 118.7% | 118.9% | 118.3% | 118.2% | 1.2 |
| worms | 15 | minnow | 99.2% | 98.8% | 99.4% | 99.1% | 1.6 |
| worms | 15 | anchovy | 98.3% | 99.6% | 98.6% | 98.8% | 3.2 |
| worms | 15 | clown | 100.8% | 100.2% | 101.3% | 100.8% | 1.5 |
| shrimp | 30 | clown (Low) | 88.6% | 88.8% | 88.6% | 88.6% | 1.9 |
| shrimp | 30 | clown (Normal) | 100.8% | 100.9% | 100.9% | 100.9% | 0.5 |
| shrimp | 30 | clown (Wild) | 111.9% | 111.8% | 112.3% | 111.6% | 0.9 |
| shrimp | 30 | angel | 99.5% | 100.3% | 99.5% | 99.2% | 2.0 |
| shrimp | 30 | butterfly | 98.3% | 99.0% | 98.6% | 98.6% | 1.7 |
| shrimp | 30 | puffer | 97.2% | 96.9% | 97.4% | 97.5% | 0.8 |
| squid | 60 | puffer (Low) | 82.5% | 82.7% | 82.5% | 82.5% | 1.3 |
| squid | 60 | puffer (Normal) | 97.2% | 97.0% | 97.0% | 97.4% | 0.9 |
| squid | 60 | puffer (Wild) | 111.9% | 112.5% | 112.3% | 112.3% | 1.2 |
| squid | 60 | lion | 96.7% | 96.0% | 96.8% | 96.8% | 1.5 |
| squid | 60 | tuna | 96.7% | 96.4% | 97.2% | 96.9% | 1.5 |
| crab | 80 | tuna (Low) | 82.8% | 82.9% | 83.0% | 82.7% | 1.7 |
| crab | 80 | tuna (Normal) | 97.5% | 97.1% | 97.8% | 97.5% | 1.3 |
| crab | 80 | tuna (Wild) | 109.7% | 111.1% | 109.5% | 109.6% | 2.8 |
| crab | 80 | turtle | 96.7% | 96.3% | 97.1% | 97.1% | 1.5 |
| live | 120 | barracuda | 93.0% | 93.1% | 92.6% | 93.4% | 2.3 |
| live | 120 | sword | 95.2% | 94.3% | 94.6% | 95.1% | 2.1 |
| mackerel | 160 | hammer | 88.1% | 88.0% | 87.5% | 87.4% | 1.6 |
| chum | 200 | shark (Normal) | 88.8% | 89.0% | 87.9% | 88.2% | 1.7 |
| chum | 200 | shark (Frenzy) | 87.8% | 87.7% | 87.4% | 87.7% | 1.4 |
| chum | 200 | manta | 89.4% | 89.2% | 89.5% | 89.7% | 0.9 |
| golden | 500 | koi | – | – | – | – | Golden Koi: chance set by the golden pocket balance (5% / 8.8% / 11%), pays 5000 |
| c_ws | 45 | seahorse | 98.7% | 99.1% | 98.6% | 98.9% | 1.4 |
| c_ws | 45 | angel | 100.5% | 100.4% | 100.4% | 100.3% | 0.7 |
| c_ws | 45 | butterfly | 99.6% | 99.6% | 99.8% | 100.3% | 2.3 |
| c_sc | 140 | octopus | 95.2% | 95.4% | 95.1% | 95.5% | 0.9 |
| c_sc | 140 | lion | 95.3% | 95.2% | 95.1% | 95.5% | 1.1 |
| c_sc | 140 | turtle | 95.8% | 95.8% | 95.8% | 95.6% | 1.0 |
| c_shc | 110 | sword | 93.7% | 93.7% | 93.5% | 93.1% | 1.3 |
| c_lm | 280 | marlin | 90.3% | 90.4% | 90.9% | 89.3% | 1.7 |
| c_lm | 280 | hammer | 90.6% | 90.9% | 90.6% | 90.8% | 0.8 |
| c_cg | 700 | healer | 85.7% | 86.9% | 84.3% | 86.1% | 1.5 |
| c_cg | 700 | megalodon | 85.7% | 85.1% | 85.9% | 85.5% | 0.7 |
| c_cg | 700 | gsquid | 85.7% | 86.9% | 84.4% | 85.3% | 1.4 |
| c_cg | 700 | kraken | 85.7% | 84.5% | 86.0% | 85.9% | 1.3 |

## Moody fish, averaged over their moods

| Fish | Home bait | Low | Normal | Wild | Weighted |
|---|---|---|---|---|---|
| sardine | 15 | 92.0% | 104.4% | 118.7% | 104.9% |
| clown | 30 | 88.6% | 100.8% | 111.9% | 100.5% |
| puffer | 60 | 82.5% | 97.2% | 111.9% | 97.2% |
| tuna | 80 | 82.8% | 97.5% | 109.7% | 96.7% |
| shark | 200 | – | 88.8% | Frenzy 87.8% | 88.5% |

Worst z across 120 seed runs: 3.2 (PASS: within chance).
Lowest return: squid → puffer (Low) 82.5%. Highest: worms → sardine (Wild) 118.7%.

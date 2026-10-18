# Route index

Every fish, every route, and what each route is for. Points are screen fractions: x 0 = left edge, 1 = right edge; y 0 = top seat row, 1 = bottom seat row. Values below 0 or above 1 are off screen, where fish enter and leave. Every route can also be flipped left-right, top-bottom or run backwards unless its notes say otherwise. A picture of each fish's routes is in `sketches/`.

## Shark  ·  big  ·  pays 100-400x

**Role:** Apex. Sets the plan every wave; everyone else reads its lane and reacts.  
**Home:** Its own lane plus a buffer band; changes every wave  
**Habit:** One per wave. Never enters from the same edge or travels the same direction two waves in a row. Picks an attitude, then a route from that attitude.  
**Status:** in game (v6)  
**Sketch:** `sketches/shark.svg`

| Route | Attitude | On screen | What it is for |
|---|---|---|---|
| Cruise (`cruise`) | King | 18-22 s | The calm default: owns one horizontal lane at one of four heights. Allowed during Manta meetings. |
| Patrol loop (`patrol`) | King | 20-26 s | Loops one side and leaves the way it came, handing the other half to the mediums. Allowed during meetings. |
| Deep sweep (`deep`) | King | 20-24 s | Sweeps a seat row; pushes the Octopus to the other seat row. Allowed during meetings. |
| Center line (`center`) | King | 22-26 s | Straight through the middle; splits the screen into top and bottom halves. Allowed during meetings. |
| Split (`split`) | King | 12-16 s | Top to bottom through the center. Nothing crosses the middle while it is there; each half keeps its own fish. |
| Diagonal (`diagonal`) | King | 18-22 s | Corner to corner; mediums take the two corners it leaves open. |
| Strike (`strike`) | Hungry | 9-12 s | A short fast lunge through the middle. |
| Feeding circle (`feed`) | Hungry | 22-28 s | Circles one spot, then leaves the way it came. The only Hungry route allowed in meetings, on the far side. |
| Stalker (`stalker`) | Curious | 24-30 s | Slow wavy pass through the lower middle: a long, easy target. |
| Inspector (`inspector`) | Curious | 20-26 s | Drops in to look at one seat and climbs back out; that seat feels watched. |
| Bubble check (`bubble`) | Curious | 22-26 s | Lingers near the center with small turns. |
| Charge (`charge`) | Aggressive | 6-8 s | Fast straight run across in 6-8 s: a jolt. |
| Thrash (`thrash`) | Aggressive | 12-15 s | Fast zigzag; looks angry and is hard to track. |
| Rush (`rush`) | Aggressive | 7-9 s | Fast corner-to-corner run. |

**Reactions:** Snap back: Reverses along its own lane at 1.6x speed and leaves where it came in. (14 hits in 3 s, 50%); Frenzy: 3 s of 1.5x speed with a hard side-to-side shake. (14 hits in 3 s, 50%)

**Second Shark moves:** Shadow (in game (v6)); Pincer (in game (v6)); Hunting pair (designed); Size-up (designed); Food fight (designed); Standoff (designed); Waiting holder (designed); Frenzy spreads (designed)

## Manta Ray  ·  big  ·  pays 150-300x

**Role:** Second respect point, the attractor. Brings 8-12 small followers that tighten when a Shark is near.  
**Home:** Half the screen; never the Shark lane  
**Habit:** Every other wave. Meets the Shark about 1 visit in 3 (only through the Shark gate). Never flees, never speeds past 1.3x.  
**Status:** in game (v6)  
**Sketch:** `sketches/manta.svg`

| Route | On screen | What it is for |
|---|---|---|
| Grand arc (`grandArc`) | 30-35 s | Covers most of the screen. In a meeting no Shark lane fits, so the Shark waits off screen. |
| Open glide (`openGlide`) | 30-35 s | Straight glide in the top or bottom half; leaves the other half free. |
| Slow S (`slowS`) | 30-35 s | Middle-to-low S; only the far edge is left for a meeting Shark. |
| Feeding loop (`feedLoop`) | 30-35 s | Circles one side; followers bunch around it. |
| Seat row glide (`seatRow`) | 30-35 s | Glides along a seat row; that row gets the followers up close. |
| Wide diagonal (`wideDiag`) | 30-35 s | Corner to corner glide. |

## Hammerhead  ·  big  ·  pays 80-150x

**Role:** Edge guard. Gives way to the Shark and the Manta.  
**Home:** Seat rows and sides  
**Habit:** 2 waves in 3; 1 in 6 of those is a pair patrol on both seat rows. Takes the edge opposite the Shark.  
**Status:** in game (v6)  
**Sketch:** `sketches/hammerhead.svg`

| Route | On screen | What it is for |
|---|---|---|
| Rail patrol (`rail`) | 20-24 s | Patrols one seat row with a light weave. Also used for the pair patrol, mirrored on both rows. |
| Corner turn (`corner`) | 18-22 s | Top row, then down a side. |
| Head sweep (`sweep`) | 20-24 s | Sways side to side along a row. |
| Wide U (`wideU`) | 22-26 s | In and out on the same side. |
| Low arc (`lowArc`) | 18-22 s | Under the middle. Only when no Shark is on screen. |
| Side swing (`swing`) | 12-16 s | A short visit to one side. |

## Marlin  ·  big  ·  pays 150-500x

**Role:** Speed trophy. Only dashes into clear water; crosses a Shark lane only 2+ s after it passes.  
**Home:** Clear water, a few seconds at a time  
**Habit:** Every wave, twice in about 1 wave in 4. Never during a Shark + Manta meeting. One at a time. Counts as a fast crosser.  
**Status:** in game (v6)  
**Sketch:** `sketches/marlin.svg`

| Route | On screen | What it is for |
|---|---|---|
| Dash (`dash`) | 5-7 s | Fast straight lane at one of five heights. |
| Diagonal dash (`diag`) | 6-8 s | Corner to corner. |
| Hook back (`hook`) | 7-9 s | Dashes in, snaps back out the same side. |
| Sharp cut (`cut`) | 6-8 s | One hard angle. |
| Drift, then burst (`burst`) | 9-12 s | Slow entry, then a fast exit. |
| School slash (`slash`) | 6-8 s | Cuts through a school, which scatters and regroups. |

## Tuna  ·  medium  ·  pays 8-15x

**Role:** Cheapest medium, most predictable. Easy team shooting.  
**Home:** Corners  
**Habit:** Schools of 2-4 that hold formation (side-by-side arc or diagonal echelon). Always enters and leaves at corners.  
**Status:** designed, not in game yet (game v7 has the older medium set)  
**Sketch:** `sketches/tuna.svg`

| Route | On screen | What it is for |
|---|---|---|
| Corner run (`cornerRun`) | 12-15 s | Corner to opposite corner as a block. |
| Crisscross (`crisscross`) | 12-15 s | Two schools at once, mirrored, crossing in an X. Best used as the release right after a Shark leaves. |
| Corner swing (`cornerSwing`) | 12-15 s | Corner to the neighbouring corner in an arch; flips to open up or down away from the Shark. |
| Corner hook (`cornerHook`) | 12-15 s | Stays on one side, corner to corner. The Tuna option while a Shark splits the screen. |

## Barracuda  ·  medium  ·  pays 10-25x

**Role:** Hunter. Its pauses are the moments to shoot it.  
**Home:** Middle band  
**Habit:** Only straight lines and sharp corners; pauses at every corner. Waits at its ambush spot until a Shark has passed.  
**Status:** designed, not in game yet (game v7 has the older medium set)  
**Sketch:** `sketches/barracuda.svg`

| Route | On screen | What it is for |
|---|---|---|
| Ambush (`ambush`) | 14-18 s | Creeps in, holds still, then darts out to a corner. |
| Zigzag stalk (`zigzag`) | 16-20 s | Straight legs with a stop at every corner. |
| Strike and retreat (`strikeRetreat`) | 14-18 s | Darts in, stops, backs out the side it came from. Never crosses the middle. |

## Octopus  ·  medium  ·  pays 12-30x

**Role:** Personal fish: hangs out at a seat.  
**Home:** Seat edges only, never the middle  
**Habit:** Moves to the opposite seat row when a Shark takes its row. 7 hits in 3 s: squirts ink and jets for the nearest edge (show only).  
**Status:** designed, not in game yet (game v7 has the older medium set)  
**Sketch:** `sketches/octopus.svg`

| Route | On screen | What it is for |
|---|---|---|
| Seat crawl (`seatCrawl`) | 17-22 s | Crawls along a seat row and rests twice. |
| Edge hops (`edgeHops`) | 17-22 s | Hops along the edge in bursts. |
| Rise and sink (`riseSink`) | 17-22 s | Comes up from under a seat, rests, sinks back. |

## Swordfish  ·  medium  ·  pays 15-35x

**Role:** Bully: fast, risky, top medium pay.  
**Home:** Anywhere, fast  
**Habit:** Straight lines with at most one hard angle. The only medium that goes top to bottom.  
**Status:** designed, not in game yet (game v7 has the older medium set)  
**Sketch:** `sketches/swordfish.svg`

| Route | On screen | What it is for |
|---|---|---|
| Spear (`spear`) | 8-11 s | Drops straight down (or up) through the screen. |
| Ricochet (`ricochet`) | 8-11 s | Bounces off a seat row like a pool shot. |
| Low slash (`lowSlash`) | 8-11 s | One long fast line. |

## Sea Turtle  ·  medium  ·  pays 20-50x

**Role:** Calm: easy to catch but pays the most of the mediums. May drift near the Manta.  
**Home:** Center  
**Habit:** Slow curves only; the only fish that circles. Not counted as a fast crosser.  
**Status:** designed, not in game yet (game v7 has the older medium set)  
**Sketch:** `sketches/turtle.svg`

| Route | On screen | What it is for |
|---|---|---|
| Lazy S (`lazyS`) | 22-27 s | A slow S through the center. |
| Slow circle (`slowCircle`) | 22-27 s | One lazy loop in the middle. |
| Seat visit (`seatVisit`) | 22-27 s | Dips to a seat and rests there. |
| Side loop (`sideLoop`) | 22-27 s | Loops on one side. The Turtle option while a Shark splits the screen. |

## Sardine  ·  tiny  ·  pays 2-3x

**Role:** The crowd. Fills the screen and hits every corner.  
**Home:** Everywhere; a coverage map sends schools to the emptiest zones  
**Habit:** Schools of 6-9; 35% of the time a mirror twin school takes the reflected route. 1 in 700 hits is a Golden Sardine (50x).  
**Status:** in game (v5)  
**Sketch:** `sketches/sardine.svg`

| Route | On screen | What it is for |
|---|---|---|
| Perimeter (`perimeter`) | by speed | A lap around the whole table past every seat. |
| Corner S (`cornerS`) | by speed | Corner to corner in an S. |
| W dip (`wDip`) | by speed | Dips to the bottom seats three times. |
| Figure 8 (`figure8`) | by speed | A figure eight through the middle. |
| Seat sweep (`seatSweep`) | by speed | Along one seat row, around, back along the other. |
| Corner arc (`cornerArc`) | by speed | Up from a bottom corner and across the top. |

## Angelfish  ·  small  ·  pays 3-8x

**Role:** The messenger. Crosses alone; freezes near the Shark, drifts to the Manta.  
**Home:** Anywhere, alone  
**Habit:** Solo; crosses the screen in 25-35 s with a gentle wobble.  
**Status:** in game (v5)  
**Sketch:** `sketches/angelfish.svg`

| Route | On screen | What it is for |
|---|---|---|
| Diagonal down (`diagDown`) | 25-35 s | Slow diagonal, top-left to bottom-right. |
| Diagonal up (`diagUp`) | 25-35 s | Slow diagonal, bottom-left to top-right. |
| Steep (`steep`) | 25-35 s | Steep drop from the top. |
| Vertical (`vertical`) | 25-35 s | Straight down one side. |
| Hook (`hook`) | 25-35 s | Drops in and hooks out the side. |
| Arch (`arch`) | 25-35 s | Rises from the bottom and sinks back. |

## Not designed yet

- **small fish (Clownfish, Butterflyfish, Puffer, Lionfish, Seahorse, Minnow, Anchovy):** not designed yet; drift at random in the game
- **specials (Bomb Crab, Lightning Eel):** not designed yet; drift at random in the game
- **bosses (Megalodon, Kraken, Giant Squid, Healer Jellyfish):** not designed yet; use the old stay-on-screen movement

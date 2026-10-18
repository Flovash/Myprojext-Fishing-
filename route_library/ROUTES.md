# Route index

Every fish, every route, and what each route is for. Points are screen fractions: x 0 = left edge, 1 = right edge; y 0 = top seat row, 1 = bottom seat row. Values below 0 or above 1 are off screen, where fish enter and leave. Every route can also be flipped left-right, top-bottom or run backwards unless its notes say otherwise. Each fish has a folder in `fish/` with a picture of all its routes (`sketch.svg`) and one folder per route (route, rules, tracked stats, sketch).

_Made by `tools/build_library.js` from the folders. Edit the JSON files, not this page._

## Shark  ·  big  ·  pays 100-400x

**Role:** Apex. Sets the plan every wave; everyone else reads its lane and reacts.  
**Home:** Its own lane plus a buffer band; changes every wave  
**Habit:** One per wave. Never enters from the same edge or travels the same direction two waves in a row. Picks an attitude, then a route from that attitude.  
**Status:** in game (v6)  
**School size:** 1 · **Formations:** single  
**Sketch:** `fish/shark/sketch.svg`

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
**School size:** 1 · **Formations:** single  
**Sketch:** `fish/manta/sketch.svg`

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
**School size:** 1 · **Formations:** single  
**Sketch:** `fish/hammerhead/sketch.svg`

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
**School size:** 1 · **Formations:** single  
**Sketch:** `fish/marlin/sketch.svg`

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
**Habit:** Schools of 2-6 that hold formation: side-by-side arc, diagonal echelon, single-file line or a tight ball. Always enters and leaves at corners.  
**Status:** in game (v8)  
**School size:** 2-6 · **Formations:** arc, echelon, line, ball  
**Sketch:** `fish/tuna/sketch.svg`

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
**Status:** in game (v8)  
**School size:** 1-2 · **Formations:** loose  
**Sketch:** `fish/barracuda/sketch.svg`

| Route | On screen | What it is for |
|---|---|---|
| Ambush (`ambush`) | 14-18 s | Creeps in, holds still, then darts out to a corner. |
| Zigzag stalk (`zigzag`) | 16-20 s | Straight legs with a stop at every corner. |
| Strike and retreat (`strikeRetreat`) | 14-18 s | Darts in, stops, backs out the side it came from. Never crosses the middle. |

## Octopus  ·  medium  ·  pays 12-30x

**Role:** Personal fish: hangs out at a seat.  
**Home:** Seat edges only, never the middle  
**Habit:** Moves to the opposite seat row when a Shark takes its row. 7 hits in 3 s: squirts ink and jets for the nearest edge (show only).  
**Status:** in game (v8)  
**School size:** 1 · **Formations:** single  
**Sketch:** `fish/octopus/sketch.svg`

| Route | On screen | What it is for |
|---|---|---|
| Seat crawl (`seatCrawl`) | 17-22 s | Crawls along a seat row and rests twice. |
| Edge hops (`edgeHops`) | 17-22 s | Hops along the edge in bursts. |
| Rise and sink (`riseSink`) | 17-22 s | Comes up from under a seat, rests, sinks back. |

## Swordfish  ·  medium  ·  pays 15-35x

**Role:** Bully: fast, risky, top medium pay.  
**Home:** Anywhere, fast  
**Habit:** Straight lines with at most one hard angle. The only medium that goes top to bottom.  
**Status:** in game (v8)  
**School size:** 1 · **Formations:** single  
**Sketch:** `fish/swordfish/sketch.svg`

| Route | On screen | What it is for |
|---|---|---|
| Spear (`spear`) | 8-11 s | Drops straight down (or up) through the screen. |
| Ricochet (`ricochet`) | 8-11 s | Bounces off a seat row like a pool shot. |
| Low slash (`lowSlash`) | 8-11 s | One long fast line. |

## Sea Turtle  ·  medium  ·  pays 20-50x

**Role:** Calm: easy to catch but pays the most of the mediums. May drift near the Manta.  
**Home:** Center  
**Habit:** Slow curves only; the only fish that circles. Not counted as a fast crosser.  
**Status:** in game (v8)  
**School size:** 1-2 · **Formations:** loose  
**Sketch:** `fish/turtle/sketch.svg`

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
**School size:** 6-9 · **Formations:** school  
**Sketch:** `fish/sardine/sketch.svg`

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
**School size:** 1 · **Formations:** single  
**Sketch:** `fish/angelfish/sketch.svg`

| Route | On screen | What it is for |
|---|---|---|
| Diagonal down (`diagDown`) | 25-35 s | Slow diagonal, top-left to bottom-right. |
| Diagonal up (`diagUp`) | 25-35 s | Slow diagonal, bottom-left to top-right. |
| Steep (`steep`) | 25-35 s | Steep drop from the top. |
| Vertical (`vertical`) | 25-35 s | Straight down one side. |
| Hook (`hook`) | 25-35 s | Drops in and hooks out the side. |
| Arch (`arch`) | 25-35 s | Rises from the bottom and sinks back. |

## Anchovy  ·  tiny  ·  pays 2-5x

**Role:** The sparkle. Fast flashes of silver that make the water feel alive.  
**Home:** Open water, and the wake behind big fish  
**Habit:** Flocks of 5-8 that split around obstacles and rejoin. They scatter when a big fish comes within 200 px and re-form 2 s later.  
**Status:** designed, not in game yet  
**School size:** 5-8 · **Formations:** school  
**Rules:** Never more than 2 Anchovy flocks on screen. Scatter (show only) when a Shark, Marlin or Megalodon is within 200 px.  
**Sketch:** `fish/anchovy/sketch.svg`

| Route | On screen | What it is for |
|---|---|---|
| Ribbon (`ribbon`) | 7-9 s | A long silver wave through the middle band. _If:_ Use when the middle band is empty. |
| Bait ball (`baitBall`) | 10-12 s | Rolls into a tight ball for 3 s, then streams away. A small crowd target. _If:_ Not while a Shark lane is within 0.2 of the ball spot. Best right before a Marlin slash (gives it something to cut through). |
| Split and rejoin (`splitRejoin`) | 8-10 s | Splits into two halves that go around the middle and meet again. _If:_ Used when a Turtle or Puffer sits in the middle. |
| Wake rider (`wakeRider`) | follows a big fish | Follows 2 s behind a Marlin or Shark through its wake. _If:_ Only after a fast big fish; keeps 2 s behind it, never ahead. |

## Clownfish  ·  tiny  ·  pays 3-5x

**Role:** The friendly one. Stays close to a seat so beginners get easy, steady catches.  
**Home:** Right in front of the seats (one "home spot" per seat)  
**Habit:** Small groups of 3-6 that dart out from a seat and back. Slow, short trips.  
**Status:** designed, not in game yet  
**School size:** 3-6 · **Formations:** school  
**Rules:** Visits are shared out by the seat fairness memory, so every seat gets its turn. A seat with a dry spell over 30 s gets the next Clownfish visit (show only, odds unchanged).  
**Sketch:** `fish/clownfish/sketch.svg`

| Route | On screen | What it is for |
|---|---|---|
| Seat home (`seatHome`) | 8-11 s | Swims to one seat, hangs there 3 s, and goes back the way it came. _If:_ Target seat = the seat with the least tiny-fish time lately. |
| Hop along (`hopAlong`) | 12-15 s | Hops along one seat row, a short stop at each seat. _If:_ Alternate rows: top row, then bottom row next time. |
| Peek (`peek`) | 6-8 s | Pops up from a seat edge, looks around, and dives back. _If:_ Never under a Hammerhead rail patrol on the same row. |

## Butterflyfish  ·  tiny  ·  pays 3-6x

**Role:** Color and calm. Gentle movers that fill the quiet parts of a wave.  
**Home:** Upper middle of the screen  
**Habit:** Travel in pairs inside a group of 3-6, fluttering up and down as they go.  
**Status:** designed, not in game yet  
**School size:** 3-6 · **Formations:** school  
**Rules:** Used most in calm scenes; fewer during hunts.  
**Sketch:** `fish/butterflyfish/sketch.svg`

| Route | On screen | What it is for |
|---|---|---|
| Pair flutter (`pairFlutter`) | 12-15 s | A slow flutter across the upper middle. |
| Loop-de-loop (`loop`) | 12-14 s | One loop in the middle, then on its way. _If:_ No loop while the Manta is within 0.25. |
| Drift down (`driftDown`) | 12-15 s | Floats down from the top seats to the bottom seats. _If:_ Pick a top seat with little traffic as the start. |

## Minnow  ·  small  ·  pays 2-10x

**Role:** The Sardine's rival in the see-saw. Quick and twitchy, good for fast shooters.  
**Home:** Wherever the Sardines are not (the see-saw decides)  
**Habit:** Schools of 3-6 that zigzag with sharp turns and sudden stops.  
**Status:** designed, not in game yet  
**School size:** 3-6 · **Formations:** loose  
**Rules:** See-saw: when Sardines are up, Minnows are down, and the other way round (already in game).  
**Sketch:** `fish/minnow/sketch.svg`

| Route | On screen | What it is for |
|---|---|---|
| Zigzag (`zigzag`) | 7-9 s | Sharp zigzag across the screen. |
| Dart and stop (`dartStop`) | 7-9 s | Darts in, freezes for a second, then bolts. |
| Switchback (`switchback`) | 8-10 s | Almost crosses, then turns back the way it came. _If:_ Never toward a Shark lane. |

## Pufferfish  ·  small  ·  pays 4-7x

**Role:** The easy, funny target. Slow and round; puffs up when hit a lot.  
**Home:** Low middle, close to the bottom seats  
**Habit:** Alone or 2-3. Bobs slowly. After 6 hits in 3 s it puffs up for 2 s and slows down (show only).  
**Status:** designed, not in game yet  
**School size:** 1-3 · **Formations:** loose  
**Rules:** Puff never changes catch chance or pay.  
**Sketch:** `fish/pufferfish/sketch.svg`

| Route | On screen | What it is for |
|---|---|---|
| Bob (`bob`) | 16-20 s | A slow bobbing pass along the low middle. |
| Rise (`rise`) | 12-15 s | Comes up from the bottom seats, turns, and sinks back. _If:_ Mirror to the top half every other time so top seats get it too. |
| Linger (`linger`) | 14-18 s | Stops in the middle for 4 s, an easy shared target. _If:_ Not while a Shark is on screen. |

**Reactions:** Puff: puffs up and slows for 2 s (6 hits in 3 s)

## Lionfish  ·  small  ·  pays 5-10x

**Role:** The escort. Rides with big fish so the big moments have small catches around them.  
**Home:** Beside big fish, or along the side edges  
**Habit:** 40% of big fish come with 2-3 Lionfish escorts (in game). Alone, it hovers and fans its fins.  
**Status:** designed, not in game yet  
**School size:** 1-3 · **Formations:** loose  
**Rules:** Escorts leave with their big fish. Never escort the Shark during a Manta meeting (too crowded).  
**Sketch:** `fish/lionfish/sketch.svg`

| Route | On screen | What it is for |
|---|---|---|
| Escort ring (`escort`) | rides with a big fish | Circles around a big fish while it travels (in game). |
| Fan hover (`fanHover`) | 14-18 s | Drifts slowly with two stops to fan its fins. |
| Edge cruise (`edgeCruise`) | 12-15 s | Slides down a side edge, past the corner seats. _If:_ Left and right edges take turns. |

## Seahorse  ·  small  ·  pays 6-15x

**Role:** The little treat. Slow, rare and worth a bit more.  
**Home:** Seat corners; moves up and down rather than across  
**Habit:** Alone or a pair. Very slow, upright, bobbing.  
**Status:** designed, not in game yet  
**School size:** 1-2 · **Formations:** loose  
**Rules:** At most 1 Seahorse visit per seat corner every 2 minutes.  
**Sketch:** `fish/seahorse/sketch.svg`

| Route | On screen | What it is for |
|---|---|---|
| Climb (`climb`) | 18-22 s | Climbs slowly from the bottom seats to the top seats. _If:_ Pick the seat column with the least small-fish time. |
| Corner bob (`cornerBob`) | 12-15 s | Comes out of a corner, bobs up and down, goes back. |
| Pair dance (`pairDance`) | 14-18 s | Two Seahorses, one from the top and one from the bottom, meet near the middle and go home. _If:_ Only when the middle is clear of big fish. |

## Bomb Crab  ·  special  ·  pays 10x + blast

**Role:** The crowd clearer. Catching it blows up fish nearby (150 px) for a big shared moment.  
**Home:** The seabed: the seat rows along the top and bottom edges  
**Habit:** Walks sideways along a seat row. The director sends it when a crowd has gathered.  
**Status:** designed, not in game yet  
**School size:** 1 · **Formations:** single  
**Rules:** Only when at least 8 fish are within its blast radius somewhere on its path. Max 1 on screen; at least 40 s between crabs. Not during a boss scene. Not within 10 s of a Lightning Eel.  
**Sketch:** `fish/bombcrab/sketch.svg`

| Route | On screen | What it is for |
|---|---|---|
| Seabed walk (`seabed`) | 14-18 s | Walks the full bottom row, past every bottom seat. _If:_ Rows take turns: bottom, then top. |
| Into the crowd (`intoCrowd`) | 14-18 s | Walks toward the busiest spot, waits there 3 s, and walks back. _If:_ Target = densest fish spot within 0.35 of a seat row. |
| Ceiling walk (`ceiling`) | 14-18 s | Walks the top row upside down. |

## Lightning Eel  ·  special  ·  pays 12x + chain

**Role:** The spark. Catching it chains to 6 nearby fish, the big excitement spike.  
**Home:** Long lanes through busy water  
**Habit:** Swims in an S, fast, alone. Glows brighter the more fish are near it.  
**Status:** designed, not in game yet  
**School size:** 1 · **Formations:** single  
**Rules:** Max 1 on screen; at least 45 s between eels. Route must pass at least 10 fish so the chain has targets. Not during a boss scene.  
**Sketch:** `fish/eel/sketch.svg`

| Route | On screen | What it is for |
|---|---|---|
| Long S (`longSine`) | 8-10 s | An S-wave right through the middle. |
| Through the school (`throughSchool`) | follows a school | Follows the path of the biggest Sardine school so the chain hits. _If:_ Only when a school of 6+ is on screen. |
| Edge snap (`edgeSnap`) | 7-9 s | Runs the top row, snaps down through the middle, leaves along the bottom row. |

## Healer Jellyfish  ·  boss  ·  pays 300-500x

**Role:** The gentle boss. Slow and glowing; a calm, team-up fight.  
**Home:** Center; rises from the bottom, sinks back at the end  
**Habit:** Pulses: rises, holds, rises again. Trails baby jellies (small, low pay).  
**Status:** designed, not in game yet  
**School size:** 1 · **Formations:** single  
**Rules:** Bosses own the stage: no big fish, the big-fish clock waits. Mediums only as escorts; small fish keep 0.15 away from the boss. The boss spends equal time near top, bottom, left and right seats. It never leaves before the scene ends (minus 4 s).  
**Fight stages:** Rise from the bottom → Bloom: figure-8 over the middle → Lantern drift past each seat column → Sink away  
**Sketch:** `fish/healer/sketch.svg`

| Route | On screen | What it is for |
|---|---|---|
| Bloom (`bloom`) | 40-50 s | Rises, draws a slow figure-8 in the middle, and sinks. |
| Lantern drift (`lantern`) | 40-50 s | Drifts side to side, stopping at each seat column. |

## Megalodon  ·  boss  ·  pays 400-800x

**Role:** The big show. Huge, fast for its size, always moving.  
**Home:** Laps the whole arena  
**Habit:** Never stops. Passes close to every seat row once per lap. Small fish scatter in front of it.  
**Status:** designed, not in game yet  
**School size:** 1 · **Formations:** single  
**Rules:** Bosses own the stage: no big fish, the big-fish clock waits. Mediums only as escorts; small fish keep 0.15 away from the boss. The boss spends equal time near top, bottom, left and right seats. It never leaves before the scene ends (minus 4 s). Charges come with a 1 s warning shadow.  
**Fight stages:** Enter wide → Laps (2) → Charges (3 passes) → Exit  
**Sketch:** `fish/megalodon/sketch.svg`

| Route | On screen | What it is for |
|---|---|---|
| Laps (`laps`) | 40-50 s | Two wide laps past every seat, then out. |
| Charges (`charges`) | 35-45 s | Three straight passes: top, middle, bottom. Turns off screen. _If:_ Order of rows is random each time. |
| Circling (`circling`) | 40-50 s | Circles in, getting tighter, then breaks out. |

## Giant Squid  ·  boss  ·  pays 500-1000x

**Role:** The reacher. Tentacles stretch toward the seats.  
**Home:** Center, reaching out to both seat rows  
**Habit:** Swims backwards in jets; holds still to reach. Squirts ink when hit hard (show only).  
**Status:** designed, not in game yet  
**School size:** 1 · **Formations:** single  
**Rules:** Bosses own the stage: no big fish, the big-fish clock waits. Mediums only as escorts; small fish keep 0.15 away from the boss. The boss spends equal time near top, bottom, left and right seats. It never leaves before the scene ends (minus 4 s).  
**Fight stages:** Jet in → Reach each seat row → Jet across → Exit  
**Sketch:** `fish/giantsquid/sketch.svg`

| Route | On screen | What it is for |
|---|---|---|
| Seat reach (`seatReach`) | 40-50 s | Holds in the middle, leans toward the top seats, then the bottom seats. |
| Jet (`jet`) | 35-45 s | Moves in short, fast jets with pauses between. |

**Reactions:** Ink: ink cloud and a jet away (20 hits in 3 s)

## Kraken  ·  boss  ·  pays 800-1200x

**Role:** The finale. The rarest boss. Rises from the deep and holds the stage.  
**Home:** Bottom center, anchored  
**Habit:** Barely moves; its tentacles sweep the seat rows instead.  
**Status:** designed, not in game yet  
**School size:** 1 · **Formations:** single  
**Rules:** Bosses own the stage: no big fish, the big-fish clock waits. Mediums only as escorts; small fish keep 0.15 away from the boss. The boss spends equal time near top, bottom, left and right seats. It never leaves before the scene ends (minus 4 s). Rarest boss: at most once per night.  
**Fight stages:** Rise → Hold and sweep → Dive and resurface → Sink  
**Sketch:** `fish/kraken/sketch.svg`

| Route | On screen | What it is for |
|---|---|---|
| Rise and hold (`riseHold`) | 45-55 s | Rises up the middle and holds there a long time, then sinks. _If:_ Tentacles sweep top row, then bottom row, during the hold. |
| Slow sweep (`slowSweep`) | 45-55 s | Drifts across the lower half, very slowly. |
| Dive and resurface (`diveResurface`) | 45-55 s | Rises on the left, dives, and comes back up on the right. |


# Peacock Reef v9: what's new and what you can tweak

Built 2026-10-19 by Claude Code from `docs/plans/BUILD_LIST.md` (steps 1-10). The game is `game/peacock_reef.html`.
**Where the numbers live:** the pole world, rituals, show tools and dive settings are files in the route library
(`route_library/pole/`, `route_library/rituals/`, `route_library/director/`), and each fish's bite style and dive chance is in
its `fish.json`. Edit the file, run `node route_library/tools/build_library.js`, and the game picks it up. Browse
everything in `route_library/CATALOG.html`. The bait tables (prices, catch %, pays) stay in the game: they're game math.

## The rule
The director controls the show, never the odds. Banks decide **when** things may happen, never **how likely** a catch is.
The gun and the pole are separate worlds with separate banks.

## 1. Two banks (gun and pole)
- Each bank = points in − points out for that side. The director's gun show reads only the gun bank. The pole show
  (Golden Koi, deep visitors) reads only the pole bank.
- Fish waiting in bags count as **owed** points.
- The settings panel line "Banks" shows both, plus the total.
- Every lab run writes `banks.md`: both banks, points by fish and by bet size, the market, rituals, diving.

## 2. Fixed odds
- Scenes no longer change gun catch chances (Bait Ball ×1.06 etc. are gone).
- Golden Koi: fixed 8.8% catch chance. The golden pocket decides when a Koi is in the water: at 5,000+ (safe), or
  4,000-5,000 when the director takes the risk (25% per check). The Golden lure is only on sale while a Koi is in.
  Table: `KOI_*`.
- Wild moods: unchanged. Each fish's jar decides when a Wild spell may start.

## 3. Bait market (pole mode only)
| Control | What it does |
|---|---|
| Button 2 (S / ↓ / K) in pole mode | Open / close the market |
| Left / right | Scroll |
| Button 1 | Buy one bait (hold = keep buying) · Sell the fish shown (hold = sell the whole bag) |
| Lock (E for P1, / for P2, O for P3, or double push forward) | Next tab: BUY → SELL → BAG |
| Button 3 | Back to the gun (closes the market) |

- **Buying bait is the pole bet.** Each cast uses one bait from stock. With none left, a quick cast buys one at the counter.
- **Caught fish go into the bag**, each with its own mood, weight and catch value.
- **Sell now** pays the catch value. **Hold to season end** pays the catch value + a weight bonus = lb × rate for its group.
- **Season end** (every 6 big-fish waves, about 7 minutes): every bag sells with its bonus. Banner "Market closed".
- A player who leaves or whose seat closes sells the bag at catch value (setting `leave`).
- Table: `MARKET` (`bonusPerLb` tiny 9 · small 6 · medium 0.2 · big 0.14 · boss 0.2, `bagMax` 20).
- Check numbers before changing them: `node lab/market_calc.js --bonus tiny=12,small=8 --share 0.08`.

## 4. Underwater world + the no-cast box
- The pole's own fish swim under the water (`UNDER.size` 24, at 0.9× their screen speed). Screen fish never bite and never steer to baits.
- The first underwater fish that eats the bait and reaches the bobber decides the cast. The bite tables, fight and pay
  are the same as before.
- No eater near a bait for 2.5 s → one rises from below, a couple of circle-widths away, and swims to it. Casts come about 40% slower than in v8, when every screen fish rushed the bait. `UNDER` sets the pace.
- **No-cast box:** the middle 40% × 30% (`NO_CAST`). A cast aimed there lands at its edge ("Too deep in the middle").
  The box only shows while aiming.

## 4b. Bites (how each fish bites)
- Players land almost every tap fight, so the house odds sit in the bite. The fight's landing rate is set to 97%
  (`FIGHT_AVG`), and the take chance is the bait table's catch % ÷ 0.97.
- Each fish has a bite style (`route_library/pole/bite_styles.json`, chosen in each `fish.json`):

| Style | Fish | What the player sees |
|---|---|---|
| peck | Sardine, Anchovy, Minnow | 2-4 quick pecks |
| nibble | Clownfish, Angelfish, Butterflyfish, Seahorse, Lionfish | 1-3 gentle nibbles |
| puff | Pufferfish | 2-5 slow pokes |
| strike | Tuna, Barracuda | hits at once |
| munch | Turtle | 3-5 slow bites |
| slash | Swordfish, Marlin | 1-2 slashes |
| wrap | Octopus | one long pull |
| circle | Shark, Hammerhead, Manta | circles the bait 2-4 s first ("Something circles the bait…") |
| deep | Megalodon, Giant Squid, Kraken, Healer | circles far below 4-6 s |

- **Teases:** some fish only sniff or nibble and swim off. The bait stays and the cast goes on (15-50% by style,
  halving after each tease). A teased fish won't come straight back.
- **When a fish commits**, the cast's one roll is made: it takes the bait (hooked, then the fight) or it bites and goes
  away with the bait ("hit it and ran", "stole the bait", "circled… and left with the bait").
- **Feeding times** (`route_library/pole/feeding.json`): Sharks, Hammerheads, Mantas and Marlins are only really around
  the bottom during their feeding window (60-150 s, every 3-5 min when the pole bank is healthy, 5-9 otherwise, with a
  "Sharks are feeding below" tag). Outside it they're rare, and a big bait waits 3× longer for a visitor. One small kind of
  fish also gets a feeding spell every few minutes. This decides who is near; the bite tables never change.

## 5. Diving fish
- Divers: Turtle, Manta, Octopus, Tuna, Swordfish, Marlin, Hammerhead, Shark (1 trip in 6), and whole Sardine,
  Minnow and Anchovy schools (1 in 15). Each fish's chance is in its `fish.json`.
- The dive point is picked when the trip starts, before anyone aims, inside that route's dive window (`rules.json`
  `dive`, picked by `route_library/tools/dive_spots.js` where the route runs through open water; 46 routes can dive, 13
  edge-hugging ones can't).
- A diving fish sinks (1 s), swims as a shadow 3-8 s, then rises further along the same route. The gun can't hit it
  while it's down, but it can bite a bait its route crosses.
- About 1 dive in 4 from the later part of a route never comes back: the fish joins the underwater world.
- **Rarity budget:** one dive at a time, 45-100 s between dives, sometimes 2-4 quiet minutes, no dives during a boss
  intro or a banner. That's about 25-30 dives an hour.
- Table: `DIVE`.

## 6. Deep visitors
- A Megalodon, Giant Squid, Kraken or Healer crosses as a huge shadow (28-40 s) every 12-25 minutes, and never surfaces.
- While one is in the water, the boss bait (Chum + Golden, 700) is on sale, and the visitor smells it from anywhere on the screen.
- Only comes when the pole bank is at 15,000+, or 9,000+ when the director takes the risk. Table: `DEEP`.

## 7. Gun show tools
- **Pacing:** never two high-intensity runs in a row (spike, roller, storm, giants). A calm or medium run comes next.
- **Risk check:** a boss waits one round (a Hunt plays instead) if the gun bank can't cover half of what the table is
  betting × 600. Table: `SHOW`.

## 8. Rituals (first version)
| Ritual | Green light | Chance per check | Own cooldown |
|---|---|---|---|
| Bait Ball | two small-fish schools near the middle | 35% | 10 min |
| Turtle Parade | a Turtle + 6 mediums on screen | 30% | 15 min |
| The Current | Monsoon season | 25% | 15 min |
| Night Water | Winter season | 25% | 15 min |
| Feeding Frenzy | right after a Bait Ball | 40% | – |

- 8-14 minutes between any two rituals (a Feeding Frenzy can follow a Bait Ball right away), so about 5-6 an hour. A ritual ends the current scene and its own scene plays next.
- Table: `RITUALS`, `RITUAL`.
- Not built yet: Make Way (fish parting for the Shark) and routes for every fish that respect each ritual.

## Lab
- `node lab/playerlab.js ...` as before; see `banks.md` in each run folder.
- Lab players shop: Fisher holds fish for the bonus (sells when short), Casual sells every 3 fish, Newbie sells right away.
  Fight skill (v9): Fisher lands 97% of fights, Casual 93%, Newbie 85%.
- The 7 small reef fish (Anchovy, Clownfish, Butterflyfish, Minnow, Pufferfish, Lionfish, Seahorse) now swim their designed
  library routes and formations. Routes that follow another fish (Wake rider) still need their own code.
  Fishers try the boss bait when a deep visitor shows up.
- `node lab/pole_audit.js` (pole rolls vs tables) and `node lab/market_calc.js` (market math) read the game file.

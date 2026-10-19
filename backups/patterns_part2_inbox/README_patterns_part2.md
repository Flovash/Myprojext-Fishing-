# Patterns part 2: every remaining fish now has routes

Made by Claude (phone chat) on 2026-10-18, while terminal Claude works on the director.
Kept in this inbox folder so it doesn't clash with the folder restructure.

## What's new (13 fish, 38 routes)
- Tiny: Anchovy (4), Clownfish (3), Butterflyfish (3)
- Small: Minnow (3), Pufferfish (3), Lionfish (3), Seahorse (3)
- Specials: Bomb Crab (3), Lightning Eel (3)
- Bosses: Healer Jellyfish (2), Megalodon (3), Giant Squid (2), Kraken (3), each with fight phases
- Shark: the 6 designed second-Shark moves now have descriptions (Hunting pair, Size-up, Food fight, Standoff, Waiting holder, Frenzy spreads)
- Laws: three new sections (small_fish, specials, bosses), 16 laws

Every fish has role, home, habit and fish-level rules. Every route has points, length,
purpose and its own "if" rules. Same format as fish/*.json in the route library.

## For terminal Claude: merge
1. Read patterns_part2.json in this folder.
2. Each entry in "fish" -> fish/<id>.json, or in the new structure
   fish/<id>/routes/<route id>/route.json + rules.json (the route's "rules" list).
3. Replace co_paths in fish/shark.json with "shark_co_paths".
4. Add "new_law_sections" to laws/laws.json.
5. Delete fish/_not_designed_yet.json (nothing is left undesigned).
6. Note in CHANGES.md. None of this is in the game code yet.

Pictures of every route: the Fish Route Library page in the Claude app.

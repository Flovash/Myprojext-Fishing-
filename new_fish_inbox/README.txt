NEW FISH INBOX
==============

Drop new fish designs here, one file per fish, then ask Claude Code to import them.
Copy TEMPLATE_new_fish.json, rename it to the fish's id (for example lanternfish.json) and fill it in.
A Google Doc containing the same JSON also works.

THE SCREEN
Points are [x, y] fractions of the screen.
  x: 0 = left edge, 1 = right edge
  y: 0 = top seat row, 1 = bottom seat row (5 seats along the top, 5 along the bottom)
Start and end every route OFF screen (below 0 or above 1, e.g. -0.1 or 1.1) so the fish swims in and out.
The game draws a smooth curve through the points. Add "sharp": true for straight lines with hard corners.
Every route is automatically mirrored left-right and top-bottom and run backwards, so one drawing gives 8 lanes.

FIELDS
  id            one word, lowercase start (lanternfish). Route ids look like glowArc.
  name          what players see.
  group         tiny, small, medium, big, boss or special. The group sets the odds; you do not set odds.
  pays          the multiplier range, e.g. "4-9x".
  role / home / habit   one plain sentence each.
  group_sizes   [smallest school, largest school].
  routes        at least one. Each needs id, name, dur [min, max] seconds on screen, pts, purpose.
  optional per route:
    pauses      [{"at": 0.5, "hold": [1, 2]}]  stop halfway along for 1-2 seconds (the "now!" moment)
    sharp       true = straight lines between the points
    crosser     true = a fast fish crossing the whole screen (counts toward the 2-fast-crossers limit)
    edge        true = only along the seat edges (never run backwards)
    shifts      [-0.2, 0, 0.2] = also slide the whole route left/right by these amounts
    lanes       [0.3, 0.5, 0.7] = also run it at these heights

RULE THAT NEVER CHANGES (law zero)
Routes only decide where and when a fish swims. They never change catch chances or pays.

WHAT HAPPENS NEXT
Claude Code runs: node route_library/tools/import_fish.js new_fish_inbox/<fish>.json
It checks the file (and lists anything to fix), adds the fish to route_library with a sketch of every route,
and updates "Fish & Routes" (the Google Sheet). Putting a brand-new fish into the game also needs its look
and size added to the game; ask Claude Code for that once the routes look right.

# PLAN: Director memory (its own brain that survives wipes)

Goal: what the director learns stays with it, even when session data is wiped
(e.g. clear 2 months of play and start with a new crowd). It keeps *what happened
and what it learned*, not a recording of the whole game. It can look back with fresh
eyes and test theories.

Build this after PLAN_director_tracking.md and PLAN_director_brain.md.

---

## 1. Two separate spaces

```
data/                 <- SESSION data. Wipeable. Logs, dispatch_log.csv, journal, players.
director/memory/      <- DIRECTOR'S OWN SPACE. Never wiped by "clear data".
  beliefs.json        what it currently believes, with confidence
  theories.json       ideas it is testing or has tested
  moments/            short notes of notable things that happened (one file per month)
  sessions/           one compact summary per session/season (the "diary")
  crowds/             a profile per crowd (crowd_A_garage_2026.json ...)
  odds_watch.json     measured vs designed payback per fish group (watch only)
  lessons.md          plain-English version anyone can read
  backups/            dated copies of the whole memory folder
```

Rule: **clearing data never touches director/memory/.** Only the owner can delete memory,
and only on purpose ("forget everything" command), with a backup made first.

## 2. Graduation: before any wipe

Before data/ is cleared, the director runs `graduate`:
1. Compresses the session into `sessions/<dates>_<crowd>.json` (stats per play,
   per player type, per route, per mission; quits, returns, best and worst moments).
2. Updates beliefs with the new evidence.
3. Saves the crowd profile.
4. Makes a backup.
Only then is the wipe allowed. If graduation fails, the wipe is blocked.

## 3. What it remembers (it decides, within these rules)

It does NOT store every frame. It stores:
- **Counters for every play** (small): times used, playtime bought, payback cost, by player type.
- **Moments**: only things worth remembering. A moment is saved when:
  - something new happens that it has never seen (first 2-Shark meeting with 8 players, a new route combo)
  - an outcome differs from what it expected by a lot (surprise score above a threshold)
  - a record (longest dry spell, biggest table win, longest session)
  - a player quits, returns, or changes type
  - a soft rule is challenged, or a theory gets a result
  - the owner gives a mission or overrides something
- **Odds watch**: designed vs measured payback per group and weapon. If they drift apart,
  it raises an alarm for the owner. It can only *report* odds problems, never change odds.

Moment format (one line JSON):
```json
{"t":"2026-11-02T21:14","kind":"surprise","what":"Tuna 6-pack corner run during Hook week",
 "expected":"12 catches","got":"4 catches","players":["Sprayer","Casual"],
 "guess":"too fast for casual players","tags":["tuna","corner_run","casual"]}
```

## 4. Beliefs (what it thinks is true)

```json
{"id":"b017","belief":"Casual players stay longer when a Manta visit comes in the first 3 minutes",
 "confidence":0.72,"evidence":41,"against":9,"first_seen":"2026-10-20","last_checked":"2026-12-01",
 "crowds":["A"],"general":false,"status":"active"}
```
- Confidence goes up and down with evidence. Old evidence slowly counts for less, but is never deleted.
- `general:true` means it held across 2+ crowds. Only general beliefs are trusted fully with a new crowd.
- The owner can read, edit, or veto any belief.

## 5. New crowd

When you start fresh with a different crowd:
- It starts a new crowd profile.
- It uses general beliefs as starting guesses, and crowd-only beliefs at half confidence.
- It re-checks them quickly in the first sessions (more exploring than usual, about 20% instead of 10%).
- It notes where the new crowd is different ("crowd B are more Snipers than crowd A").

## 6. Looking back and testing theories

Theory format:
```json
{"id":"t009","idea":"Dry spells over 45 s cause Newbies to quit, not losses",
 "status":"testing","from":"rethink 2026-12-05","test":"cap dry spells at 40 s for Newbie-heavy tables in 10% of waves",
 "measure":"quit rate per hour","result":null}
```
Status: idea -> testing -> supported / rejected -> retired. Rejected ideas can be re-opened.

Jobs:
- **Nightly review**: score today's plays, save moments, update beliefs.
- **Weekly rethink**: re-read old session summaries and moments with all the evidence so far.
  Ask: "what did I believe then, what do I see now?" New ideas become theories.
- **Theory tests** run inside the experiment share and the risk budget from PLAN_director_brain.md.
  They can also run in the player lab first, so nothing risky hits real players.

## 7. Limits (never change)

- Memory can never unlock a locked law (equal odds, group paybacks, payback band).
- Theories about odds are watch-only; it can test *show* (routes, timing, waves), not odds.
- Memory stays small: summaries and moments, target under 50 MB a year.
- Backups every night; keep the last 30 plus one per month.

## 8. Build order

1. Create director/memory/ and the "clear data never touches memory" rule.
2. graduate command (compress -> beliefs -> crowd profile -> backup -> allow wipe).
3. Moments recorder with the "worth remembering" rules.
4. Beliefs with confidence and owner veto.
5. Odds watch with alarms.
6. Theories + weekly rethink.
7. Lab test: run 2 "months" with crowd A in the lab, graduate, wipe, run crowd B,
   and check the director starts smarter than a blank one (compare hook rate and
   return rate in the first week vs a director with empty memory).
8. lessons.md written in plain words after every graduation and rethink.

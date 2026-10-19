# PLAN: Theory board (how an idea becomes official)

Every session the director writes theories. Nothing becomes official until it has been
written down, discussed by the owner, tested, and signed off.
Builds on PLAN_director_memory.md (theories.json, moments, beliefs).

---

## 1. Every session: the director writes theories

At the end of each session it writes 1 to 3 theory cards (more only if something big happened).

Kinds of theory:
- **Winning**: how wins and losses feel at the table. Example: "big wins right after a dry spell bring players back more than steady small wins."
  (This is about *timing and the show*, never about changing one player's odds.)
- **Keeping players**: what makes people stay, quit or come back.
- **Players**: types, groups, how a crowd behaves.
- **Fish and routes**: which routes, formations and waves work.
- **Rules**: a soft rule that seems to get in the way.
- **Wild ideas**: anything else it noticed. Allowed, just labeled as wild.

## 2. The theory card (one file each)

`director/memory/theories/T-2026-031_big_win_after_dry_spell.md`

```
# T-2026-031  Big wins after a dry spell bring players back
Kind: winning          Status: draft          Written: 2026-11-04 (session 12)

## The idea
In plain words, one or two sentences.

## Why I think so
The moments and numbers that made me notice it (links to moments/ and sessions/).

## How to test it
Lab first: which personas, how many hours, which seeds.
Live (only if approved): what share of waves, for how many days.

## What would prove it wrong
The result that would make me drop it. Written BEFORE the test.

## Risk
Payback risk, player-experience risk, which locked laws it touches (must be none).

## Discussion
- director: ...
- owner: ...
- reviewer (Claude): ...

## Results
(filled in after testing)

## Decision
(owner signs here)
```

## 3. The ladder

```
draft -> discussed -> approved to test -> lab test -> live test -> results -> review
      -> OFFICIAL  |  rejected  |  needs more testing  |  parked
```

- **draft**: director wrote it. It can't do anything yet.
- **discussed**: the owner (and a Claude reviewer) have commented, and the director has answered every question.
  The director must reply to objections, not ignore them. It may change the card.
- **approved to test**: the owner says go. Lab test first, always.
- **live test**: only after the lab looks good, inside the experiment share (about 10% of waves) and the risk budget.
- **review**: results are compared with the "what would prove it wrong" line written before the test.
- **OFFICIAL**: only the owner can sign it. Then it moves into the official book.
- **rejected** or **parked** ideas are kept, never deleted, and can be reopened later.

## 4. Three voices

1. **Director**: writes theories, answers questions, runs tests, reports honestly (including bad results).
2. **Owner (you)**: comments, approves tests, signs official decisions. Final say, always.
3. **Reviewer (Claude)**: reads each card and points out weak evidence, missing tests,
   luck vs real effect (enough sessions? enough seeds?) and any locked law being touched.

## 5. Official book

`director/memory/official/` is the director's rulebook, numbered:

```
OFF-001  Manta in the first 3 minutes for Casual-heavy tables   (from T-2026-007, signed 2026-11-10)
OFF-002  ...
```
- Only official entries can change the director's default plans for good.
- Each entry keeps its card, discussion, test data and signature.
- Official entries are reviewed again every few months, or when a new crowd arrives.
  The owner can unsign an entry, which moves it back to "needs more testing".

## 6. Theory meeting (weekly)

The director writes `theory_meeting_<date>.md`:
- new cards waiting for discussion
- tests running, with progress
- results ready for a decision
- official entries due for a re-check

You read it on your phone, comment, and approve or reject. That's the meeting.

## 7. Limits

- A theory can never unlock a locked law (equal odds for every shot, group paybacks, payback band).
- No theory may target one player's odds. Theories change the show, the timing and the plays only.
- Unofficial theories only act inside approved tests, nowhere else.
- Cap: at most 3 live tests at once, so results don't mix up.

## 8. Build order

1. Theory card template, plus theories/ folder and status field.
2. End-of-session writer (1 to 3 cards from moments and surprises).
3. Discussion section: owner and reviewer comments, director replies.
4. Approve-to-test switch and lab test runner.
5. Live test inside the experiment share and risk budget.
6. Results vs "would prove it wrong", then review.
7. Official book with signatures, plus re-check schedule.
8. Weekly theory meeting file.

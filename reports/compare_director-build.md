# Lab comparison: director-build

Made 2026-10-18 14:41 by `node lab/compare.js --name director-build baseline-v7 routes-v8 tuna-formations season-3 season-6 season-9 plays-on`. Each cell is the average over the seeds, with the lowest and highest seed in brackets.

| | **baseline-v7** | **routes-v8** | **tuna-formations** | **season-3** | **season-6** | **season-9** | **plays-on** |
|---|---|---|---|---|---|---|---|
| Runs | 3 × 12 h | 3 × 12 h | 3 × 12 h | 3 × 12 h | 3 × 12 h | 3 × 12 h | 3 × 12 h |
| Changes | none | season_length_waves 6 → 0 | season_length_waves 6 → 0 | season_length_waves 6 → 3 | season_length_waves 6 → 6 | season_length_waves 6 → 9 | season_length_waves 6 → 6 |
| Plays | none (old game) | off | off | off | off | off | all on |
| Table payback % | 88.6 (85.2–92.5) | 93.7 (89.6–99.4) | 88.9 (85.3–90.9) | 93.7 (90.9–97.9) | 90.3 (88.0–93.3) | 96.9 (93.5–102.0) | 93.3 (91.6–96.6) |
| Gun payback % | 85.4 (79.4–91.5) | 92.6 (87.4–100.4) | 86.6 (80.2–91.0) | 93.1 (89.7–99.0) | 87.1 (83.9–91.2) | 97.1 (92.6–103.6) | 92.2 (89.4–96.2) |
| Pole payback % | 95.7 (94.9–97.0) | 96.5 (95.7–97.3) | 94.4 (90.6–96.5) | 95.0 (93.9–96.2) | 96.8 (96.3–97.8) | 96.4 (95.7–97.6) | 96.2 (93.6–98.0) |
| Seat spread (pts) | 48.6 (31.6–66.8) | 55.0 (54.6–55.6) | 44.7 (35.9–55.9) | 63.5 (55.1–69.7) | 60.6 (42.4–85.6) | 65.7 (62.1–68.2) | 51.1 (41.9–68.2) |
| Average session (min) | 35.0 (34.6–35.5) | 35.3 (34.3–36.0) | 34.4 (33.6–35.3) | 35.3 (35.0–35.5) | 35.3 (34.5–35.7) | 34.9 (34.3–35.5) | 35.1 (34.0–36.4) |
| Longest dry spell, p90 (s) | 66.9 (62.5–72.6) | 70.7 (69.1–72.1) | 70.4 (66.0–76.2) | 70.0 (64.2–75.2) | 74.4 (72.0–78.3) | 67.9 (65.4–69.9) | 73.3 (68.2–79.3) |
| Time between wins, p90 (s) | 13.2 (13.1–13.4) | 13.2 (13.0–13.5) | 13.0 (12.7–13.3) | 13.1 (13.0–13.2) | 13.0 (13.0–13.1) | 13.1 (13.0–13.2) | 13.1 (12.9–13.5) |
| Catches per player-minute | 10.4 (10.2–10.4) | 10.3 (10.2–10.5) | 10.5 (10.3–10.8) | 10.5 (10.4–10.5) | 10.5 (10.4–10.5) | 10.5 (10.4–10.6) | 10.4 (10.2–10.6) |
| Plays fired | – | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) | 209 (205–217) |
| Medium fish caught (% of fish sent) | – | 41.0 (39.5–41.8) | 39.2 (38.6–39.8) | 39.1 (38.3–39.8) | 40.1 (39.8–40.4) | 40.1 (39.4–40.8) | 39.7 (38.5–40.5) |
| Medium: first catch after sending (s) | – | 8.4 (8.4–8.5) | 8.3 (8.2–8.5) | 8.3 (8.2–8.3) | 8.4 (8.3–8.5) | 8.4 (8.3–8.5) | 8.5 (8.3–8.6) |
| Medium schools with no catch (%) | – | 44.9 (43.9–46.4) | 43.3 (42.6–44.2) | 43.0 (42.3–43.4) | 42.5 (42.1–43.0) | 42.5 (42.1–42.8) | 42.7 (41.9–44.1) |

Runs: baseline-v7: 2026-10-18_0354_baseline-v7_s3, 2026-10-18_0354_baseline-v7_s2, 2026-10-18_0354_baseline-v7_s1; routes-v8: 2026-10-18_0349_routes-v8_s3, 2026-10-18_0349_routes-v8_s2, 2026-10-18_0349_routes-v8_s1; tuna-formations: 2026-10-18_0400_tuna-formations_s1, 2026-10-18_0400_tuna-formations_s2, 2026-10-18_0400_tuna-formations_s3; season-3: 2026-10-18_0406_season-3_s1, 2026-10-18_0406_season-3_s2, 2026-10-18_0406_season-3_s3; season-6: 2026-10-18_0412_season-6_s3, 2026-10-18_0412_season-6_s2, 2026-10-18_0413_season-6_s1; season-9: 2026-10-18_0418_season-9_s3, 2026-10-18_0419_season-9_s1, 2026-10-18_0419_season-9_s2; plays-on: 2026-10-18_0425_plays-on_s2, 2026-10-18_0425_plays-on_s1, 2026-10-18_0425_plays-on_s3

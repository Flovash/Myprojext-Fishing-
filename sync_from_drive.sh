#!/bin/bash
# Copy the code from the Fish Game Table Drive folder into this repo. Data and reports stay in Drive.
# usage: ./sync_from_drive.sh   (run from the repo folder), then git add -A && git commit && git push
set -euo pipefail
DRIVE="$(ls -d "$HOME"/Library/CloudStorage/GoogleDrive-*/"My Drive/Fish Game Table" | head -1)"
REPO="$(cd "$(dirname "$0")" && pwd)"
RS=(rsync -a --delete --exclude '.DS_Store' --exclude '*.gsheet' --exclude '*.gdoc')
"${RS[@]}" "$DRIVE/game/" "$REPO/game/"
"${RS[@]}" "$DRIVE/simulator/" "$REPO/simulator/"
# route library without lab data: data/ (dispatch log, scoreboard), readable/ (lab stats copies), each route's stats.csv
"${RS[@]}" --exclude 'data/' --exclude 'readable/' --exclude 'stats.csv' "$DRIVE/route_library/" "$REPO/route_library/"
cp "$DRIVE/Reef Playbook.html" "$REPO/reef_playbook.html"
echo "synced from Drive"

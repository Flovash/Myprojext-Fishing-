#!/bin/bash
# Copy everything from the Fish Game Table Drive folder into this repo (the Drive folder is the working copy).
# usage: ./sync_from_drive.sh   (run from the repo folder), then git add -A && git commit && git push
# Left out: Google Docs/Sheets shortcut files (.gsheet/.gdoc only open inside Drive and carry the owner's email), .DS_Store, lock files.
# Kept from the repo itself: index.html (the website's front page), .nojekyll, .gitignore, this script.
set -euo pipefail
DRIVE="$(ls -d "$HOME"/Library/CloudStorage/GoogleDrive-*/"My Drive/Fish Game Table" | head -1)"
REPO="$(cd "$(dirname "$0")" && pwd)"
rsync -a --delete \
  --exclude '.git/' --exclude '.DS_Store' --exclude '*.gsheet' --exclude '*.gdoc' --exclude '.lock/' \
  --exclude '/Reef Playbook.html' \
  --filter 'P /index.html' --filter 'P /.nojekyll' --filter 'P /.gitignore' --filter 'P /sync_from_drive.sh' --filter 'P /reef_playbook.html' \
  "$DRIVE/" "$REPO/"
# the playbook gets a web-friendly name (no space) for the website
cp "$DRIVE/Reef Playbook.html" "$REPO/reef_playbook.html"
echo "synced from Drive"

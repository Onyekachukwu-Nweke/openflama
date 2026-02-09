#!/bin/bash
set -e

if [ -z "$GITHUB_TOKEN" ] || [ -z "$GITHUB_OWNER" ] || [ -z "$GITHUB_REPO" ]; then
  echo "Error: GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO must be set"
  exit 1
fi

REMOTE_URL="https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_OWNER}/${GITHUB_REPO}.git"

git remote add github "$REMOTE_URL" 2>/dev/null || git remote set-url github "$REMOTE_URL"

git push github HEAD:main --force

echo "Pushed to https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}"

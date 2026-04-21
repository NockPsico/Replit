#!/bin/bash
set -e

REPO_URL="https://github.com/NockPsico/Replit.git"
GITHUB_USER="NockPsico"

if [ -z "${GITHUB_TOKEN}" ]; then
  echo "ERROR: GITHUB_TOKEN secret is not set. Configure it in Replit Secrets." >&2
  exit 1
fi

AUTH_URL="https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/NockPsico/Replit.git"

git config user.email "replit-agent@replit.com" 2>/dev/null || true
git config user.name "Replit Agent" 2>/dev/null || true

echo "Sincronizando com GitHub (${REPO_URL})..."
git push "${AUTH_URL}" HEAD:main
echo "GitHub sincronizado com sucesso."

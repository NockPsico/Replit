#!/bin/bash
set -e
pnpm install --frozen-lockfile
pnpm --filter db push

# Sincronização automática com GitHub
git config user.email "replit-agent@replit.com" || true
git config user.name "Replit Agent" || true
git push replit HEAD:main --force || echo "GitHub push falhou, continuando..."

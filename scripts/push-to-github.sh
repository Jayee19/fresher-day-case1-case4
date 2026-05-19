#!/bin/bash
# Run from Terminal: bash scripts/push-to-github.sh YOUR_GITHUB_USERNAME REPO_NAME
set -e
USER="${1:?Usage: bash scripts/push-to-github.sh GITHUB_USERNAME REPO_NAME}"
REPO="${2:?Usage: bash scripts/push-to-github.sh GITHUB_USERNAME REPO_NAME}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

rm -rf case1-campus-found/.git
rm -rf .git
git init
git add -A
git commit -m "Fresher Day: Case 1 Campus Loop + Case 4 Churn Detective"
git branch -M main
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/${USER}/${REPO}.git"
echo ""
echo "Repo ready. Create empty repo at: https://github.com/new?name=${REPO}"
echo "Then run: git push -u origin main"
echo "(Use a GitHub Personal Access Token as password if prompted)"

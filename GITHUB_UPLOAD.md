# Upload to GitHub

One repo for **Case 1 + Case 4** (recommended for submission).

## 1. Create an empty repo on GitHub

1. Go to https://github.com/new
2. Repository name: e.g. `fresher-day-case1-case4`
3. **Do not** add README, .gitignore, or license (you already have files locally)
4. Click **Create repository**

## 2. Run these commands in Terminal

```bash
cd /Users/jayeedas/Projects/fresher-day-case1-case4

# remove broken partial git folder in case1 if it exists
rm -rf case1-campus-found/.git

git init
git add -A
git status

git commit -m "$(cat <<'EOF'
Add Case 1 Campus Loop and Case 4 Churn Detective deliverables.

Includes Next.js lost & found app, churn notebook, data, and CMO deliverables.
EOF
)"

git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fresher-day-case1-case4.git
git push -u origin main
```

Replace `YOUR_USERNAME` and the repo name with yours.

## 3. If GitHub asks for login

- **HTTPS:** use a [Personal Access Token](https://github.com/settings/tokens) as the password, or
- **SSH:** use `git@github.com:YOUR_USERNAME/fresher-day-case1-case4.git` as `origin` instead

## 4. Optional — two separate repos

If your course wants one repo per case:

```bash
# Case 1 only
cd case1-campus-found
git init && git add -A && git commit -m "Case 1: Campus Loop lost & found"
# create repo on GitHub, then push

# Case 4 only
cd ../case4-churn-detective
git init && git add -A && git commit -m "Case 4: Churn Detective"
# create second repo on GitHub, then push
```

## What is ignored (not uploaded)

- `case1-campus-found/node_modules/`, `.next/`, `.env`, `*.db`
- `case4-churn-detective/.venv/`, `.ipynb_checkpoints/`

The CSV `case4-churn-detective/data/case4_telecom_churn.csv` **is** included (~800KB). If you use the official pack file, replace it before committing.

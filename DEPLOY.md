# GitHub + Vercel deploy (Case 1)

## Part A — Push to GitHub (5 minutes)

### 1. Create empty repo on GitHub

1. Open https://github.com/new  
2. Repository name: `fresher-day-case1-case4` (or any name)  
3. **Do not** add README, .gitignore, or license  
4. Click **Create repository**

### 2. Run in Terminal

```bash
cd /Users/jayeedas/Projects/fresher-day-case1-case4

git init
git add -A
git commit -m "Fresher Day: Case 1 Campus Loop + Case 4 Churn Detective"

git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/fresher-day-case1-case4.git
git push -u origin main
```

Replace `YOUR_GITHUB_USERNAME` and repo name.

**Login:** GitHub no longer accepts account passwords for `git push`. Use a **Personal Access Token** as the password: https://github.com/settings/tokens → Generate (classic) → scope `repo`.

---

## Part B — Deploy Case 1 on Vercel (15 minutes)

SQLite **does not work** on Vercel (no persistent disk). Use free **Neon** Postgres.

### 1. Create Neon database

1. https://neon.tech → Sign up (GitHub login is fine)  
2. **New project** → copy the **connection string** (starts with `postgresql://...`)  
3. It must include `?sslmode=require` (Neon usually adds this)

### 2. Switch Prisma to Postgres (one-time)

```bash
cd /Users/jayeedas/Projects/fresher-day-case1-case4/case1-campus-found

cp prisma/schema.prisma prisma/schema.sqlite.backup
cp prisma/schema.postgresql.prisma prisma/schema.prisma
```

### 3. Push schema + seed to Neon (local, once)

```bash
export DATABASE_URL="postgresql://USER:PASS@HOST/neondb?sslmode=require"

npx prisma db push
npm run db:seed
```

### 4. Deploy on Vercel

1. https://vercel.com → Sign up with **GitHub**  
2. **Add New Project** → Import your `fresher-day-case1-case4` repo  
3. **Important settings:**
   - **Root Directory:** `case1-campus-found` (click Edit)
   - **Framework Preset:** Next.js  
4. **Environment Variables:**
   - Name: `DATABASE_URL`  
   - Value: (same Neon connection string)  
5. Click **Deploy**

Wait ~2–3 minutes. Open the `.vercel.app` URL in **incognito** and confirm the feed loads.

### 5. Seed production (if feed is empty)

From your machine (with `DATABASE_URL` set to Neon):

```bash
cd case1-campus-found
npm run db:seed
```

Refresh the live site.

### 6. Commit Postgres schema (optional but recommended)

```bash
cd /Users/jayeedas/Projects/fresher-day-case1-case4
git add case1-campus-found/prisma/schema.prisma
git commit -m "Use PostgreSQL schema for Vercel deployment"
git push
```

---

## Part C — What to paste in the submission form

| Field | Value |
|-------|--------|
| Google Doc | Your doc with GitHub + deploy + video links |
| Deployment Link | `https://your-project.vercel.app` |
| Video Link | YouTube or Drive |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `git push` rejected | Create repo on GitHub first; check remote URL |
| Vercel build fails on Prisma | Set `DATABASE_URL` in Vercel env; use Postgres schema |
| Live site has no posts | Run `npm run db:seed` with production `DATABASE_URL` |
| Images 404 in terminal | Unsplash URLs; re-run seed or ignore for demo |

## Local dev after switching to Postgres

Keep using Neon URL in `.env`, or restore SQLite:

```bash
cp prisma/schema.sqlite.backup prisma/schema.prisma
# .env: DATABASE_URL="file:./dev.db"
npx prisma db push && npm run db:seed
```

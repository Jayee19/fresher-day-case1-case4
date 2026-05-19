# Case 1 — Campus Loop (Lost & Found)

Instagram-inspired lost & found for a campus: big imagery, fast posting, lightweight matching, and a **claim → poster confirms** flow (multiple claims allowed until one is accepted).

## Stack
- Next.js 14 (App Router) + TypeScript + Tailwind
- Prisma + **SQLite** locally (`file:./dev.db`)

## Quick start
```bash
npm install
npx prisma db push
npm run db:seed
npm run dev
```
Open http://localhost:3000

## Deploy (Vercel + hosted Postgres)
SQLite on Vercel serverless is not durable. For submission:
1. Create a free **Neon** or **Supabase** Postgres database.
2. Set `DATABASE_URL` to the Postgres URL in Vercel project settings.
3. Change `prisma/schema.prisma` `provider` to `postgresql` (or use `prisma migrate` on Postgres).
4. Run `npx prisma db push` (or `migrate deploy`) against production, then seed if desired.

## Demo script (video)
1. Set your display name in the header.
2. **I lost something** → post with photo URL, location, story.
3. Open a seeded **Found** match card → **Send claim** (use a second browser/incognito as “another student”, or clear cookies).
4. Back in the first browser (poster session), **Confirm match** on the claim.

## Auth note
Anonymous **httpOnly `lf_uid`** cookie + optional display name. Good for a prototype; production would use campus SSO (OIDC/SAML) and verified email/phone.

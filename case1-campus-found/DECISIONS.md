# Decisions log — Case 1 (Campus Loop)

## Stack
- **Next.js + Prisma** for a single-repo full-stack app with fast UI iteration and typed data access.
- **SQLite** for zero-config local demos; README documents moving to **Postgres** for real deploys.

## Auth
- **Anonymous session cookie** (`lf_uid`, httpOnly) plus a user-chosen **display name** cookie.
- Rationale: the brief allows justifying a prototype shortcut; implementing OAuth without a real campus IdP would distract from UX and matching.

## Matching logic
- **Weighted blend** of token overlap on title/description (Jaccard on de-noised tokens), location similarity (exact / substring / token overlap), and date proximity (decay over ~3 weeks).
- Rationale: explainable, fast on small data, good enough for demo; production would add embeddings and/or perceptual hashing for images.

## Claims
- **Multiple pending claims** are allowed; accepting one **resolves** the post and auto-rejects other pendings.
- Rationale: matches the brief’s messy edge case (two people claim the same item) without blocking legitimate parallel attempts.

## Imagery
- **Image URL** field (Unsplash-friendly) instead of binary uploads.
- Rationale: Vercel serverless has no durable local disk; real uploads would go to S3/Cloudinary/Supabase Storage.

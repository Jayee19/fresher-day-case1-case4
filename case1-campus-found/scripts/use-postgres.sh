#!/bin/bash
# Switch Prisma to PostgreSQL for Vercel/Neon deploy
set -e
cd "$(dirname "$0")/.."
cp prisma/schema.prisma prisma/schema.sqlite.backup
cp prisma/schema.postgresql.prisma prisma/schema.prisma
echo "Switched to PostgreSQL. Set DATABASE_URL in .env then:"
echo "  npx prisma db push"
echo "  npm run db:seed"

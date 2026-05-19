import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rankMatches } from "@/lib/match";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const opposite = post.kind === "LOST" ? "FOUND" : "LOST";
  const pool = await prisma.post.findMany({
    where: { kind: opposite, status: "OPEN" },
  });

  const matches = rankMatches(post, pool);
  return NextResponse.json(matches);
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  const { id: postId } = await ctx.params;
  const jar = await cookies();
  const claimantId = jar.get("lf_uid")?.value;
  if (!claimantId) {
    return NextResponse.json({ error: "Session missing" }, { status: 400 });
  }

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (post.status === "RESOLVED") {
    return NextResponse.json({ error: "This post is already resolved" }, { status: 400 });
  }
  if (post.authorId === claimantId) {
    return NextResponse.json({ error: "You cannot claim your own post" }, { status: 400 });
  }

  const body = (await req.json()) as { claimantName?: string; message?: string };
  const claimantName = (body.claimantName ?? "").trim().slice(0, 48);
  const message = (body.message ?? "").trim().slice(0, 500) || null;
  if (!claimantName) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }

  const existing = await prisma.claim.findFirst({
    where: { postId, claimantId, status: "PENDING" },
  });
  if (existing) {
    return NextResponse.json({ error: "You already have a pending claim" }, { status: 400 });
  }

  const claim = await prisma.claim.create({
    data: { postId, claimantId, claimantName, message },
  });

  return NextResponse.json(claim);
}

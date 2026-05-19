import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const jar = await cookies();
  const uid = jar.get("lf_uid")?.value;
  if (!uid) return NextResponse.json({ error: "Session missing" }, { status: 400 });

  const body = (await req.json()) as { action?: string };
  const action = body.action === "reject" ? "reject" : "accept";

  const claim = await prisma.claim.findUnique({
    where: { id },
    include: { post: true },
  });
  if (!claim) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (claim.post.authorId !== uid) {
    return NextResponse.json({ error: "Only the poster can decide claims" }, { status: 403 });
  }
  if (claim.status !== "PENDING") {
    return NextResponse.json({ error: "Claim already resolved" }, { status: 400 });
  }

  if (action === "accept") {
    await prisma.$transaction(async (tx) => {
      await tx.claim.update({
        where: { id },
        data: { status: "ACCEPTED" },
      });
      await tx.claim.updateMany({
        where: { postId: claim.postId, id: { not: id }, status: "PENDING" },
        data: { status: "REJECTED" },
      });
      await tx.post.update({
        where: { id: claim.postId },
        data: { status: "RESOLVED" },
      });
    });
    return NextResponse.json({ ok: true, status: "ACCEPTED" });
  }

  await prisma.claim.update({ where: { id }, data: { status: "REJECTED" } });
  return NextResponse.json({ ok: true, status: "REJECTED" });
}

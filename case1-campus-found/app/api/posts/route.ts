import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const kind = searchParams.get("kind");
  const where =
    kind === "LOST" || kind === "FOUND"
      ? { kind }
      : {};
  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { claims: { where: { status: "PENDING" } } },
  });
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const jar = await cookies();
  const authorId = jar.get("lf_uid")?.value;
  if (!authorId) {
    return NextResponse.json({ error: "Session missing" }, { status: 400 });
  }
  const body = (await req.json()) as {
    kind?: string;
    title?: string;
    description?: string;
    location?: string;
    occurredAt?: string;
    imageUrl?: string | null;
    authorName?: string;
  };
  const kind = body.kind === "FOUND" ? "FOUND" : "LOST";
  const title = (body.title ?? "").trim().slice(0, 80);
  const description = (body.description ?? "").trim().slice(0, 2000);
  const location = (body.location ?? "").trim().slice(0, 120);
  const authorName = (body.authorName ?? "").trim().slice(0, 48);
  const imageUrl = body.imageUrl?.trim() || null;
  const occurredAt = body.occurredAt ? new Date(body.occurredAt) : new Date();
  if (!title || !description || !location || !authorName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (Number.isNaN(occurredAt.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
  const post = await prisma.post.create({
    data: {
      kind,
      title,
      description,
      location,
      occurredAt,
      imageUrl,
      authorId,
      authorName,
    },
  });
  return NextResponse.json(post);
}

import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostDetail } from "./PostDetail";

export const dynamic = "force-dynamic";

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { claims: { orderBy: { createdAt: "desc" } } },
  });
  if (!post) notFound();

  const jar = await cookies();
  const viewerId = jar.get("lf_uid")?.value ?? null;

  const opposite = post.kind === "LOST" ? "FOUND" : "LOST";
  const pool = await prisma.post.findMany({
    where: { kind: opposite as "LOST" | "FOUND", status: "OPEN" },
  });
  const { rankMatches } = await import("@/lib/match");
  const matches = rankMatches(post, pool);

  return <PostDetail post={post} matches={matches} viewerId={viewerId} />;
}

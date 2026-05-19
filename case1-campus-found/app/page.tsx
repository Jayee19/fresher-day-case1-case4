import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/PostCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { claims: { where: { status: "PENDING" } } },
    take: 60,
  });

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">What went missing today?</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-stone-300">
          Post in seconds, skim beautiful cards, and let simple matching surface the one line that might be yours.
          Built for thumbs, not admin forms.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/post/new?kind=lost"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-stone-900 shadow-lg shadow-white/10"
          >
            I lost something
          </Link>
          <Link
            href="/post/new?kind=found"
            className="rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-white"
          >
            I found something
          </Link>
        </div>
      </section>

      {posts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 p-10 text-center text-sm text-stone-400">
          No posts yet. Seed the demo or be the first to post.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}

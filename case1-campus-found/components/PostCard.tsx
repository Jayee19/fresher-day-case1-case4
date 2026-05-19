import Image from "next/image";
import Link from "next/link";
import type { Post, Claim } from "@prisma/client";

type PostWithClaims = Post & { claims?: Claim[] };

const badge: Record<string, string> = {
  LOST: "from-rose-500/90 to-orange-500/90",
  FOUND: "from-emerald-500/90 to-teal-500/90",
};

export function PostCard({ post }: { post: PostWithClaims }) {
  const pending = post.claims?.filter((c) => c.status === "PENDING").length ?? 0;
  const img =
    post.imageUrl ||
    "https://picsum.photos/id/1003/800/1000";

  return (
    <Link href={`/post/${post.id}`} className="group block overflow-hidden rounded-3xl glass">
      <div className="relative aspect-[4/5] w-full bg-stone-900">
        <Image
          src={img}
          alt=""
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div
          className={`absolute left-3 top-3 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-lg ${badge[post.kind]}`}
        >
          {post.kind === "LOST" ? "Lost" : "Found"}
        </div>
        {pending > 0 ? (
          <div className="absolute right-3 top-3 rounded-full bg-black/55 px-2 py-1 text-[11px] text-amber-200 ring-1 ring-amber-400/40">
            {pending} claim{pending > 1 ? "s" : ""}
          </div>
        ) : null}
        <div className="absolute bottom-0 left-0 right-0 space-y-1 p-4">
          <p className="line-clamp-2 text-base font-semibold leading-snug">{post.title}</p>
          <p className="text-xs text-stone-300">{post.location}</p>
        </div>
      </div>
    </Link>
  );
}

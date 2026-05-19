"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Claim, Post } from "@prisma/client";
import type { MatchCandidate } from "@/lib/match";

type Props = {
  post: Post & { claims: Claim[] };
  matches: MatchCandidate[];
  viewerId: string | null;
};

export function PostDetail({ post, matches, viewerId }: Props) {
  const router = useRouter();
  const isAuthor = viewerId === post.authorId;
  const [claimantName, setClaimantName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const img =
    post.imageUrl ||
    "https://picsum.photos/id/1003/1200/900";

  async function submitClaim(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const res = await fetch(`/api/posts/${post.id}/claims`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claimantName, message }),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j.error ?? "Could not claim");
      return;
    }
    setClaimantName("");
    setMessage("");
    router.refresh();
  }

  async function decideClaim(claimId: string, action: "accept" | "reject") {
    setBusy(true);
    await fetch(`/api/claims/${claimId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setBusy(false);
    router.refresh();
  }

  const canClaim = Boolean(viewerId && !isAuthor && post.status !== "RESOLVED");

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <article className="space-y-4">
        <div className="overflow-hidden rounded-3xl glass">
          <div className="relative aspect-[16/11] w-full bg-stone-900">
            <Image src={img} alt="" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white ring-1 ring-white/15">
              {post.kind === "LOST" ? "Lost" : "Found"}
            </div>
          </div>
          <div className="space-y-2 p-5">
            <h1 className="text-2xl font-semibold tracking-tight">{post.title}</h1>
            <p className="text-sm text-stone-300">{post.location}</p>
            <p className="text-sm leading-relaxed text-stone-200">{post.description}</p>
            <p className="text-xs text-stone-500">
              Posted by <span className="text-stone-300">{post.authorName}</span> ·{" "}
              {new Date(post.occurredAt).toLocaleString()} · status {post.status}
            </p>
          </div>
        </div>

        {isAuthor && post.claims.some((c) => c.status === "PENDING") ? (
          <section className="rounded-3xl border border-amber-400/25 bg-amber-500/5 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-100">Claims</h2>
            <p className="mt-1 text-xs text-stone-400">
              Accept the person who actually matches your item. Everyone else is auto-declined.
            </p>
            <ul className="mt-4 space-y-3">
              {post.claims
                .filter((c) => c.status === "PENDING")
                .map((c) => (
                <li key={c.id} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold">{c.claimantName}</p>
                      {c.message ? <p className="text-xs text-stone-400">{c.message}</p> : null}
                    </div>
                    <span className="text-[11px] uppercase tracking-wide text-stone-500">{c.status}</span>
                  </div>
                  {c.status === "PENDING" ? (
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => decideClaim(c.id, "accept")}
                        className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-emerald-950"
                      >
                        Confirm match
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => decideClaim(c.id, "reject")}
                        className="rounded-full border border-white/15 px-4 py-1.5 text-xs text-stone-200"
                      >
                        Not them
                      </button>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>

      <aside className="space-y-6">
        <section className="rounded-3xl glass p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-300">Likely matches</h2>
          <p className="mt-1 text-xs text-stone-500">
            Lightweight text + location + date scoring — tuned for demos, not perfection.
          </p>
          {matches.length === 0 ? (
            <p className="mt-4 text-sm text-stone-400">No strong candidates yet. Try widening your wording.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {matches.map((m) => (
                <li key={m.id} className="rounded-2xl border border-white/10 bg-black/25 p-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <Link href={`/post/${m.id}`} className="font-semibold text-orange-100 hover:underline">
                      {m.title}
                    </Link>
                    <span className="text-xs text-stone-400">{m.score}</span>
                  </div>
                  <p className="text-xs text-stone-500">{m.location}</p>
                  <p className="mt-1 text-[11px] text-stone-400">{m.reasons.join(" · ")}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {canClaim ? (
          <section className="rounded-3xl border border-white/10 bg-black/30 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-200">Claim this item</h2>
            <p className="mt-1 text-xs text-stone-500">
              One tap for the finder/loser to raise their hand. Poster confirms to avoid random grabs.
            </p>
            <form className="mt-4 space-y-3" onSubmit={submitClaim}>
              <input
                required
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none ring-orange-400/30 focus:ring-2"
                placeholder="Your name as it appears on campus"
                value={claimantName}
                onChange={(e) => setClaimantName(e.target.value)}
              />
              <textarea
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none ring-orange-400/30 focus:ring-2"
                rows={3}
                placeholder="Why is it yours? (stickers, lock screen, serial hint…)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              {err ? <p className="text-xs text-rose-300">{err}</p> : null}
              <button
                disabled={busy}
                type="submit"
                className="w-full rounded-full bg-white py-2.5 text-sm font-semibold text-stone-900 disabled:opacity-60"
              >
                {busy ? "Sending…" : "Send claim"}
              </button>
            </form>
          </section>
        ) : null}

        {!viewerId ? (
          <p className="text-xs text-stone-500">Session is initializing — refresh if buttons stay disabled.</p>
        ) : null}
      </aside>
    </div>
  );
}

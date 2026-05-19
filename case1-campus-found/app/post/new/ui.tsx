"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Kind = "LOST" | "FOUND";

export function NewPostForm({ initialKind }: { initialKind: Kind }) {
  const router = useRouter();
  const [kind, setKind] = useState<Kind>(initialKind);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [occurredAt, setOccurredAt] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  });
  const [imageUrl, setImageUrl] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((d: { displayName?: string }) => {
        if (d.displayName) setAuthorName(d.displayName);
      })
      .catch(() => {});
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind,
        title,
        description,
        location,
        occurredAt: new Date(occurredAt).toISOString(),
        imageUrl: imageUrl || null,
        authorName,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j.error ?? "Could not save");
      return;
    }
    const post = await res.json();
    router.push(`/post/${post.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-3xl glass p-6">
      <div className="flex gap-2 rounded-full bg-black/30 p-1">
        {(["LOST", "FOUND"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={`flex-1 rounded-full py-2 text-xs font-semibold uppercase tracking-wide ${
              kind === k
                ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white"
                : "text-stone-400"
            }`}
          >
            {k === "LOST" ? "Lost" : "Found"}
          </button>
        ))}
      </div>

      <label className="block text-xs uppercase tracking-wide text-stone-400">
        Title
        <input
          required
          className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none ring-orange-400/30 focus:ring-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Black AirPods case"
        />
      </label>

      <label className="block text-xs uppercase tracking-wide text-stone-400">
        Story
        <textarea
          required
          rows={4}
          className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none ring-orange-400/30 focus:ring-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Scratches near the hinge, small sticker of a cat…"
        />
      </label>

      <label className="block text-xs uppercase tracking-wide text-stone-400">
        Location tag
        <input
          required
          className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none ring-orange-400/30 focus:ring-2"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Central Library · Level 2 · near window seats"
        />
      </label>

      <label className="block text-xs uppercase tracking-wide text-stone-400">
        When
        <input
          type="datetime-local"
          required
          className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none ring-orange-400/30 focus:ring-2"
          value={occurredAt}
          onChange={(e) => setOccurredAt(e.target.value)}
        />
      </label>

      <label className="block text-xs uppercase tracking-wide text-stone-400">
        Photo URL (optional)
        <input
          className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none ring-orange-400/30 focus:ring-2"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://picsum.photos/id/1003/800/1000"
        />
      </label>

      <label className="block text-xs uppercase tracking-wide text-stone-400">
        Your first name (shown on the card)
        <input
          required
          className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none ring-orange-400/30 focus:ring-2"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
        />
      </label>

      {err ? <p className="text-sm text-rose-300">{err}</p> : null}

      <button
        disabled={busy}
        className="w-full rounded-full bg-gradient-to-r from-orange-500 to-rose-500 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-orange-500/25 disabled:opacity-60"
      >
        {busy ? "Posting…" : "Publish"}
      </button>
    </form>
  );
}

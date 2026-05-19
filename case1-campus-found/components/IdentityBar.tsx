"use client";

import { useEffect, useState } from "react";

export function IdentityBar() {
  const [name, setName] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((d: { displayName?: string }) => {
        setName(d.displayName ?? "");
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    await fetch("/api/me", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName: trimmed }),
    });
    setName(trimmed);
  }

  return (
    <form onSubmit={save} className="flex flex-wrap items-center gap-2 text-sm">
      <label className="text-stone-400" htmlFor="dn">
        You are
      </label>
      <input
        id="dn"
        className="w-44 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-sm outline-none ring-orange-400/40 placeholder:text-stone-500 focus:ring-2"
        placeholder="e.g. Sam"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        type="submit"
        className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-lg shadow-orange-500/20"
      >
        Save
      </button>
      {!loaded ? <span className="text-xs text-stone-500">Loading session…</span> : null}
    </form>
  );
}

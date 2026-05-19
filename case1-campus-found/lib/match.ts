import type { Post } from "@prisma/client";

const STOP = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with",
  "is", "was", "it", "my", "i", "we", "you", "this", "that", "lost", "found",
]);

function tokens(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w)),
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of Array.from(a)) if (b.has(x)) inter++;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

function locationScore(a: string, b: string): number {
  const x = a.toLowerCase().trim();
  const y = b.toLowerCase().trim();
  if (x === y) return 1;
  if (x.includes(y) || y.includes(x)) return 0.65;
  const ta = new Set(tokens(x));
  const tb = new Set(tokens(y));
  return jaccard(ta, tb) * 0.9;
}

function daysBetween(d1: Date, d2: Date): number {
  return Math.abs(d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24);
}

export type MatchCandidate = Post & { score: number; reasons: string[] };

export function rankMatches(source: Post, candidates: Post[]): MatchCandidate[] {
  const srcTitle = tokens(source.title);
  const srcDesc = tokens(source.description);
  const srcAll = new Set([...Array.from(srcTitle), ...Array.from(srcDesc)]);

  const scored: MatchCandidate[] = [];

  for (const c of candidates) {
    if (c.id === source.id) continue;
    const reasons: string[] = [];
    let score = 0;

    const ctTitle = tokens(c.title);
    const ctDesc = tokens(c.description);
    const ctAll = new Set([...Array.from(ctTitle), ...Array.from(ctDesc)]);

    const textSim = 0.55 * jaccard(srcTitle, ctTitle) + 0.45 * jaccard(srcAll, ctAll);
    score += textSim * 55;
    if (textSim > 0.2) reasons.push("Similar wording in title/description");

    const loc = locationScore(source.location, c.location);
    score += loc * 30;
    if (loc >= 1) reasons.push("Same location tag");
    else if (loc > 0.4) reasons.push("Nearby / overlapping location");

    const dayDiff = daysBetween(source.occurredAt, c.occurredAt);
    const dateScore = Math.max(0, 1 - dayDiff / 21) * 15;
    score += dateScore;
    if (dayDiff <= 3) reasons.push("Same few days");
    else if (dayDiff <= 14) reasons.push("Within a couple of weeks");

    if (score >= 18) {
      scored.push({ ...c, score: Math.round(score * 10) / 10, reasons });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 12);
}

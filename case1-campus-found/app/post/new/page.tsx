import { NewPostForm } from "./ui";

export default function NewPostPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const k = typeof searchParams.kind === "string" ? searchParams.kind : "lost";
  const initialKind = k === "found" ? "FOUND" : "LOST";
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New post</h1>
        <p className="mt-1 text-sm text-stone-400">Keep it human — short title, honest details.</p>
      </div>
      <NewPostForm initialKind={initialKind} />
    </div>
  );
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const jar = await cookies();
  const uid = jar.get("lf_uid")?.value ?? null;
  const name = jar.get("lf_name")?.value ?? "";
  return NextResponse.json({ uid, displayName: name });
}

export async function POST(req: Request) {
  const body = (await req.json()) as { displayName?: string };
  const name = (body.displayName ?? "").trim().slice(0, 48);
  if (!name) {
    return NextResponse.json({ error: "Display name required" }, { status: 400 });
  }
  const res = NextResponse.json({ ok: true, displayName: name });
  res.cookies.set("lf_name", name, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
  });
  return res;
}

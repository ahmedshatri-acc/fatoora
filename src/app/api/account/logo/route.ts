import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { sql } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

const MAX_BYTES = 500 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"];

export async function POST(request: Request) {
  const session = await requireSession().catch(() => null);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = rateLimit(`logo-upload:${session.userId}`, { limit: 20, windowMs: 60 * 60 * 1000 });
  if (!rl.success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

  const file = form.get("logo");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "file_too_large" }, { status: 413 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "invalid_type" }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const dataUrl = `data:${file.type};base64,${buf.toString("base64")}`;

  const db = sql();
  await db`
    INSERT INTO profiles (user_id, logo_data) VALUES (${session.userId}, ${dataUrl})
    ON CONFLICT (user_id) DO UPDATE SET logo_data = EXCLUDED.logo_data
  `;
  return NextResponse.json({ ok: true, dataUrl });
}

export async function DELETE() {
  const session = await requireSession().catch(() => null);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = sql();
  await db`UPDATE profiles SET logo_data = NULL WHERE user_id = ${session.userId}`;
  return NextResponse.json({ ok: true });
}

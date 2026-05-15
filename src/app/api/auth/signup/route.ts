import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const SignupSchema = z.object({
  email: z.string().email().max(254).toLowerCase(),
  password: z.string().min(8).max(256),
  name: z.string().min(1).max(100).trim(),
});

export async function POST(request: Request) {
  // Rate limit: 5 signups per hour per IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const rl = rateLimit(`signup:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many signup attempts. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = SignupSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    // Give useful errors for password/name but generic for email to avoid enumeration
    if (firstError.path[0] === "password") {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }
    if (firstError.path[0] === "name") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { email, password, name } = parsed.data;

  const db = sql();
  const existing = await db`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
  if (existing.length > 0) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 12);
  const rows = await db`
    INSERT INTO users (email, password_hash, name)
    VALUES (${email}, ${hash}, ${name})
    RETURNING id, email, name
  `;
  const user = rows[0];

  const session = await getSession();
  session.userId = user.id;
  session.email = user.email;
  session.name = user.name;
  await session.save();

  return NextResponse.json({ ok: true });
}

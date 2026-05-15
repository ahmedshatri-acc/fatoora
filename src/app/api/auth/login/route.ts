import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email().max(254).toLowerCase(),
  password: z.string().min(1).max(256),
});

export async function POST(request: Request) {
  // Rate limit: 10 attempts per 15 minutes per IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const rl = rateLimit(`login:${ip}`, { limit: 10, windowMs: 15 * 60 * 1000 });
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
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

  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const { email, password } = parsed.data;

  const db = sql();
  const rows = await db`
    SELECT id, email, name, password_hash FROM users WHERE email = ${email} LIMIT 1
  `;

  // Constant-time path: always compare even when user not found to prevent timing attacks
  const dummyHash =
    "$2b$12$invalidhashpaddingthatisexactlythirtytwocharslong......";
  const hashToCompare = rows.length > 0 ? (rows[0].password_hash as string) : dummyHash;
  const valid = await bcrypt.compare(password, hashToCompare);

  if (rows.length === 0 || !valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const user = rows[0];
  const session = await getSession();
  session.userId = user.id;
  session.email = user.email;
  session.name = user.name;
  await session.save();

  return NextResponse.json({ ok: true });
}

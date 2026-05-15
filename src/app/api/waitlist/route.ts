import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const WaitlistSchema = z.object({
  email: z.string().email().max(254).toLowerCase(),
  name: z.string().max(100).trim().optional(),
});

export async function POST(request: Request) {
  // Rate limit: 5 waitlist submissions per hour per IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = rateLimit(`waitlist:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = WaitlistSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const { email, name } = parsed.data;

  const db = sql();
  await db`
    INSERT INTO waitlist (email, name) VALUES (${email}, ${name ?? null})
    ON CONFLICT (email) DO NOTHING
  `;

  return NextResponse.json({ ok: true });
}

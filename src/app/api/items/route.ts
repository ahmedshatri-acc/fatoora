import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { sql } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const ItemPostSchema = z.object({
  name: z.string().min(1).max(500).trim(),
  unit_price: z.number().nonnegative().max(1_000_000_000),
});

export async function GET() {
  const session = await requireSession().catch(() => null);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = sql();
  const rows = await db`
    SELECT id, name, unit_price FROM items
    WHERE user_id = ${session.userId}
    ORDER BY name LIMIT 500
  `;
  return NextResponse.json({ items: rows });
}

export async function POST(request: Request) {
  const session = await requireSession().catch(() => null);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = rateLimit(`item-create:${session.userId}`, { limit: 100, windowMs: 60 * 60 * 1000 });
  if (!rl.success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const body = await request.json().catch(() => null);
  const parsed = ItemPostSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid item" }, { status: 400 });

  const { name, unit_price } = parsed.data;
  const db = sql();
  const rows = await db`
    INSERT INTO items (user_id, name, unit_price)
    VALUES (${session.userId}, ${name}, ${unit_price})
    ON CONFLICT (user_id, lower(name)) DO UPDATE SET unit_price = EXCLUDED.unit_price
    RETURNING id, name, unit_price
  `;
  return NextResponse.json({ item: rows[0] });
}

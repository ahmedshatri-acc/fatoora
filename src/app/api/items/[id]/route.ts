import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { sql } from "@/lib/db";
import { z } from "zod";

const IdParam = z.string().uuid();

const ItemUpdateSchema = z.object({
  name: z.string().min(1).max(500).trim(),
  unit_price: z.number().nonnegative().max(1_000_000_000),
});

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession().catch(() => null);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!IdParam.safeParse(id).success) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await request.json().catch(() => null);
  const parsed = ItemUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid item" }, { status: 400 });

  const db = sql();
  const result = await db`
    UPDATE items SET name = ${parsed.data.name}, unit_price = ${parsed.data.unit_price}
    WHERE id = ${id} AND user_id = ${session.userId}
  `;
  if (result.count === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession().catch(() => null);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!IdParam.safeParse(id).success) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const db = sql();
  const result = await db`DELETE FROM items WHERE id = ${id} AND user_id = ${session.userId}`;
  if (result.count === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

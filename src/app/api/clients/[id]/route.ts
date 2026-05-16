import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { sql } from "@/lib/db";
import { z } from "zod";

const SAT_VAT_RE = /^3\d{14}$/;
const IdParam = z.string().uuid();

const ClientUpdateSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  email: z
    .string()
    .email()
    .max(254)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  vat_number: z
    .string()
    .regex(SAT_VAT_RE)
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession().catch(() => null);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!IdParam.safeParse(id).success) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const parsed = ClientUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid client data" }, { status: 400 });
  }

  const { name, email, vat_number } = parsed.data;
  const db = sql();
  const result = await db`
    UPDATE clients
    SET name = ${name}, email = ${email ?? null}, vat_number = ${vat_number ?? null}
    WHERE id = ${id} AND user_id = ${session.userId}
  `;
  if (result.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession().catch(() => null);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!IdParam.safeParse(id).success) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const db = sql();
  const result = await db`
    DELETE FROM clients WHERE id = ${id} AND user_id = ${session.userId}
  `;
  if (result.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

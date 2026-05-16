import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { sql } from "@/lib/db";
import { z } from "zod";
import crypto from "node:crypto";

const IdParam = z.string().uuid();

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession().catch(() => null);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!IdParam.safeParse(id).success) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const db = sql();
  const result = await db`
    DELETE FROM invoices WHERE id = ${id} AND user_id = ${session.userId}
  `;
  if (result.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

const ShareSchema = z.object({ action: z.enum(["generate", "revoke"]) });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession().catch(() => null);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!IdParam.safeParse(id).success) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const body = await request.json().catch(() => ({}));
  const parsed = ShareSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const db = sql();
  if (parsed.data.action === "revoke") {
    const result = await db`
      UPDATE invoices SET share_token = NULL
      WHERE id = ${id} AND user_id = ${session.userId}
    `;
    if (result.count === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  }

  const token = crypto.randomBytes(24).toString("base64url");
  const result = await db`
    UPDATE invoices SET share_token = ${token}
    WHERE id = ${id} AND user_id = ${session.userId}
    RETURNING share_token
  `;
  if (result.count === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ token });
}

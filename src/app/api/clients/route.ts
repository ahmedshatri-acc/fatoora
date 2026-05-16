import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { sql } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const SAT_VAT_RE = /^3\d{14}$/;

const ClientPostSchema = z.object({
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

export async function GET(request: Request) {
  const session = await requireSession().catch(() => null);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() ?? "";

  const db = sql();
  const rows = q
    ? await db`
        SELECT id, name, email, vat_number
        FROM clients
        WHERE user_id = ${session.userId} AND name ILIKE ${"%" + q + "%"}
        ORDER BY name LIMIT 20
      `
    : await db`
        SELECT id, name, email, vat_number
        FROM clients
        WHERE user_id = ${session.userId}
        ORDER BY name LIMIT 200
      `;

  return NextResponse.json({ clients: rows });
}

export async function POST(request: Request) {
  const session = await requireSession().catch(() => null);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = rateLimit(`client-create:${session.userId}`, { limit: 60, windowMs: 60 * 60 * 1000 });
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = ClientPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid client data" }, { status: 400 });
  }

  const { name, email, vat_number } = parsed.data;
  const db = sql();
  const rows = await db`
    INSERT INTO clients (user_id, name, email, vat_number)
    VALUES (${session.userId}, ${name}, ${email ?? null}, ${vat_number ?? null})
    ON CONFLICT (user_id, lower(name)) DO UPDATE
      SET email = COALESCE(EXCLUDED.email, clients.email),
          vat_number = COALESCE(EXCLUDED.vat_number, clients.vat_number)
    RETURNING id, name, email, vat_number
  `;

  return NextResponse.json({ client: rows[0] });
}

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireSession, getSession } from "@/lib/session";
import { sql } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const SAT_VAT_RE = /^3\d{14}$/;

const AccountUpdateSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  currentPassword: z.string().min(1).max(256).optional(),
  newPassword: z.string().min(8).max(256).optional(),
  default_seller_name: z.string().max(200).trim().optional().or(z.literal("").transform(() => null)),
  default_seller_vat: z
    .string()
    .regex(SAT_VAT_RE)
    .optional()
    .or(z.literal("").transform(() => null)),
  default_notes: z.string().max(2000).optional().or(z.literal("").transform(() => null)),
});

export async function PUT(request: Request) {
  const session = await requireSession().catch(() => null);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = rateLimit(`account-update:${session.userId}`, { limit: 30, windowMs: 60 * 60 * 1000 });
  if (!rl.success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = AccountUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { name, currentPassword, newPassword, default_seller_name, default_seller_vat, default_notes } = parsed.data;
  const db = sql();

  // Password change: requires current password verification
  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json({ error: "current_password_required" }, { status: 400 });
    }
    const rows = await db`SELECT password_hash FROM users WHERE id = ${session.userId} LIMIT 1`;
    if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const ok = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!ok) return NextResponse.json({ error: "current_password_wrong" }, { status: 403 });
    const hash = await bcrypt.hash(newPassword, 12);
    await db`UPDATE users SET password_hash = ${hash} WHERE id = ${session.userId}`;
  }

  if (name && name !== session.name) {
    await db`UPDATE users SET name = ${name} WHERE id = ${session.userId}`;
    const s = await getSession();
    s.name = name;
    await s.save();
  }

  // Profile defaults: any of these keys present (even null) → update
  const updatingDefaults =
    default_seller_name !== undefined || default_seller_vat !== undefined || default_notes !== undefined;

  if (updatingDefaults) {
    await db`
      INSERT INTO profiles (user_id, default_seller_name, default_seller_vat, default_notes)
      VALUES (
        ${session.userId},
        ${default_seller_name ?? null},
        ${default_seller_vat ?? null},
        ${default_notes ?? null}
      )
      ON CONFLICT (user_id) DO UPDATE SET
        default_seller_name = COALESCE(EXCLUDED.default_seller_name, profiles.default_seller_name),
        default_seller_vat = COALESCE(EXCLUDED.default_seller_vat, profiles.default_seller_vat),
        default_notes = COALESCE(EXCLUDED.default_notes, profiles.default_notes)
    `;
  }

  return NextResponse.json({ ok: true });
}

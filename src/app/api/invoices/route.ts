import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { sql } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { calculateVat, calculateTotal, generateZatcaQRData } from "@/lib/zatca";
import { z } from "zod";

// Saudi VAT number: exactly 15 digits, starts with 3
const SAT_VAT_RE = /^3\d{14}$/;

const LineItemSchema = z.object({
  description: z.string().min(1).max(500).trim(),
  qty: z.number().int().positive().max(100_000),
  unit_price: z.number().nonnegative().max(1_000_000_000),
});

const InvoicePostSchema = z.object({
  invoice_date: z.string().datetime(),
  seller_name: z.string().min(1).max(200).trim(),
  seller_vat: z
    .string()
    .regex(SAT_VAT_RE, "VAT number must be exactly 15 digits starting with 3"),
  client_name: z.string().min(1).max(200).trim(),
  client_email: z
    .string()
    .email()
    .max(254)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  items: z.array(LineItemSchema).min(1).max(100),
  notes: z.string().max(2000).optional(),
  status: z.enum(["draft", "sent"]),
});

const InvoicePatchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["draft", "sent", "paid"]),
});

async function nextInvoiceNumber(userId: string): Promise<string> {
  const db = sql();
  const rows = await db`
    INSERT INTO invoice_sequences (user_id, last_seq)
    VALUES (${userId}, 1)
    ON CONFLICT (user_id) DO UPDATE
      SET last_seq = invoice_sequences.last_seq + 1
    RETURNING last_seq
  `;
  const seq: number = rows[0].last_seq;
  const year = new Date().getFullYear();
  return `INV-${year}-${String(seq).padStart(5, "0")}`;
}

export async function POST(request: Request) {
  const session = await requireSession().catch(() => null);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Rate limit: 60 invoice creations per hour per user
  const rl = rateLimit(`invoice-create:${session.userId}`, {
    limit: 60,
    windowMs: 60 * 60 * 1000,
  });
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = InvoicePostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid invoice data", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Compute all financial values server-side — never trust client-supplied totals
  const subtotal = data.items.reduce((s, item) => s + item.qty * item.unit_price, 0);
  const vat_amount = calculateVat(subtotal);
  const total_with_vat = calculateTotal(subtotal);
  const vat_rate = 0.15;

  // Regenerate QR data server-side from validated inputs
  const qr_data = generateZatcaQRData({
    sellerName: data.seller_name,
    vatNumber: data.seller_vat,
    invoiceDate: data.invoice_date,
    totalWithVat: total_with_vat,
    vatAmount: vat_amount,
  });

  const invoiceNumber = await nextInvoiceNumber(session.userId);

  const db = sql();
  const rows = await db`
    INSERT INTO invoices (
      user_id, invoice_number, invoice_date, seller_name, seller_vat,
      client_name, client_email, items, subtotal, vat_amount, total_with_vat,
      vat_rate, qr_data, notes, status
    ) VALUES (
      ${session.userId}, ${invoiceNumber}, ${data.invoice_date},
      ${data.seller_name}, ${data.seller_vat}, ${data.client_name},
      ${data.client_email ?? null}, ${JSON.stringify(data.items)},
      ${subtotal}, ${vat_amount}, ${total_with_vat},
      ${vat_rate}, ${qr_data}, ${data.notes ?? null}, ${data.status}
    ) RETURNING id, invoice_number
  `;

  return NextResponse.json({ id: rows[0].id, invoice_number: rows[0].invoice_number });
}

export async function PATCH(request: Request) {
  const session = await requireSession().catch(() => null);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = InvoicePatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { id, status } = parsed.data;
  const db = sql();

  // user_id check prevents IDOR — user can only update their own invoices
  const result = await db`
    UPDATE invoices SET status = ${status}, updated_at = NOW()
    WHERE id = ${id} AND user_id = ${session.userId}
  `;

  if (result.count === 0) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

import { requireSession } from "@/lib/session";
import { sql } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

function csvField(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET() {
  const session = await requireSession().catch(() => null);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const rl = rateLimit(`csv-export:${session.userId}`, { limit: 20, windowMs: 60 * 60 * 1000 });
  if (!rl.success) return new Response("Too many requests", { status: 429 });

  const db = sql();
  const rows = await db<{
    invoice_number: string;
    invoice_date: string;
    due_date: string | null;
    client_name: string;
    client_email: string | null;
    seller_name: string;
    seller_vat: string;
    subtotal: string;
    discount_amount: string;
    vat_amount: string;
    total_with_vat: string;
    status: string;
  }[]>`
    SELECT invoice_number, invoice_date, due_date, client_name, client_email,
           seller_name, seller_vat, subtotal, discount_amount, vat_amount, total_with_vat, status
    FROM invoices
    WHERE user_id = ${session.userId}
    ORDER BY created_at DESC
  `;

  const headers = [
    "invoice_number","invoice_date","due_date","client_name","client_email",
    "seller_name","seller_vat","subtotal","discount_amount","vat_amount","total_with_vat","status",
  ];
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push([
      r.invoice_number,
      r.invoice_date ? new Date(r.invoice_date).toISOString().slice(0, 10) : "",
      r.due_date ? new Date(r.due_date).toISOString().slice(0, 10) : "",
      r.client_name,
      r.client_email,
      r.seller_name,
      r.seller_vat,
      r.subtotal,
      r.discount_amount,
      r.vat_amount,
      r.total_with_vat,
      r.status,
    ].map(csvField).join(","));
  }
  const csv = "﻿" + lines.join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="wathq-invoices-${new Date().toISOString().slice(0,10)}.csv"`,
    },
  });
}

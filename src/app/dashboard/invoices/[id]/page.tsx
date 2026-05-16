import { requireSession } from "@/lib/session";
import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import { InvoiceActions } from "@/components/InvoiceActions";
import { InvoiceDisplay } from "@/components/InvoiceDisplay";
import { getMessages } from "@/lib/locale";
import Link from "next/link";

interface InvoiceRow {
  id: string;
  invoice_number: string;
  invoice_date: string;
  seller_name: string;
  seller_vat: string;
  client_name: string;
  client_email: string | null;
  items: Array<{ description: string; qty: number; unit_price: number }>;
  subtotal: string;
  vat_amount: string;
  total_with_vat: string;
  qr_data: string;
  notes: string | null;
  status: "draft" | "sent" | "paid";
  share_token: string | null;
}

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireSession();
  const { locale, messages: t } = await getMessages();
  const db = sql();

  const rows = await db<InvoiceRow[]>`
    SELECT id, invoice_number, invoice_date, seller_name, seller_vat,
           client_name, client_email, items, subtotal, vat_amount, total_with_vat,
           qr_data, notes, status, share_token
    FROM invoices WHERE id = ${id} AND user_id = ${session.userId} LIMIT 1
  `;
  if (rows.length === 0) notFound();
  const inv = rows[0];
  const ti = t.dashboard.invoices;

  const statusLabel = inv.status === "paid" ? ti.paid : inv.status === "sent" ? ti.sent : ti.draft;
  const statusClass =
    inv.status === "paid"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
      : inv.status === "sent"
      ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #invoice-printable, #invoice-printable * { visibility: visible; }
          #invoice-printable { position: fixed; inset: 0; padding: 2rem; background: white; }
        }
      `}</style>

      <div className="mx-auto max-w-3xl">
        <div className="print:hidden mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/dashboard/invoices" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              {ti.backToList}
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{inv.invoice_number}</h1>
            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusClass}`}>
              {statusLabel}
            </span>
          </div>
          <InvoiceActions
            invoiceId={inv.id}
            currentStatus={inv.status}
            initialShareToken={inv.share_token}
            t={{
              markPaid: ti.markPaid,
              markSent: ti.markSent,
              markDraft: ti.markDraft,
              share: ti.share,
              shareCopied: ti.shareCopied,
              shareTitle: ti.shareTitle,
              shareDesc: ti.shareDesc,
              shareGenerate: ti.shareGenerate,
              shareRevoke: ti.shareRevoke,
              print: ti.print,
              delete: ti.delete,
              deleteConfirm: ti.deleteConfirm,
            }}
          />
        </div>

        <div id="invoice-printable">
          <InvoiceDisplay invoice={inv} locale={locale} t={ti} />
        </div>
      </div>
    </>
  );
}

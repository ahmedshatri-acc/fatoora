import { requireSession } from "@/lib/session";
import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import { getMessages } from "@/lib/locale";
import { InvoiceDisplay } from "@/components/InvoiceDisplay";
import { AutoPrint } from "@/components/AutoPrint";

export const dynamic = "force-dynamic";

interface InvoiceRow {
  invoice_number: string;
  invoice_date: string;
  due_date: string | null;
  seller_name: string;
  seller_vat: string;
  client_name: string;
  client_email: string | null;
  items: Array<{ description: string; qty: number; unit_price: number }>;
  subtotal: string;
  vat_amount: string;
  total_with_vat: string;
  discount_amount: string;
  qr_data: string;
  notes: string | null;
  logo_data: string | null;
}

export default async function PrintInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireSession();
  const { locale, messages: t } = await getMessages();
  const db = sql();
  const rows = await db<InvoiceRow[]>`
    SELECT i.invoice_number, i.invoice_date, i.due_date, i.seller_name, i.seller_vat,
           i.client_name, i.client_email, i.items, i.subtotal, i.vat_amount, i.total_with_vat,
           i.discount_amount, i.qr_data, i.notes, p.logo_data
    FROM invoices i
    LEFT JOIN profiles p ON p.user_id = i.user_id
    WHERE i.id = ${id} AND i.user_id = ${session.userId} LIMIT 1
  `;
  if (rows.length === 0) notFound();
  const inv = rows[0];

  return (
    <div className="min-h-screen bg-white p-8" dir={locale === "ar" ? "rtl" : "ltr"}>
      <AutoPrint />
      <div className="mx-auto max-w-3xl">
        <InvoiceDisplay invoice={inv} logoData={inv.logo_data} locale={locale} t={t.dashboard.invoices} />
      </div>
    </div>
  );
}

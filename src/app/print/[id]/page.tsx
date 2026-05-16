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
}

export default async function PrintInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireSession();
  const { locale, messages: t } = await getMessages();
  const db = sql();
  const rows = await db<InvoiceRow[]>`
    SELECT invoice_number, invoice_date, seller_name, seller_vat, client_name, client_email,
           items, subtotal, vat_amount, total_with_vat, qr_data, notes
    FROM invoices WHERE id = ${id} AND user_id = ${session.userId} LIMIT 1
  `;
  if (rows.length === 0) notFound();
  const inv = rows[0];

  return (
    <div className="min-h-screen bg-white p-8" dir={locale === "ar" ? "rtl" : "ltr"}>
      <AutoPrint />
      <div className="mx-auto max-w-3xl">
        <InvoiceDisplay invoice={inv} locale={locale} t={t.dashboard.invoices} />
      </div>
    </div>
  );
}

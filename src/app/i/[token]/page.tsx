import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import { getMessages } from "@/lib/locale";
import { InvoiceDisplay } from "@/components/InvoiceDisplay";
import { Receipt } from "lucide-react";
import Link from "next/link";

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

export default async function SharedInvoicePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { locale, messages: t } = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  const db = sql();
  const rows = await db<InvoiceRow[]>`
    SELECT invoice_number, invoice_date, seller_name, seller_vat, client_name, client_email,
           items, subtotal, vat_amount, total_with_vat, qr_data, notes
    FROM invoices WHERE share_token = ${token} LIMIT 1
  `;
  if (rows.length === 0) notFound();
  const inv = rows[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950" dir={dir}>
      <header className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Receipt className="h-6 w-6 text-emerald-600" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">Wathq</span>
          </Link>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t.share.poweredBy}</p>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">
        <InvoiceDisplay invoice={inv} locale={locale} t={t.dashboard.invoices} />
      </main>
    </div>
  );
}

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

export default async function SharedInvoicePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { locale, messages: t } = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  const db = sql();
  const rows = await db<InvoiceRow[]>`
    SELECT i.invoice_number, i.invoice_date, i.due_date, i.seller_name, i.seller_vat,
           i.client_name, i.client_email, i.items, i.subtotal, i.vat_amount, i.total_with_vat,
           i.discount_amount, i.qr_data, i.notes, p.logo_data
    FROM invoices i
    LEFT JOIN profiles p ON p.user_id = i.user_id
    WHERE i.share_token = ${token} LIMIT 1
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
        <InvoiceDisplay invoice={inv} logoData={inv.logo_data} locale={locale} t={t.dashboard.invoices} />
      </main>
    </div>
  );
}

import { Card } from "@/components/ui/Card";
import { Receipt } from "lucide-react";
import { InvoiceQR } from "@/components/InvoiceQR";
import { formatSAR } from "@/lib/zatca";
import { formatDate } from "@/lib/utils";
import type { Messages } from "@/messages/ar";

interface InvoiceData {
  invoice_number: string;
  invoice_date: string;
  seller_name: string;
  seller_vat: string;
  client_name: string;
  client_email: string | null;
  items: Array<{ description: string; qty: number; unit_price: number }>;
  subtotal: number | string;
  vat_amount: number | string;
  total_with_vat: number | string;
  qr_data: string;
  notes: string | null;
}

export function InvoiceDisplay({
  invoice,
  locale,
  t,
}: {
  invoice: InvoiceData;
  locale: "ar" | "en";
  t: Messages["dashboard"]["invoices"];
}) {
  return (
    <Card>
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="h-6 w-6 text-emerald-600" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">{t.taxInvoice}</span>
        </div>
        <div className="text-end">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t.colNumber}</p>
          <p className="font-bold text-gray-900 dark:text-white">{invoice.invoice_number}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatDate(invoice.invoice_date, locale)}</p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-8">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">{t.seller}</p>
          <p className="font-semibold text-gray-900 dark:text-white">{invoice.seller_name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t.vatNumber}: {invoice.seller_vat}</p>
        </div>
        <div className="text-end">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">{t.client}</p>
          <p className="font-semibold text-gray-900 dark:text-white">{invoice.client_name}</p>
          {invoice.client_email && <p className="text-sm text-gray-500 dark:text-gray-400">{invoice.client_email}</p>}
        </div>
      </div>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full text-sm min-w-[400px]">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400">
              <th className="pb-3 text-start font-medium">{t.description}</th>
              <th className="pb-3 text-center font-medium">{t.quantity}</th>
              <th className="pb-3 text-end font-medium">{t.unitPrice}</th>
              <th className="pb-3 text-end font-medium">{t.itemTotal}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {invoice.items.map((item, i) => (
              <tr key={i}>
                <td className="py-3 text-gray-900 dark:text-white">{item.description}</td>
                <td className="py-3 text-center text-gray-600 dark:text-gray-300">{item.qty}</td>
                <td className="py-3 text-end text-gray-600 dark:text-gray-300">{formatSAR(item.unit_price)}</td>
                <td className="py-3 text-end font-medium text-gray-900 dark:text-white">{formatSAR(item.qty * item.unit_price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <InvoiceQR qrData={invoice.qr_data} caption="ZATCA QR" />
        <div className="min-w-48 space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>{t.subtotal}</span><span>{formatSAR(Number(invoice.subtotal))}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>{t.vatRow}</span><span>{formatSAR(Number(invoice.vat_amount))}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2 text-base font-bold text-gray-900 dark:text-white">
            <span>{t.grandTotal}</span><span>{formatSAR(Number(invoice.total_with_vat))}</span>
          </div>
        </div>
      </div>

      {invoice.notes && (
        <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t.notes}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">{invoice.notes}</p>
        </div>
      )}
    </Card>
  );
}

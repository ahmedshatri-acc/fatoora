import { requireSession } from "@/lib/session";
import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import { formatSAR } from "@/lib/zatca";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Receipt } from "lucide-react";
import { InvoiceQR } from "@/components/InvoiceQR";
import { InvoiceStatusButtons } from "@/components/InvoiceStatusButtons";
import { PrintButton } from "@/components/PrintButton";
import Link from "next/link";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireSession();
  const db = sql();

  const rows = await db`
    SELECT * FROM invoices WHERE id = ${id} AND user_id = ${session.userId} LIMIT 1
  `;
  if (rows.length === 0) notFound();
  const inv = rows[0];

  const statusLabel =
    inv.status === "paid" ? "مدفوعة" : inv.status === "sent" ? "مرسلة" : "مسودة";
  const statusClass =
    inv.status === "paid"
      ? "bg-emerald-50 text-emerald-700"
      : inv.status === "sent"
      ? "bg-amber-50 text-amber-700"
      : "bg-gray-100 text-gray-600";

  return (
    <>
      {/* Print-only global styles injected via a style tag */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #invoice-printable, #invoice-printable * { visibility: visible; }
          #invoice-printable { position: fixed; inset: 0; padding: 2rem; background: white; }
        }
      `}</style>

      <div className="mx-auto max-w-3xl">
        {/* Header bar — hidden when printing */}
        <div className="print:hidden mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/invoices" className="text-sm text-gray-500 hover:text-gray-700">
              ← الفواتير
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{inv.invoice_number}</h1>
            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusClass}`}>
              {statusLabel}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <InvoiceStatusButtons
              invoiceId={inv.id}
              currentStatus={inv.status as "draft" | "sent" | "paid"}
            />
            <PrintButton />
          </div>
        </div>

        <div id="invoice-printable">
          <Card>
            <div className="mb-8 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="h-6 w-6 text-emerald-600" />
                <span className="text-xl font-bold text-gray-900">فاتورة ضريبية</span>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">رقم الفاتورة</p>
                <p className="font-bold text-gray-900">{inv.invoice_number}</p>
                <p className="text-sm text-gray-500 mt-1">{formatDate(inv.invoice_date)}</p>
              </div>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-8">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">البائع</p>
                <p className="font-semibold text-gray-900">{inv.seller_name}</p>
                <p className="text-sm text-gray-500">الرقم الضريبي: {inv.seller_vat}</p>
              </div>
              <div className="text-left">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">العميل</p>
                <p className="font-semibold text-gray-900">{inv.client_name}</p>
                {inv.client_email && <p className="text-sm text-gray-500">{inv.client_email}</p>}
              </div>
            </div>

            <div className="mb-8 overflow-x-auto">
              <table className="w-full text-sm min-w-[400px]">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500">
                    <th className="pb-3 text-right font-medium">الوصف</th>
                    <th className="pb-3 text-center font-medium">الكمية</th>
                    <th className="pb-3 text-left font-medium">سعر الوحدة</th>
                    <th className="pb-3 text-left font-medium">الإجمالي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(inv.items as Array<{ description: string; qty: number; unit_price: number }>).map((item, i) => (
                    <tr key={i}>
                      <td className="py-3 text-gray-900">{item.description}</td>
                      <td className="py-3 text-center text-gray-600">{item.qty}</td>
                      <td className="py-3 text-left text-gray-600">{formatSAR(item.unit_price)}</td>
                      <td className="py-3 text-left font-medium text-gray-900">{formatSAR(item.qty * item.unit_price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <InvoiceQR qrData={inv.qr_data} />
              <div className="min-w-48 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>المجموع قبل الضريبة</span><span>{formatSAR(Number(inv.subtotal))}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>ضريبة القيمة المضافة (15%)</span><span>{formatSAR(Number(inv.vat_amount))}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-gray-900">
                  <span>الإجمالي</span><span>{formatSAR(Number(inv.total_with_vat))}</span>
                </div>
              </div>
            </div>

            {inv.notes && (
              <div className="mt-6 border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-500 mb-1">ملاحظات</p>
                <p className="text-sm text-gray-700">{inv.notes}</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}

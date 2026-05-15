import { requireSession } from "@/lib/session";
import { sql } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { FileText } from "lucide-react";
import { formatSAR } from "@/lib/zatca";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function InvoicesPage() {
  const session = await requireSession();
  const db = sql();
  const invoices = await db`
    SELECT * FROM invoices WHERE user_id = ${session.userId}
    ORDER BY created_at DESC
  `;

  const statusLabel = (s: string) =>
    s === "paid" ? "مدفوعة" : s === "sent" ? "مرسلة" : "مسودة";
  const statusClass = (s: string) =>
    s === "paid"
      ? "bg-emerald-50 text-emerald-700"
      : s === "sent"
      ? "bg-amber-50 text-amber-700"
      : "bg-gray-100 text-gray-600";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">الفواتير</h1>
        <Link href="/dashboard/invoices/new">
          <Button>+ فاتورة جديدة</Button>
        </Link>
      </div>

      <Card className="p-0 overflow-hidden">
        {invoices.length > 0 ? (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right font-medium text-gray-500">رقم الفاتورة</th>
                    <th className="px-6 py-3 text-right font-medium text-gray-500">العميل</th>
                    <th className="px-6 py-3 text-right font-medium text-gray-500">التاريخ</th>
                    <th className="px-6 py-3 text-right font-medium text-gray-500">الإجمالي</th>
                    <th className="px-6 py-3 text-right font-medium text-gray-500">الحالة</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{inv.invoice_number}</td>
                      <td className="px-6 py-4 text-gray-600">{inv.client_name}</td>
                      <td className="px-6 py-4 text-gray-600">{formatDate(inv.created_at)}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{formatSAR(Number(inv.total_with_vat))}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusClass(inv.status)}`}>
                          {statusLabel(inv.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/dashboard/invoices/${inv.id}`} className="text-emerald-600 hover:text-emerald-700 font-medium">
                          عرض
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="sm:hidden divide-y divide-gray-100">
              {invoices.map((inv) => (
                <Link
                  key={inv.id}
                  href={`/dashboard/invoices/${inv.id}`}
                  className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{inv.invoice_number}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{inv.client_name}</p>
                    <p className="text-xs text-gray-400">{formatDate(inv.created_at)}</p>
                  </div>
                  <div className="text-left flex flex-col items-end gap-1">
                    <p className="text-sm font-bold text-gray-900">{formatSAR(Number(inv.total_with_vat))}</p>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusClass(inv.status)}`}>
                      {statusLabel(inv.status)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="py-16 text-center">
            <FileText className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm text-gray-500 mb-4">لا توجد فواتير بعد</p>
            <Link href="/dashboard/invoices/new">
              <Button>أنشئ فاتورتك الأولى</Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}

import { requireSession } from "@/lib/session";
import { sql } from "@/lib/db";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { FileText, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { formatSAR } from "@/lib/zatca";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function DashboardPage() {
  const session = await requireSession();
  const db = sql();

  const invoices = await db`
    SELECT * FROM invoices WHERE user_id = ${session.userId}
    ORDER BY created_at DESC LIMIT 5
  `;

  const stats = await db`
    SELECT total_with_vat, status FROM invoices WHERE user_id = ${session.userId}
  `;

  const totalRevenue = stats.filter(i => i.status === "paid").reduce((s, i) => s + Number(i.total_with_vat), 0);
  const pendingCount = stats.filter(i => i.status === "sent").length;
  const paidCount = stats.filter(i => i.status === "paid").length;
  const totalCount = stats.length;

  const firstName = session.name?.split(" ")[0] ?? "مرحبًا";

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">مرحبًا، {firstName} 👋</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">إليك ملخص نشاطك</p>
        </div>
        <Link href="/dashboard/invoices/new">
          <Button size="lg">+ فاتورة جديدة</Button>
        </Link>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">إجمالي الفواتير</span>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCount}</p>
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">الإيرادات المحصّلة</span>
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatSAR(totalRevenue)}</p>
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">في الانتظار</span>
            <Clock className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">مدفوعة</span>
            <CheckCircle className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{paidCount}</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>آخر الفواتير</CardTitle>
          <Link href="/dashboard/invoices" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
            عرض الكل
          </Link>
        </CardHeader>
        {invoices.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{inv.invoice_number}</p>
                  <p className="text-xs text-gray-500">{inv.client_name} · {formatDate(inv.created_at)}</p>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">{formatSAR(Number(inv.total_with_vat))}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    inv.status === "paid" ? "bg-emerald-50 text-emerald-700"
                    : inv.status === "sent" ? "bg-amber-50 text-amber-700"
                    : "bg-gray-100 text-gray-600"
                  }`}>
                    {inv.status === "paid" ? "مدفوعة" : inv.status === "sent" ? "مرسلة" : "مسودة"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <FileText className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm text-gray-500">لا توجد فواتير بعد</p>
            <Link href="/dashboard/invoices/new">
              <Button className="mt-4" size="sm">أنشئ فاتورتك الأولى</Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}

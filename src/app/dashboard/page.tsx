import { requireSession } from "@/lib/session";
import { sql } from "@/lib/db";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { FileText, TrendingUp, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { formatSAR } from "@/lib/zatca";
import { formatDate, interpolate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getMessages } from "@/lib/locale";
import { getAccountSnapshot, countInvoicesThisMonth } from "@/lib/account";
import { RevenueChart } from "@/components/RevenueChart";

export default async function DashboardPage() {
  const session = await requireSession();
  const { locale, messages: t } = await getMessages();
  const db = sql();

  const [account, usedThisMonth, invoices, stats, chartRows] = await Promise.all([
    getAccountSnapshot(session.userId),
    countInvoicesThisMonth(session.userId),
    db`SELECT id, invoice_number, client_name, total_with_vat, status, created_at
       FROM invoices WHERE user_id = ${session.userId}
       ORDER BY created_at DESC LIMIT 5`,
    db`SELECT total_with_vat, status FROM invoices WHERE user_id = ${session.userId}`,
    db<{ month: string; total: string }[]>`
      SELECT to_char(date_trunc('month', invoice_date), 'YYYY-MM') AS month,
             COALESCE(SUM(total_with_vat), 0)::text AS total
      FROM invoices
      WHERE user_id = ${session.userId}
        AND status = 'paid'
        AND invoice_date >= NOW() - INTERVAL '6 months'
      GROUP BY date_trunc('month', invoice_date)
    `,
  ]);

  // Build a 6-month series anchored on current month
  const monthsT = t.dashboard.reports.months;
  const chart: { label: string; value: number }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const row = chartRows.find(r => r.month === key);
    chart.push({
      label: monthsT[d.getMonth()].slice(0, 3),
      value: row ? Number(row.total) : 0,
    });
  }

  const totalRevenue = stats.filter(i => i.status === "paid").reduce((s, i) => s + Number(i.total_with_vat), 0);
  const pendingCount = stats.filter(i => i.status === "sent").length;
  const paidCount = stats.filter(i => i.status === "paid").length;
  const totalCount = stats.length;
  const firstName = session.name?.split(" ")[0] ?? "";

  const access = account?.access;
  const monthlyUsageText = access?.monthlyLimit === Infinity
    ? interpolate(t.dashboard.monthlyUsageUnlimited, { used: usedThisMonth })
    : interpolate(t.dashboard.monthlyUsage, { used: usedThisMonth, limit: access?.monthlyLimit ?? 0 });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.dashboard.greeting}، {firstName} 👋
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.dashboard.subtitle}</p>
        </div>
        <Link href="/dashboard/invoices/new">
          <Button size="lg">{t.dashboard.newInvoice}</Button>
        </Link>
      </div>

      {access && (
        <div className="mb-6 space-y-2">
          {access.blocked ? (
            <div className="flex items-center gap-3 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 px-4 py-3 text-sm">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
              <p className="flex-1 text-red-700 dark:text-red-300">{t.dashboard.trialExpired}</p>
              <Link href="/dashboard/settings" className="rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-1.5 text-xs whitespace-nowrap">
                {t.dashboard.upgradeNow}
              </Link>
            </div>
          ) : !access.plan && access.trialActive ? (
            <div className="flex items-center gap-3 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
              <Clock className="h-5 w-5 shrink-0" />
              <p className="flex-1">{interpolate(t.dashboard.trialDaysLeft, { n: access.daysRemaining })}</p>
              <Link href="/dashboard/settings" className="font-medium underline">
                {t.dashboard.upgradeNow}
              </Link>
            </div>
          ) : null}
          <p className="text-xs text-gray-500 dark:text-gray-400 px-1">{monthlyUsageText}</p>
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">{t.dashboard.totalInvoices}</span>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCount}</p>
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">{t.dashboard.revenue}</span>
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatSAR(totalRevenue)}</p>
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">{t.dashboard.pending}</span>
            <Clock className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingCount}</p>
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">{t.dashboard.paid}</span>
            <CheckCircle className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{paidCount}</p>
        </Card>
      </div>

      <div className="mb-8">
        <Card>
          <RevenueChart data={chart} title={t.dashboard.chartTitle} emptyLabel={t.dashboard.chartEmpty} />
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.dashboard.recentInvoices}</CardTitle>
          <Link href="/dashboard/invoices" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
            {t.dashboard.viewAll}
          </Link>
        </CardHeader>
        {invoices.length > 0 ? (
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{inv.invoice_number}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{inv.client_name} · {formatDate(inv.created_at, locale)}</p>
                </div>
                <div className="text-end">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatSAR(Number(inv.total_with_vat))}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    inv.status === "paid" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                    : inv.status === "sent" ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  }`}>
                    {inv.status === "paid" ? t.dashboard.invoices.paid : inv.status === "sent" ? t.dashboard.invoices.sent : t.dashboard.invoices.draft}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <FileText className="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-gray-700" />
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.dashboard.empty}</p>
            <Link href="/dashboard/invoices/new">
              <Button className="mt-4" size="sm">{t.dashboard.createFirst}</Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}

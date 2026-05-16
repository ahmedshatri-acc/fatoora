import { requireSession } from "@/lib/session";
import { sql } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { BarChart3 } from "lucide-react";
import { formatSAR } from "@/lib/zatca";
import { getMessages } from "@/lib/locale";
import Link from "next/link";

interface MonthRow {
  month: number;
  invoice_count: number;
  subtotal_sum: string;
  vat_sum: string;
  total_sum: string;
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  const session = await requireSession();
  const { messages: t } = await getMessages();
  const tr = t.dashboard.reports;
  const params = await searchParams;
  const currentYear = new Date().getFullYear();
  const year = Math.max(2020, Math.min(currentYear, parseInt(params.year ?? String(currentYear), 10) || currentYear));

  const db = sql();
  const rows = await db<MonthRow[]>`
    SELECT
      EXTRACT(MONTH FROM invoice_date)::int AS month,
      COUNT(*)::int AS invoice_count,
      COALESCE(SUM(subtotal), 0)::text AS subtotal_sum,
      COALESCE(SUM(vat_amount), 0)::text AS vat_sum,
      COALESCE(SUM(total_with_vat), 0)::text AS total_sum
    FROM invoices
    WHERE user_id = ${session.userId}
      AND status = 'paid'
      AND EXTRACT(YEAR FROM invoice_date) = ${year}
    GROUP BY EXTRACT(MONTH FROM invoice_date)
    ORDER BY month
  `;

  const totals = rows.reduce(
    (acc, r) => ({
      count: acc.count + r.invoice_count,
      subtotal: acc.subtotal + Number(r.subtotal_sum),
      vat: acc.vat + Number(r.vat_sum),
      total: acc.total + Number(r.total_sum),
    }),
    { count: 0, subtotal: 0, vat: 0, total: 0 }
  );

  const years: number[] = [];
  for (let y = currentYear; y >= currentYear - 4; y--) years.push(y);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{tr.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{tr.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">{tr.year}:</span>
          <div className="flex gap-1">
            {years.map(y => (
              <Link
                key={y}
                href={`/dashboard/reports?year=${y}`}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  year === y
                    ? "bg-emerald-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {y}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <p className="mb-3 text-xs text-gray-400 dark:text-gray-500">{tr.onlyPaid}</p>

      <Card className="p-0 overflow-hidden">
        {rows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-start font-medium text-gray-500 dark:text-gray-400">{tr.month}</th>
                  <th className="px-4 py-3 text-start font-medium text-gray-500 dark:text-gray-400">{tr.invoicesCount}</th>
                  <th className="px-4 py-3 text-start font-medium text-gray-500 dark:text-gray-400">{tr.totalSubtotal}</th>
                  <th className="px-4 py-3 text-start font-medium text-gray-500 dark:text-gray-400">{tr.totalVat}</th>
                  <th className="px-4 py-3 text-start font-medium text-gray-500 dark:text-gray-400">{tr.totalWithVat}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {rows.map(r => (
                  <tr key={r.month} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{tr.months[r.month - 1]}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{r.invoice_count}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{formatSAR(Number(r.subtotal_sum))}</td>
                    <td className="px-4 py-3 text-emerald-700 dark:text-emerald-400 font-medium">{formatSAR(Number(r.vat_sum))}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{formatSAR(Number(r.total_sum))}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <tr>
                  <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">{tr.grandTotal}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{totals.count}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{formatSAR(totals.subtotal)}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-700 dark:text-emerald-400">{formatSAR(totals.vat)}</td>
                  <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">{formatSAR(totals.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <BarChart3 className="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-gray-700" />
            <p className="text-sm text-gray-500 dark:text-gray-400">{tr.empty}</p>
          </div>
        )}
      </Card>
    </div>
  );
}

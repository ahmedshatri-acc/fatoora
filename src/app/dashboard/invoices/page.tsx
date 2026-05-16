import { requireSession } from "@/lib/session";
import { sql } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getMessages } from "@/lib/locale";
import { InvoicesList, type InvoiceRow } from "@/components/InvoicesList";

const PAGE_SIZE = 20;

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const session = await requireSession();
  const { locale, messages: t } = await getMessages();
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const statusFilter = (params.status ?? "all").trim();
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const validStatuses = ["draft", "sent", "paid"];
  const useStatus = validStatuses.includes(statusFilter) ? statusFilter : null;
  const searchLike = q.length > 0 ? `%${q}%` : null;

  const db = sql();
  const statusCond = useStatus ? db`AND status = ${useStatus}` : db``;
  const searchCond = searchLike
    ? db`AND (invoice_number ILIKE ${searchLike} OR client_name ILIKE ${searchLike})`
    : db``;

  const rows = await db<InvoiceRow[]>`
    SELECT id, invoice_number, client_name, total_with_vat, status, created_at, share_token
    FROM invoices
    WHERE user_id = ${session.userId} ${statusCond} ${searchCond}
    ORDER BY created_at DESC
    LIMIT ${PAGE_SIZE} OFFSET ${offset}
  `;

  const countRows = await db<{ c: number }[]>`
    SELECT COUNT(*)::int AS c FROM invoices
    WHERE user_id = ${session.userId} ${statusCond} ${searchCond}
  `;
  const totalCount = countRows[0]?.c ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const hasFilters = q.length > 0 || useStatus !== null;
  const empty = rows.length === 0;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.dashboard.invoices.title}</h1>
        <Link href="/dashboard/invoices/new">
          <Button>{t.dashboard.invoices.newBtn}</Button>
        </Link>
      </div>

      <InvoicesList
        initial={rows}
        totalPages={totalPages}
        page={page}
        q={q}
        status={statusFilter}
        locale={locale}
        t={t.dashboard.invoices}
      />

      {empty && !hasFilters && (
        <Card className="mt-4">
          <div className="py-16 text-center">
            <FileText className="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-gray-700" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t.dashboard.invoices.empty}</p>
            <Link href="/dashboard/invoices/new">
              <Button>{t.dashboard.invoices.createFirst}</Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}

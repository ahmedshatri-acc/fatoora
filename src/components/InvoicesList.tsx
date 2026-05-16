"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { formatSAR } from "@/lib/zatca";
import { formatDate, interpolate } from "@/lib/utils";
import { Trash2, Search } from "lucide-react";

export interface InvoiceRow {
  id: string;
  invoice_number: string;
  client_name: string;
  total_with_vat: string | number;
  status: "draft" | "sent" | "paid";
  created_at: string;
  due_date: string | null;
  share_token: string | null;
}

interface InvoicesListT {
  searchPlaceholder: string;
  filterAll: string;
  filterDraft: string;
  filterSent: string;
  filterPaid: string;
  noResults: string;
  prevPage: string;
  nextPage: string;
  page: string;
  delete: string;
  deleteConfirm: string;
  draft: string;
  sent: string;
  paid: string;
  overdue: string;
  view: string;
  colNumber: string;
  colClient: string;
  colDate: string;
  colTotal: string;
  colStatus: string;
}

export function InvoicesList({
  initial,
  totalPages,
  page,
  q,
  status,
  locale,
  t,
}: {
  initial: InvoiceRow[];
  totalPages: number;
  page: number;
  q: string;
  status: string;
  locale: "ar" | "en";
  t: InvoicesListT;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [rows, setRows] = useState(initial);
  const [searchInput, setSearchInput] = useState(q);

  function navigate(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const merged: Record<string, string | undefined> = { q, status, page: String(page), ...updates };
    for (const [k, v] of Object.entries(merged)) {
      if (v && v !== "" && !(k === "status" && v === "all") && !(k === "page" && v === "1")) {
        params.set(k, v);
      }
    }
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `/dashboard/invoices?${qs}` : "/dashboard/invoices");
    });
  }

  async function remove(id: string) {
    if (!confirm(t.deleteConfirm)) return;
    const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
    if (res.ok) setRows(rows.filter(r => r.id !== id));
  }

  function isOverdue(r: InvoiceRow) {
    return r.status !== "paid" && r.due_date && new Date(r.due_date) < new Date();
  }
  function statusLabel(r: InvoiceRow) {
    if (isOverdue(r)) return t.overdue;
    return r.status === "paid" ? t.paid : r.status === "sent" ? t.sent : t.draft;
  }
  function statusClass(r: InvoiceRow) {
    if (isOverdue(r)) return "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400";
    return r.status === "paid"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
      : r.status === "sent"
      ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
  }

  const filters: { key: string; label: string }[] = [
    { key: "all", label: t.filterAll },
    { key: "draft", label: t.filterDraft },
    { key: "sent", label: t.filterSent },
    { key: "paid", label: t.filterPaid },
  ];

  const hasFilters = q.length > 0 || status !== "all";

  return (
    <>
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <form
          onSubmit={(e) => { e.preventDefault(); navigate({ q: searchInput, page: "1" }); }}
          className="relative flex-1"
        >
          <Search className="absolute top-2.5 start-3 h-4 w-4 text-gray-400" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 ps-10 pe-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </form>
        <div className="flex gap-1 overflow-x-auto">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => navigate({ status: f.key, page: "1" })}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                status === f.key
                  ? "bg-emerald-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        {rows.length > 0 ? (
          <>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-start font-medium text-gray-500 dark:text-gray-400">{t.colNumber}</th>
                    <th className="px-6 py-3 text-start font-medium text-gray-500 dark:text-gray-400">{t.colClient}</th>
                    <th className="px-6 py-3 text-start font-medium text-gray-500 dark:text-gray-400">{t.colDate}</th>
                    <th className="px-6 py-3 text-start font-medium text-gray-500 dark:text-gray-400">{t.colTotal}</th>
                    <th className="px-6 py-3 text-start font-medium text-gray-500 dark:text-gray-400">{t.colStatus}</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {rows.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{inv.invoice_number}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{inv.client_name}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{formatDate(inv.created_at, locale)}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{formatSAR(Number(inv.total_with_vat))}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusClass(inv)}`}>
                          {statusLabel(inv)}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex items-center gap-3 justify-end">
                        <Link href={`/dashboard/invoices/${inv.id}`} className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                          {t.view}
                        </Link>
                        <button
                          onClick={() => remove(inv.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          aria-label={t.delete}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="sm:hidden divide-y divide-gray-100 dark:divide-gray-800">
              {rows.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between px-4 py-4">
                  <Link href={`/dashboard/invoices/${inv.id}`} className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{inv.invoice_number}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{inv.client_name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{formatDate(inv.created_at, locale)}</p>
                  </Link>
                  <div className="flex flex-col items-end gap-1 ms-3">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{formatSAR(Number(inv.total_with_vat))}</p>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusClass(inv)}`}>
                      {statusLabel(inv)}
                    </span>
                    <button onClick={() => remove(inv.id)} className="text-gray-400 hover:text-red-600 mt-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : hasFilters ? (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.noResults}</p>
          </div>
        ) : null}
      </Card>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <button
            disabled={page <= 1 || pending}
            onClick={() => navigate({ page: String(page - 1) })}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 disabled:opacity-40"
          >
            {t.prevPage}
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {interpolate(t.page, { n: page })} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages || pending}
            onClick={() => navigate({ page: String(page + 1) })}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 disabled:opacity-40"
          >
            {t.nextPage}
          </button>
        </div>
      )}
    </>
  );
}

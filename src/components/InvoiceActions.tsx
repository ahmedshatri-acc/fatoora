"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Send, Trash2, Share2, Printer, Copy, X, MessageCircle } from "lucide-react";

interface InvoiceActionsT {
  markPaid: string;
  markSent: string;
  markDraft: string;
  share: string;
  shareCopied: string;
  shareTitle: string;
  shareDesc: string;
  shareGenerate: string;
  shareRevoke: string;
  shareWhatsapp: string;
  print: string;
  delete: string;
  deleteConfirm: string;
}

export function InvoiceActions({
  invoiceId,
  currentStatus,
  initialShareToken,
  whatsappMessageTemplate,
  t,
}: {
  invoiceId: string;
  currentStatus: "draft" | "sent" | "paid";
  initialShareToken: string | null;
  whatsappMessageTemplate: string;
  t: InvoiceActionsT;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareToken, setShareToken] = useState<string | null>(initialShareToken);
  const [copied, setCopied] = useState(false);

  async function updateStatus(status: "draft" | "sent" | "paid") {
    setLoading(true);
    await fetch("/api/invoices", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: invoiceId, status }),
    });
    setLoading(false);
    router.refresh();
  }

  async function generateShare() {
    setLoading(true);
    const res = await fetch(`/api/invoices/${invoiceId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generate" }),
    });
    if (res.ok) {
      const { token } = await res.json();
      setShareToken(token);
    }
    setLoading(false);
  }

  async function revokeShare() {
    setLoading(true);
    await fetch(`/api/invoices/${invoiceId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "revoke" }),
    });
    setShareToken(null);
    setLoading(false);
  }

  async function copyLink() {
    if (!shareToken) return;
    const url = `${window.location.origin}/i/${shareToken}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function shareWhatsapp() {
    let token = shareToken;
    if (!token) {
      const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate" }),
      });
      if (!res.ok) return;
      const data = await res.json();
      token = data.token;
      setShareToken(token);
    }
    const url = `${window.location.origin}/i/${token}`;
    const msg = whatsappMessageTemplate.replace(/\s*$/, "") + " " + url;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  }

  async function remove() {
    if (!confirm(t.deleteConfirm)) return;
    setLoading(true);
    const res = await fetch(`/api/invoices/${invoiceId}`, { method: "DELETE" });
    if (res.ok) router.push("/dashboard/invoices");
    else setLoading(false);
  }

  return (
    <>
      <div className="print:hidden flex flex-wrap items-center gap-2">
        {currentStatus === "draft" && (
          <Button onClick={() => updateStatus("sent")} loading={loading} variant="secondary" size="sm">
            <Send className="h-4 w-4" />{t.markSent}
          </Button>
        )}
        {currentStatus !== "paid" && (
          <Button onClick={() => updateStatus("paid")} loading={loading} variant="secondary" size="sm">
            <CheckCircle2 className="h-4 w-4" />{t.markPaid}
          </Button>
        )}
        <button
          onClick={shareWhatsapp}
          className="flex items-center gap-2 rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900"
        >
          <MessageCircle className="h-4 w-4" />{t.shareWhatsapp}
        </button>
        <button
          onClick={() => setShareOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <Share2 className="h-4 w-4" />{t.share}
        </button>
        <a
          href={`/print/${invoiceId}`}
          target="_blank"
          rel="noopener"
          className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <Printer className="h-4 w-4" />{t.print}
        </a>
        <button
          onClick={remove}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
        >
          <Trash2 className="h-4 w-4" />{t.delete}
        </button>
      </div>

      {shareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 print:hidden" onClick={() => setShareOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t.shareTitle}</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.shareDesc}</p>
              </div>
              <button onClick={() => setShareOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {shareToken ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2">
                  <input
                    readOnly
                    value={typeof window !== "undefined" ? `${window.location.origin}/i/${shareToken}` : ""}
                    className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-200 focus:outline-none"
                    dir="ltr"
                  />
                  <button onClick={copyLink} className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1">
                    <Copy className="h-3.5 w-3.5" />
                    {copied ? t.shareCopied : "Copy"}
                  </button>
                </div>
                <Button onClick={revokeShare} loading={loading} variant="secondary" className="w-full">
                  {t.shareRevoke}
                </Button>
              </div>
            ) : (
              <Button onClick={generateShare} loading={loading} className="w-full">
                {t.shareGenerate}
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

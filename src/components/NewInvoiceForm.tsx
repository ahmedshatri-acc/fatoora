"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { calculateVat, calculateTotal, formatSAR } from "@/lib/zatca";

interface LineItem {
  description: string;
  qty: number;
  unit_price: number;
}

interface SavedClient {
  id: string;
  name: string;
  email: string | null;
  vat_number: string | null;
}

interface SavedItem {
  id: string;
  name: string;
  unit_price: number;
}

interface NewT {
  title: string;
  sellerCard: string;
  sellerName: string;
  sellerNamePlaceholder: string;
  sellerVat: string;
  sellerVatPlaceholder: string;
  saveAsDefault: string;
  clientCard: string;
  clientName: string;
  clientNamePlaceholder: string;
  clientEmail: string;
  clientEmailPlaceholder: string;
  saveClient: string;
  pickClient: string;
  itemsCard: string;
  itemDescription: string;
  itemQty: string;
  itemUnitPrice: string;
  itemDescriptionPlaceholder: string;
  addItem: string;
  notesCard: string;
  notesPlaceholder: string;
  saveAsDraft: string;
  issue: string;
  errorFields: string;
  errorItems: string;
  errorNetwork: string;
  errorGeneric: string;
  pickItem: string;
  saveItem: string;
  dueDateLabel: string;
  discountTitle: string;
  discountAmount: string;
  discountPercent: string;
  discountFixed: string;
  discountNone: string;
}

interface InvoicesT {
  monthlyCapReached: string;
  trialEnded: string;
  subtotal: string;
  vatRow: string;
  grandTotal: string;
  discountRow: string;
}

const DEFAULT_ITEM: LineItem = { description: "", qty: 1, unit_price: 0 };

export function NewInvoiceForm({
  defaults,
  clients,
  savedItems,
  blocked,
  t,
  ti,
}: {
  defaults: { sellerName: string; sellerVat: string; notes: string };
  clients: SavedClient[];
  savedItems: SavedItem[];
  blocked: boolean;
  t: NewT;
  ti: InvoicesT;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [capError, setCapError] = useState<"cap" | "trial" | null>(null);

  const [sellerName, setSellerName] = useState(defaults.sellerName);
  const [sellerVat, setSellerVat] = useState(defaults.sellerVat);
  const [saveAsDefault, setSaveAsDefault] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [saveClient, setSaveClient] = useState(false);
  const [items, setItems] = useState<LineItem[]>([{ ...DEFAULT_ITEM }]);
  const [saveItems, setSaveItems] = useState(false);
  const [notes, setNotes] = useState(defaults.notes);
  const [dueDate, setDueDate] = useState("");
  const [discountType, setDiscountType] = useState<"none" | "percent" | "fixed">("none");
  const [discountValue, setDiscountValue] = useState(0);

  const [clientSearch, setClientSearch] = useState("");
  const [showClients, setShowClients] = useState(false);
  const [itemSearchIdx, setItemSearchIdx] = useState<number | null>(null);

  const filteredClients = useMemo(() => {
    const q = clientSearch.trim().toLowerCase();
    if (!q) return clients.slice(0, 8);
    return clients.filter(c => c.name.toLowerCase().includes(q)).slice(0, 8);
  }, [clients, clientSearch]);

  function filteredItems(idx: number) {
    const q = items[idx]?.description?.trim().toLowerCase() ?? "";
    if (!q) return savedItems.slice(0, 8);
    return savedItems.filter(i => i.name.toLowerCase().includes(q)).slice(0, 8);
  }

  function pickClient(c: SavedClient) {
    setClientName(c.name);
    setClientSearch(c.name);
    setClientEmail(c.email ?? "");
    setShowClients(false);
  }
  function pickItem(idx: number, item: SavedItem) {
    const updated = [...items];
    updated[idx] = { description: item.name, qty: updated[idx]?.qty || 1, unit_price: item.unit_price };
    setItems(updated);
    setItemSearchIdx(null);
  }

  function addItem() { setItems([...items, { ...DEFAULT_ITEM }]); }
  function removeItem(i: number) { setItems(items.filter((_, idx) => idx !== i)); }
  function updateItem(i: number, field: keyof LineItem, value: string | number) {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: value };
    setItems(updated);
  }

  const rawSubtotal = items.reduce((s, item) => s + item.qty * item.unit_price, 0);
  const discountAmount = useMemo(() => {
    if (discountType === "percent") return Math.min(rawSubtotal, rawSubtotal * Math.min(100, Math.max(0, discountValue)) / 100);
    if (discountType === "fixed") return Math.min(rawSubtotal, Math.max(0, discountValue));
    return 0;
  }, [discountType, discountValue, rawSubtotal]);
  const subtotal = rawSubtotal - discountAmount;
  const vat = calculateVat(subtotal);
  const total = calculateTotal(subtotal);

  async function handleSubmit(e: React.FormEvent, status: "draft" | "sent") {
    e.preventDefault();
    const finalClientName = clientName || clientSearch;
    if (!sellerName || !sellerVat || !finalClientName) {
      setError(t.errorFields); return;
    }
    if (items.some(i => !i.description || i.unit_price <= 0)) {
      setError(t.errorItems); return;
    }

    setSaving(true);
    setError("");
    setCapError(null);

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoice_date: new Date().toISOString(),
          due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
          seller_name: sellerName,
          seller_vat: sellerVat,
          client_name: finalClientName,
          client_email: clientEmail || undefined,
          items,
          notes: notes || undefined,
          status,
          discount_type: discountType !== "none" ? discountType : undefined,
          discount_value: discountType !== "none" ? discountValue : undefined,
          save_as_default: saveAsDefault,
          save_client: saveClient,
          save_items: saveItems,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.error === "monthly_cap_reached") setCapError("cap");
        else if (data.error === "trial_expired") setCapError("trial");
        else setError(data.error ?? t.errorGeneric);
        setSaving(false);
        return;
      }

      router.push(`/dashboard/invoices/${data.id}`);
    } catch {
      setError(t.errorNetwork);
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">{t.title}</h1>

      {(blocked || capError) && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p>{blocked || capError === "trial" ? ti.trialEnded : ti.monthlyCapReached}</p>
        </div>
      )}

      <form>
        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">{t.sellerCard}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input id="seller-name" label={t.sellerName} placeholder={t.sellerNamePlaceholder}
                value={sellerName} onChange={(e) => setSellerName(e.target.value)} required />
              <Input id="seller-vat" label={t.sellerVat} placeholder={t.sellerVatPlaceholder}
                value={sellerVat} onChange={(e) => setSellerVat(e.target.value)} maxLength={15} dir="ltr" required />
            </div>
            <label className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <input type="checkbox" checked={saveAsDefault} onChange={(e) => setSaveAsDefault(e.target.checked)} />
              {t.saveAsDefault}
            </label>
          </Card>

          <Card>
            <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">{t.clientCard}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="relative">
                <label htmlFor="client-name" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.clientName}</label>
                <input
                  id="client-name"
                  className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder={t.clientNamePlaceholder}
                  value={clientSearch}
                  onFocus={() => setShowClients(true)}
                  onBlur={() => setTimeout(() => setShowClients(false), 150)}
                  onChange={(e) => { setClientSearch(e.target.value); setClientName(e.target.value); setShowClients(true); }}
                  required
                />
                {showClients && filteredClients.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
                    {filteredClients.map(c => (
                      <li key={c.id}>
                        <button
                          type="button"
                          onMouseDown={(e) => { e.preventDefault(); pickClient(c); }}
                          className="block w-full text-start px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <span className="text-gray-900 dark:text-gray-100">{c.name}</span>
                          {c.email && <span className="ms-2 text-xs text-gray-400">{c.email}</span>}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Input id="client-email" label={t.clientEmail} placeholder={t.clientEmailPlaceholder}
                type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} dir="ltr" />
            </div>
            <label className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <input type="checkbox" checked={saveClient} onChange={(e) => setSaveClient(e.target.checked)} />
              {t.saveClient}
            </label>
          </Card>

          <Card>
            <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">{t.itemsCard}</h2>
            <div className="space-y-3">
              <div className="hidden sm:grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                <div className="col-span-6">{t.itemDescription}</div>
                <div className="col-span-2">{t.itemQty}</div>
                <div className="col-span-3">{t.itemUnitPrice}</div>
                <div className="col-span-1" />
              </div>
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-start">
                  <div className="col-span-12 sm:col-span-6 relative">
                    <input
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      placeholder={t.itemDescriptionPlaceholder} value={item.description}
                      onFocus={() => setItemSearchIdx(i)}
                      onBlur={() => setTimeout(() => setItemSearchIdx(prev => prev === i ? null : prev), 150)}
                      onChange={(e) => { updateItem(i, "description", e.target.value); setItemSearchIdx(i); }} />
                    {itemSearchIdx === i && filteredItems(i).length > 0 && (
                      <ul className="absolute z-10 mt-1 w-full max-h-40 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
                        {filteredItems(i).map(si => (
                          <li key={si.id}>
                            <button
                              type="button"
                              onMouseDown={(e) => { e.preventDefault(); pickItem(i, si); }}
                              className="block w-full text-start px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <span className="text-gray-900 dark:text-gray-100">{si.name}</span>
                              <span className="ms-2 text-xs text-gray-400">{formatSAR(si.unit_price)}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <input
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      type="number" min="1" value={item.qty} dir="ltr"
                      onChange={(e) => updateItem(i, "qty", Number(e.target.value))} />
                  </div>
                  <div className="col-span-7 sm:col-span-3">
                    <input
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      type="number" min="0" step="0.01" value={item.unit_price} dir="ltr"
                      onChange={(e) => updateItem(i, "unit_price", Number(e.target.value))} />
                  </div>
                  <div className="col-span-1 flex justify-center pt-2">
                    {items.length > 1 && (
                      <button type="button" onClick={() => removeItem(i)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <button type="button" onClick={addItem}
                className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                <Plus className="h-4 w-4" />{t.addItem}
              </button>
              <label className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <input type="checkbox" checked={saveItems} onChange={(e) => setSaveItems(e.target.checked)} />
                {t.saveItem}
              </label>
            </div>

            <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.discountTitle}</label>
                <div className="flex gap-2">
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as "none" | "percent" | "fixed")}
                    className="rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="none">{t.discountNone}</option>
                    <option value="percent">{t.discountPercent}</option>
                    <option value="fixed">{t.discountFixed}</option>
                  </select>
                  {discountType !== "none" && (
                    <input
                      type="number" min="0" step="0.01" dir="ltr"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(Number(e.target.value))}
                      placeholder={t.discountAmount}
                      className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="due-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.dueDateLabel}</label>
                <input
                  id="due-date" type="date" dir="ltr"
                  value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                  className="rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>{ti.subtotal}</span><span>{formatSAR(rawSubtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-amber-700 dark:text-amber-400">
                  <span>{ti.discountRow}</span><span>−{formatSAR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>{ti.vatRow}</span><span>{formatSAR(vat)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-gray-800">
                <span>{ti.grandTotal}</span><span>{formatSAR(total)}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">{t.notesCard}</h2>
            <textarea
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
              rows={3} placeholder={t.notesPlaceholder} value={notes}
              onChange={(e) => setNotes(e.target.value)} />
          </Card>

          {error && <p className="rounded-lg bg-red-50 dark:bg-red-950 px-4 py-3 text-sm text-red-600 dark:text-red-400">{error}</p>}

          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={(e) => handleSubmit(e as React.FormEvent, "draft")} loading={saving} disabled={blocked}>
              {t.saveAsDraft}
            </Button>
            <Button type="button" onClick={(e) => handleSubmit(e as React.FormEvent, "sent")} loading={saving} disabled={blocked}>
              {t.issue}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { calculateVat, calculateTotal, formatSAR } from "@/lib/zatca";

interface LineItem {
  description: string;
  qty: number;
  unit_price: number;
}

const DEFAULT_ITEM: LineItem = { description: "", qty: 1, unit_price: 0 };

export default function NewInvoicePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [sellerName, setSellerName] = useState("");
  const [sellerVat, setSellerVat] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [items, setItems] = useState<LineItem[]>([{ ...DEFAULT_ITEM }]);
  const [notes, setNotes] = useState("");

  function addItem() { setItems([...items, { ...DEFAULT_ITEM }]); }
  function removeItem(i: number) { setItems(items.filter((_, idx) => idx !== i)); }
  function updateItem(i: number, field: keyof LineItem, value: string | number) {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: value };
    setItems(updated);
  }

  // Optimistic preview only — the server recomputes authoritatively
  const subtotal = items.reduce((s, item) => s + item.qty * item.unit_price, 0);
  const vat = calculateVat(subtotal);
  const total = calculateTotal(subtotal);

  async function handleSubmit(e: React.FormEvent, status: "draft" | "sent") {
    e.preventDefault();
    if (!sellerName || !sellerVat || !clientName) {
      setError("يرجى تعبئة جميع الحقول المطلوبة"); return;
    }
    if (items.some(i => !i.description || i.unit_price <= 0)) {
      setError("يرجى إكمال بيانات بنود الفاتورة"); return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoice_date: new Date().toISOString(),
          seller_name: sellerName,
          seller_vat: sellerVat,
          client_name: clientName,
          client_email: clientEmail || undefined,
          items,
          notes: notes || undefined,
          status,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? "حدث خطأ أثناء الحفظ");
        setSaving(false);
        return;
      }

      router.push(`/dashboard/invoices/${data.id}`);
    } catch {
      setError("تعذّر الاتصال بالخادم، يرجى المحاولة مجددًا");
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">فاتورة جديدة</h1>
      <form>
        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 text-base font-semibold text-gray-900">بيانات البائع</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input id="seller-name" label="اسم المنشأة / الاسم التجاري *" placeholder="شركة الأفق للتطوير"
                value={sellerName} onChange={(e) => setSellerName(e.target.value)} required />
              <Input id="seller-vat" label="الرقم الضريبي (15 رقمًا) *" placeholder="300000000000003"
                value={sellerVat} onChange={(e) => setSellerVat(e.target.value)} maxLength={15} dir="ltr" required />
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-base font-semibold text-gray-900">بيانات العميل</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input id="client-name" label="اسم العميل *" placeholder="أحمد المطيري"
                value={clientName} onChange={(e) => setClientName(e.target.value)} required />
              <Input id="client-email" label="البريد الإلكتروني للعميل" placeholder="client@email.com"
                type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} dir="ltr" />
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-base font-semibold text-gray-900">بنود الفاتورة</h2>
            <div className="space-y-3">
              <div className="hidden sm:grid grid-cols-12 gap-2 text-xs font-medium text-gray-500">
                <div className="col-span-6">الوصف</div>
                <div className="col-span-2">الكمية</div>
                <div className="col-span-3">سعر الوحدة (ر.س)</div>
                <div className="col-span-1" />
              </div>
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-start">
                  <div className="col-span-12 sm:col-span-6">
                    <input
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      placeholder="وصف الخدمة أو المنتج" value={item.description}
                      onChange={(e) => updateItem(i, "description", e.target.value)} />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <input
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      type="number" min="1" value={item.qty} dir="ltr"
                      onChange={(e) => updateItem(i, "qty", Number(e.target.value))} />
                  </div>
                  <div className="col-span-7 sm:col-span-3">
                    <input
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
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
            <button type="button" onClick={addItem}
              className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
              <Plus className="h-4 w-4" />إضافة بند
            </button>
            <div className="mt-6 border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>المجموع قبل الضريبة</span><span>{formatSAR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>ضريبة القيمة المضافة (15%)</span><span>{formatSAR(vat)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>الإجمالي شامل الضريبة</span><span>{formatSAR(total)}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-base font-semibold text-gray-900">ملاحظات (اختياري)</h2>
            <textarea
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
              rows={3} placeholder="شروط الدفع، ملاحظات إضافية..." value={notes}
              onChange={(e) => setNotes(e.target.value)} />
          </Card>

          {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={(e) => handleSubmit(e as React.FormEvent, "draft")} loading={saving}>
              حفظ كمسودة
            </Button>
            <Button type="button" onClick={(e) => handleSubmit(e as React.FormEvent, "sent")} loading={saving}>
              إصدار الفاتورة
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

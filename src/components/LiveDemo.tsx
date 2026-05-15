"use client";

import { useState } from "react";
import { calculateVat, calculateTotal, formatSAR, generateZatcaQRData } from "@/lib/zatca";
import { InvoiceQR } from "@/components/InvoiceQR";

export function LiveDemo() {
  const [sellerName, setSellerName] = useState("شركة الأفق للتطوير");
  const [clientName, setClientName] = useState("أحمد المطيري");
  const [description, setDescription] = useState("تطوير تطبيق جوال");
  const [amount, setAmount] = useState(5000);
  const [generated, setGenerated] = useState(false);
  const [qrData, setQrData] = useState("");

  const vat = calculateVat(amount);
  const total = calculateTotal(amount);

  function generate() {
    const data = generateZatcaQRData({
      sellerName,
      vatNumber: "300000000000003",
      invoiceDate: new Date().toISOString(),
      totalWithVat: total,
      vatAmount: vat,
    });
    setQrData(data);
    setGenerated(true);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
      <p className="mb-4 text-sm font-semibold text-emerald-600 uppercase tracking-wide">جرّب الآن — بدون تسجيل</p>

      {!generated ? (
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">اسم البائع</label>
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={sellerName}
              onChange={(e) => setSellerName(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">اسم العميل</label>
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">الخدمة</label>
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">المبلغ (ر.س)</label>
            <input
              type="number"
              dir="ltr"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={1}
            />
          </div>
          <div className="rounded-lg bg-gray-50 p-3 text-sm space-y-1">
            <div className="flex justify-between text-gray-500">
              <span>قبل الضريبة</span><span>{formatSAR(amount)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>ضريبة القيمة المضافة 15%</span><span>{formatSAR(vat)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-200">
              <span>الإجمالي</span><span>{formatSAR(total)}</span>
            </div>
          </div>
          <button
            onClick={generate}
            className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            إنشاء الفاتورة مع رمز ZATCA
          </button>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <InvoiceQR qrData={qrData} />
          </div>
          <div className="rounded-lg border border-gray-100 p-4 text-sm text-right space-y-1">
            <p className="font-semibold text-gray-900">{sellerName} ← {clientName}</p>
            <p className="text-gray-500">{description}</p>
            <p className="text-lg font-bold text-emerald-600">{formatSAR(total)}</p>
          </div>
          <p className="text-xs text-gray-400">رمز ZATCA صالح ومتوافق مع متطلبات هيئة الزكاة والضريبة والجمارك</p>
          <button
            onClick={() => setGenerated(false)}
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            ← أنشئ فاتورة أخرى
          </button>
        </div>
      )}
    </div>
  );
}

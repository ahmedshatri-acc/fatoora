"use client";

import { useState } from "react";
import { calculateVat, calculateTotal, formatSAR, generateZatcaQRData } from "@/lib/zatca";
import { InvoiceQR } from "@/components/InvoiceQR";
import { useLocale } from "@/components/LocaleProvider";

export function LiveDemo() {
  const { t } = useLocale();
  const td = t.landing.demo;

  const [sellerName, setSellerName] = useState(t.locale === "ar" ? "شركة الأفق للتطوير" : "Horizon Tech Co.");
  const [clientName, setClientName] = useState(t.locale === "ar" ? "أحمد المطيري" : "Ahmed Al-Mutairi");
  const [description, setDescription] = useState(t.locale === "ar" ? "تطوير تطبيق جوال" : "Mobile app development");
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
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-lg">
      <p className="mb-4 text-sm font-semibold text-emerald-600 uppercase tracking-wide">{td.badge}</p>

      {!generated ? (
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{td.seller}</label>
            <input
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={sellerName}
              onChange={(e) => setSellerName(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{td.client}</label>
            <input
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{td.description}</label>
            <input
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{td.amount}</label>
            <input
              type="number"
              dir="ltr"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={1}
            />
          </div>
          <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3 text-sm space-y-1">
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>{td.vatAmount.split(" (")[0]}</span><span>{formatSAR(amount)}</span>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>{td.vatAmount}</span><span>{formatSAR(vat)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-1 border-t border-gray-200 dark:border-gray-700">
              <span>{td.total}</span><span>{formatSAR(total)}</span>
            </div>
          </div>
          <button
            onClick={generate}
            className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            {td.generate}
          </button>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <InvoiceQR qrData={qrData} />
          </div>
          <div className="rounded-lg border border-gray-100 dark:border-gray-800 p-4 text-sm text-start space-y-1">
            <p className="font-semibold text-gray-900 dark:text-white">{sellerName} ← {clientName}</p>
            <p className="text-gray-500 dark:text-gray-400">{description}</p>
            <p className="text-lg font-bold text-emerald-600">{formatSAR(total)}</p>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">{td.zatcaCaption}</p>
          <button
            onClick={() => setGenerated(false)}
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            {td.another}
          </button>
        </div>
      )}
    </div>
  );
}

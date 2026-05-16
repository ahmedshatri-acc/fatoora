"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Crown, CheckCircle2, Upload, X } from "lucide-react";
import { interpolate } from "@/lib/utils";

interface SettingsT {
  title: string;
  accountInfo: string;
  name: string;
  email: string;
  changePassword: string;
  currentPassword: string;
  newPassword: string;
  saveAccount: string;
  savedOk: string;
  passwordWrong: string;
  defaultsTitle: string;
  defaultsDesc: string;
  defaultSellerName: string;
  defaultSellerVat: string;
  defaultNotes: string;
  invoicePrefix: string;
  invoicePrefixHint: string;
  saveDefaults: string;
  brandingTitle: string;
  brandingDesc: string;
  uploadLogo: string;
  removeLogo: string;
  logoSizeError: string;
  logoTypeError: string;
  subscription: string;
  trial: string;
  trialDaysLeft: string;
  perMonth: string;
  subscribedIndividual: string;
  subscribedBusiness: string;
  paymentPending: string;
  contactToUpgrade: string;
}

interface Initial {
  name: string;
  email: string;
  plan: "individual" | "business" | null;
  trialDaysRemaining: number;
  trialActive: boolean;
  defaultSellerName: string;
  defaultSellerVat: string;
  defaultNotes: string;
  invoicePrefix: string;
  logoData: string | null;
}

export function SettingsForm({ initial, t }: { initial: Initial; t: SettingsT }) {
  const [name, setName] = useState(initial.name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [sellerName, setSellerName] = useState(initial.defaultSellerName);
  const [sellerVat, setSellerVat] = useState(initial.defaultSellerVat);
  const [defaultNotes, setDefaultNotes] = useState(initial.defaultNotes);
  const [invoicePrefix, setInvoicePrefix] = useState(initial.invoicePrefix);
  const [logoData, setLogoData] = useState<string | null>(initial.logoData);
  const [accountBusy, setAccountBusy] = useState(false);
  const [defaultsBusy, setDefaultsBusy] = useState(false);
  const [logoBusy, setLogoBusy] = useState(false);
  const [accountMsg, setAccountMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [defaultsMsg, setDefaultsMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [logoMsg, setLogoMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function saveAccount(e: React.FormEvent) {
    e.preventDefault();
    setAccountBusy(true);
    setAccountMsg(null);
    const body: Record<string, string> = { name };
    if (newPassword) {
      body.currentPassword = currentPassword;
      body.newPassword = newPassword;
    }
    const res = await fetch("/api/account", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setAccountMsg({ kind: "ok", text: t.savedOk });
      setCurrentPassword("");
      setNewPassword("");
    } else {
      const data = await res.json().catch(() => ({}));
      const text = data.error === "current_password_wrong" ? t.passwordWrong : "Error";
      setAccountMsg({ kind: "err", text });
    }
    setAccountBusy(false);
  }

  async function saveDefaults(e: React.FormEvent) {
    e.preventDefault();
    setDefaultsBusy(true);
    setDefaultsMsg(null);
    const res = await fetch("/api/account", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        default_seller_name: sellerName,
        default_seller_vat: sellerVat,
        default_notes: defaultNotes,
        invoice_prefix: invoicePrefix,
      }),
    });
    setDefaultsMsg({ kind: res.ok ? "ok" : "err", text: res.ok ? t.savedOk : "Error" });
    setDefaultsBusy(false);
  }

  async function uploadLogo(file: File) {
    setLogoBusy(true);
    setLogoMsg(null);
    const form = new FormData();
    form.append("logo", file);
    const res = await fetch("/api/account/logo", { method: "POST", body: form });
    if (res.ok) {
      const data = await res.json();
      setLogoData(data.dataUrl);
      setLogoMsg({ kind: "ok", text: t.savedOk });
    } else {
      const data = await res.json().catch(() => ({}));
      const text = data.error === "file_too_large" ? t.logoSizeError
        : data.error === "invalid_type" ? t.logoTypeError
        : "Error";
      setLogoMsg({ kind: "err", text });
    }
    setLogoBusy(false);
  }

  async function removeLogo() {
    setLogoBusy(true);
    const res = await fetch("/api/account/logo", { method: "DELETE" });
    if (res.ok) setLogoData(null);
    setLogoBusy(false);
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">{t.title}</h1>
      <div className="space-y-6 max-w-2xl">
        <Card>
          <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">{t.accountInfo}</h2>
          <form onSubmit={saveAccount} className="space-y-4">
            <Input id="name" label={t.name} value={name} onChange={(e) => setName(e.target.value)} required />
            <Input id="email" label={t.email} value={initial.email} disabled dir="ltr" />
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">{t.changePassword}</p>
              <div className="space-y-3">
                <Input id="current-password" type="password" label={t.currentPassword}
                  value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} dir="ltr" />
                <Input id="new-password" type="password" label={t.newPassword}
                  value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={8} dir="ltr" />
              </div>
            </div>
            {accountMsg && (
              <p className={`text-sm ${accountMsg.kind === "ok" ? "text-emerald-600" : "text-red-600"}`}>
                {accountMsg.text}
              </p>
            )}
            <Button type="submit" loading={accountBusy}>{t.saveAccount}</Button>
          </form>
        </Card>

        <Card>
          <h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">{t.brandingTitle}</h2>
          <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">{t.brandingDesc}</p>
          {logoData ? (
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoData} alt="Logo" className="h-16 w-auto max-w-[200px] rounded border border-gray-100 dark:border-gray-800 bg-white p-2 object-contain" />
              <Button variant="secondary" onClick={removeLogo} loading={logoBusy}>
                <X className="h-4 w-4" />{t.removeLogo}
              </Button>
            </div>
          ) : (
            <>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadLogo(f); }}
              />
              <Button variant="secondary" onClick={() => fileRef.current?.click()} loading={logoBusy}>
                <Upload className="h-4 w-4" />{t.uploadLogo}
              </Button>
            </>
          )}
          {logoMsg && (
            <p className={`mt-3 text-sm ${logoMsg.kind === "ok" ? "text-emerald-600" : "text-red-600"}`}>
              {logoMsg.text}
            </p>
          )}
        </Card>

        <Card>
          <h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">{t.defaultsTitle}</h2>
          <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">{t.defaultsDesc}</p>
          <form onSubmit={saveDefaults} className="space-y-4">
            <Input id="def-name" label={t.defaultSellerName} value={sellerName} onChange={(e) => setSellerName(e.target.value)} />
            <Input id="def-vat" label={t.defaultSellerVat} value={sellerVat} onChange={(e) => setSellerVat(e.target.value)} maxLength={15} dir="ltr" />
            <div>
              <Input id="def-prefix" label={t.invoicePrefix} value={invoicePrefix} onChange={(e) => setInvoicePrefix(e.target.value.toUpperCase())} maxLength={16} dir="ltr" />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t.invoicePrefixHint}</p>
            </div>
            <div>
              <label htmlFor="def-notes" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.defaultNotes}</label>
              <textarea id="def-notes" value={defaultNotes} onChange={(e) => setDefaultNotes(e.target.value)} rows={3}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            {defaultsMsg && (
              <p className={`text-sm ${defaultsMsg.kind === "ok" ? "text-emerald-600" : "text-red-600"}`}>
                {defaultsMsg.text}
              </p>
            )}
            <Button type="submit" loading={defaultsBusy}>{t.saveDefaults}</Button>
          </form>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Crown className="h-5 w-5 text-amber-500" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">{t.subscription}</h2>
          </div>
          {initial.plan ? (
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950 p-4 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <p className="font-medium text-emerald-800 dark:text-emerald-300">
                {initial.plan === "individual" ? t.subscribedIndividual : t.subscribedBusiness}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {initial.trialActive ? (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {interpolate(t.trialDaysLeft, { n: initial.trialDaysRemaining })}
                </p>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-300">{t.trial}</p>
              )}
              <p className="text-xs text-amber-600 dark:text-amber-400">{t.paymentPending}</p>
              <a href="/contact" className="inline-flex rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2">
                {t.contactToUpgrade}
              </a>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Receipt } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useLocale } from "@/components/LocaleProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

export default function SignupPage() {
  const router = useRouter();
  const { t, dir } = useLocale();
  const l = t.auth.signup;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error === "Email already registered" ? l.errorEmail : l.errorGeneric);
      setLoading(false);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-950 px-4" dir={dir}>
      <div className="w-full max-w-sm">
        <div className="flex justify-end gap-1 mb-4">
          <ThemeToggle />
          <LocaleSwitcher />
        </div>
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <Link href="/" className="flex items-center gap-2">
              <Receipt className="h-7 w-7 text-emerald-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">Wathq</span>
            </Link>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{l.title}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{l.subtitle}</p>
        </div>

        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
          <form onSubmit={handleSignup} className="space-y-4">
            <Input id="name" type="text" label={l.name} placeholder={l.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} required />
            <Input id="email" type="email" label={l.email} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required dir="ltr" />
            <Input id="password" type="password" label={l.password} placeholder={l.passwordHint} value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required dir="ltr" />
            {error && <p className="rounded-lg bg-red-50 dark:bg-red-950 px-3 py-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
            <Button type="submit" className="w-full" size="lg" loading={loading}>{l.submit}</Button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          {l.hasAccount}{" "}
          <Link href="/login" className="font-medium text-emerald-600 hover:text-emerald-700">{l.loginLink}</Link>
        </p>
      </div>
    </div>
  );
}

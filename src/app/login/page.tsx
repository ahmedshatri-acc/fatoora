"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Receipt } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex items-center gap-2">
              <Receipt className="h-7 w-7 text-emerald-600" />
              <span className="text-2xl font-bold text-gray-900">وَثَق</span>
            </div>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">تسجيل الدخول</h1>
          <p className="mt-1 text-sm text-gray-500">أدخل بياناتك للمتابعة</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              id="email"
              type="email"
              label="البريد الإلكتروني"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
            />
            <Input
              id="password"
              type="password"
              label="كلمة المرور"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              dir="ltr"
            />
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              تسجيل الدخول
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          ليس لديك حساب؟{" "}
          <Link href="/signup" className="font-medium text-emerald-600 hover:text-emerald-700">
            سجّل مجانًا
          </Link>
        </p>
      </div>
    </div>
  );
}

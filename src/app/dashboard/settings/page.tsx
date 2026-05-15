import { requireSession } from "@/lib/session";
import { sql } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { PLANS } from "@/lib/stripe";
import { CheckCircle2, Crown } from "lucide-react";
import { SubscribeButton } from "@/components/SubscribeButton";

export default async function SettingsPage() {
  const session = await requireSession();
  const db = sql();

  const rows = await db`SELECT plan FROM profiles WHERE user_id = ${session.userId} LIMIT 1`;
  const plan = rows[0]?.plan ?? null;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">الإعدادات</h1>
      <div className="space-y-6 max-w-2xl">
        <Card>
          <h2 className="mb-4 text-base font-semibold text-gray-900">معلومات الحساب</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">الاسم</span>
              <span className="font-medium text-gray-900">{session.name}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">البريد الإلكتروني</span>
              <span className="font-medium text-gray-900 dir-ltr">{session.email}</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Crown className="h-5 w-5 text-amber-500" />
            <h2 className="text-base font-semibold text-gray-900">الاشتراك</h2>
          </div>
          {plan ? (
            <div className="rounded-lg bg-emerald-50 p-4 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="font-medium text-emerald-800">
                  أنت مشترك في الخطة {plan === "individual" ? "الفردية" : "الأعمال"}
                </p>
                <p className="text-sm text-emerald-600">
                  {plan === "individual" ? PLANS.individual.priceMonthly : PLANS.business.priceMonthly} ريال / شهر
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-4 text-sm text-gray-500">أنت على الفترة التجريبية المجانية. اختر خطتك للاستمرار.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {(["individual", "business"] as const).map((p) => (
                  <div key={p} className="rounded-xl border border-gray-200 p-4">
                    <p className="font-semibold text-gray-900 mb-1">{PLANS[p].name}</p>
                    <p className="text-2xl font-bold text-gray-900 mb-3">
                      {PLANS[p].priceMonthly}
                      <span className="text-sm font-normal text-gray-500"> ريال/شهر</span>
                    </p>
                    <ul className="mb-4 space-y-1.5">
                      {PLANS[p].features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />{f}
                        </li>
                      ))}
                    </ul>
                    <SubscribeButton plan={p} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

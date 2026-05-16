import type { Metadata } from "next";
import { LegalLayout, Section } from "@/components/LegalLayout";
import { Mail, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "تواصل معنا",
  description: "تواصل مع فريق دعم Wathq — نحن هنا للمساعدة في أي استفسار عن الفوترة الإلكترونية ورمز QR من زاتكا.",
};

export default function ContactPage() {
  return (
    <LegalLayout title="تواصل معنا">
      <Section title="الدعم الفني">
        <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
          <Mail className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-gray-900 mb-1">البريد الإلكتروني</p>
            <a
              href="mailto:support@wathq.sa"
              className="text-emerald-600 hover:underline text-sm"
            >
              support@wathq.sa
            </a>
            <p className="text-xs text-gray-400 mt-1">للاستفسارات التقنية ومشكلات الحساب</p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
          <Clock className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-gray-900 mb-1">وقت الاستجابة</p>
            <p className="text-sm text-gray-600">خلال 24 ساعة في أيام العمل</p>
            <p className="text-xs text-gray-400 mt-1">الأحد — الخميس، 9 صباحًا — 6 مساءً بتوقيت الرياض</p>
          </div>
        </div>
      </Section>

      <Section title="استفسارات متخصصة">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="font-semibold text-gray-900 text-sm mb-1">الفوترة والاشتراكات</p>
            <a href="mailto:billing@wathq.sa" className="text-emerald-600 hover:underline text-sm">
              billing@wathq.sa
            </a>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="font-semibold text-gray-900 text-sm mb-1">الخصوصية والبيانات</p>
            <a href="mailto:privacy@wathq.sa" className="text-emerald-600 hover:underline text-sm">
              privacy@wathq.sa
            </a>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="font-semibold text-gray-900 text-sm mb-1">الشؤون القانونية</p>
            <a href="mailto:legal@wathq.sa" className="text-emerald-600 hover:underline text-sm">
              legal@wathq.sa
            </a>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="font-semibold text-gray-900 text-sm mb-1">الشراكات والأعمال</p>
            <a href="mailto:hello@wathq.sa" className="text-emerald-600 hover:underline text-sm">
              hello@wathq.sa
            </a>
          </div>
        </div>
      </Section>

      <Section title="أسئلة شائعة قبل التواصل">
        <div className="space-y-4">
          {[
            {
              q: "هل فواتيري تتضمن رمز QR من زاتكا؟",
              a: "نعم. كل فاتورة عبر Wathq تتضمن رمز QR بترميز TLV حسب معيار زاتكا للفواتير المبسطة (B2C) واحتساب ضريبة القيمة المضافة 15%. للفوترة بين الشركات (B2B) وفق المرحلة الثانية، يتطلب الأمر تكاملًا منفصلًا مع بوابة فاتورة وهو قيد التطوير.",
            },
            {
              q: "نسيت كلمة المرور — كيف أعيد تعيينها؟",
              a: "توجّه إلى صفحة تسجيل الدخول واضغط «نسيت كلمة المرور»، أو راسلنا على support@wathq.sa وسنساعدك.",
            },
            {
              q: "كيف أُلغي اشتراكي؟",
              a: "من إعدادات حسابك، اختر «الاشتراك» ثم «إلغاء الاشتراك». يستمر وصولك حتى نهاية فترة الفوترة الحالية.",
            },
            {
              q: "هل يمكنني تصدير فواتيري؟",
              a: "نعم، يمكنك تصدير أي فاتورة بصيغة PDF مباشرةً من صفحة الفاتورة.",
            },
          ].map(({ q, a }) => (
            <details key={q} className="rounded-lg border border-gray-100 bg-gray-50 p-4 group">
              <summary className="font-medium text-gray-800 cursor-pointer list-none flex items-center justify-between">
                {q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg">›</span>
              </summary>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </Section>
    </LegalLayout>
  );
}

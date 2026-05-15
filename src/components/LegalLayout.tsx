import Link from "next/link";
import { Receipt } from "lucide-react";

export function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Receipt className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold text-gray-900">Wathq</span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            العودة للرئيسية
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">{title}</h1>
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm prose-custom">
          {children}
        </div>
      </main>

      <footer className="border-t border-gray-100 bg-white py-6 text-center text-sm text-gray-400">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-3">
          <Link href="/about" className="hover:text-gray-600 transition-colors">من نحن</Link>
          <Link href="/privacy" className="hover:text-gray-600 transition-colors">سياسة الخصوصية</Link>
          <Link href="/terms" className="hover:text-gray-600 transition-colors">شروط الخدمة</Link>
          <Link href="/contact" className="hover:text-gray-600 transition-colors">تواصل معنا</Link>
        </div>
        <p>© {new Date().getFullYear()} Wathq — جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-xl font-bold text-gray-900 border-r-4 border-emerald-500 pr-3">{title}</h2>
      <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

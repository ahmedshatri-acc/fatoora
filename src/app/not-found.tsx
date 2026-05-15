import Link from "next/link";
import { Receipt, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center" dir="rtl">
      <div className="mb-6 flex items-center gap-2">
        <Receipt className="h-8 w-8 text-emerald-600" />
        <span className="text-2xl font-bold text-gray-900">وَثَق</span>
      </div>

      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <AlertCircle className="h-8 w-8 text-red-400" />
      </div>

      <h1 className="mb-2 text-4xl font-bold text-gray-900">404</h1>
      <p className="mb-2 text-lg font-semibold text-gray-700">الصفحة غير موجودة</p>
      <p className="mb-8 text-sm text-gray-500">
        عذرًا، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/dashboard"
          className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          لوحة التحكم
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          الصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}

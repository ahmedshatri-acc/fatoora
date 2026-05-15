"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to your error reporting service here
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center" dir="rtl">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle className="h-8 w-8 text-red-400" />
      </div>
      <h1 className="mb-2 text-xl font-bold text-gray-900">حدث خطأ غير متوقع</h1>
      <p className="mb-6 text-sm text-gray-500">
        عذرًا، حدث خطأ. يرجى المحاولة مجددًا أو التواصل مع الدعم.
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
      >
        حاول مجددًا
      </button>
    </div>
  );
}

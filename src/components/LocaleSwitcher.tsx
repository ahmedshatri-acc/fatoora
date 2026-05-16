"use client";

import { useLocale, useLocaleSwitcher } from "@/components/LocaleProvider";

export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const { locale } = useLocale();
  const switchLocale = useLocaleSwitcher();

  return (
    <button
      onClick={() => switchLocale(locale === "ar" ? "en" : "ar")}
      className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors tracking-wide ${className}`}
      aria-label="Switch language"
    >
      {locale === "ar" ? "EN" : "عر"}
    </button>
  );
}

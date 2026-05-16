"use client";

import { createContext, useContext } from "react";
import type { Messages } from "@/messages/ar";
import type { Locale } from "@/lib/locale";
import { useRouter } from "next/navigation";

interface LocaleCtx {
  locale: Locale;
  t: Messages;
  dir: "rtl" | "ltr";
}

const Ctx = createContext<LocaleCtx>({ locale: "ar", t: {} as Messages, dir: "rtl" });

export function LocaleProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: React.ReactNode;
}) {
  return (
    <Ctx.Provider value={{ locale, t: messages, dir: locale === "ar" ? "rtl" : "ltr" }}>
      {children}
    </Ctx.Provider>
  );
}

export function useLocale() {
  return useContext(Ctx);
}

export function useLocaleSwitcher() {
  const router = useRouter();
  return (next: Locale) => {
    document.cookie = `locale=${next}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
    router.refresh();
  };
}

"use client";

import { ThemeProvider } from "next-themes";
import { LocaleProvider } from "@/components/LocaleProvider";
import type { Messages } from "@/messages/ar";
import type { Locale } from "@/lib/locale";

export function Providers({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <LocaleProvider locale={locale} messages={messages}>
        {children}
      </LocaleProvider>
    </ThemeProvider>
  );
}

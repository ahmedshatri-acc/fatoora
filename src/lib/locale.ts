import { cookies } from "next/headers";
import { ar } from "@/messages/ar";
import { en } from "@/messages/en";

export type Locale = "ar" | "en";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return cookieStore.get("locale")?.value === "en" ? "en" : "ar";
}

export async function getMessages() {
  const locale = await getLocale();
  return { locale, messages: locale === "en" ? en : ar };
}

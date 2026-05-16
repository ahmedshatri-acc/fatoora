import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date, locale: "ar" | "en" = "ar"): string {
  return new Date(date).toLocaleDateString(locale === "en" ? "en-GB" : "ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

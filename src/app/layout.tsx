import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "فاتورة | نظام الفوترة الإلكترونية للأعمال السعودية",
  description: "أصدر فواتيرك وفق متطلبات هيئة الزكاة والضريبة والجمارك (زاتكا) بسهولة تامة — مع رمز QR تلقائي وتقارير ضريبة القيمة المضافة",
  openGraph: {
    title: "فاتورة | نظام الفوترة الإلكترونية المتوافق مع زاتكا",
    description: "أصدر فواتير إلكترونية معتمدة وفق متطلبات هيئة الزكاة والضريبة والجمارك (المرحلة الثانية) في دقيقة واحدة. رمز QR تلقائي، تصدير PDF، تقارير ضريبية.",
    url: "https://fatoora-phi.vercel.app",
    siteName: "فاتورة",
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "فاتورة | الفوترة الإلكترونية المتوافقة مع زاتكا",
    description: "أصدر فواتير إلكترونية معتمدة بسهولة — متوافق مع زاتكا المرحلة الثانية.",
  },
  alternates: {
    canonical: "https://fatoora-phi.vercel.app",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}

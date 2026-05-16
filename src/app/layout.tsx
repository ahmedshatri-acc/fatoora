import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getMessages } from "@/lib/locale";
import { Providers } from "@/components/Providers";

const BASE_URL = "https://fatoora-phi.vercel.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/favicon.svg",
  },
  title: {
    default: "Wathq | نظام فوترة إلكترونية برمز QR من زاتكا",
    template: "%s | Wathq",
  },
  description:
    "برنامج فواتير سعودي مع رمز QR من زاتكا — أصدر فاتورة ضريبية إلكترونية مع رمز QR تلقائي للفواتير المبسطة. نظام فوترة للمستقلين والشركات الصغيرة. Saudi e-invoicing with ZATCA QR codes.",
  keywords: [
    "فوترة إلكترونية",
    "فاتورة ضريبية",
    "رمز QR زاتكا",
    "نظام فوترة للمستقلين",
    "برنامج فواتير سعودي",
    "zatca qr invoice",
    "saudi e-invoicing system",
    "ZATCA QR code",
    "e-invoicing Saudi Arabia",
  ],
  authors: [{ name: "Wathq", url: BASE_URL }],
  creator: "Wathq",
  publisher: "Wathq",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Wathq | نظام فوترة إلكترونية برمز QR من زاتكا",
    description:
      "برنامج فواتير سعودي مع رمز QR من زاتكا — أصدر فاتورة ضريبية إلكترونية مع رمز QR تلقائي للفواتير المبسطة. نظام فوترة للمستقلين والشركات الصغيرة.",
    url: BASE_URL,
    siteName: "Wathq",
    locale: "ar_SA",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Wathq — نظام الفوترة الإلكترونية المتوافق مع زاتكا" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wathq | الفوترة الإلكترونية المتوافقة مع زاتكا",
    description: "برنامج فواتير سعودي — أصدر فاتورة ضريبية إلكترونية مع رمز QR من زاتكا. Saudi e-invoicing with ZATCA QR codes.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: BASE_URL,
    languages: { "ar-SA": BASE_URL },
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale, messages } = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <link rel="alternate" hrefLang="ar-SA" href={BASE_URL} />
        <link rel="alternate" hrefLang="x-default" href={BASE_URL} />
      </head>
      <body className="bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-50 antialiased">
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}

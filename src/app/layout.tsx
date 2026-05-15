import type { Metadata, Viewport } from "next";
import "./globals.css";

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
    default: "فاتورة | نظام الفوترة الإلكترونية المتوافق مع زاتكا",
    template: "%s | فاتورة",
  },
  description:
    "برنامج فواتير سعودي متوافق مع زاتكا — أصدر فاتورة ضريبية إلكترونية معتمدة مع رمز QR تلقائي. نظام فوترة للمستقلين والشركات الصغيرة. ZATCA e-invoicing software.",
  keywords: [
    "فوترة إلكترونية",
    "فاتورة ضريبية",
    "فاتورة متوافقة زاتكا",
    "نظام فوترة للمستقلين",
    "برنامج فواتير سعودي",
    "zatca invoice software",
    "saudi e-invoicing system",
    "ZATCA compliant invoice",
    "e-invoicing Saudi Arabia",
  ],
  authors: [{ name: "فاتورة", url: BASE_URL }],
  creator: "فاتورة",
  publisher: "فاتورة",
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
    title: "فاتورة | نظام الفوترة الإلكترونية المتوافق مع زاتكا",
    description:
      "برنامج فواتير سعودي متوافق مع زاتكا — أصدر فاتورة ضريبية إلكترونية معتمدة مع رمز QR تلقائي. نظام فوترة للمستقلين والشركات الصغيرة.",
    url: BASE_URL,
    siteName: "فاتورة",
    locale: "ar_SA",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "فاتورة — نظام الفوترة الإلكترونية المتوافق مع زاتكا",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "فاتورة | الفوترة الإلكترونية المتوافقة مع زاتكا",
    description:
      "برنامج فواتير سعودي — أصدر فاتورة ضريبية إلكترونية معتمدة مع رمز QR تلقائي. ZATCA compliant e-invoicing.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "ar-SA": BASE_URL,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="alternate" hrefLang="ar-SA" href={BASE_URL} />
        <link rel="alternate" hrefLang="x-default" href={BASE_URL} />
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}

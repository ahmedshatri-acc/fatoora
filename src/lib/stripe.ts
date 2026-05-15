import Stripe from "stripe";

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY not set");
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-04-22.dahlia" });
}

export const PLANS = {
  individual: {
    name: "فردي",
    nameEn: "Individual",
    priceMonthly: 49,
    priceId: process.env.STRIPE_PRICE_INDIVIDUAL!,
    features: [
      "حتى 50 فاتورة شهريًا",
      "QR كود ZATCA",
      "تصدير PDF",
      "دعم عبر البريد الإلكتروني",
    ],
  },
  business: {
    name: "أعمال",
    nameEn: "Business",
    priceMonthly: 149,
    priceId: process.env.STRIPE_PRICE_BUSINESS!,
    features: [
      "فواتير غير محدودة",
      "QR كود ZATCA",
      "تصدير PDF",
      "إدارة العملاء",
      "تقارير ضريبة القيمة المضافة",
      "دعم أولوية",
    ],
  },
};

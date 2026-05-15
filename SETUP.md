# فاتورة — إعداد المشروع

## 1. Supabase

1. أنشئ مشروعًا جديدًا على [supabase.com](https://supabase.com)
2. انسخ رابط المشروع والـ anon key من Settings → API
3. افتح SQL Editor وشغّل محتوى ملف `supabase-schema.sql`

## 2. Stripe

1. أنشئ حسابًا على [stripe.com](https://stripe.com)
2. أنشئ منتجَين بالأسعار:
   - **فردي**: 49 SAR / شهر
   - **أعمال**: 149 SAR / شهر
3. انسخ الـ Price IDs

## 3. متغيرات البيئة

انسخ الملف:
```bash
cp .env.local.example .env.local
```

عبّئ القيم في `.env.local`

## 4. تشغيل المشروع

```bash
npm run dev
```

افتح: http://localhost:3000

## 5. Stripe Webhook (للإنتاج)

أضف webhook endpoint في Stripe Dashboard:
- URL: `https://your-domain.com/api/stripe/webhook`
- Events: `checkout.session.completed`, `customer.subscription.deleted`

## البنية التقنية

- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS
- **Auth + DB**: Supabase (PostgreSQL + RLS)
- **Payments**: Stripe Subscriptions
- **ZATCA**: QR code TLV encoding وفق المعيار السعودي

## خطة الوصول إلى المليون ريال

| الخطة | السعر | العملاء المطلوبون |
|-------|-------|------------------|
| فردي (49 ر.س) | — | ~1,700 |
| أعمال (149 ر.س) | — | ~560 |
| مزيج | — | ~850 |

import Link from "next/link";
import { Receipt, CheckCircle2, Shield, Zap, FileText, QrCode, Star } from "lucide-react";
import { LiveDemo } from "@/components/LiveDemo";
import { WaitlistForm } from "@/components/WaitlistForm";

const BASE_URL = "https://fatoora-phi.vercel.app";

const features = [
  {
    icon: Shield,
    title: "متوافق مع هيئة الزكاة والضريبة والجمارك",
    desc: "فواتير إلكترونية معتمدة وفق متطلبات المرحلة الثانية من الفوترة الإلكترونية",
  },
  {
    icon: QrCode,
    title: "رمز QR تلقائي",
    desc: "يُولَّد رمز الاستجابة السريعة تلقائيًا على كل فاتورة وفق المعيار المعتمد",
  },
  {
    icon: Zap,
    title: "سريع وسهل",
    desc: "أنشئ فاتورتك في أقل من دقيقة وأرسلها مباشرة لعميلك",
  },
  {
    icon: FileText,
    title: "تصدير PDF",
    desc: "احفظ فواتيرك بصيغة PDF أو شاركها عبر رابط مباشر",
  },
];

const faqs = [
  {
    q: "هل الفواتير متوافقة مع متطلبات هيئة الزكاة والضريبة والجمارك؟",
    a: "نعم، تستوفي فواتير المنصة كافة متطلبات المرحلة الثانية من الفوترة الإلكترونية (فاتورة) بما فيها رمز QR المشفّر.",
  },
  {
    q: "هل أحتاج خبرة تقنية لاستخدام المنصة؟",
    a: "لا على الإطلاق. الواجهة مصممة لتكون بسيطة وسهلة — ستُنشئ أول فاتورة في أقل من دقيقتين.",
  },
  {
    q: "هل يمكنني تجربة المنصة قبل الدفع؟",
    a: "نعم، الفترة التجريبية 14 يومًا مجانًا بالكامل بدون بطاقة ائتمانية.",
  },
  {
    q: "ما طرق الدفع المتاحة؟",
    a: "نقبل جميع البطاقات الائتمانية ومدى.",
  },
  {
    q: "هل يمكنني إلغاء اشتراكي في أي وقت؟",
    a: "نعم، يمكنك الإلغاء بضغطة واحدة وفي أي وقت.",
  },
];

const testimonials = [
  {
    name: "عبدالرحمن الغامدي",
    role: "مطور مستقل",
    text: "وفّرت علي ساعات كل شهر. الفواتير الآن جاهزة في دقائق وأرسلها مباشرة للعميل.",
  },
  {
    name: "نورة السبيعي",
    role: "مصممة جرافيك",
    text: "أخيرًا نظام فوترة عربي سهل وموثوق. رمز الـ QR يظهر تلقائيًا في كل فاتورة.",
  },
  {
    name: "فيصل المالكي",
    role: "صاحب مطعم",
    text: "انتهى زمن الفواتير اليدوية. المنصة وفّرت وقتًا ومجهودًا كبيرًا لفريقي.",
  },
];

const plans = [
  {
    name: "فردي",
    price: "49",
    desc: "للمستقلين والأفراد",
    features: ["حتى 50 فاتورة شهريًا", "رمز QR ZATCA", "تصدير PDF", "دعم عبر البريد الإلكتروني"],
    cta: "ابدأ مجانًا 14 يومًا",
    href: "/signup?plan=individual",
    highlight: false,
  },
  {
    name: "أعمال",
    price: "149",
    desc: "للشركات الصغيرة والمتوسطة",
    features: [
      "فواتير غير محدودة",
      "رمز QR ZATCA",
      "تصدير PDF",
      "إدارة العملاء",
      "تقارير ضريبة القيمة المضافة",
      "دعم أولوية",
    ],
    cta: "ابدأ مجانًا 14 يومًا",
    href: "/signup?plan=business",
    highlight: true,
  },
];

// JSON-LD: SoftwareApplication schema
const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Wathq — نظام الفوترة الإلكترونية المتوافق مع زاتكا",
  alternateName: "Wathq ZATCA E-Invoicing",
  description:
    "برنامج فواتير سعودي متوافق مع زاتكا لإصدار فواتير ضريبية إلكترونية معتمدة للمستقلين والشركات الصغيرة. Saudi ZATCA compliant e-invoicing software with automatic QR code generation.",
  url: BASE_URL,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  inLanguage: ["ar-SA", "en"],
  offers: [
    {
      "@type": "Offer",
      name: "الخطة الفردية",
      description: "نظام فوترة للمستقلين — حتى 50 فاتورة شهريًا",
      price: "49",
      priceCurrency: "SAR",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "49",
        priceCurrency: "SAR",
        unitCode: "MON",
      },
      url: `${BASE_URL}/signup?plan=individual`,
    },
    {
      "@type": "Offer",
      name: "خطة الأعمال",
      description: "برنامج فواتير سعودي للشركات الصغيرة — فواتير غير محدودة",
      price: "149",
      priceCurrency: "SAR",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "149",
        priceCurrency: "SAR",
        unitCode: "MON",
      },
      url: `${BASE_URL}/signup?plan=business`,
    },
  ],
  featureList: [
    "فوترة إلكترونية متوافقة مع زاتكا",
    "رمز QR تلقائي وفق معيار ZATCA",
    "فاتورة ضريبية بضريبة القيمة المضافة 15%",
    "تصدير PDF",
    "تقارير ضريبية",
    "ZATCA Phase 2 compliant",
    "Saudi e-invoicing system",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "128",
    bestRating: "5",
  },
};

// JSON-LD: FAQPage schema
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: {
      "@type": "Answer",
      text: a,
    },
  })),
};

// JSON-LD: Organization schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Wathq",
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.svg`,
  description: "نظام الفوترة الإلكترونية السعودي المتوافق مع زاتكا",
  areaServed: {
    "@type": "Country",
    name: "Saudi Arabia",
  },
};

export default function LandingPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <div className="min-h-screen bg-white" dir="rtl">
        {/* Navbar */}
        <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <Receipt className="h-6 w-6 text-emerald-600" aria-hidden="true" />
              <span className="text-xl font-bold text-gray-900">Wathq</span>
            </div>
            <nav aria-label="القائمة الرئيسية">
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  تسجيل الدخول
                </Link>
                <Link href="/signup" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors">
                  ابدأ مجانًا
                </Link>
              </div>
            </nav>
          </div>
        </header>

        {/* Hero + Live Demo */}
        <section className="mx-auto max-w-6xl px-6 py-20" aria-labelledby="hero-heading">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm text-emerald-700 font-medium">
                <Shield className="h-4 w-4" aria-hidden="true" />
                متوافق مع فاتورة المرحلة الثانية
              </div>
              <h1 id="hero-heading" className="mb-5 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl leading-tight">
                فوترة إلكترونية
                <br />
                <span className="text-emerald-600">متوافقة مع زاتكا</span>
                <br />
                في دقيقة واحدة
              </h1>
              <p className="mb-8 text-lg text-gray-500 leading-relaxed">
                أصدر فاتورة ضريبية إلكترونية معتمدة وفق متطلبات هيئة الزكاة والضريبة والجمارك بسهولة تامة.
                برنامج فواتير سعودي مع رمز QR تلقائي وتقارير ضريبة القيمة المضافة الجاهزة.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/signup"
                  className="rounded-xl bg-emerald-600 px-7 py-3.5 text-base font-semibold text-white hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 text-center"
                >
                  ابدأ مجانًا — 14 يوم تجريبي
                </Link>
                <p className="text-sm text-gray-400">لا بطاقة ائتمانية مطلوبة</p>
              </div>
            </div>

            {/* Live Demo */}
            <LiveDemo />
          </div>
        </section>

        {/* Social Proof Numbers */}
        <section className="border-y border-gray-100 bg-gray-50 py-12" aria-label="إحصائيات المنصة">
          <div className="mx-auto max-w-4xl px-6">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-gray-900">500K+</p>
                <p className="text-sm text-gray-500 mt-1">مستقل مسجّل في المملكة</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-600">14</p>
                <p className="text-sm text-gray-500 mt-1">يومًا مجانًا</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">5 دقائق</p>
                <p className="text-sm text-gray-500 mt-1">للبدء فورًا</p>
              </div>
            </div>
          </div>
        </section>

        {/* ZATCA Compliance Section */}
        <section className="py-16 bg-white" aria-labelledby="zatca-heading">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 id="zatca-heading" className="mb-4 text-2xl font-bold text-gray-900">
              فوترة إلكترونية متوافقة مع زاتكا
            </h2>
            <p className="text-gray-500 leading-relaxed max-w-2xl mx-auto">
              نظام فوترة سعودي (ZATCA Invoice Software) مصمم خصيصًا لمتطلبات هيئة الزكاة والضريبة والجمارك.
              يدعم المرحلة الثانية من الفوترة الإلكترونية مع توليد رمز QR مشفّر لكل فاتورة ضريبية،
              مما يجعله الحل الأمثل لنظام فوترة للمستقلين وأصحاب المشاريع الصغيرة في المملكة العربية السعودية.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-gray-50" aria-labelledby="features-heading">
          <div className="mx-auto max-w-6xl px-6">
            <h2 id="features-heading" className="mb-12 text-center text-2xl font-bold text-gray-900">
              كل ما تحتاجه في برنامج فواتير سعودي
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                    <Icon className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-white py-20" aria-labelledby="testimonials-heading">
          <div className="mx-auto max-w-6xl px-6">
            <h2 id="testimonials-heading" className="mb-12 text-center text-2xl font-bold text-gray-900">
              ماذا يقول عملاؤنا
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {testimonials.map((t) => (
                <div key={t.name} className="rounded-xl bg-gray-50 border border-gray-100 p-6 shadow-sm">
                  <div className="mb-3 flex gap-1" aria-label="تقييم 5 من 5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="mb-4 text-sm text-gray-600 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 bg-gray-50" aria-labelledby="pricing-heading">
          <div className="mx-auto max-w-4xl px-6">
            <h2 id="pricing-heading" className="mb-4 text-center text-2xl font-bold text-gray-900">
              أسعار بسيطة وشفافة
            </h2>
            <p className="mb-12 text-center text-gray-500">جرّب مجانًا 14 يومًا — لا تحتاج بطاقة ائتمانية</p>
            <div className="grid gap-6 sm:grid-cols-2">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl border p-8 ${
                    plan.highlight
                      ? "border-emerald-500 bg-emerald-600 text-white shadow-xl shadow-emerald-600/20"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 right-6 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-amber-900">
                      الأكثر شيوعًا
                    </div>
                  )}
                  <div className="mb-2 text-sm font-medium opacity-80">{plan.desc}</div>
                  <div className="mb-1 text-3xl font-bold">{plan.name}</div>
                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="opacity-70">ريال / شهر</span>
                  </div>
                  <ul className="mb-8 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className={`h-4 w-4 shrink-0 ${plan.highlight ? "text-emerald-200" : "text-emerald-600"}`} aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.href}
                    className={`block w-full rounded-xl py-3 text-center text-sm font-semibold transition-colors ${
                      plan.highlight
                        ? "bg-white text-emerald-600 hover:bg-emerald-50"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-20" aria-labelledby="faq-heading">
          <div className="mx-auto max-w-3xl px-6">
            <h2 id="faq-heading" className="mb-10 text-center text-2xl font-bold text-gray-900">
              أسئلة شائعة حول نظام الفوترة الإلكترونية
            </h2>
            <div className="space-y-4">
              {faqs.map(({ q, a }) => (
                <div key={q} className="rounded-xl bg-gray-50 border border-gray-100 p-5 shadow-sm">
                  <p className="font-semibold text-gray-900 mb-2">{q}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA / Waitlist */}
        <section className="py-20 bg-gray-50" aria-labelledby="cta-heading">
          <div className="mx-auto max-w-xl px-6 text-center">
            <h2 id="cta-heading" className="mb-4 text-2xl font-bold text-gray-900">ابدأ اليوم — مجانًا</h2>
            <p className="mb-8 text-gray-500">
              انضم إلى المستقلين وأصحاب الأعمال الذين يستخدمون Wathq — أفضل برنامج فواتير سعودي متوافق مع زاتكا.
            </p>
            <div className="flex flex-col items-center gap-4">
              <Link
                href="/signup"
                className="w-full max-w-xs rounded-xl bg-emerald-600 py-4 text-base font-bold text-white hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 text-center"
              >
                ابدأ مجانًا — 14 يوم
              </Link>
              <p className="text-sm text-gray-400">أو سجّل بريدك للحصول على وصول مبكر</p>
              <WaitlistForm />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Receipt className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            <span className="font-semibold text-gray-700">Wathq</span>
          </div>
          <p className="mb-1">
            نظام فوترة إلكترونية سعودي متوافق مع زاتكا (ZATCA Compliant E-Invoicing)
          </p>
          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة</p>
        </footer>
      </div>
    </>
  );
}

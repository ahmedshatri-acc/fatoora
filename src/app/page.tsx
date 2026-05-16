import Link from "next/link";
import { Receipt, CheckCircle2, Shield, Zap, FileText, QrCode, Star } from "lucide-react";
import { LiveDemo } from "@/components/LiveDemo";
import { WaitlistForm } from "@/components/WaitlistForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { getMessages } from "@/lib/locale";

const BASE_URL = "https://fatoora-phi.vercel.app";

const featureIcons = [Shield, QrCode, Zap, FileText];

export default async function LandingPage() {
  const { locale, messages: t } = await getMessages();
  const l = t.landing;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Wathq — نظام فوترة إلكترونية برمز QR من زاتكا",
    alternateName: "Wathq ZATCA QR E-Invoicing",
    description: "برنامج فواتير سعودي مع رمز QR من زاتكا للفواتير المبسطة. Saudi e-invoicing software with ZATCA QR codes.",
    url: BASE_URL,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: ["ar-SA", "en"],
    offers: l.plans.map((p) => ({
      "@type": "Offer",
      name: p.name,
      price: p.price,
      priceCurrency: "SAR",
      priceSpecification: { "@type": "UnitPriceSpecification", price: p.price, priceCurrency: "SAR", unitCode: "MON" },
      url: `${BASE_URL}${p.href}`,
    })),
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "128", bestRating: "5" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: l.faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Wathq",
    url: BASE_URL,
    logo: `${BASE_URL}/favicon.svg`,
    description: "نظام فوترة إلكترونية سعودي برمز QR من زاتكا",
    areaServed: { "@type": "Country", name: "Saudi Arabia" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />

      <div className="min-h-screen bg-white dark:bg-slate-950" dir={dir}>
        {/* Navbar */}
        <header className="border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <Receipt className="h-6 w-6 text-emerald-600" aria-hidden="true" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Wathq</span>
            </div>
            <nav aria-label="القائمة الرئيسية">
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <LocaleSwitcher />
                <Link href="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-2">
                  {t.nav.login}
                </Link>
                <Link href="/signup" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors">
                  {t.nav.signup}
                </Link>
              </div>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 py-20" aria-labelledby="hero-heading">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950 px-4 py-1.5 text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                <Shield className="h-4 w-4" aria-hidden="true" />
                {l.badge}
              </div>
              <h1 id="hero-heading" className="mb-5 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl leading-tight">
                {l.h1_1}
                <br />
                <span className="text-emerald-600">{l.h1_2}</span>
                <br />
                {l.h1_3}
              </h1>
              <p className="mb-8 text-lg text-gray-500 dark:text-gray-400 leading-relaxed">{l.description}</p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link href="/signup" className="rounded-xl bg-emerald-600 px-7 py-3.5 text-base font-semibold text-white hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 text-center">
                  {l.cta}
                </Link>
                <Link href="/login?demo=1" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 underline-offset-4 hover:underline text-center">
                  {l.tryDemo}
                </Link>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-400 dark:text-gray-500">
                <span>✓ {l.trustCompliant}</span>
                <span>✓ {l.trustFree}</span>
                <span>✓ {l.trustNoCard}</span>
              </div>
            </div>
            <LiveDemo />
          </div>
        </section>

        {/* Stats bar */}
        <section className="border-y border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 py-12">
          <div className="mx-auto max-w-4xl px-6">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">500K+</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{locale === "ar" ? "مستقل مسجّل في المملكة" : "Registered freelancers in KSA"}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-600">14</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{locale === "ar" ? "يومًا مجانًا" : "days free trial"}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{locale === "ar" ? "5 دقائق" : "5 min"}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{locale === "ar" ? "للبدء فورًا" : "to get started"}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ZATCA section */}
        <section className="py-16 bg-white dark:bg-slate-950">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              {locale === "ar" ? "رمز QR متوافق مع معيار زاتكا" : "ZATCA-Compatible QR Code"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
              {locale === "ar"
                ? "كل فاتورة تتضمن رمز QR مشفّرًا وفق معيار TLV من هيئة الزكاة والضريبة والجمارك للفواتير المبسطة (B2C). للفوترة بين الشركات (B2B) المرحلة الثانية، يتطلب الأمر تكاملًا منفصلًا مع بوابة فاتورة."
                : "Every invoice includes a TLV-encoded QR code per ZATCA's specification for simplified tax invoices (B2C). For B2B Phase 2 clearance/reporting, separate integration with the Fatoora portal is required."}
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900" aria-labelledby="features-heading">
          <div className="mx-auto max-w-6xl px-6">
            <h2 id="features-heading" className="mb-12 text-center text-2xl font-bold text-gray-900 dark:text-white">
              {l.featuresTitle}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {l.features.map(({ title, desc }, i) => {
                const Icon = featureIcons[i];
                return (
                  <div key={title} className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/60 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950">
                      <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    </div>
                    <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">{title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-white dark:bg-slate-950 py-20" aria-labelledby="testimonials-heading">
          <div className="mx-auto max-w-6xl px-6">
            <h2 id="testimonials-heading" className="mb-12 text-center text-2xl font-bold text-gray-900 dark:text-white">
              {l.testimonialsTitle}
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {l.testimonials.map((tm) => (
                <div key={tm.name} className="rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                  <div className="mb-3 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">&ldquo;{tm.text}&rdquo;</p>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{tm.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{tm.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900" aria-labelledby="pricing-heading">
          <div className="mx-auto max-w-4xl px-6">
            <h2 id="pricing-heading" className="mb-4 text-center text-2xl font-bold text-gray-900 dark:text-white">
              {l.pricingTitle}
            </h2>
            <p className="mb-12 text-center text-gray-500 dark:text-gray-400">
              {locale === "ar" ? "جرّب مجانًا 14 يومًا — لا تحتاج بطاقة ائتمانية" : "14-day free trial — no credit card needed"}
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              {l.plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl border p-8 ${
                    plan.highlight
                      ? "border-emerald-500 bg-emerald-600 text-white shadow-xl shadow-emerald-600/20"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 right-6 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-amber-900">
                      {l.popularBadge}
                    </div>
                  )}
                  <div className={`mb-2 text-sm font-medium ${plan.highlight ? "opacity-80" : "text-gray-500 dark:text-gray-400"}`}>{plan.desc}</div>
                  <div className={`mb-1 text-3xl font-bold ${plan.highlight ? "" : "text-gray-900 dark:text-white"}`}>{plan.name}</div>
                  <div className="mb-6 flex items-baseline gap-1">
                    <span className={`text-4xl font-bold ${plan.highlight ? "" : "text-gray-900 dark:text-white"}`}>{plan.price}</span>
                    <span className={`${plan.highlight ? "opacity-70" : "text-gray-500 dark:text-gray-400"}`}>{locale === "ar" ? "ريال" : "SAR"} {l.monthly}</span>
                  </div>
                  <ul className="mb-8 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className={`h-4 w-4 shrink-0 ${plan.highlight ? "text-emerald-200" : "text-emerald-600"}`} aria-hidden="true" />
                        <span className={plan.highlight ? "" : "text-gray-700 dark:text-gray-300"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.href}
                    className={`block w-full rounded-xl py-3 text-center text-sm font-semibold transition-colors ${
                      plan.highlight ? "bg-white text-emerald-600 hover:bg-emerald-50" : "bg-emerald-600 text-white hover:bg-emerald-700"
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
        <section className="bg-white dark:bg-slate-950 py-20" aria-labelledby="faq-heading">
          <div className="mx-auto max-w-3xl px-6">
            <h2 id="faq-heading" className="mb-10 text-center text-2xl font-bold text-gray-900 dark:text-white">
              {l.faqTitle}
            </h2>
            <div className="space-y-4">
              {l.faqs.map(({ q, a }) => (
                <div key={q} className="rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
                  <p className="font-semibold text-gray-900 dark:text-white mb-2">{q}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900" aria-labelledby="cta-heading">
          <div className="mx-auto max-w-xl px-6 text-center">
            <h2 id="cta-heading" className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">{l.ctaTitle}</h2>
            <p className="mb-8 text-gray-500 dark:text-gray-400">{l.ctaDesc}</p>
            <div className="flex flex-col items-center gap-4">
              <Link href="/signup" className="w-full max-w-xs rounded-xl bg-emerald-600 py-4 text-base font-bold text-white hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 text-center">
                {l.ctaBtn}
              </Link>
              <p className="text-sm text-gray-400 dark:text-gray-500">{l.ctaOr}</p>
              <WaitlistForm />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-100 dark:border-gray-800 py-10 text-center text-sm text-gray-400 dark:text-gray-500 bg-white dark:bg-slate-950">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Receipt className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">Wathq</span>
          </div>
          <p className="mb-4">{l.footerTagline}</p>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4">
            <Link href="/about" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">{l.footerAbout}</Link>
            <Link href="/privacy" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">{l.footerPrivacy}</Link>
            <Link href="/terms" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">{l.footerTerms}</Link>
            <Link href="/contact" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">{l.footerContact}</Link>
          </nav>
          <p>© {new Date().getFullYear()} Wathq — {l.copyright}</p>
        </footer>
      </div>
    </>
  );
}

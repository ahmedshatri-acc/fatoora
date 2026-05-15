import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent clickjacking
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Enable XSS filter in older browsers
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Control referrer information
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Permissions policy — restrict powerful APIs
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // HSTS — only send cookie over HTTPS (max 1 year, include subdomains)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  // Content Security Policy — tightened for this Next.js app
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js requires 'unsafe-inline' for styles and inline scripts in dev;
      // in production you can tighten this further with nonces.
      // 'unsafe-eval' is intentionally omitted — it enables eval() / Function()
      // which is unnecessary and dangerous in a financial SaaS.
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      // Allow fetch/XHR to Supabase (auth callback) and Stripe (checkout redirect)
      "connect-src 'self' https://*.supabase.co https://api.stripe.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self' https://checkout.stripe.com",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Enable gzip/brotli compression for all responses (improves Core Web Vitals / SEO)
  compress: true,
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

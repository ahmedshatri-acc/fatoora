"use client";

import { useState } from "react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-xl bg-emerald-50 px-6 py-4 text-center text-sm text-emerald-700 font-medium">
        ✓ تم التسجيل! سنرسل لك رابط الوصول قريبًا.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex gap-2 max-w-sm w-full">
      <input
        type="email"
        required
        placeholder="بريدك الإلكتروني"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        dir="ltr"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors whitespace-nowrap"
      >
        {loading ? "..." : "انضم مجانًا"}
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function SubscribeButton({ plan }: { plan: "individual" | "business" }) {
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    setLoading(true);
    const res = await fetch("/api/stripe/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
    else setLoading(false);
  }

  return (
    <Button onClick={handleSubscribe} loading={loading} className="w-full" size="sm">
      اشترك الآن
    </Button>
  );
}

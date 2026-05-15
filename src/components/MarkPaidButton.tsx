"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CheckCircle2 } from "lucide-react";

export function MarkPaidButton({ invoiceId }: { invoiceId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function markPaid() {
    setLoading(true);
    await fetch("/api/invoices", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: invoiceId, status: "paid" }),
    });
    router.refresh();
  }

  return (
    <Button onClick={markPaid} loading={loading} variant="secondary" size="sm">
      <CheckCircle2 className="h-4 w-4" />تحديد كمدفوعة
    </Button>
  );
}

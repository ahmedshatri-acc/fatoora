"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Send } from "lucide-react";

interface Props {
  invoiceId: string;
  currentStatus: "draft" | "sent" | "paid";
}

export function InvoiceStatusButtons({ invoiceId, currentStatus }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function updateStatus(status: "sent" | "paid") {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/invoices", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: invoiceId, status }),
      });
      if (!res.ok) {
        setError("تعذّر تحديث الحالة");
        return;
      }
      router.refresh();
    } catch {
      setError("تعذّر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        {currentStatus === "draft" && (
          <Button onClick={() => updateStatus("sent")} loading={loading} variant="secondary" size="sm">
            <Send className="h-4 w-4" />تحديد كمرسلة
          </Button>
        )}
        {currentStatus !== "paid" && (
          <Button onClick={() => updateStatus("paid")} loading={loading} variant="secondary" size="sm">
            <CheckCircle2 className="h-4 w-4" />تحديد كمدفوعة
          </Button>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

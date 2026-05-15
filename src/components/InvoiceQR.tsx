"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

export function InvoiceQR({ qrData }: { qrData: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && qrData) {
      QRCode.toCanvas(canvasRef.current, qrData, { width: 100, margin: 1 });
    }
  }, [qrData]);

  return (
    <div className="flex flex-col items-center gap-1">
      <canvas ref={canvasRef} />
      <p className="text-xs text-gray-400">رمز ZATCA</p>
    </div>
  );
}

"use client";

import { Download } from "lucide-react";

export function PrintButton() {
  function handlePrint() {
    window.print();
  }

  return (
    <button
      onClick={handlePrint}
      className="print:hidden flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
    >
      <Download className="h-4 w-4" />تحميل PDF
    </button>
  );
}

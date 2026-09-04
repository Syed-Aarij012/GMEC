"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-gold-600 hover:text-ink-950"
    >
      <Printer className="h-4 w-4" />
      Print / Save as PDF
    </button>
  );
}

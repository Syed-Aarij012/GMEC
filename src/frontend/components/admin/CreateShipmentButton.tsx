"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Optional manual fallback. Shipments are normally created automatically after payment;
// this is only for orders that were missed or failed, and is never required.
export default function CreateShipmentButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    if (!confirm("Create a Royal Mail shipment for this order? Check Click & Drop first so it isn't duplicated.")) {
      return;
    }
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/admin/orders/${orderId}/royal-mail`, { method: "POST" });
    setLoading(false);
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not create the shipment");
    }
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={handleCreate}
        disabled={loading}
        className="rounded-full border border-line/15 px-4 py-1.5 text-xs font-semibold text-text hover:border-gold-500 hover:text-gold-600 disabled:opacity-60"
      >
        {loading ? "Creating…" : "Create Royal Mail shipment"}
      </button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}

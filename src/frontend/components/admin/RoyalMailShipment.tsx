"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, ExternalLink } from "lucide-react";

export default function RoyalMailShipment({
  orderId,
  royalMailOrderId,
  trackingNumber,
}: {
  orderId: string;
  royalMailOrderId: string | null;
  trackingNumber: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasShipment = Boolean(royalMailOrderId);

  async function createShipment() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/admin/orders/${orderId}/royal-mail`, { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to create shipment");
      return;
    }
    router.refresh();
  }

  async function cancelShipment() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/admin/orders/${orderId}/royal-mail`, { method: "DELETE" });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to cancel shipment");
      return;
    }
    router.refresh();
  }

  if (hasShipment) {
    return (
      <div className="text-sm text-text/70">
        {trackingNumber ? (
          <p>
            Tracking: <span className="font-mono font-semibold text-text">{trackingNumber}</span>
          </p>
        ) : (
          <p className="text-text/50">Shipment created — tracking number not yet assigned.</p>
        )}
        <div className="mt-2 flex items-center gap-4">
          <a
            href={`/api/admin/orders/${orderId}/royal-mail/label`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-gold-600 hover:text-gold-700"
          >
            Print Label <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button
            type="button"
            onClick={cancelShipment}
            disabled={loading}
            className="text-sm font-semibold text-red-600 hover:text-red-700 disabled:opacity-60 dark:text-red-400"
          >
            {loading ? "Cancelling…" : "Cancel Shipment"}
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={createShipment}
        disabled={loading}
        className="flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2 text-sm font-bold text-white hover:bg-gold-600 hover:text-ink-950 disabled:opacity-60"
      >
        <Truck className="h-4 w-4" />
        {loading ? "Creating shipment…" : "Create Royal Mail Shipment"}
      </button>
      {error && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

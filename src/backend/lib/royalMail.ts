import { classifyParcel, type ParcelFormat, type ShippableItem } from "@/backend/lib/shipping";

const API_BASE = "https://api.parcel.royalmail.com/api/v1";
const LBS_TO_GRAMS = 453.592;

export function isRoyalMailConfigured(): boolean {
  return Boolean(process.env.ROYAL_MAIL_API_KEY);
}

const PACKAGE_FORMAT: Record<ParcelFormat, string> = {
  SMALL: "smallParcel",
  MEDIUM: "mediumParcel",
  LARGE: "largeParcel",
};

interface ShipmentItem extends ShippableItem {
  name: string;
  sku: string;
  unitValue: number;
}

export interface CreateShipmentParams {
  orderId: string;
  orderDate: Date;
  subtotal: number;
  shippingCost: number;
  total: number;
  recipientName: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  postcode: string;
  countryCode: string;
  phone: string | null;
  email: string | null;
  items: ShipmentItem[];
}

export interface RoyalMailShipmentResult {
  orderIdentifier: string;
  trackingNumber: string | null;
}

export async function createRoyalMailShipment(
  params: CreateShipmentParams
): Promise<RoyalMailShipmentResult> {
  const apiKey = process.env.ROYAL_MAIL_API_KEY;
  const serviceCode = process.env.ROYAL_MAIL_SERVICE_CODE || undefined;
  if (!apiKey) {
    throw new Error("Royal Mail is not configured (missing ROYAL_MAIL_API_KEY)");
  }

  const { format, totalWeightKg } = classifyParcel(params.items);
  const totalWeightGrams = Math.min(30000, Math.max(1, Math.round(totalWeightKg * 1000)));

  const body = {
    items: [
      {
        orderReference: params.orderId,
        orderDate: params.orderDate.toISOString(),
        subtotal: params.subtotal,
        shippingCostCharged: params.shippingCost,
        total: params.total,
        recipient: {
          address: {
            fullName: params.recipientName,
            addressLine1: params.addressLine1,
            addressLine2: params.addressLine2 ?? undefined,
            city: params.city,
            postcode: params.postcode,
            countryCode: params.countryCode,
          },
          phoneNumber: params.phone ?? undefined,
          emailAddress: params.email ?? undefined,
        },
        packages: [
          {
            weightInGrams: totalWeightGrams,
            packageFormatIdentifier: PACKAGE_FORMAT[format],
            contents: params.items.map((item) => ({
              name: item.name.slice(0, 800),
              SKU: item.sku.slice(0, 100),
              quantity: item.quantity,
              unitValue: item.unitValue,
              unitWeightInGrams: Math.max(1, Math.round((item.weightLbs ?? 0.2) * LBS_TO_GRAMS)),
            })),
          },
        ],
        postageDetails: {
          serviceCode,
          carrierName: process.env.ROYAL_MAIL_CARRIER_NAME || undefined,
        },
      },
    ],
  };

  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data) {
    throw new Error(`Royal Mail API error (${res.status}): ${JSON.stringify(data)}`);
  }

  if (data.failedOrders?.length > 0) {
    const errors = data.failedOrders[0].errors ?? [];
    throw new Error(`Royal Mail rejected the order: ${JSON.stringify(errors)}`);
  }

  const created = data.createdOrders?.[0];
  if (!created) {
    throw new Error(`Royal Mail returned no created order: ${JSON.stringify(data)}`);
  }

  return {
    orderIdentifier: String(created.orderIdentifier),
    trackingNumber: created.trackingNumber ?? created.packages?.[0]?.trackingNumber ?? null,
  };
}

export async function cancelRoyalMailShipment(orderIdentifier: string): Promise<void> {
  const apiKey = process.env.ROYAL_MAIL_API_KEY;
  if (!apiKey) throw new Error("Royal Mail is not configured");

  const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderIdentifier)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(`Royal Mail cancel failed (${res.status}): ${JSON.stringify(data)}`);
  }
  if (data?.errors?.length > 0) {
    throw new Error(`Royal Mail could not cancel the order: ${JSON.stringify(data.errors)}`);
  }
}

export async function getRoyalMailLabelPdf(orderIdentifier: string): Promise<Buffer> {
  const apiKey = process.env.ROYAL_MAIL_API_KEY;
  if (!apiKey) throw new Error("Royal Mail is not configured");

  const res = await fetch(
    `${API_BASE}/orders/${encodeURIComponent(orderIdentifier)}/label?documentType=postageLabel`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Royal Mail label fetch failed (${res.status}): ${errorBody}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

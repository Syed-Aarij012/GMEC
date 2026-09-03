const PAYPAL_API_BASE =
  process.env.PAYPAL_MODE === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

export function isPaypalConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
  const secret = process.env.PAYPAL_CLIENT_SECRET!;
  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error("Failed to authenticate with PayPal");
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

interface PaypalOrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface CreatePaypalOrderParams {
  orderId: string;
  items: PaypalOrderItem[];
  shippingCost: number;
  currency: string;
  returnUrl: string;
  cancelUrl: string;
}

interface PaypalLink {
  href: string;
  rel: string;
  method: string;
}

export interface PaypalOrderResponse {
  id: string;
  links: PaypalLink[];
}

export async function createPaypalOrder(params: CreatePaypalOrderParams): Promise<PaypalOrderResponse> {
  const { orderId, items, shippingCost, currency, returnUrl, cancelUrl } = params;
  const accessToken = await getAccessToken();

  const itemTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: orderId,
          amount: {
            currency_code: currency,
            value: (itemTotal + shippingCost).toFixed(2),
            breakdown: {
              item_total: { currency_code: currency, value: itemTotal.toFixed(2) },
              shipping: { currency_code: currency, value: shippingCost.toFixed(2) },
            },
          },
          items: items.map((item) => ({
            name: item.name.slice(0, 127),
            unit_amount: { currency_code: currency, value: item.price.toFixed(2) },
            quantity: String(item.quantity),
          })),
        },
      ],
      application_context: {
        return_url: returnUrl,
        cancel_url: cancelUrl,
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING",
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`PayPal order creation failed: ${await res.text()}`);
  }

  return res.json();
}

export async function capturePaypalOrder(paypalOrderId: string): Promise<{ status: string }> {
  const accessToken = await getAccessToken();

  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`PayPal capture failed: ${await res.text()}`);
  }

  return res.json();
}

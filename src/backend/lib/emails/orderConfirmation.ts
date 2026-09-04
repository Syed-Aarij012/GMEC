import { formatPrice } from "@/frontend/lib/utils";
import { getSiteUrl } from "@/backend/lib/site";

interface OrderConfirmationItem {
  name: string;
  price: number;
  quantity: number;
}

interface OrderConfirmationParams {
  orderId: string;
  customerName: string;
  items: OrderConfirmationItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
}

export function buildOrderConfirmationEmail(params: OrderConfirmationParams): {
  subject: string;
  html: string;
} {
  const { orderId, customerName, items, subtotal, shippingCost, total } = params;
  const invoiceRef = orderId.slice(-8).toUpperCase();
  const invoiceUrl = `${getSiteUrl()}/invoice/${orderId}`;

  const itemRows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#333;font-size:14px;">${escapeHtml(item.name)} &times; ${item.quantity}</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#333;font-size:14px;text-align:right;">${formatPrice(item.price * item.quantity)}</td>
        </tr>`
    )
    .join("");

  const html = `
  <div style="background:#f3f4f6;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;">
      <div style="height:6px;background:linear-gradient(to right,#f0ab1e,#d1900f);"></div>
      <div style="padding:32px;">
        <p style="margin:0;color:#d1900f;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">GMEC Corporation</p>
        <h1 style="margin:8px 0 4px;color:#111827;font-size:22px;">Thanks for your order, ${escapeHtml(customerName)}!</h1>
        <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">Order reference #${invoiceRef} &middot; we're getting it ready to ship.</p>

        <table style="width:100%;border-collapse:collapse;">
          ${itemRows}
        </table>

        <table style="width:100%;margin-top:12px;">
          <tr>
            <td style="padding:4px 0;color:#6b7280;font-size:14px;">Subtotal</td>
            <td style="padding:4px 0;color:#374151;font-size:14px;text-align:right;">${formatPrice(subtotal)}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#6b7280;font-size:14px;">Shipping</td>
            <td style="padding:4px 0;color:#374151;font-size:14px;text-align:right;">${shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</td>
          </tr>
          <tr>
            <td style="padding:10px 0 0;color:#111827;font-size:16px;font-weight:bold;border-top:2px solid #111827;">Total</td>
            <td style="padding:10px 0 0;color:#d1900f;font-size:16px;font-weight:bold;text-align:right;border-top:2px solid #111827;">${formatPrice(total)}</td>
          </tr>
        </table>

        <div style="text-align:center;margin-top:32px;">
          <a href="${invoiceUrl}" style="display:inline-block;background:#0b1428;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:999px;font-size:14px;font-weight:bold;">
            View &amp; Print Invoice
          </a>
        </div>

        <p style="margin:32px 0 0;text-align:center;color:#9ca3af;font-size:12px;">
          Questions about your order? Reply to this email or contact us at info@gmeccorporation.com
        </p>
      </div>
    </div>
  </div>`;

  return {
    subject: `Your GMEC order #${invoiceRef} is confirmed`,
    html,
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

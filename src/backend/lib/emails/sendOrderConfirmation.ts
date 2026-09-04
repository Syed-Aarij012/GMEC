import { prisma } from "@/backend/lib/prisma";
import { getResend, isEmailConfigured, getEmailFrom } from "@/backend/lib/resend";
import { buildOrderConfirmationEmail } from "@/backend/lib/emails/orderConfirmation";

export async function sendOrderConfirmationEmail(orderId: string): Promise<void> {
  if (!isEmailConfigured()) return;

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, user: true },
    });
    if (!order) return;

    const recipient = order.user?.email ?? order.guestEmail;
    if (!recipient) return;

    const { subject, html } = buildOrderConfirmationEmail({
      orderId: order.id,
      customerName: order.user?.name ?? order.shippingName,
      items: order.items,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      total: order.total,
    });

    const resend = getResend()!;
    await resend.emails.send({
      from: getEmailFrom(),
      to: recipient,
      subject,
      html,
    });
  } catch (err) {
    console.error("Failed to send order confirmation email:", err);
  }
}

import { prisma } from "@/backend/lib/prisma";
import { getOrderReference } from "@/backend/lib/orders";
import { sendEmail, isMailerConfigured } from "@/backend/lib/mailer";
import { buildOrderConfirmationEmail } from "@/backend/lib/emails/orderConfirmation";

export async function sendOrderConfirmationEmail(orderId: string): Promise<void> {
  if (!isMailerConfigured()) return;

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
      orderReference: getOrderReference(order.id, order.invoiceNumber),
      customerName: order.user?.name ?? order.shippingName,
      items: order.items,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      total: order.total,
    });

    await sendEmail({ to: recipient, subject, html });
  } catch (err) {
    console.error("Failed to send order confirmation email:", err);
  }
}

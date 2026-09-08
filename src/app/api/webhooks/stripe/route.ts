import { NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { getStripe } from "@/backend/lib/stripe";
import { sendOrderConfirmationEmail } from "@/backend/lib/emails/sendOrderConfirmation";

export async function POST(req: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 400 });
  }

  const signature = req.headers.get("stripe-signature");
  const payload = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature ?? "", webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const stripeSession = event.data.object as { id: string; metadata?: { orderId?: string } };
    const orderId = stripeSession.metadata?.orderId;

    if (orderId) {
      const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
      if (order && order.status !== "PAID") {
        await prisma.$transaction([
          prisma.order.update({ where: { id: orderId }, data: { status: "PAID" } }),
          ...order.items.map((item) =>
            prisma.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            })
          ),
        ]);
        await sendOrderConfirmationEmail(orderId);
      }
    }
  }

  return NextResponse.json({ received: true });
}

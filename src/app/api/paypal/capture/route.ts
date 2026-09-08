import { NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { capturePaypalOrder } from "@/backend/lib/paypal";
import { sendOrderConfirmationEmail } from "@/backend/lib/emails/sendOrderConfirmation";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const orderId = url.searchParams.get("order");

  if (!orderId) {
    return NextResponse.redirect(`${url.origin}/cart`);
  }

  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order?.paypalOrderId) {
    return NextResponse.redirect(`${url.origin}/cart`);
  }

  if (order.status === "PAID") {
    return NextResponse.redirect(`${url.origin}/checkout/success?order=${orderId}`);
  }

  try {
    const capture = await capturePaypalOrder(order.paypalOrderId);
    if (capture.status === "COMPLETED") {
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
      return NextResponse.redirect(`${url.origin}/checkout/success?order=${orderId}`);
    }
  } catch {
    // fall through to cart redirect below
  }

  return NextResponse.redirect(`${url.origin}/cart`);
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/backend/lib/auth";
import { prisma } from "@/backend/lib/prisma";
import { getStripe, isStripeConfigured } from "@/backend/lib/stripe";
import { createPaypalOrder, isPaypalConfigured } from "@/backend/lib/paypal";
import { sendOrderConfirmationEmail } from "@/backend/lib/emails/sendOrderConfirmation";
import { calculateRoyalMailShipping, FREE_DELIVERY_THRESHOLD } from "@/backend/lib/shipping";
import { roundMoney } from "@/backend/lib/money";
import { checkoutSchema } from "@/backend/lib/validation";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }
  const { items, shipping, paymentMethod } = parsed.data;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in to place an order" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
  });

  if (products.length !== items.length) {
    return NextResponse.json({ error: "One or more items are no longer available" }, { status: 400 });
  }

  const orderItemsData = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }
    return {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    };
  });

  const subtotal = roundMoney(orderItemsData.reduce((sum, i) => sum + i.price * i.quantity, 0));
  const shippingCost =
    subtotal >= FREE_DELIVERY_THRESHOLD
      ? 0
      : calculateRoyalMailShipping(
          items.map((item) => {
            const product = products.find((p) => p.id === item.productId)!;
            return {
              weightLbs: product.weightLbs,
              lengthIn: product.lengthIn,
              widthIn: product.widthIn,
              heightIn: product.heightIn,
              quantity: item.quantity,
            };
          })
        );
  const total = roundMoney(subtotal + shippingCost);

  // Stock is validated above but only decremented once payment is actually confirmed
  // (Stripe webhook / PayPal capture), so an abandoned or never-paid checkout never
  // reserves inventory.
  let order;
  try {
    order = await prisma.order.create({
      data: {
        userId: session?.user?.id,
        guestEmail: session?.user?.id ? undefined : shipping.email,
        subtotal,
        shippingCost,
        total,
        shippingName: shipping.fullName,
        shippingLine1: shipping.line1,
        shippingLine2: shipping.line2,
        shippingCity: shipping.city,
        shippingPostcode: shipping.postcode,
        shippingCountry: shipping.country,
        shippingPhone: shipping.phone,
        items: { create: orderItemsData },
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not place order";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const origin = req.headers.get("origin") ?? new URL(req.url).origin;

  if (paymentMethod === "paypal") {
    if (!isPaypalConfigured()) {
      return NextResponse.json({ error: "PayPal is not configured" }, { status: 400 });
    }

    const paypalOrder = await createPaypalOrder({
      orderId: order.id,
      items: orderItemsData,
      shippingCost,
      currency: "GBP",
      returnUrl: `${origin}/api/paypal/capture?order=${order.id}`,
      cancelUrl: `${origin}/cart`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { paypalOrderId: paypalOrder.id },
    });

    const approveUrl = paypalOrder.links.find((link) => link.rel === "approve")?.href;
    if (!approveUrl) {
      return NextResponse.json({ error: "Could not start PayPal checkout" }, { status: 502 });
    }

    return NextResponse.json({ url: approveUrl });
  }

  if (!isStripeConfigured()) {
    await prisma.$transaction([
      prisma.order.update({ where: { id: order.id }, data: { status: "PAID" } }),
      ...orderItemsData.map((item) =>
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      ),
    ]);
    await sendOrderConfirmationEmail(order.id);
    return NextResponse.json({ url: `/checkout/success?order=${order.id}` });
  }

  const stripe = getStripe()!;
  const stripeSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: shipping.email,
    line_items: [
      ...orderItemsData.map((item) => ({
        price_data: {
          currency: "gbp",
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      ...(shippingCost > 0
        ? [
            {
              price_data: {
                currency: "gbp",
                product_data: { name: "Shipping" },
                unit_amount: Math.round(shippingCost * 100),
              },
              quantity: 1,
            },
          ]
        : []),
    ],
    success_url: `${origin}/checkout/success?order=${order.id}`,
    cancel_url: `${origin}/cart`,
    metadata: { orderId: order.id },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: stripeSession.id },
  });

  return NextResponse.json({ url: stripeSession.url });
}

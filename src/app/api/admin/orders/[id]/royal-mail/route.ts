import { NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { getAdminSession } from "@/backend/lib/admin";
import { createRoyalMailShipment, cancelRoyalMailShipment, isRoyalMailConfigured } from "@/backend/lib/royalMail";
import { toIsoAlpha3 } from "@/backend/lib/countryCode";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  if (!isRoyalMailConfigured()) {
    return NextResponse.json(
      { error: "Royal Mail is not configured (set ROYAL_MAIL_API_KEY)" },
      { status: 400 }
    );
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } }, user: true },
  });

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.royalMailOrderId) {
    return NextResponse.json({ error: "A Royal Mail shipment already exists for this order" }, { status: 400 });
  }

  try {
    const result = await createRoyalMailShipment({
      orderId: order.id,
      orderDate: order.createdAt,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      total: order.total,
      recipientName: order.shippingName,
      addressLine1: order.shippingLine1,
      addressLine2: order.shippingLine2,
      city: order.shippingCity,
      postcode: order.shippingPostcode,
      countryCode: toIsoAlpha3(order.shippingCountry),
      phone: order.shippingPhone,
      email: order.user?.email ?? order.guestEmail,
      items: order.items.map((item) => ({
        name: item.name,
        sku: item.product.sku,
        quantity: item.quantity,
        unitValue: item.price,
        weightLbs: item.product.weightLbs,
        lengthIn: item.product.lengthIn,
        widthIn: item.product.widthIn,
        heightIn: item.product.heightIn,
      })),
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        royalMailOrderId: result.orderIdentifier,
        royalMailTrackingNumber: result.trackingNumber,
      },
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create Royal Mail shipment";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, select: { royalMailOrderId: true } });

  if (!order?.royalMailOrderId) {
    return NextResponse.json({ error: "No Royal Mail shipment exists for this order" }, { status: 400 });
  }

  try {
    await cancelRoyalMailShipment(order.royalMailOrderId);
    await prisma.order.update({
      where: { id },
      data: { royalMailOrderId: null, royalMailTrackingNumber: null },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to cancel Royal Mail shipment";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

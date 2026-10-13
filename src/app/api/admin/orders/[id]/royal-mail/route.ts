import { NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { getAdminSession } from "@/backend/lib/admin";
import { cancelRoyalMailShipment } from "@/backend/lib/royalMail";
import { createShipmentForOrder, ShipmentError } from "@/backend/lib/royalMailShipment";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;

  try {
    const result = await createShipmentForOrder(id);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    if (err instanceof ShipmentError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
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

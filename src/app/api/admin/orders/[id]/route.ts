import { NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { getAdminSession } from "@/backend/lib/admin";

const VALID_STATUSES = ["PENDING", "PAID", "FULFILLED", "CANCELLED"];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const status = body?.status;

  if (typeof status !== "string" || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status: status as "PENDING" | "PAID" | "FULFILLED" | "CANCELLED" },
  });

  return NextResponse.json({ order });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;

  // Paid orders are financial records (revenue, invoices, shipments), so they can never be
  // hard-deleted from the admin. Only unpaid/cancelled orders may be removed.
  const existing = await prisma.order.findUnique({ where: { id }, select: { status: true } });
  if (existing && (existing.status === "PAID" || existing.status === "FULFILLED")) {
    return NextResponse.json(
      { error: "Paid or fulfilled orders can't be deleted. Set the status to Cancelled instead." },
      { status: 400 }
    );
  }

  try {
    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Could not delete this order" }, { status: 400 });
  }
}

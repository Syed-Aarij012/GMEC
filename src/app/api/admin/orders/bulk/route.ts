import { NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { getAdminSession } from "@/backend/lib/admin";
import { ORDER_STATUSES } from "@/backend/lib/orders";
import type { OrderStatus } from "@prisma/client";

export async function PATCH(req: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const ids = body?.ids;
  const status = body?.status;

  if (!Array.isArray(ids) || ids.length === 0 || ids.some((id) => typeof id !== "string")) {
    return NextResponse.json({ error: "No orders selected" }, { status: 400 });
  }
  if (typeof status !== "string" || !ORDER_STATUSES.includes(status as OrderStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const result = await prisma.order.updateMany({
    where: { id: { in: ids } },
    data: { status: status as OrderStatus },
  });

  return NextResponse.json({ updated: result.count });
}

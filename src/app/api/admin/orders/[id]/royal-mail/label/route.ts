import { NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { getAdminSession } from "@/backend/lib/admin";
import { getRoyalMailLabelPdf } from "@/backend/lib/royalMail";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, select: { royalMailOrderId: true } });

  if (!order?.royalMailOrderId) {
    return NextResponse.json({ error: "No Royal Mail shipment exists for this order" }, { status: 404 });
  }

  try {
    const pdf = await getRoyalMailLabelPdf(order.royalMailOrderId);
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="royal-mail-label-${order.royalMailOrderId}.pdf"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch Royal Mail label";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

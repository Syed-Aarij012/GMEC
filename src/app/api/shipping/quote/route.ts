import { NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { calculateRoyalMailShipping, FREE_DELIVERY_THRESHOLD } from "@/backend/lib/shipping";
import { roundMoney } from "@/backend/lib/money";

interface QuoteItem {
  productId: string;
  quantity: number;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const items: QuoteItem[] = Array.isArray(body?.items) ? body.items : [];

  if (items.length === 0) {
    return NextResponse.json({ subtotal: 0, shippingCost: 0, total: 0 });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
  });

  const subtotal = roundMoney(
    items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? sum + product.price * item.quantity : sum;
    }, 0)
  );

  const shippingCost =
    subtotal > FREE_DELIVERY_THRESHOLD
      ? 0
      : calculateRoyalMailShipping(
          items
            .map((item) => {
              const product = products.find((p) => p.id === item.productId);
              if (!product) return null;
              return {
                weightLbs: product.weightLbs,
                lengthIn: product.lengthIn,
                widthIn: product.widthIn,
                heightIn: product.heightIn,
                quantity: item.quantity,
              };
            })
            .filter((x): x is NonNullable<typeof x> => x !== null)
        );

  return NextResponse.json({ subtotal, shippingCost, total: roundMoney(subtotal + shippingCost) });
}

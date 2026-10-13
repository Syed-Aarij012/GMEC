import { prisma } from "@/backend/lib/prisma";
import { getOrderReference } from "@/backend/lib/orders";
import { createRoyalMailShipment, isRoyalMailConfigured, type RoyalMailShipmentResult } from "@/backend/lib/royalMail";
import { toIsoAlpha3 } from "@/backend/lib/countryCode";

export class ShipmentError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

// Pushes a paid order to Royal Mail and stores the returned identifiers.
// Throws ShipmentError for precondition failures, plain Error for API failures.
export async function createShipmentForOrder(orderId: string): Promise<RoyalMailShipmentResult> {
  if (!isRoyalMailConfigured()) {
    throw new ShipmentError("Royal Mail is not configured (set ROYAL_MAIL_API_KEY)", 400);
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } }, user: true },
  });

  if (!order) throw new ShipmentError("Order not found", 404);
  if (order.status === "PENDING" || order.status === "CANCELLED") {
    throw new ShipmentError("This order must be paid before a Royal Mail shipment can be created", 400);
  }
  if (order.royalMailOrderId) {
    throw new ShipmentError("A Royal Mail shipment already exists for this order", 400);
  }

  const result = await createRoyalMailShipment({
    orderId: getOrderReference(order.id, order.invoiceNumber),
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

  return result;
}

// Called right after payment succeeds. Never throws — a Royal Mail failure must
// not break checkout; the admin can retry from the order page.
export async function autoCreateShipmentForOrder(orderId: string): Promise<void> {
  if (!isRoyalMailConfigured()) return;
  try {
    await createShipmentForOrder(orderId);
  } catch (err) {
    console.error(`Auto-create Royal Mail shipment failed for order ${orderId}:`, err);
  }
}

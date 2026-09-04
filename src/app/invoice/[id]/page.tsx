import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronLeft, Sparkles } from "lucide-react";
import { prisma } from "@/backend/lib/prisma";
import { formatPrice } from "@/frontend/lib/utils";
import PrintButton from "@/frontend/components/invoice/PrintButton";

const statusStyles: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-600",
  PAID: "bg-[#fdf3e0] text-[#a86f09]",
  FULFILLED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, user: true },
  });

  if (!order) notFound();

  const invoiceRef = order.id.slice(-8).toUpperCase();
  const paymentMethod = order.paypalOrderId
    ? "PayPal"
    : order.stripeSessionId
      ? "Credit / Debit Card"
      : "N/A";
  const customerName = order.user?.name ?? order.shippingName;
  const customerEmail = order.user?.email ?? order.guestEmail;

  return (
    <div className="min-h-screen bg-gray-100 py-10 text-[#1a1a1a] print:bg-white print:py-0">
      <div className="mx-auto max-w-3xl px-6 print:px-0">
        <div className="mb-6 flex items-center justify-between print:hidden">
          <Link href="/" className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-gray-800">
            <ChevronLeft className="h-4 w-4" /> Back to site
          </Link>
          <PrintButton />
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5 print:rounded-none print:shadow-none print:ring-0">
          <div className="h-2 bg-gradient-to-r from-[#f0ab1e] to-[#d1900f]" />

          <div className="flex items-start justify-between gap-6 bg-gradient-to-br from-[#faf7f0] to-white px-8 py-8 sm:px-12 print:px-8 print:py-4">
            <Image
              src="/brand/gmec-logo.png"
              alt="GMEC Corporation"
              width={240}
              height={77}
              className="print:h-auto print:w-36"
            />
            <div className="text-right text-sm text-gray-600 print:text-xs">
              <p className="font-bold text-gray-900">GMEC Corporation</p>
              <p>453B Barking Road</p>
              <p>LONDON</p>
              <p>E6 2JX</p>
              <p>United Kingdom (UK)</p>
            </div>
          </div>

          <div className="px-8 py-8 sm:px-12 sm:py-10 print:px-8 print:py-4">
            <div className="flex flex-wrap items-center justify-between gap-3 print:gap-2">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 print:text-xl">Invoice</h1>
                <p className="mt-1 text-sm font-semibold text-[#d1900f] print:mt-0 print:text-xs">#{invoiceRef}</p>
              </div>
              <span
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide print:px-2 print:py-0.5 print:text-[10px] ${statusStyles[order.status]}`}
              >
                {order.status}
              </span>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 print:mt-3 print:gap-2">
              <div className="rounded-xl bg-gray-50 p-5 text-sm text-gray-700 print:p-3 print:text-xs">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400 print:mb-1 print:text-[10px]">Billed To</p>
                <p className="font-bold text-gray-900">{customerName}</p>
                <p>{order.shippingLine1}</p>
                {order.shippingLine2 && <p>{order.shippingLine2}</p>}
                <p>{order.shippingCity}</p>
                <p>{order.shippingPostcode}</p>
                <p>{order.shippingCountry}</p>
                {customerEmail && <p className="mt-1 text-gray-500 print:mt-0.5">{customerEmail}</p>}
                {order.shippingPhone && <p className="text-gray-500">{order.shippingPhone}</p>}
              </div>

              <div className="rounded-xl bg-gray-50 p-5 text-sm text-gray-700 print:p-3 print:text-xs">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400 print:mb-1 print:text-[10px]">Details</p>
                <div className="space-y-1.5 print:space-y-0.5">
                  <p className="flex justify-between gap-4">
                    <span className="text-gray-500">Invoice Number</span>
                    <span className="font-semibold text-gray-900">{invoiceRef}</span>
                  </p>
                  <p className="flex justify-between gap-4">
                    <span className="text-gray-500">Order Number</span>
                    <span className="font-semibold text-gray-900">{invoiceRef}</span>
                  </p>
                  <p className="flex justify-between gap-4">
                    <span className="text-gray-500">Order Date</span>
                    <span className="font-semibold text-gray-900">
                      {order.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </p>
                  <p className="flex justify-between gap-4">
                    <span className="text-gray-500">Payment Method</span>
                    <span className="font-semibold text-gray-900">{paymentMethod}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 print:mt-3">
              <table className="w-full text-left text-sm print:text-xs">
                <thead>
                  <tr className="bg-[#0b1428] text-white">
                    <th className="px-5 py-3.5 font-semibold print:px-3 print:py-1.5">Product</th>
                    <th className="px-5 py-3.5 font-semibold print:px-3 print:py-1.5">Quantity</th>
                    <th className="px-5 py-3.5 font-semibold print:px-3 print:py-1.5">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, i) => (
                    <tr key={item.id} className={i % 2 === 1 ? "bg-gray-50" : "bg-white"}>
                      <td className="px-5 py-3.5 font-medium text-gray-800 print:px-3 print:py-1.5">{item.name}</td>
                      <td className="px-5 py-3.5 text-gray-600 print:px-3 print:py-1.5">{item.quantity}</td>
                      <td className="px-5 py-3.5 text-gray-800 print:px-3 print:py-1.5">{formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end print:mt-3">
              <div className="w-full max-w-xs rounded-xl bg-gray-50 p-5 text-sm print:p-3 print:text-xs">
                <div className="flex justify-between py-1.5 text-gray-600 print:py-0.5">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between py-1.5 text-gray-600 print:py-0.5">
                  <span>Shipping</span>
                  <span>{order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}</span>
                </div>
                <div className="mt-1 flex justify-between border-t border-gray-200 pt-3 text-base font-bold text-gray-900 print:mt-0.5 print:pt-1.5 print:text-sm">
                  <span>Total</span>
                  <span className="text-[#d1900f]">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            <div className="mt-12 border-t border-dashed border-gray-200 pt-8 text-center print:mt-4 print:pt-3">
              <Sparkles className="mx-auto h-5 w-5 text-[#f0ab1e] print:h-3.5 print:w-3.5" />
              <p className="mt-2 text-base font-bold text-gray-900 print:mt-1 print:text-sm">
                Thank you for shopping with GMEC Corporation!
              </p>
              <p className="mt-1 text-sm text-gray-500 print:text-xs">
                We hope you love your new lighting — until next time, take care and goodbye!
              </p>
              <p className="mt-4 text-xs text-gray-400 print:mt-1.5 print:text-[10px]">
                Questions about your order? info@gmeccorporation.com &middot; +44 7951 282482
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

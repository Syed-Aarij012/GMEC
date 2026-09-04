import type { Metadata } from "next";
import PolicyLayout, { PolicySection } from "@/frontend/components/policy/PolicyLayout";

export const metadata: Metadata = { title: "Refund & Returns Policy" };

export default function RefundReturnsPolicyPage() {
  return (
    <PolicyLayout title="Refund &amp; Returns Policy" updated="4 September 2026">
      <p>
        At GMEC Corporation, we want you to be fully satisfied with every
        purchase. This Refund and Returns Policy outlines the terms under
        which you may return products and request a refund. By shopping with
        us, you agree to the conditions explained below.
      </p>

      <PolicySection heading="Returns Eligibility">
        <p>
          Items may be returned within 14 days of delivery in accordance with
          UK consumer protection regulations. Products must be unused, in
          their original packaging, and in the same condition as received.
          For hygiene and safety reasons, certain items may be
          non-returnable unless they are faulty or damaged.
        </p>
      </PolicySection>

      <PolicySection heading="Faulty or Damaged Items">
        <p>
          If an item arrives damaged, defective, or incorrect, we will offer
          a replacement or full refund. Customers should notify us within 48
          hours of receiving the order and provide relevant details or
          evidence so we can resolve the issue quickly.
        </p>
      </PolicySection>

      <PolicySection heading="Return Process">
        <p>
          To arrange a return, customers must request authorisation before
          sending items back. Once a return has been approved, products
          should be securely packaged and returned to the address provided.
          Returns without prior approval may not be accepted.
        </p>
      </PolicySection>

      <PolicySection heading="Refunds">
        <p>
          Refunds will only be issued once the returned item has been
          received and inspected. If approved, the refund will be processed
          to the original payment method. Refunds may take between three to
          ten business days depending on your bank or payment provider.
          Shipping costs are non-refundable unless the return is due to our
          error.
        </p>
      </PolicySection>

      <PolicySection heading="Exchanges">
        <p>
          In cases where an exchange is available, we will dispatch the
          replacement product once the returned item has been received and
          verified. If the replacement is out of stock, a full refund will
          be provided.
        </p>
      </PolicySection>

      <PolicySection heading="Non-Returnable Items">
        <p>
          Certain products may not be eligible for return due to their
          nature. This includes clearance or sale items, products that have
          been used or altered, and items marked as non-returnable on the
          product page.
        </p>
      </PolicySection>

      <PolicySection heading="Policy Updates">
        <p>
          GMEC Corporation reserves the right to amend this Refund and
          Returns Policy at any time. Any updates will be published on this
          page and will take immediate effect. Customers are encouraged to
          review the policy regularly to stay informed of their rights and
          responsibilities.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}

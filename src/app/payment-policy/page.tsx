import type { Metadata } from "next";
import PolicyLayout, { PolicySection } from "@/frontend/components/policy/PolicyLayout";

export const metadata: Metadata = { title: "Payment Policy" };

export default function PaymentPolicyPage() {
  return (
    <PolicyLayout title="Payment Policy" updated="4 September 2026">
      <p>
        At GMEC Corporation, we are committed to providing a safe and
        reliable shopping experience. This Payment Policy explains how
        payments are handled on our website. By placing an order, you agree
        to the terms outlined below.
      </p>

      <PolicySection heading="Accepted Payment Methods">
        <p>
          We accept a range of secure and convenient payment options
          including debit and credit cards such as Visa, Mastercard, and
          American Express, processed via Stripe. Customers may also choose
          to pay using PayPal for a faster checkout experience. All
          transactions are processed using trusted and encrypted payment
          gateways, ensuring your details remain safe at all times.
        </p>
      </PolicySection>

      <PolicySection heading="Currency">
        <p>
          All payments on our website are processed in British Pounds
          Sterling (GBP). If you are purchasing from outside the United
          Kingdom, your card provider or payment service may apply additional
          charges or currency conversion fees. GMEC Corporation does not
          control or cover these additional costs.
        </p>
      </PolicySection>

      <PolicySection heading="Payment Timing">
        <p>
          Payment must be made in full at the time of purchase. Orders will
          only be confirmed and dispatched once the payment has been
          successfully received and verified. If for any reason a payment is
          not completed, the order will be automatically cancelled.
        </p>
      </PolicySection>

      <PolicySection heading="Security and Fraud Prevention">
        <p>
          Your security is our top priority. We use industry-standard
          encryption and secure sockets layer (SSL) technology to protect
          your payment details throughout the checkout process. GMEC
          Corporation will never ask for your payment details via email or
          telephone. To prevent fraud, all payments are subject to
          verification checks, and in certain cases, we may request
          additional confirmation before processing an order.
        </p>
      </PolicySection>

      <PolicySection heading="Failed or Declined Payments">
        <p>
          If a payment is declined or unsuccessful, customers are encouraged
          to verify their payment details and ensure sufficient funds are
          available. An alternative payment method may be required if the
          issue persists. In some cases, contacting your bank or card
          provider may be necessary to resolve declined transactions.
        </p>
      </PolicySection>

      <PolicySection heading="Refunds and Cancellations">
        <p>
          All approved refunds will be issued back to the same payment
          method used at checkout. Refund times depend on the payment
          provider but are usually processed within three to ten business
          days. For further details regarding returns and eligibility,
          please review our Refund and Return Policy.
        </p>
      </PolicySection>

      <PolicySection heading="Updates to this Policy">
        <p>
          GMEC Corporation may update or amend this Payment Policy from time
          to time. Any changes will take immediate effect once published on
          this page, and customers are encouraged to review the policy
          regularly to stay informed.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}

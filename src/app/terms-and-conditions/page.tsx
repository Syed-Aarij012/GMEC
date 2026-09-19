import type { Metadata } from "next";
import Link from "next/link";
import PolicyLayout, { PolicySection } from "@/frontend/components/policy/PolicyLayout";

export const metadata: Metadata = { title: "Terms & Conditions", alternates: { canonical: "/terms-and-conditions" } };

export default function TermsAndConditionsPage() {
  return (
    <PolicyLayout title="Terms &amp; Conditions" updated="4 September 2026">
      <p>
        Welcome to <Link href="https://www.gmeccorporation.com/">GMEC Corporation</Link>. These Terms and Conditions govern the
        use of our website and the purchase of products through our online
        store. By accessing or using our site, you agree to comply with the
        terms outlined below.
      </p>

      <PolicySection heading="Use of Website">
        <p>
          This website is intended for personal, non-commercial use. You
          agree not to misuse our site, attempt to disrupt its
          functionality, or use it for unlawful purposes. GMEC Corporation
          reserves the right to suspend or restrict access to users who
          breach these terms.
        </p>
      </PolicySection>

      <PolicySection heading="Product Information">
        <p>
          We make every effort to ensure product descriptions, images, and
          prices are accurate. However, errors may occasionally occur. In
          such cases, we reserve the right to correct inaccuracies and, if
          necessary, cancel an order that has been placed under incorrect
          information.
        </p>
      </PolicySection>

      <PolicySection heading="Orders and Availability">
        <p>
          All orders are subject to acceptance and availability. Placing an
          item in your basket does not guarantee purchase until payment has
          been successfully processed. If an item is unavailable, we will
          notify you and provide the option of a replacement or refund.
        </p>
      </PolicySection>

      <PolicySection heading="Pricing and Payment">
        <p>
          All prices are listed in British Pounds Sterling (GBP) and include
          applicable UK taxes unless otherwise stated. Payment must be made
          in full at the time of order using one of the accepted payment
          methods. Orders will not be processed until payment is received.
        </p>
      </PolicySection>

      <PolicySection heading="Shipping and Delivery">
        <p>
          Delivery times provided on our website are estimates only and may
          vary depending on location and courier services. GMEC Corporation
          is not responsible for delays outside our control, but we will
          make every effort to ensure your order is delivered promptly.
        </p>
      </PolicySection>

      <PolicySection heading="Returns and Refunds">
        <p>
          Customers have the right to return items in accordance with our
          Refund and Returns Policy. Refunds will be processed to the
          original payment method once the returned item has been inspected
          and approved.
        </p>
      </PolicySection>

      <PolicySection heading="Limitation of Liability">
        <p>
          To the extent permitted by law, GMEC Corporation shall not be held
          liable for any indirect, incidental, or consequential damages
          arising from the use of our website or products. Our liability is
          limited to the value of the product purchased.
        </p>
      </PolicySection>

      <PolicySection heading="Intellectual Property">
        <p>
          All content on this website, including text, images, graphics, and
          logos, is the property of GMEC Corporation and is protected by
          copyright and intellectual property laws. You may not copy,
          reproduce, or distribute any material from our website without
          prior written consent.
        </p>
      </PolicySection>

      <PolicySection heading="Governing Law">
        <p>
          These Terms and Conditions are governed by and construed in
          accordance with the laws of England and Wales. Any disputes
          arising from the use of our website or services will be subject to
          the exclusive jurisdiction of the UK courts.
        </p>
      </PolicySection>

      <PolicySection heading="Changes to Terms">
        <p>
          GMEC Corporation reserves the right to amend or update these Terms
          and Conditions at any time. Updates will take effect once
          published on this page, and continued use of the website
          constitutes acceptance of the revised terms.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}

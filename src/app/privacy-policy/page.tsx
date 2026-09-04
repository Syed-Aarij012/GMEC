import type { Metadata } from "next";
import PolicyLayout, { PolicySection } from "@/frontend/components/policy/PolicyLayout";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout title="Privacy Policy" updated="4 September 2026">
      <p>
        At GMEC Corporation, we respect your privacy and are committed to
        protecting your personal information. This Privacy Policy explains
        how we collect, use, and safeguard the data you provide when using
        our website. By accessing or purchasing from our site, you agree to
        the practices outlined below.
      </p>

      <PolicySection heading="Information We Collect">
        <p>
          When you visit our website or make a purchase, we may collect
          personal details such as your name, email address, billing and
          shipping addresses, phone number, and payment information. In
          addition, we may collect non-personal data including your browser
          type, device information, and browsing behaviour to help us improve
          our services.
        </p>
      </PolicySection>

      <PolicySection heading="How We Use Your Information">
        <p>
          The information we collect is used to process your orders, provide
          customer support, deliver products, and ensure a smooth shopping
          experience. We may also use your details to send important updates
          about your orders, promotional offers, or service improvements. Any
          marketing communication will only be sent if you have provided your
          consent, and you may opt out at any time.
        </p>
      </PolicySection>

      <PolicySection heading="Data Security">
        <p>
          We take data security seriously and implement strict measures to
          protect your personal information. All transactions are processed
          through secure payment gateways, and sensitive data is encrypted
          during transmission. While we strive to safeguard your details, no
          method of online transmission can be guaranteed as completely
          secure, and customers share their information at their own risk.
        </p>
      </PolicySection>

      <PolicySection heading="Sharing of Information">
        <p>
          GMEC Corporation does not sell or rent your personal data to third
          parties. We may share information only with trusted service
          providers who assist us in operating our website, processing
          payments, or delivering orders. These partners are required to keep
          your data secure and use it only for the purpose of supporting our
          services.
        </p>
      </PolicySection>

      <PolicySection heading="Cookies and Tracking">
        <p>
          Our website uses cookies to enhance your browsing experience.
          Cookies are small files stored on your device that help us
          remember your preferences, analyse site traffic, and improve our
          services. You may choose to disable cookies in your browser
          settings, although this may affect the functionality of our site.
        </p>
      </PolicySection>

      <PolicySection heading="Your Rights">
        <p>
          As a UK customer, you have the right to access, update, or request
          the deletion of your personal information held by us. You may also
          request to restrict how we use your data or opt out of marketing
          communications at any time. To exercise these rights, please
          contact our support team through the details provided on our
          website.
        </p>
      </PolicySection>

      <PolicySection heading="Retention of Data">
        <p>
          We will retain your personal information only for as long as
          necessary to fulfil the purposes outlined in this policy,
          including legal, accounting, or reporting obligations. Once data is
          no longer required, it will be securely deleted or anonymised.
        </p>
      </PolicySection>

      <PolicySection heading="Changes to this Privacy Policy">
        <p>
          GMEC Corporation reserves the right to update or amend this Privacy
          Policy at any time. Any changes will be published on this page, and
          we encourage customers to review the policy periodically to stay
          informed.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}

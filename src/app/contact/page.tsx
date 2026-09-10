import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import ContactForm from "@/frontend/components/contact/ContactForm";
import Reveal from "@/frontend/components/motion/Reveal";

export const metadata: Metadata = { title: "Contact Us", alternates: { canonical: "/contact" } };

const details = [
  { icon: MapPin, label: "Address", value: "GMEC House, Keppel Road, London E6 2BD" },
  { icon: Phone, label: "Phone", value: "+44 7951 282482" },
  { icon: Mail, label: "Email", value: "info@gmeccorporation.com" },
  { icon: Clock, label: "Support", value: "Available 24/7" },
];

export default function ContactPage() {
  return (
    <div className="bg-ink-950">
      <Reveal className="container-page py-16 text-center">
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Get in Touch</h1>
        <p className="mx-auto mt-3 max-w-xl text-cream-100/70">
          Questions about a product, a bulk order, or a trade account? Our
          team is here to help.
        </p>
      </Reveal>

      <div className="rounded-t-[2.5rem] bg-canvas">
        <div className="container-page grid grid-cols-1 gap-12 py-16 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <h2 className="text-xl font-bold text-text">Contact Details</h2>
            <div className="mt-6 space-y-5">
              {details.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-canvas-muted text-gold-600">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-text/50">{label}</p>
                    <p className="font-medium text-text">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-canvas-muted p-5">
              <p className="text-sm font-semibold text-text">Trade &amp; Bulk Orders</p>
              <p className="mt-1 text-sm text-text/60">
                Electrical contractors, developers and hospitality businesses
               , ask us about volume pricing and account terms.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="rounded-2xl border border-line/10 p-6 sm:p-8">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/frontend/components/motion/Reveal";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <section className="bg-canvas-muted">
      <Reveal className="container-page flex flex-col items-center gap-6 py-14 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-900 text-gold-400">
          <Mail className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-2xl font-extrabold text-text">Stay in the loop</h2>
          <p className="mt-2 text-text/60">
            New arrivals, trade offers and exclusive discounts, straight to your inbox.
          </p>
        </div>
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.p
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="font-semibold text-gold-600"
            >
              Thanks for subscribing, keep an eye on your inbox!
            </motion.p>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmit}
              className="flex w-full max-w-md gap-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                suppressHydrationWarning
                className="w-full rounded-full border border-line/10 bg-canvas px-5 py-3 text-sm outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              />
              <button
                type="submit"
                suppressHydrationWarning
                className="shrink-0 rounded-full bg-ink-900 px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105 hover:bg-gold-600 hover:text-ink-950"
              >
                Subscribe
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </Reveal>
    </section>
  );
}

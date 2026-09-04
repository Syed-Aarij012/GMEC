"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
}

function Stars({ rating, size = "h-4 w-4" }: { rating: number; size?: string }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${size} ${n <= rating ? "fill-gold-500 text-gold-500" : "text-line/30"}`}
        />
      ))}
    </div>
  );
}

export default function ProductReviews({
  productId,
  initialReviews,
}: {
  productId: string;
  initialReviews: Review[];
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [form, setForm] = useState({ name: "", email: "", rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const average =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus("idle");

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, ...form }),
    });

    setSubmitting(false);
    if (res.ok) {
      const data = await res.json();
      setReviews([data.review, ...reviews]);
      setForm({ name: "", email: "", rating: 5, comment: "" });
      setStatus("success");
    } else {
      setStatus("error");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-extrabold text-text">Customer Reviews</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <Stars rating={Math.round(average)} />
            <span className="text-sm text-text/60">
              {average.toFixed(1)} out of 5 ({reviews.length} review{reviews.length === 1 ? "" : "s"})
            </span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="mt-4 text-sm text-text/60">
          No reviews yet — be the first to review this product.
        </p>
      ) : (
        <div className="mt-6 divide-y divide-line/10">
          {reviews.map((r) => (
            <div key={r.id} className="py-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-text">{r.name}</span>
                <span className="text-xs text-text/40">
                  {new Date(r.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <Stars rating={r.rating} size="h-3.5 w-3.5" />
              <p className="mt-2 text-sm leading-relaxed text-text/70">{r.comment}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border border-line/10 p-5">
        <h3 className="font-bold text-text">Add a review</h3>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-text">Your rating</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setForm({ ...form, rating: n })}
                aria-label={`${n} star${n === 1 ? "" : "s"}`}
              >
                <Star
                  className={`h-6 w-6 transition-colors ${
                    n <= form.rating ? "fill-gold-500 text-gold-500" : "text-line/30 hover:text-gold-400"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-text">Your review</span>
          <textarea
            required
            minLength={10}
            rows={4}
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            className={inputClass}
          />
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-text">Name</span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-text">Email</span>
            <input
              type="email"
              suppressHydrationWarning
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
            />
            <span className="mt-1 block text-xs text-text/40">Won&apos;t be published.</span>
          </label>
        </div>

        {status === "success" && (
          <p className="rounded-lg bg-gold-500/10 p-3 text-sm font-semibold text-gold-700 dark:text-gold-400">
            Thanks for your review!
          </p>
        )}
        {status === "error" && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
            Something went wrong. Please try again.
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-ink-900 px-6 py-2.5 text-sm font-bold text-white transition-transform hover:scale-105 hover:bg-gold-600 hover:text-ink-950 disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-line/15 bg-canvas px-3.5 py-2.5 text-sm text-text outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500";

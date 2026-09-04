"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const result = await res.json();

    if (!res.ok) {
      setError(result.error ?? "Something went wrong");
      setSubmitting(false);
      return;
    }

    await signIn("credentials", { email, password, redirect: false });
    router.push("/account");
    router.refresh();
  }

  return (
    <div className="container-page flex justify-center py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ink-900 text-gold-400">
            <UserPlus className="h-5 w-5" />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold text-text">Create your account</h1>
          <p className="mt-1 text-sm text-text/60">Track orders and check out faster</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-text">Full Name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-text">Email</span>
            <input
              type="email"
              suppressHydrationWarning
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-text">Password</span>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </label>

          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-ink-900 px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] hover:bg-gold-600 hover:text-ink-950 disabled:opacity-60"
          >
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text/60">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-gold-600 hover:text-gold-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-line/15 bg-canvas px-3.5 py-2.5 text-sm text-text outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500";

"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { LogIn, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const explicitCallbackUrl = searchParams.get("callbackUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setSubmitting(false);
      return;
    }

    if (explicitCallbackUrl) {
      router.push(explicitCallbackUrl);
    } else {
      const session = await getSession();
      router.push(session?.user.role === "ADMIN" ? "/admin" : "/account");
    }
    router.refresh();
  }

  return (
    <div className="container-page flex justify-center py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ink-900 text-gold-400">
            <LogIn className="h-5 w-5" />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold text-text">Welcome back</h1>
          <p className="mt-1 text-sm text-text/60">Sign in to your GMEC account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-text/40 hover:text-text/70"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-ink-900 px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] hover:bg-gold-600 hover:text-ink-950 disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text/60">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-gold-600 hover:text-gold-700">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-line/15 bg-canvas px-3.5 py-2.5 text-sm text-text outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

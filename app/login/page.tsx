"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-4 bg-surface">
      {/* Subtle glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-brand-500/8 blur-3xl"
      />

      <div className="relative z-10 w-full max-w-sm animate-fade-up">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Link
            href="/"
            className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center text-white text-sm font-bold hover:bg-brand-400 transition-colors"
          >
            P
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-white">Welcome back</h1>
            <p className="text-sm text-white/50 mt-0.5">
              Sign in to your workspace
            </p>
          </div>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleLogin}
          className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 space-y-4"
        >
          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="login-email"
              className="text-sm font-medium text-white/70"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="login-password"
                className="text-sm font-medium text-white/70"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all"
            />
          </div>

          {/* Remember me */}
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              id="login-remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/5 accent-brand-500 cursor-pointer"
            />
            <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
              Remember me
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner /> Signing in…
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Switch to signup */}
        <p className="mt-5 text-center text-sm text-white/40">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-brand-400 hover:text-brand-300 transition-colors"
          >
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

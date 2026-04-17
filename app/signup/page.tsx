"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

function validate(email: string, password: string): string | null {
  if (!email.includes("@")) return "Enter a valid email address.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  return null;
}

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const validationError = validate(email.trim(), password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        // Supabase will redirect here after email confirmation
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // If email confirmation is disabled in Supabase, redirect immediately
    setSuccess(true);
    setLoading(false);

    // Give user a moment to read the success message, then redirect
    setTimeout(() => router.push("/dashboard"), 2000);
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
            <h1 className="text-xl font-semibold text-white">
              Create your workspace
            </h1>
            <p className="text-sm text-white/50 mt-0.5">
              Start executing. Free forever.
            </p>
          </div>
        </div>

        {/* Success state */}
        {success ? (
          <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-6 text-center space-y-2">
            <p className="text-sm font-medium text-green-400">
              Account created!
            </p>
            <p className="text-xs text-white/50">
              Check your email to confirm your account, then you&apos;ll be
              redirected to your dashboard.
            </p>
          </div>
        ) : (
          /* Form card */
          <form
            onSubmit={handleSignup}
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
                htmlFor="signup-email"
                className="text-sm font-medium text-white/70"
              >
                Email
              </label>
              <input
                id="signup-email"
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
              <label
                htmlFor="signup-password"
                className="text-sm font-medium text-white/70"
              >
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all"
              />
              {password.length > 0 && password.length < 8 && (
                <p className="text-xs text-amber-400/80">
                  {8 - password.length} more character
                  {8 - password.length !== 1 ? "s" : ""} needed
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner /> Creating account…
                </span>
              ) : (
                "Create account"
              )}
            </button>

            <p className="text-center text-xs text-white/30">
              By signing up you agree to our{" "}
              <Link
                href="/terms"
                className="text-white/50 hover:text-white transition-colors"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-white/50 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </form>
        )}

        {/* Switch to login */}
        <p className="mt-5 text-center text-sm text-white/40">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-brand-400 hover:text-brand-300 transition-colors"
          >
            Sign in
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

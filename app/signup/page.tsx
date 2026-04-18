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
  const [showPassword, setShowPassword] = useState(false);
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

    // Email confirmation is disabled — session is active immediately
    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push("/dashboard"), 1200);
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
          <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-6 text-center space-y-4">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-green-400">Check your inbox!</p>
              <p className="text-xs text-white/50 leading-relaxed">
                We sent a confirmation link to <span className="text-white/70 font-medium">{email}</span>.
                Click it to activate your account, then sign in.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-block mt-2 text-sm text-brand-400 hover:text-brand-300 transition-colors"
            >
              Go to sign in →
            </Link>
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
            <div className="relative group">
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full rounded-lg border border-white/10 bg-white/5 pl-3.5 pr-10 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.888 9.888L3 3m18 18l-6.915-6.915" />
                  </svg>
                )}
              </button>
            </div>
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

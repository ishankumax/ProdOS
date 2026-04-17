import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "Personal OS — Execution Portal",
  description: "A private system for goals, habits, and progress.",
};

export default async function HomePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-dvh bg-surface flex flex-col items-center justify-center p-6 text-center">
      {/* Background Decor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-mesh opacity-20"
      />

      <div className="relative z-10 max-w-xl flex flex-col items-center gap-8">
        {/* Core Identity */}
        <div className="space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-500 mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-2xl shadow-brand-500/20">
            P
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tighter sm:text-5xl">
            Productivity OS
          </h1>
          <p className="text-white/40 text-sm font-medium uppercase tracking-[0.3em]">
            Private Execution System
          </p>
        </div>

        {/* Dynamic Entrance */}
        <div className="w-full p-1 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
          {user ? (
            <div className="p-8 space-y-6">
              <div className="space-y-1">
                <p className="text-white/30 text-xs uppercase font-bold tracking-widest">Active Identity</p>
                <p className="text-white font-medium">{user.email}</p>
              </div>
              <Link
                href="/dashboard"
                className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2 group"
              >
                Go to Dashboard
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          ) : (
            <div className="p-8 space-y-6">
              <p className="text-white/30 text-sm leading-relaxed">
                Connect your account to access your personal goal mapping and progress tracking.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="w-full bg-white/5 hover:bg-white/10 text-white/70 py-3 rounded-xl text-sm transition-all"
                >
                  Initialize System
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="flex items-center gap-6 text-[10px] font-bold text-white/20 uppercase tracking-widest">
           <span>v1.0.4</span>
           <span className="w-1 h-1 rounded-full bg-white/20" />
           <span>Encrypted</span>
           <span className="w-1 h-1 rounded-full bg-white/20" />
           <span>User Focused</span>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import { FEATURES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Productivity OS — Your Unified Workspace",
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-dvh">
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* Hero */}
        <section className="relative flex flex-col items-center justify-center text-center px-4 pt-40 pb-28 overflow-hidden">
          {/* Mesh background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-mesh opacity-60"
          />
          {/* Glow orb */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-500/10 blur-3xl"
          />

          <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl mx-auto">
            <span className="chip animate-fade-in">
              ✦ Now in public beta
            </span>

            <h1 className="animate-fade-up text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/50">
              Productivity OS
            </h1>

            <p
              className="animate-fade-up animation-delay-100 text-lg sm:text-xl text-subtle max-w-xl leading-relaxed"
              style={{ animationFillMode: "forwards" }}
            >
              One workspace for your tasks, focus sessions, and long-term goals.
              Built for deep workers who value clarity.
            </p>

            <div
              className="animate-fade-up animation-delay-200 flex flex-col sm:flex-row items-center gap-3 mt-2"
              style={{ animationFillMode: "forwards" }}
            >
              <Link href="/signup" className="btn-primary px-7 py-3 text-base">
                Start for free
              </Link>
              <Link href="/demo" className="btn-ghost px-7 py-3 text-base">
                View demo →
              </Link>
            </div>

            <p
              className="animate-fade-up animation-delay-300 text-xs text-muted mt-1"
              style={{ animationFillMode: "forwards" }}
            >
              No credit card required · Free forever plan available
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 sm:px-6 lg:px-8 pb-28 max-w-7xl mx-auto w-full">
          <div className="text-center mb-14">
            <h2 className="section-heading">Everything you need to ship focus</h2>
            <p className="text-subtle mt-3 max-w-md mx-auto text-base">
              Purpose-built tools that work together — not a dozen tabs scattered across your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((feature, i) => (
              <FeatureCard key={feature.id} feature={feature} index={i} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 sm:px-6 lg:px-8 pb-28 max-w-7xl mx-auto w-full">
          <div className="relative overflow-hidden rounded-3xl glass p-12 text-center">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-br from-brand-900/60 via-surface-overlay/40 to-transparent pointer-events-none"
            />
            <div className="relative z-10 flex flex-col items-center gap-6 max-w-xl mx-auto">
              <h2 className="section-heading">Ready to focus?</h2>
              <p className="text-subtle text-base leading-relaxed">
                Join thousands of deep workers who have reclaimed their time and
                energy with Productivity OS.
              </p>
              <Link href="/signup" className="btn-primary px-8 py-3 text-base">
                Get started — it&apos;s free
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

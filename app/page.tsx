import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import { FEATURES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Productivity OS — Execution over Intention",
  description:
    "Your goals, habits, and progress in one place. A system built for people who execute — not just plan.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-dvh">
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* Hero */}
        <section className="relative flex flex-col items-center justify-center text-center px-4 pt-40 pb-32 overflow-hidden">
          {/* Subtle radial glow — restrained */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-500/8 blur-3xl"
          />

          <div className="relative z-10 flex flex-col items-center gap-5 max-w-2xl mx-auto">
            <span className="chip animate-fade-in">
              ✦ Built for execution
            </span>

            <h1 className="animate-fade-up text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1] text-white">
              Execution over{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-500">
                intention.
              </span>
            </h1>

            <p
              className="animate-fade-up animation-delay-100 text-base sm:text-lg text-white/60 max-w-lg leading-relaxed"
              style={{ animationFillMode: "forwards" }}
            >
              Productivity OS is a unified system — not another to-do app.
              Goals, habits, and weekly progress in one place, built for people
              who follow through.
            </p>

            <div
              className="animate-fade-up animation-delay-200 flex flex-col sm:flex-row items-center gap-3 mt-2"
              style={{ animationFillMode: "forwards" }}
            >
              <Link href="/signup" className="btn-primary px-6 py-2.5 text-sm">
                Start for free
              </Link>
              <Link href="/demo" className="btn-ghost px-6 py-2.5 text-sm">
                View demo →
              </Link>
            </div>

            <p
              className="animate-fade-up animation-delay-300 text-xs text-white/35 mt-1"
              style={{ animationFillMode: "forwards" }}
            >
              No credit card required · Free forever plan available
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 sm:px-6 lg:px-8 pb-28 max-w-5xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="section-heading">One system. Three pillars.</h2>
            <p className="text-white/50 mt-3 max-w-sm mx-auto text-sm">
              No bloat. Every feature earns its place.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {FEATURES.map((feature, i) => (
              <FeatureCard key={feature.id} feature={feature} index={i} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 sm:px-6 lg:px-8 pb-28 max-w-5xl mx-auto w-full">
          <div className="relative overflow-hidden rounded-2xl glass p-10 text-center">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-br from-brand-900/50 via-transparent to-transparent pointer-events-none"
            />
            <div className="relative z-10 flex flex-col items-center gap-5 max-w-md mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Stop planning. Start executing.
              </h2>
              <p className="text-white/55 text-sm leading-relaxed">
                Join people who use Productivity OS as their daily operating
                system — not just another app they open and forget.
              </p>
              <Link href="/signup" className="btn-primary px-7 py-2.5 text-sm">
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

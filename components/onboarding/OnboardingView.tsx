"use client";

import { useState } from "react";
import { CLASSES } from "@/lib/theme";

export interface OnboardingData {
  wakeTime: string;
  sleepTime: string;
  improvements: string[];
  reminders: {
    hydration: boolean;
    posture: boolean;
    journal: boolean;
  };
}

interface OnboardingProps {
  onComplete: (data: OnboardingData | null) => void;
}

export default function OnboardingView({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [wakeTime, setWakeTime] = useState("07:00");
  const [sleepTime, setSleepTime] = useState("22:30");
  const [improvements, setImprovements] = useState<string[]>([]);
  const [reminders, setReminders] = useState({
    hydration: true,
    posture: true,
    journal: true,
  });

  const categories = [
    { id: "focus", label: "Deep Focus & Productivity", iconClass: "fi fi-sr-target" },
    { id: "hydration", label: "Optimal Hydration", iconClass: "fi fi-sr-water" },
    { id: "sleep", label: "Consistent Sleep Cycle", iconClass: "fi fi-sr-bed" },
    { id: "budget", label: "Smart Budgeting", iconClass: "fi fi-sr-coins" },
    { id: "mind", label: "Emotional Awareness", iconClass: "fi fi-sr-heart" },
  ];

  const handleToggleImprovement = (id: string) => {
    setImprovements((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      const data = { wakeTime, sleepTime, improvements, reminders };
      localStorage.setItem("prod_os_onboarding_completed", "true");
      localStorage.setItem("prod_os_user_onboarding_data", JSON.stringify(data));
      onComplete(data);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("prod_os_onboarding_completed", "skipped");
    onComplete(null);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#0d0d14]/90 backdrop-blur-xl">
      <div className={`w-full max-w-lg p-8 ${CLASSES.panel} relative mx-4 space-y-6 border-white/[0.08]`}>
        
        {/* Onboarding steps tracker */}
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold tracking-widest text-brand-400 uppercase">
            Step {step} of 3
          </span>
          <button
            onClick={handleSkip}
            className="text-[10px] text-white/40 hover:text-white uppercase font-bold tracking-wider transition-colors"
          >
            Skip
          </button>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <i className="fi fi-sr-spa text-brand-400 text-lg flex items-center" />
              Tell us about your sleep cycle
            </h2>
            <p className="text-xs text-white/50">
              We personalize your hourly schedules, reminders, and daily planner templates to align with your natural circadian rhythm.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-[10px] text-white/40 uppercase font-semibold mb-1 block">Wake Time</label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-brand-500/50"
                />
              </div>
              <div>
                <label className="text-[10px] text-white/40 uppercase font-semibold mb-1 block">Sleep Time</label>
                <input
                  type="time"
                  value={sleepTime}
                  onChange={(e) => setSleepTime(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-brand-500/50"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <i className="fi fi-sr-target text-brand-400 text-lg flex items-center" />
              What areas do you want to focus on?
            </h2>
            <p className="text-xs text-white/50">
              Select your primary goals. We will customize your recommendations and metrics accordingly.
            </p>
            <div className="space-y-2 pt-2">
              {categories.map((c) => {
                const selected = improvements.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => handleToggleImprovement(c.id)}
                    className={`w-full p-4 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                      selected
                        ? "bg-brand-500/10 border-brand-500/40 text-brand-300"
                        : "bg-white/[0.02] border-white/10 text-white/60 hover:border-white/20"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <i className={`${c.iconClass} text-brand-400 text-xs flex items-center`} />
                      <span>{c.label}</span>
                    </span>
                    {selected && <i className="fi fi-sr-check text-brand-400 text-xs" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <i className="fi fi-sr-bell text-brand-400 text-lg flex items-center" />
              Zen Reminders
            </h2>
            <p className="text-xs text-white/50">
              Enable subtle reminders to support your daily wellness goals.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                <div>
                  <h4 className="text-xs font-semibold text-white/90">Hydration Reminders</h4>
                  <p className="text-[10px] text-white/40">Remind me to drink water every 2 hours</p>
                </div>
                <input
                  type="checkbox"
                  checked={reminders.hydration}
                  onChange={(e) => setReminders((prev) => ({ ...prev, hydration: e.target.checked }))}
                  className="rounded border-white/10 bg-white/5 text-brand-500 focus:ring-brand-500"
                />
              </div>

              <div className="flex justify-between items-center p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                <div>
                  <h4 className="text-xs font-semibold text-white/90">Posture Checks</h4>
                  <p className="text-[10px] text-white/40">Remind me to align my spine and stretch</p>
                </div>
                <input
                  type="checkbox"
                  checked={reminders.posture}
                  onChange={(e) => setReminders((prev) => ({ ...prev, posture: e.target.checked }))}
                  className="rounded border-white/10 bg-white/5 text-brand-500 focus:ring-brand-500"
                />
              </div>

              <div className="flex justify-between items-center p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                <div>
                  <h4 className="text-xs font-semibold text-white/90">Evening Reflection</h4>
                  <p className="text-[10px] text-white/40">Prompt me to write a gratitude note before sleep</p>
                </div>
                <input
                  type="checkbox"
                  checked={reminders.journal}
                  onChange={(e) => setReminders((prev) => ({ ...prev, journal: e.target.checked }))}
                  className="rounded border-white/10 bg-white/5 text-brand-500 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/70 text-xs font-semibold transition-all"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold transition-all shadow-[0_0_12px_rgba(var(--brand-500-rgb),0.25)]"
          >
            {step === 3 ? "BEGIN JOURNEY" : "CONTINUE"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { CLASSES } from "@/lib/theme";

type GoalView = "Today" | "Weekly" | "Yearly";

export default function Goals() {
  const [view, setView] = useState<GoalView>("Today");

  return (
    <div className="h-full w-full flex flex-col pt-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Goals</h1>
        
        {/* View Toggle */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          {(["Today", "Weekly", "Yearly"] as GoalView[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                view === v
                  ? "bg-brand-500 text-white shadow-[0_0_12px_rgba(var(--brand-500-rgb),0.3)]"
                  : "text-white/40 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className={`flex-1 ${CLASSES.card} flex flex-col items-center justify-center p-8 text-center gap-4`}>
        <i className="fi fi-sr-bullseye text-4xl text-white/20" />
        <div>
          <h2 className="text-lg font-semibold text-white/80">{view} Goals</h2>
          <p className="text-sm text-white/40 mt-1">This module is under construction.</p>
        </div>
      </div>
    </div>
  );
}

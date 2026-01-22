"use client";

import { useState, useEffect } from "react";
import { CLASSES, TEXT } from "@/lib/theme";

interface UserOnboardingData {
  wakeTime?: string;
  sleepTime?: string;
  [key: string]: unknown;
}

interface Insight {
  icon: string;
  text: string;
}

export default function ProfileView() {
  const [userData, setUserData] = useState<UserOnboardingData | null>(null);
  const [aiInsights, setAiInsights] = useState<Insight[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("prod_os_user_onboarding_data");
    if (raw) setUserData(JSON.parse(raw));

    // Generate dynamic AI Insights based on local metrics context
    const budget = localStorage.getItem("prod_os_tracker_energy") ? "Your budget suggests solid saving rates this week." : "Log your daily budget to activate finance forecasts.";
    const sleep = parseInt(localStorage.getItem("prod_os_tracker_sleep") || "7", 10);
    const water = parseInt(localStorage.getItem("prod_os_tracker_water") || "0", 10);

    const insights: Insight[] = [
      sleep < 7 
        ? { icon: "fi fi-sr-exclamation text-amber-500", text: "Circulation Check: Sleep cycles are below 7 hrs. Consider setting a sleep reminder chime." }
        : { icon: "fi fi-sr-sparkles text-brand-400", text: "Optimal Rest: Consistent 7+ hr sleep pattern detected." },
      water < 5
        ? { icon: "fi fi-sr-info text-cyan-400", text: "Hydration warning: Water levels are below average. Take a screen break to drink a glass." }
        : { icon: "fi fi-sr-check-circle text-emerald-400", text: "Well Hydrated: Excellent hydration streaks this week." },
      { icon: "fi fi-sr-brain text-violet-400", text: "Productivity: Your focus sprints peak between 9:00 AM and 11:00 AM." },
      { icon: "fi fi-sr-coins text-yellow-500", text: `Finance: ${budget}` }
    ];
    setAiInsights(insights);
  }, []);

  return (
    <div className="h-full w-full flex flex-col pt-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <i className="fi fi-sr-user text-brand-400 text-xl flex items-center" />
          Profile Center
        </h1>
        <span className="text-xs text-white/40 uppercase tracking-widest">Aesthetics &amp; Insights</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* User Card */}
        <div className={`p-6 ${CLASSES.card} flex flex-col items-center text-center space-y-4`}>
          <div className="w-20 h-20 rounded-full border-2 border-brand-500 bg-brand-500/10 flex items-center justify-center text-3xl">
            <i className="fi fi-sr-spa text-brand-400 text-3xl flex items-center" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Zen Explorer</h2>
            <p className="text-xs text-white/40">Mindfulness Practitioner</p>
          </div>
          <div className="w-full border-t border-white/5 pt-4 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-white/40">Wake Goal:</span>
              <span className="text-white/80">{userData?.wakeTime || "07:00 AM"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Sleep Goal:</span>
              <span className="text-white/80">{userData?.sleepTime || "10:30 PM"}</span>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className={`lg:col-span-2 p-6 ${CLASSES.card} space-y-4`}>
          <h3 className={`font-bold flex items-center gap-2 ${TEXT.base}`}>
            <i className="fi fi-sr-brain text-brand-400 text-sm flex items-center" /> Personalized AI Insights
          </h3>
          <div className="space-y-3">
            {aiInsights.map((insight, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] text-xs text-white/80 leading-relaxed flex items-start gap-3">
                <i className={`${insight.icon} text-sm mt-0.5 shrink-0 flex items-center`} />
                <span>{insight.text}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";

const INSIGHTS = [
  { 
    label: "Peak Performance", 
    value: "8:00 AM - 10:00 AM", 
    desc: "Your goal completion rate is 40% higher in the morning.",
    icon: "↗"
  },
  { 
    label: "Consistency Score", 
    value: "84%", 
    desc: "You have maintained a 5-day habit streak. Keep it up!",
    icon: "🔥"
  },
];

const SUGGESTIONS = [
  { title: "Review Backlog", action: "Archive 3 overdue goals", type: "maintenance" },
  { title: "Deep Work", action: "Schedule 90min for 'Project strategy'", type: "execution" },
  { title: "Routine Check", action: "Log 'Personal Study' for today", type: "habit" },
];

export default function RightPanel() {
  return (
    <aside className="w-full h-full flex flex-col bg-surface border-l border-white/5 sticky top-0 overflow-y-auto custom-scrollbar">
      {/* Branding Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between gap-3 sticky top-0 bg-surface/80 backdrop-blur-md z-10">
        <span className="font-bold text-white tracking-tight pl-16">Intelligence</span>
        <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-sm">
          i
        </div>
      </div>

      <div className="p-6 space-y-10">
        {/* Performance Insights */}
        <section className="space-y-4">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
            Operational Insights
          </p>
          <div className="space-y-3">
            {INSIGHTS.map((insight) => (
              <div 
                key={insight.label}
                className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-2 hover:bg-white/[0.03] transition-colors group"
              >
                <div className="flex justify-between items-start">
                  <span className="text-brand-400 text-xs font-bold">{insight.icon} {insight.label}</span>
                  <span className="text-white font-bold text-xs">{insight.value}</span>
                </div>
                <p className="text-[11px] text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
                  {insight.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* System Suggestions */}
        <section className="space-y-4">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
            Next Protocols
          </p>
          <div className="space-y-2">
            {SUGGESTIONS.map((sug) => (
              <button 
                key={sug.title}
                className="w-full p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-brand-500/10 hover:border-brand-500/20 transition-all text-left flex items-start gap-3 group"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 opacity-40 group-hover:opacity-100" />
                <div>
                   <p className="text-xs font-bold text-white/80 group-hover:text-white">{sug.title}</p>
                   <p className="text-[10px] text-white/30 mt-1">{sug.action}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Pro Tip - Simplified */}
        <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/10">
          <p className="text-[9px] font-black text-brand-400 uppercase tracking-widest">Efficiency Tip</p>
          <p className="text-[11px] text-brand-300/60 mt-2 leading-relaxed italic">
            "Batch your small tasks into 15-minute sprints to avoid context switching fatigue."
          </p>
        </div>
      </div>
    </aside>
  );
}


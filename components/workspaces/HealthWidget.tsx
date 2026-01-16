"use client";

import { HEALTH_COLORS, CLASSES, TEXT } from "@/lib/theme";

export default function HealthWidget() {
  return (
    <div className={`w-[300px] ${CLASSES.card} p-6 flex flex-col items-center justify-center h-full relative`}>
      <h3 className={`absolute top-6 left-6 text-xs font-bold uppercase tracking-widest ${TEXT.muted}`}>Health</h3>

      {/* Circular Activity Rings */}
      <div className="relative w-40 h-40 mt-4">
        {/* Outer Ring — Steps */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle cx="80" cy="80" r="70" fill="none" stroke={HEALTH_COLORS.steps} strokeWidth="8"
            strokeDasharray="439.8" strokeDashoffset="100" strokeLinecap="round" />
        </svg>

        {/* Middle Ring — Sleep */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="80" cy="80" r="55" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle cx="80" cy="80" r="55" fill="none" stroke={HEALTH_COLORS.sleep} strokeWidth="8"
            strokeDasharray="345.5" strokeDashoffset="150" strokeLinecap="round" />
        </svg>

        {/* Inner Ring — Screen Time */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="80" cy="80" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle cx="80" cy="80" r="40" fill="none" stroke={HEALTH_COLORS.screen} strokeWidth="8"
            strokeDasharray="251.3" strokeDashoffset="50" strokeLinecap="round" />
        </svg>
      </div>

      <div className="mt-8 grid grid-cols-3 w-full gap-2 text-center">
        <div>
          <div className="font-bold text-sm" style={{ color: HEALTH_COLORS.steps }}>8k</div>
          <div className={`text-[9px] uppercase tracking-wider ${TEXT.muted}`}>Steps</div>
        </div>
        <div>
          <div className="font-bold text-sm" style={{ color: HEALTH_COLORS.sleep }}>6h</div>
          <div className={`text-[9px] uppercase tracking-wider ${TEXT.muted}`}>Sleep</div>
        </div>
        <div>
          <div className="font-bold text-sm" style={{ color: HEALTH_COLORS.screen }}>4h</div>
          <div className={`text-[9px] uppercase tracking-wider ${TEXT.muted}`}>Screen</div>
        </div>
      </div>
    </div>
  );
}

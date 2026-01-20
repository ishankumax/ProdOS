"use client";

import MicroTrackers from "../widgets/MicroTrackers";
import { CLASSES, TEXT } from "@/lib/theme";

export default function WellnessView() {
  return (
    <div className="h-full w-full flex flex-col pt-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">🧘 Wellness Center</h1>
        <span className="text-xs text-white/40 uppercase tracking-widest">Quantitative Health Telemetry</span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <MicroTrackers />

        <div className={`p-6 ${CLASSES.card} space-y-4`}>
          <h3 className={`font-bold ${TEXT.base}`}>Wellness Telemetry Analytics</h3>
          <div className="h-48 rounded-xl bg-white/[0.01] border border-white/5 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-brand-500/5 to-transparent pointer-events-none" />
            {/* Mock chart layout lines */}
            <div className="w-full h-full flex flex-col justify-between p-4 text-[9px] font-mono text-white/20">
              <div className="border-b border-white/5 w-full pb-1 text-right">OPTIMAL</div>
              <div className="border-b border-white/5 w-full pb-1 text-right">BALANCED</div>
              <div className="w-full text-right">REST NEEDED</div>
            </div>
            <div className="absolute text-xs text-white/30 italic flex flex-col items-center gap-1">
              <i className="fi fi-sr-chart-line text-lg" />
              <span>Interactive weekly and monthly health patterns will update here.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

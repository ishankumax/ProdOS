"use client";

export default function HealthWidget() {
  return (
    <div className="w-[300px] bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center h-full relative">
      <h3 className="absolute top-6 left-6 text-xs font-bold text-white/40 uppercase tracking-widest">Health</h3>
      
      {/* Mock Circular Visualization */}
      <div className="relative w-40 h-40 mt-4">
        {/* Outer Ring - Steps */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle cx="80" cy="80" r="70" fill="none" stroke="#3b82f6" strokeWidth="8" strokeDasharray="439.8" strokeDashoffset="100" strokeLinecap="round" />
        </svg>
        
        {/* Middle Ring - Sleep */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="80" cy="80" r="55" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle cx="80" cy="80" r="55" fill="none" stroke="#8b5cf6" strokeWidth="8" strokeDasharray="345.5" strokeDashoffset="150" strokeLinecap="round" />
        </svg>

        {/* Inner Ring - Screen Time */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="80" cy="80" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle cx="80" cy="80" r="40" fill="none" stroke="#ef4444" strokeWidth="8" strokeDasharray="251.3" strokeDashoffset="50" strokeLinecap="round" />
        </svg>
      </div>

      <div className="mt-8 grid grid-cols-3 w-full gap-2 text-center">
        <div>
          <div className="text-blue-500 font-bold text-sm">8k</div>
          <div className="text-[9px] text-white/40 uppercase tracking-wider">Steps</div>
        </div>
        <div>
          <div className="text-purple-500 font-bold text-sm">6h</div>
          <div className="text-[9px] text-white/40 uppercase tracking-wider">Sleep</div>
        </div>
        <div>
          <div className="text-red-500 font-bold text-sm">4h</div>
          <div className="text-[9px] text-white/40 uppercase tracking-wider">Screen</div>
        </div>
      </div>
    </div>
  );
}

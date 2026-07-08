"use client";

import { useState, useEffect } from "react";

export default function RightPanel() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <aside className="w-64 border-l border-white/5 h-full p-6 bg-[#0d0d14] flex flex-col">
      <div className="mb-8">
        <h2 className="text-4xl font-light tracking-tight">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h2>
        <p className="text-sm font-medium text-white/40 mt-1">
          {time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-xs font-bold tracking-widest text-white/20 uppercase mb-3 flex items-center">
          <i className="fi fi-sr-globe mr-2 text-[10px]"></i> World Clocks
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/60">SFO</span>
            <span className="font-mono">{new Date(time.getTime() - 12.5*60*60*1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/60">LON</span>
            <span className="font-mono">{new Date(time.getTime() - 4.5*60*60*1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold tracking-widest text-white/20 uppercase mb-3 flex items-center">
          <i className="fi fi-sr-calendar mr-2 text-[10px]"></i> Today&apos;s Agenda
        </h3>
        <div className="p-3 bg-white/5 rounded text-sm text-white/60 text-center italic">
          No events synced
        </div>
        <button className="w-full mt-3 py-2 border border-white/10 rounded text-xs text-white/40 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-1.5">
          <i className="fi fi-sr-calendar-plus text-[10px]"></i> Connect Google Calendar
        </button>
      </div>
    </aside>
  );
}

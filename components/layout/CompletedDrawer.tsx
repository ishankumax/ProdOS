"use client";

import { useState } from "react";

export default function CompletedDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`fixed left-0 top-16 bottom-0 z-20 bg-[#0d0d14] border-r border-white/10 transition-transform duration-300 ${isOpen ? "translate-x-0 w-80" : "-translate-x-full w-80"}`}>
      {/* Handle to open/close */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-8 top-1/2 -translate-y-1/2 w-8 h-24 bg-white/5 border border-l-0 border-white/10 rounded-r-xl flex items-center justify-center text-white/40 hover:text-white"
      >
        {isOpen ? "◀" : "▶"}
      </button>

      <div className="p-6 h-full flex flex-col">
        <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Completed ⇔ Left</h3>
        
        <div className="flex-1 overflow-auto space-y-3">
          <div className="p-3 bg-white/5 rounded line-through text-white/40 text-sm">Review PRs for frontend</div>
          <div className="p-3 bg-white/5 rounded line-through text-white/40 text-sm">Read 10 pages</div>
          <div className="p-3 bg-white/5 rounded line-through text-white/40 text-sm">Gym workout</div>
        </div>
        
        <div className="pt-4 border-t border-white/5 text-center">
          <button className="text-xs text-blue-400 hover:text-blue-300">View History (Reset Sun)</button>
        </div>
      </div>
    </div>
  );
}

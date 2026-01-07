"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CONTEXTS } from "@/lib/constants";

export default function ContextSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState("personal");

  const activeContext = CONTEXTS.find((c) => c.id === activeId) || CONTEXTS[0]!;

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col items-end">
      {/* Pill Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 h-10 rounded-full border backdrop-blur-md bg-surface-raised/80 border-white/10 hover:border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all active:scale-98 text-left group"
      >
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500 shrink-0"></span>
        </span>
        
        <span className="text-xs font-mono font-bold text-white/90 uppercase tracking-wider flex items-center gap-1.5">
          <span className="opacity-60">{activeContext.icon}</span>
          <span>{activeContext.label}</span>
        </span>

        <span className={cn(
          "text-[9px] text-white/45 transition-transform duration-250 select-none font-mono",
          isOpen ? "rotate-180" : ""
        )}>
          ▼
        </span>
      </button>

      {/* Dropdown Options Container */}
      {isOpen && (
        <div className="mt-2 w-72 rounded-xl border backdrop-blur-md bg-surface-overlay/95 border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] overflow-hidden">
          <div className="p-1.5 flex flex-col gap-1">
            <div className="px-2.5 py-1.5 text-[9px] font-bold font-mono tracking-widest text-white/35 uppercase border-b border-white/5 mb-1">
              Select Context
            </div>
            
            {CONTEXTS.map((item) => {
              const isSelected = item.id === activeId;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveId(item.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-all duration-150 group",
                    isSelected
                      ? "bg-brand-500/10 border border-brand-500/20 text-brand-400"
                      : "border border-transparent text-white/60 hover:text-white hover:bg-white/[0.03]"
                  )}
                >
                  <span className={cn(
                    "text-base mt-0.5 shrink-0 transition-opacity",
                    isSelected ? "text-brand-400 opacity-100" : "text-white/40 group-hover:opacity-100"
                  )}>
                    {item.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold font-mono tracking-tight text-white/90 group-hover:text-white">
                      {item.label}
                    </div>
                    <div className="text-[10px] font-mono text-white/40 leading-normal mt-0.5 group-hover:text-white/50 truncate">
                      {item.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

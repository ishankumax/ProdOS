"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { getDomains } from "@/features/domains/queries/getDomains";
import { setActiveDomain } from "@/features/domains/actions/setActiveDomain";
import { Domain } from "@/types/domain";

export default function ContextSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState("");
  
  const containerRef = useRef<HTMLDivElement>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchDomains = async () => {
    try {
      const data = await getDomains();
      setDomains(data || []);
    } catch (err) {
      console.error("Failed to load domains in context switcher:", err);
    }
  };

  useEffect(() => {
    fetchDomains();

    // Read active domain cookie on mount
    const match = document.cookie.match(/v2_active_domain_id=([^;]+)/);
    setActiveId(match ? match[1] : null);

    // Listen to changes in focus domains or switcher context
    const handleContextChange = (e: CustomEvent<string | null>) => {
      setActiveId(e.detail);
    };

    window.addEventListener("domain-change", fetchDomains);
    window.addEventListener("context-change", handleContextChange as EventListener);
    
    return () => {
      window.removeEventListener("domain-change", fetchDomains);
      window.removeEventListener("context-change", handleContextChange as EventListener);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // Sync toast helper
  useEffect(() => {
    if (toast) {
      setToastMsg(toast);
    }
  }, [toast]);

  // Click outside to close handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const changeContext = async (id: string | null) => {
    setActiveId(id);
    await setActiveDomain(id);
    setIsOpen(false);

    // Notify other components
    window.dispatchEvent(new CustomEvent("context-change", { detail: id }));

    // Trigger toast notification
    const label = id ? domains.find(d => d.id === id)?.name || "Focus Domain" : "Global View";
    setToast(label);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const activeDomain = activeId ? domains.find((d) => d.id === activeId) : null;
  const activeLabel = activeDomain ? activeDomain.name : "Global View";
  const activeColor = activeDomain ? activeDomain.colorHex : "#10B981";

  return (
    <>
      <div ref={containerRef} className="fixed top-6 right-6 z-50 flex flex-col items-end">
        {/* Pill Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-4 h-10 rounded-full border backdrop-blur-md bg-surface-raised/80 border-white/10 hover:border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all active:scale-98 text-left group"
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: activeColor }}
            />
            <span
              className="relative inline-flex rounded-full h-2 w-2 shrink-0"
              style={{ backgroundColor: activeColor }}
            />
          </span>
          
          <span className="text-xs font-mono font-bold text-white/90 uppercase tracking-wider flex items-center gap-1.5">
            <span className="opacity-60">⌬</span>
            <span>{activeLabel}</span>
          </span>
 
          <span className={cn(
            "text-[9px] text-white/45 transition-transform duration-300 select-none font-mono",
            isOpen ? "rotate-180" : ""
          )}>
            ▼
          </span>
        </button>

        {/* Dropdown Options Container */}
        <div className={cn(
          "mt-2 w-72 rounded-xl border backdrop-blur-md bg-surface-overlay/95 border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-300 ease-out origin-top-right",
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        )}>
          <div className="p-1.5 flex flex-col gap-1">
            <div className="px-2.5 py-1.5 text-[9px] font-bold font-mono tracking-widest text-white/35 uppercase border-b border-white/5 mb-1">
              Select Context
            </div>
            
            {/* 1. Global View Item */}
            <button
              onClick={() => changeContext(null)}
              className={cn(
                "w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-all duration-150 group",
                activeId === null
                  ? "bg-brand-500/10 border border-brand-500/20 text-brand-400"
                  : "border border-transparent text-white/60 hover:text-white hover:bg-white/[0.03]"
              )}
            >
              <span className="text-base mt-0.5 shrink-0 opacity-100">⊞</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold font-mono tracking-tight text-white/90 group-hover:text-white">
                  Global View
                </div>
                <div className="text-[10px] font-mono text-white/40 leading-normal mt-0.5 group-hover:text-white/50 truncate">
                  All focus areas & strategy.
                </div>
              </div>
            </button>

            {/* 2. List of Focus Domains */}
            {domains.map((item) => {
              const isSelected = item.id === activeId;
              return (
                <button
                  key={item.id}
                  onClick={() => changeContext(item.id)}
                  className={cn(
                    "w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-all duration-150 group",
                    isSelected
                      ? "bg-brand-500/10 border border-brand-500/20 text-brand-400"
                      : "border border-transparent text-white/60 hover:text-white hover:bg-white/[0.03]"
                  )}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full mt-1.5 shrink-0 opacity-100"
                    style={{ backgroundColor: item.colorHex }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold font-mono tracking-tight text-white/90 group-hover:text-white">
                      {item.name}
                    </div>
                    <div className="text-[10px] font-mono text-white/40 leading-normal mt-0.5 group-hover:text-white/50 truncate">
                      {item.description || `${item.priority} priority focus area`}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Terminal Command Toast Notification */}
      <div className={cn(
        "fixed bottom-6 left-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border backdrop-blur-md bg-surface-overlay/90 border-brand-500/20 text-brand-400 font-mono text-xs shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 ease-out",
        toast
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-2 pointer-events-none"
      )}>
        <span className="relative flex h-2 w-2 shrink-0">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: activeColor }}
          />
          <span
            className="relative inline-flex rounded-full h-2 w-2 shrink-0"
            style={{ backgroundColor: activeColor }}
          />
        </span>
        <span>[System Sync]: Switched to {toastMsg}</span>
      </div>
    </>
  );
}

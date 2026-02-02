"use client";

import { cn } from "@/lib/utils";

export default function FloatingThemeSelector() {
  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center h-12 overflow-hidden cursor-default select-none rounded-full border backdrop-blur-md",
        "bg-surface-raised/80 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
        "w-12"
      )}
    >
      {/* Trigger Dot / Icon */}
      <div className="absolute right-0 top-0 w-12 h-12 flex items-center justify-center cursor-pointer pointer-events-none text-white/60">
        <span className="text-base font-mono leading-none text-white/40">
          ❖
        </span>
      </div>
    </div>
  );
}

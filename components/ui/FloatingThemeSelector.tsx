"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export default function FloatingThemeSelector() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center h-12 overflow-hidden cursor-default select-none transition-all duration-500 ease-out rounded-full border backdrop-blur-md",
        "bg-surface-raised/80 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
        "hover:border-brand-500/30",
        isHovered ? "w-[300px]" : "w-12"
      )}
    >
      {/* Theme selection container */}
      <div
        className={cn(
          "flex items-center gap-1.5 pl-4 pr-12 transition-all duration-300 w-full justify-between",
          isHovered ? "opacity-100 pointer-events-auto delay-100" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Themes will render here */}
      </div>

      {/* Trigger Dot / Icon */}
      <div className="absolute right-0 top-0 w-12 h-12 flex items-center justify-center cursor-pointer pointer-events-none text-white/60">
        <span className="text-base font-mono leading-none text-white/40">
          ❖
        </span>
      </div>
    </div>
  );
}

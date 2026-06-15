"use client";

import React from "react";
import { useEditMode } from "@/providers/edit-mode-provider";
import FloatingThemeSelector from "@/components/ui/FloatingThemeSelector";
import { cn } from "@/lib/utils";

export default function ControlCenter() {
  const { mode, toggleMode } = useEditMode();
  const isEditMode = mode === "configuration";

  return (
    <div className="fixed bottom-6 right-20 z-50 flex items-center gap-3">
      {/* Edit Mode Toggle Switch */}
      <button
        onClick={toggleMode}
        className={cn(
          "h-12 px-5 rounded-full border backdrop-blur-md transition-all duration-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)] active:scale-95",
          isEditMode
            ? "bg-brand-500 text-white border-brand-500/30 shadow-[0_0_12px_rgba(var(--brand-500-rgb),0.2)] hover:bg-brand-400"
            : "bg-surface-raised/80 border-white/10 text-white/60 hover:text-white hover:bg-white/5"
        )}
      >
        <span className={cn("w-1.5 h-1.5 rounded-full", isEditMode ? "bg-white animate-ping" : "bg-white/30")} />
        EDIT: {isEditMode ? "ON" : "OFF"}
      </button>

      {/* Floating Theme Selector is imported separately and rendered by Dashboard/Layout, 
          but we render it inside ControlCenter container or let it float independently. 
          Since FloatingThemeSelector is fixed at bottom-6 right-6, it aligns perfectly 
          next to this ControlCenter (which is fixed at right-20)! */}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import BottomNavbar, { WorkspaceType } from "./BottomNavbar";
import Header from "./Header";
import GoalsRail from "./GoalsRail";
import CompletedDrawer from "./CompletedDrawer";
import { useEditMode } from "@/contexts/EditModeContext";

interface ShellProps {
  children: React.ReactNode;
  activeWorkspace: WorkspaceType;
  onWorkspaceChange: (w: WorkspaceType) => void;
}

export default function Shell({ children, activeWorkspace, onWorkspaceChange }: ShellProps) {
  const { isEditing, toggleEdit } = useEditMode();
  const [toast, setToast] = useState<{ message: string; type: "on" | "off" } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Show toast whenever isEditing changes (skip very first mount render)
  useEffect(() => {
    if (!isMounted) { setIsMounted(true); return; }
    setToast({ message: isEditing ? "Edit Mode ON" : "Edit Mode OFF", type: isEditing ? "on" : "off" });
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  return (
    <div className="flex h-screen bg-[#0d0d14] text-white overflow-hidden relative">

      {/* Toast Notification */}
      <div
        className={`absolute top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2.5 px-4 py-2.5 rounded-full border backdrop-blur-md shadow-2xl transition-all duration-300 pointer-events-none select-none ${
          toast
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-2 scale-95"
        } ${
          toast?.type === "on"
            ? "bg-blue-500/20 border-blue-500/40 text-blue-300"
            : "bg-white/8 border-white/15 text-white/60"
        }`}
      >
        <i className={`${toast?.type === "on" ? "fi fi-sr-pencil" : "fi fi-sr-check"} text-xs flex items-center`}></i>
        <span className="text-xs font-semibold tracking-wide">{toast?.message ?? "Edit Mode OFF"}</span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* 1. Header (Shared) */}
        <Header activeWorkspace={activeWorkspace} />

        {/* Workspace Content Layer */}
        <div className="flex-1 flex overflow-hidden relative pb-24">
          <GoalsRail />
          <CompletedDrawer />
          
          <main className="flex-1 overflow-auto p-8 relative">
            {children}
          </main>
        </div>

        {/* 2. Floating Bottom Navbar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
          <BottomNavbar activeWorkspace={activeWorkspace} onWorkspaceChange={onWorkspaceChange} />
        </div>

        {/* 3. Floating Bottom-Right Controls */}
        <div className="absolute bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          {/* Edit Mode Toggle */}
          <button
            onClick={toggleEdit}
            title={isEditing ? "Exit Edit Mode" : "Edit Mode"}
            className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border backdrop-blur-md ${
              isEditing
                ? "bg-blue-500 border-blue-400 text-white shadow-blue-500/40 scale-110"
                : "bg-white/8 border-white/15 text-white/60 hover:text-white hover:bg-white/15 hover:border-white/30"
            }`}
          >
            <i className={`${isEditing ? "fi fi-sr-check" : "fi fi-sr-pencil"} text-sm flex items-center`}></i>
          </button>

          {/* Context Action Button (calculator / timer) */}
          <button
            className="w-11 h-11 bg-white/8 hover:bg-white/15 border border-white/15 hover:border-white/30 rounded-full flex items-center justify-center shadow-lg transition-all backdrop-blur-md text-white/60 hover:text-white"
            title={activeWorkspace === "Financial Dashboard" ? "Calculator" : "Pomodoro Timer"}
          >
            {activeWorkspace === "Financial Dashboard" ? (
              <i className="fi fi-sr-calculator text-sm text-inherit flex items-center"></i>
            ) : (
              <i className="fi fi-sr-clock text-sm text-inherit flex items-center"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

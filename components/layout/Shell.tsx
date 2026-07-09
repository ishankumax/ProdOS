"use client";

import { useEffect, useRef, useState } from "react";
import BottomNavbar, { WorkspaceType } from "./BottomNavbar";
import Header from "./Header";
import GoalsRail from "./GoalsRail";
import CompletedDrawer from "./CompletedDrawer";
import CalendarOverlay from "./CalendarOverlay";
import { useEditMode } from "@/contexts/EditModeContext";
import { ICONS, CLASSES, SURFACE, TRANSITION } from "@/lib/theme";

interface ShellProps {
  children: React.ReactNode;
  activeWorkspace: WorkspaceType;
  onWorkspaceChange: (w: WorkspaceType) => void;
}

export default function Shell({ children, activeWorkspace, onWorkspaceChange }: ShellProps) {
  const { isEditing, toggleEdit } = useEditMode();
  const [toast, setToast] = useState<{ message: string; type: "on" | "off" } | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const calBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isMounted) { setIsMounted(true); return; }
    setToast({ message: isEditing ? "Edit Mode ON" : "Edit Mode OFF", type: isEditing ? "on" : "off" });
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  return (
    <div className={`flex h-screen text-white overflow-hidden relative ${SURFACE.tw.base}`}>

      {/* ── Toast Notification ────────────────────────────────────── */}
      <div
        className={`absolute top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2.5 px-4 py-2.5 rounded-full border backdrop-blur-md shadow-2xl ${TRANSITION.panel} pointer-events-none select-none ${
          toast ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-95"
        } ${
          toast?.type === "on"
            ? "bg-brand-500/20 border-brand-500/40 text-brand-300"
            : "bg-white/8 border-white/15 text-white/60"
        }`}
      >
        <i className={`${toast?.type === "on" ? ICONS.edit : ICONS.check} text-xs flex items-center`} />
        <span className="text-xs font-semibold tracking-wide">{toast?.message ?? "Edit Mode OFF"}</span>
      </div>

      {/* ── Main Content Area ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Header activeWorkspace={activeWorkspace} />

        <div className="flex-1 flex overflow-hidden relative pb-24">
          <GoalsRail />
          <CompletedDrawer />
          <main className="flex-1 overflow-auto p-8 relative">
            {children}
          </main>
        </div>

        {/* ── Floating Bottom Navbar ────────────────────────────── */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
          <BottomNavbar activeWorkspace={activeWorkspace} onWorkspaceChange={onWorkspaceChange} />
        </div>

        {/* ── Floating Bottom-Right Controls ────────────────────── */}
        <div className="absolute bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          {/* Edit Mode Toggle */}
          <button
            onClick={toggleEdit}
            title={isEditing ? "Exit Edit Mode" : "Edit Mode"}
            className={`${CLASSES.floatBtn} ${
              isEditing
                ? "!bg-brand-500 !border-brand-400 !text-white shadow-[0_0_24px_var(--accent-shadow)] scale-110"
                : ""
            }`}
          >
            <i className={`${isEditing ? ICONS.check : ICONS.edit} text-sm flex items-center`} />
          </button>

          {/* Calendar Toggle */}
          <button
            ref={calBtnRef}
            onClick={() => setCalOpen(o => !o)}
            title="Calendar"
            className={`${CLASSES.floatBtn} ${
              calOpen
                ? "!bg-brand-500 !border-brand-400 !text-white shadow-[0_0_24px_var(--accent-shadow)] scale-110"
                : ""
            }`}
          >
            <i className={`${ICONS.calendar} text-sm flex items-center`} />
          </button>

          {/* Context Action Button */}
          <button
            className={CLASSES.floatBtn}
            title={activeWorkspace === "Financial Dashboard" ? "Calculator" : "Pomodoro Timer"}
          >
            <i className={`${activeWorkspace === "Financial Dashboard" ? ICONS.calculator : ICONS.timer} text-sm flex items-center`} />
          </button>
        </div>

        {/* ── Calendar Overlay ──────────────────────────────────── */}
        <CalendarOverlay isOpen={calOpen} onClose={() => setCalOpen(false)} />
      </div>
    </div>
  );
}

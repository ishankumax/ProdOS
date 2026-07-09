"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNavbar, { WorkspaceType } from "./BottomNavbar";
import Header from "./Header";
import GoalsRail from "./GoalsRail";
import CompletedDrawer from "./CompletedDrawer";
import CalendarOverlay from "./CalendarOverlay";
import { useEditMode } from "@/contexts/EditModeContext";
import { ICONS, CLASSES, SURFACE, TRANSITION } from "@/lib/theme";
import { GENIE_TOAST, GENIE_TOAST_TRANSITION, WORKSPACE_ENTER, WORKSPACE_EXIT, WORKSPACE_TRANSITION, pressAnimation } from "@/lib/motion";

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
      <AnimatePresence>
        {toast && (
          <motion.div
            key="shell-toast"
            variants={GENIE_TOAST}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={GENIE_TOAST_TRANSITION}
            className={`absolute top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2.5 px-4 py-2.5 rounded-full border backdrop-blur-md shadow-2xl pointer-events-none select-none ${
              toast.type === "on"
                ? "bg-brand-500/20 border-brand-500/40 text-brand-300"
                : "bg-white/8 border-white/15 text-white/60"
            }`}
          >
            <i className={`${toast.type === "on" ? ICONS.edit : ICONS.check} text-xs flex items-center`} />
            <span className="text-xs font-semibold tracking-wide">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content Area ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Header activeWorkspace={activeWorkspace} />

        <div className="flex-1 flex overflow-hidden relative pb-24">
          <GoalsRail />
          <CompletedDrawer />
          <main className="flex-1 overflow-auto p-8 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeWorkspace}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: WORKSPACE_EXIT.hidden,
                  visible: WORKSPACE_ENTER.visible,
                }}
                transition={WORKSPACE_TRANSITION}
                className="w-full h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* ── Floating Bottom Navbar ────────────────────────────── */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
          <BottomNavbar activeWorkspace={activeWorkspace} onWorkspaceChange={onWorkspaceChange} />
        </div>

        {/* ── Floating Bottom-Right Controls ────────────────────── */}
        <div className="absolute bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          {/* Edit Mode Toggle */}
          <motion.button
            onClick={toggleEdit}
            whileTap={pressAnimation}
            title={isEditing ? "Exit Edit Mode" : "Edit Mode"}
            className={`${CLASSES.floatBtn} ${
              isEditing
                ? "!bg-brand-500 !border-brand-400 !text-white shadow-[0_0_24px_var(--accent-shadow)] scale-110"
                : ""
            }`}
          >
            <i className={`${isEditing ? ICONS.check : ICONS.edit} text-sm flex items-center`} />
          </motion.button>

          {/* Calendar Toggle */}
          <motion.button
            ref={calBtnRef}
            onClick={() => setCalOpen(o => !o)}
            whileTap={pressAnimation}
            title="Calendar"
            className={`${CLASSES.floatBtn} ${
              calOpen
                ? "!bg-brand-500 !border-brand-400 !text-white shadow-[0_0_24px_var(--accent-shadow)] scale-110"
                : ""
            }`}
          >
            <i className={`${ICONS.calendar} text-sm flex items-center`} />
          </motion.button>

          {/* Context Action Button */}
          <motion.button
            whileTap={pressAnimation}
            className={CLASSES.floatBtn}
            title={activeWorkspace === "Financial Dashboard" ? "Calculator" : "Pomodoro Timer"}
          >
            <i className={`${activeWorkspace === "Financial Dashboard" ? ICONS.calculator : ICONS.timer} text-sm flex items-center`} />
          </motion.button>
        </div>

        {/* ── Calendar Overlay ──────────────────────────────────── */}
        <CalendarOverlay isOpen={calOpen} onClose={() => setCalOpen(false)} />
      </div>
    </div>
  );
}

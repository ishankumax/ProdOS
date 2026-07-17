"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNavbar, { WorkspaceType } from "./BottomNavbar";
import Header from "./Header";
import GoalsRail from "./GoalsRail";
import CompletedDrawer from "./CompletedDrawer";
import CalendarOverlay from "./CalendarOverlay";
import NotesOverlay from "./NotesOverlay";
import StatusBar from "./StatusBar";
import SettingsView from "../settings/SettingsView";
import { useEditMode } from "@/contexts/EditModeContext";
import { ICONS, SURFACE } from "@/lib/theme";
import { GENIE_TOAST, GENIE_TOAST_TRANSITION, WORKSPACE_ENTER, WORKSPACE_EXIT, WORKSPACE_TRANSITION } from "@/lib/motion";

interface ShellProps {
  children: React.ReactNode;
  activeWorkspace: WorkspaceType;
  onWorkspaceChange: (w: WorkspaceType) => void;
  onCalendarDateSelect?: (dateKey: string) => void;
}

export default function Shell({ children, activeWorkspace, onWorkspaceChange, onCalendarDateSelect }: ShellProps) {
  const { isEditing } = useEditMode();
  const [toast, setToast] = useState<{ message: string; type: "on" | "off" } | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const calBtnRef = useRef<HTMLButtonElement>(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const notesBtnRef = useRef<HTMLButtonElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

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
        {activeWorkspace.toLowerCase() !== "journal" && <Header activeWorkspace={activeWorkspace} />}

        <div className={`flex-1 flex overflow-hidden relative ${activeWorkspace.toLowerCase() === "journal" ? "pb-0" : "pb-32"}`}>
          {activeWorkspace.toLowerCase() !== "journal" && <GoalsRail />}
          {activeWorkspace.toLowerCase() !== "journal" && <CompletedDrawer />}
          <main className={`flex-1 overflow-auto relative ${activeWorkspace.toLowerCase() === "journal" ? "px-0 py-4 pb-28" : "p-8"}`}>
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
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50">
          <BottomNavbar activeWorkspace={activeWorkspace} onWorkspaceChange={onWorkspaceChange} onSettingsOpen={() => setSettingsOpen(true)} />
        </div>

        {/* ── Fixed Bottom Strip (Status Bar) ──────────────────────── */}
        <StatusBar
          activeWorkspace={activeWorkspace}
          calOpen={calOpen}
          setCalOpen={setCalOpen}
          calBtnRef={calBtnRef}
          notesOpen={notesOpen}
          setNotesOpen={setNotesOpen}
          notesBtnRef={notesBtnRef}
          onSettingsOpen={() => setSettingsOpen(true)}
        />

        {/* ── Overlays ────────────────────────────────────────────── */}
        <CalendarOverlay isOpen={calOpen} onClose={() => setCalOpen(false)} onDateSelect={onCalendarDateSelect} />
        <NotesOverlay isOpen={notesOpen} onClose={() => setNotesOpen(false)} />
        <SettingsView isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </div>
  );
}

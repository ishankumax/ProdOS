"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/components/providers/DataProvider";
import { useEditMode } from "@/contexts/EditModeContext";
import { ICONS } from "@/lib/theme";
import { SPRING_BOUNCE, pressAnimation } from "@/lib/motion";

export type WorkspaceType = string;

interface BottomNavbarProps {
  activeWorkspace: WorkspaceType;
  onWorkspaceChange: (w: WorkspaceType) => void;
}

const AVAILABLE_ICONS = [
  { name: "Home", class: "fi fi-sr-home" },
  { name: "Laptop", class: "fi fi-sr-laptop" },
  { name: "Finance", class: "fi fi-sr-chart-histogram" },
  { name: "Box", class: "fi fi-sr-box" },
  { name: "Health", class: "fi fi-sr-heart" },
  { name: "Target", class: "fi fi-sr-target" },
  { name: "Book", class: "fi fi-sr-book" },
  { name: "Bookmark", class: "fi fi-sr-bookmark" },
  { name: "Timer", class: "fi fi-sr-stopwatch" },
  { name: "Notes", class: "fi fi-sr-document" },
  { name: "Wallet", class: "fi fi-sr-wallet" },
  { name: "Star", class: "fi fi-sr-star" },
  { name: "Users", class: "fi fi-sr-users" },
  { name: "Globe", class: "fi fi-sr-globe" },
];

export default function BottomNavbar({ activeWorkspace, onWorkspaceChange }: BottomNavbarProps) {
  const { workspaces, addWorkspace } = useData();
  const { isEditing } = useEditMode();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("fi fi-sr-home");
  const [error, setError] = useState("");

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newWorkspaceName.trim();
    if (!trimmed) {
      setError("Name cannot be empty");
      return;
    }

    if (workspaces.some((w) => w.name.toLowerCase() === trimmed.toLowerCase())) {
      setError("Workspace already exists");
      return;
    }

    addWorkspace(trimmed, selectedIcon);
    onWorkspaceChange(trimmed);
    setNewWorkspaceName("");
    setSelectedIcon("fi fi-sr-home");
    setError("");
    setShowAddModal(false);
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {showAddModal && (
          <>
            <div
              className="fixed inset-0 z-40 cursor-default"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 bg-[#0d0d1a]/95 border border-white/[0.09] rounded-2xl backdrop-blur-xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-50"
            >
              <form onSubmit={handleCreateWorkspace} className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">New Workspace</span>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    <i className={`${ICONS.close} text-[10px]`} />
                  </button>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Workspace Name..."
                    value={newWorkspaceName}
                    onChange={(e) => {
                      setNewWorkspaceName(e.target.value);
                      if (error) setError("");
                    }}
                    className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-brand-500/50 rounded-xl px-3 py-2 text-xs text-white placeholder-white/20 outline-none transition-all"
                    autoFocus
                  />
                  {error && <p className="text-[10px] text-red-400 mt-1">{error}</p>}
                </div>

                <div>
                  <span className="text-[9px] font-bold text-white/35 uppercase tracking-wider block mb-2">Select Icon</span>
                  <div className="grid grid-cols-5 gap-2 max-h-36 overflow-y-auto pr-1">
                    {AVAILABLE_ICONS.map((icon) => {
                      const isIconSelected = selectedIcon === icon.class;
                      return (
                        <button
                          key={icon.name}
                          type="button"
                          onClick={() => setSelectedIcon(icon.class)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm transition-all ${
                            isIconSelected
                              ? "bg-brand-500 text-white shadow-[0_0_12px_rgba(var(--brand-500-rgb),0.4)]"
                              : "bg-white/[0.02] border border-white/[0.05] text-white/40 hover:text-white hover:bg-white/[0.06]"
                          }`}
                        >
                          <i className={icon.class} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/60 hover:text-white text-xs font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold transition-all shadow-[0_0_12px_rgba(var(--brand-500-rgb),0.25)]"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.div
        layout
        className="group flex items-center gap-1 p-1.5 bg-[#0d0d14]/85 border border-white/[0.09] rounded-full backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300"
      >
        {workspaces.map((ws) => {
          const isActive = activeWorkspace === ws.name;
          return (
            <motion.button
              key={ws.name}
              layout
              onClick={() => onWorkspaceChange(ws.name)}
              whileTap={pressAnimation}
              title={ws.name}
              className={`relative flex items-center gap-0 group-hover:gap-2 h-9 rounded-full px-2.5 transition-all duration-300 ease-in-out overflow-hidden z-10 ${
                isActive
                  ? "text-white"
                  : "text-white/40 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="navbarActiveBg"
                  className="absolute inset-0 bg-brand-500 shadow-md shadow-[var(--accent-shadow)] z-[-1] rounded-full"
                  transition={SPRING_BOUNCE}
                />
              )}
              <i className={`${ws.iconClass} text-sm flex items-center flex-shrink-0`} />
              <span className="text-xs font-medium whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-[120px] opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                {ws.name}
              </span>
            </motion.button>
          );
        })}

        {isEditing && (
          <>
            <motion.div
              layout
              className="w-px h-5 bg-white/[0.09] mx-0.5 flex-shrink-0"
            />

            <motion.button
              layout
              onClick={() => setShowAddModal(true)}
              whileTap={pressAnimation}
              title="New Workspace"
              className="flex items-center gap-0 group-hover:gap-2 h-9 rounded-full px-2.5 border border-dashed border-white/20 text-white/30 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all duration-300 ease-in-out overflow-hidden"
            >
              <i className={`${ICONS.add} flex items-center text-xs flex-shrink-0`} />
              <span className="text-xs font-medium whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-[48px] opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                New
              </span>
            </motion.button>
          </>
        )}
      </motion.div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/components/providers/DataProvider";
import { ICONS, CLASSES, LAYOUT } from "@/lib/theme";
import { GENIE_PANEL_VARIANTS, GENIE_PANEL_TRANSITION } from "@/lib/motion";

const PANEL_TOP    = LAYOUT.headerH + LAYOUT.margin;
const PANEL_BOTTOM = LAYOUT.margin + 40;
const PANEL_RIGHT  = LAYOUT.margin;
const PANEL_WIDTH  = 288;

export default function NotesOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { workspaces } = useData();
  const [selectedContext, setSelectedContext] = useState("Personal Life");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [showContextMenu, setShowContextMenu] = useState(false);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("prod_os_notes");
    if (saved) {
      try { setNotes(JSON.parse(saved)); } catch {}
    }
  }, []);

  // Close context menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setShowContextMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNoteChange = (text: string) => {
    const updated = { ...notes, [selectedContext]: text };
    setNotes(updated);
    localStorage.setItem("prod_os_notes", JSON.stringify(updated));
  };

  const activeWs = workspaces.find(w => w.name === selectedContext);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="notes-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[149]"
            onMouseDown={onClose}
          />

          <motion.div
            ref={panelRef}
            key="notes-panel"
            variants={GENIE_PANEL_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={GENIE_PANEL_TRANSITION}
            style={{
              position:        "fixed",
              top:             PANEL_TOP,
              bottom:          PANEL_BOTTOM,
              right:           PANEL_RIGHT,
              width:           PANEL_WIDTH,
              zIndex:          150,
              transformOrigin: "bottom right",
            }}
            className={`flex flex-col overflow-hidden ${CLASSES.panel}`}
            onMouseDown={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 pt-3 pb-2 border-b border-white/[0.06]">
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Quick Notes</span>
              <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
                <i className={`${ICONS.close} text-[8px]`} />
              </button>
            </div>

            {/* Textarea */}
            <div className="flex-1 px-4 pt-3 pb-2 min-h-0">
              <textarea
                value={notes[selectedContext] || ""}
                onChange={e => handleNoteChange(e.target.value)}
                placeholder={`Notes for ${selectedContext}...`}
                rows={6}
                className="w-full h-full bg-transparent resize-none text-[11px] leading-relaxed text-white/70 placeholder-white/20 outline-none border-0 focus:ring-0"
                style={CLASSES.scrollStyle}
              />
            </div>

            {/* Footer — context selector */}
            <div className="flex items-center justify-between px-4 pb-3 pt-1 border-t border-white/[0.05]">
              <span className="text-[9px] text-white/25 uppercase tracking-wider">Context</span>
              <div className="relative" ref={contextMenuRef}>
                <button
                  onClick={() => setShowContextMenu(v => !v)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.08] hover:border-white/[0.12] text-white/50 hover:text-white transition-all text-[9px] font-bold uppercase tracking-wider"
                >
                  {activeWs && <i className={`${activeWs.iconClass} text-[9px]`} />}
                  <span>{selectedContext}</span>
                  <i className={`${ICONS.chevronDown} text-[7px] opacity-50`} />
                </button>

                <AnimatePresence>
                  {showContextMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.12 }}
                      className="absolute bottom-full right-0 mb-1.5 w-48 bg-[#0d0d1a]/98 border border-white/[0.09] rounded-xl backdrop-blur-xl p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-10"
                    >
                      <div className="px-2 py-1 text-[8px] font-bold text-white/25 uppercase tracking-widest border-b border-white/[0.05] mb-1">
                        Select Context
                      </div>
                      <div className="max-h-44 overflow-y-auto space-y-0.5" style={CLASSES.scrollStyle}>
                        {workspaces.map(ws => {
                          const isSel = ws.name === selectedContext;
                          return (
                            <button
                              key={ws.name}
                              onClick={() => { setSelectedContext(ws.name); setShowContextMenu(false); }}
                              className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-left text-[10px] font-medium transition-all ${
                                isSel
                                  ? "bg-brand-500/15 border border-brand-500/20 text-brand-400"
                                  : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
                              }`}
                            >
                              <i className={`${ws.iconClass} text-[10px]`} />
                              <span className="truncate">{ws.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

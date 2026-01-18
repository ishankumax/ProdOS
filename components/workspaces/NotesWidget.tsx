"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/components/providers/DataProvider";
import { ICONS, CLASSES, TEXT } from "@/lib/theme";
import { pressAnimation } from "@/lib/motion";

export default function NotesWidget() {
  const { workspaces } = useData();
  const [selectedContext, setSelectedContext] = useState("Personal Life");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load notes on mount
  useEffect(() => {
    const saved = localStorage.getItem("prod_os_notes");
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load notes", e);
      }
    }
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentNote = notes[selectedContext] || "";

  const handleNoteChange = (text: string) => {
    const updated = { ...notes, [selectedContext]: text };
    setNotes(updated);
    localStorage.setItem("prod_os_notes", JSON.stringify(updated));
  };

  // Find active workspace icon class for current context
  const activeWorkspaceObj = workspaces.find((w) => w.name === selectedContext);
  const activeIcon = activeWorkspaceObj?.iconClass || "fi fi-sr-document";

  return (
    <div className={`w-[300px] flex-shrink-0 ${CLASSES.card} p-5 flex flex-col h-full relative`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={`text-xs font-bold uppercase tracking-widest ${TEXT.muted}`}>Notes</h3>
          <p className="text-[10px] text-white/20 mt-0.5">Quick references per context</p>
        </div>
        <i className={`${ICONS.note} text-white/20 text-sm`} />
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col relative min-h-0">
        <textarea
          value={currentNote}
          onChange={(e) => handleNoteChange(e.target.value)}
          placeholder={`Type notes for ${selectedContext}...`}
          className="w-full flex-1 bg-transparent resize-none text-[11px] leading-relaxed text-white/70 placeholder-white/20 outline-none border-0 p-0 pb-10 focus:ring-0 focus:outline-none"
        />

        {/* Floating Context Selector Button at Bottom Right */}
        <div className="absolute bottom-0 right-0 z-10" ref={dropdownRef}>
          <motion.button
            whileTap={pressAnimation}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.12] text-white/50 hover:text-white transition-all text-[9px] font-bold uppercase tracking-wider shadow-sm"
          >
            <i className={`${activeIcon} text-[10px]`} />
            <span>{selectedContext}</span>
            <i className={`${ICONS.chevronDown} text-[8px] opacity-60`} />
          </motion.button>

          {/* Context Selector Dropdown */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full right-0 mb-2 w-44 bg-[#0d0d1a]/95 border border-white/[0.09] rounded-xl backdrop-blur-xl p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col gap-0.5"
              >
                <div className="px-2 py-1 text-[8px] font-bold text-white/30 uppercase tracking-widest border-b border-white/[0.05] mb-1">
                  Select Context
                </div>
                <div className="max-h-48 overflow-y-auto space-y-0.5 pr-1" style={CLASSES.scrollStyle}>
                  {workspaces.map((ws) => {
                    const isSelected = ws.name === selectedContext;
                    return (
                      <button
                        key={ws.name}
                        onClick={() => {
                          setSelectedContext(ws.name);
                          setIsDropdownOpen(false);
                        }}
                        className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-left text-[10px] font-medium transition-all ${
                          isSelected
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
    </div>
  );
}

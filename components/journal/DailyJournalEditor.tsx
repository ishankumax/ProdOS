"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CLASSES } from "@/lib/theme";
import { SPRING_FLUID } from "@/lib/motion";

// ── Props ──────────────────────────────────────────────────────────────────────

interface DailyJournalEditorProps {
  date: string; // YYYY-MM-DD
  content: string;
  onContentChange: (content: string) => void;
  isToday: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDateDisplay(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y!, m! - 1, d);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return "🌙 Late Night Thoughts";
  if (hour < 12) return "🌅 Good Morning";
  if (hour < 17) return "☀️ Good Afternoon";
  if (hour < 21) return "🌇 Good Evening";
  return "🌙 Night Reflections";
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function DailyJournalEditor({
  date,
  content,
  onContentChange,
  isToday,
}: DailyJournalEditorProps) {
  const [localContent, setLocalContent] = useState(content);
  const [charCount, setCharCount] = useState(content.length);
  const [isSaving, setIsSaving] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync external content changes (e.g., switching dates)
  useEffect(() => {
    setLocalContent(content);
    setCharCount(content.length);
  }, [content, date]);

  const handleChange = (value: string) => {
    setLocalContent(value);
    setCharCount(value.length);
    setIsSaving(true);

    // Debounce the parent callback
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onContentChange(value);
      setIsSaving(false);
    }, 500);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <motion.div
      className={`p-5 ${CLASSES.card} h-full flex flex-col`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING_FLUID}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-base">📖</span>
          <h3 className="text-sm font-bold text-white/85">Daily Journal</h3>
        </div>
        <div className="flex items-center gap-2">
          {/* Save indicator */}
          {isSaving ? (
            <span className="text-[9px] text-amber-400/60 font-semibold flex items-center gap-1">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-2.5 h-2.5 border border-amber-400/60 border-t-transparent rounded-full"
              />
              Saving…
            </span>
          ) : localContent.length > 0 ? (
            <span className="text-[9px] text-brand-400/60 font-semibold flex items-center gap-1">
              <i className="fi fi-sr-check text-[7px]" />
              Saved
            </span>
          ) : null}
        </div>
      </div>

      {/* Date */}
      <div className="mb-3">
        <p className="text-[11px] text-white/50 font-medium">
          {formatDateDisplay(date)}
        </p>
        {isToday && (
          <p className="text-[10px] text-brand-400/70 font-semibold mt-0.5">
            {getTimeGreeting()}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-white/[0.06] mb-3" />

      {/* Textarea */}
      <div className="flex-1 relative min-h-0">
        <textarea
          ref={textareaRef}
          value={localContent}
          onChange={(e) => handleChange(e.target.value)}
          readOnly={!isToday}
          placeholder={
            isToday
              ? "Write your thoughts, reflections, wins, and lessons for today…"
              : "No journal entry for this day."
          }
          rows={11}
          className={`w-full h-full resize-none rounded-xl p-3 text-xs leading-relaxed outline-none transition-all duration-200 ${
            isToday
              ? "bg-white/[0.02] border border-white/[0.08] text-white/80 placeholder:text-white/20 focus:border-brand-500/40 focus:bg-white/[0.03]"
              : "bg-white/[0.01] border border-white/[0.05] text-white/60 cursor-default"
          }`}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(var(--brand-500-rgb),0.15) transparent",
          }}
        />
      </div>

      {/* Footer: char count + past date badge */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          {!isToday && (
            <span className="text-[9px] font-bold bg-white/[0.06] text-white/40 px-2 py-0.5 rounded-full">
              📅 Past Entry
            </span>
          )}
        </div>
        <span className="text-[9px] text-white/25 font-mono">
          {charCount.toLocaleString()} chars
        </span>
      </div>
    </motion.div>
  );
}

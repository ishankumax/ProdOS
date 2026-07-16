"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/components/providers/DataProvider";
import { CLASSES, TEXT } from "@/lib/theme";

function daysLeft(expiresAt: number): number {
  const ms = expiresAt - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function RecycleBin() {
  const { recycleBin, restoreTask, permanentlyDeleteTask } = useData();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  // Sort by newest deleted first
  const sorted = [...recycleBin].sort((a, b) => b.deletedAt - a.deletedAt);

  return (
    <div className={`h-full flex flex-col p-5 ${CLASSES.card} relative`}>
      <h3 className={`font-bold mb-4 flex items-center gap-2 ${TEXT.base}`}>
        <i className="fi fi-sr-trash text-red-400/70 text-sm" />
        Recycle Bin
        {sorted.length > 0 && (
          <span className="ml-auto text-[10px] font-mono bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20">
            {sorted.length} item{sorted.length !== 1 ? "s" : ""}
          </span>
        )}
      </h3>

      {/* Legend */}
      <p className="text-[10px] text-white/30 mb-3 leading-relaxed">
        Items are auto-deleted after <span className="text-white/50 font-semibold">7 days</span>.
        Restore to keep them.
      </p>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar max-h-[220px]">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <i className="fi fi-sr-check-circle text-green-400/40 text-2xl" />
            <p className="text-xs text-white/25 italic">Bin is empty</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {sorted.map((task) => {
              const left = daysLeft(task.expiresAt);
              const isUrgent = left <= 1;
              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.18 }}
                  className="p-3 rounded-xl border border-white/[0.07] bg-white/[0.015] hover:bg-white/[0.025] transition-all group"
                >
                  {/* Task text */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs text-white/60 line-through truncate flex-1">
                      {task.text}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded border flex-shrink-0 ${
                        isUrgent
                          ? "text-red-400 border-red-500/30 bg-red-500/10"
                          : "text-white/30 border-white/10 bg-white/5"
                      }`}
                    >
                      {left === 0 ? "today" : `${left}d left`}
                    </span>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-white/25 font-mono">
                      Deleted {formatDate(task.deletedAt)}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Restore */}
                      <button
                        onClick={() => restoreTask(task.id)}
                        title="Restore task"
                        className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-300 hover:bg-brand-500/20 transition-colors"
                      >
                        <i className="fi fi-sr-undo text-[9px]" />
                        Restore
                      </button>
                      {/* Permanent delete */}
                      {confirmId === task.id ? (
                        <button
                          onClick={() => {
                            permanentlyDeleteTask(task.id);
                            setConfirmId(null);
                          }}
                          className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 transition-colors"
                        >
                          Confirm
                        </button>
                      ) : (
                        <button
                          onClick={() => setConfirmId(task.id)}
                          title="Permanently delete"
                          className="w-6 h-6 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <i className="fi fi-sr-trash text-[9px]" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

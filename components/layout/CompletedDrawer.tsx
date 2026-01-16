"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/components/providers/DataProvider";
import { SURFACE, CLASSES, TEXT, ICONS } from "@/lib/theme";
import { GENIE_DRAWER_LEFT, GENIE_DRAWER_TRANSITION, GENIE_LIST_ITEM, GENIE_LIST_TRANSITION, LIST_STAGGER } from "@/lib/motion";

export default function CompletedDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { tasks, toggleTask } = useData();

  const completedTasks = tasks.filter(t => t.completed);

  return (
    <motion.div
      variants={GENIE_DRAWER_LEFT}
      initial="hidden"
      animate={isOpen ? "visible" : "hidden"}
      transition={GENIE_DRAWER_TRANSITION}
      style={{ transformOrigin: "left center" }}
      className={`fixed left-0 top-16 bottom-0 z-20 w-80 ${SURFACE.tw.base} border-r border-white/[0.06]`}
    >
      {/* Slide handle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-8 top-1/2 -translate-y-1/2 w-8 h-24 bg-white/[0.05] border border-l-0 border-white/[0.09] rounded-r-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
      >
        <i className={`${isOpen ? ICONS.chevronLeft : ICONS.chevronRight} text-[10px] flex items-center`} />
      </button>

      <div className="p-6 h-full flex flex-col">
        <h3 className={`text-sm font-bold uppercase tracking-widest mb-6 border-b border-white/[0.06] pb-4 ${TEXT.subtle}`}>
          Completed
        </h3>

        <div className="flex-1 overflow-auto space-y-3 pr-1" style={CLASSES.scrollStyle}>
          <AnimatePresence mode="popLayout">
            {completedTasks.length === 0 ? (
              <motion.div
                key="empty-completed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`text-sm italic text-center mt-4 ${TEXT.dim}`}
              >
                No completed tasks
              </motion.div>
            ) : (
              completedTasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  layout
                  variants={GENIE_LIST_ITEM}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{
                    ...GENIE_LIST_TRANSITION,
                    delay: i * LIST_STAGGER,
                  }}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3 ${CLASSES.cardHover} line-through text-white/40 text-sm cursor-pointer`}
                >
                  {task.text}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        <div className="pt-4 border-t border-white/[0.06] text-center">
          <button className={`text-xs text-brand-400 hover:text-brand-300 transition-colors`}>
            View History (Reset Sun)
          </button>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SPRING_SNAPPY, SPRING_FLUID } from "@/lib/motion";
import { CLASSES } from "@/lib/theme";
import type { DailyTask } from "@/hooks/useJournalData";

// ── Props ──────────────────────────────────────────────────────────────────────

interface DailyTasksGridProps {
  tasks: DailyTask[];
  onToggle: (taskId: string) => void;
  onRename: (taskId: string, name: string) => void;
  onReorder: (tasks: DailyTask[]) => void;
  isToday: boolean;
}

// ── Single Sortable Task Card ──────────────────────────────────────────────────

function SortableTaskCard({
  task,
  onToggle,
  onRename,
  isToday,
}: {
  task: DailyTask;
  onToggle: (id: string) => void;
  onRename: (id: string, name: string) => void;
  isToday: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.taskName);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: !isToday });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto" as const,
  };

  const handleSubmitName = () => {
    setIsEditing(false);
    if (editValue.trim() && editValue.trim() !== task.taskName) {
      onRename(task.id, editValue.trim());
    } else {
      setEditValue(task.taskName);
    }
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={SPRING_FLUID}
      className={`group relative flex flex-row items-center gap-2 p-2 rounded-lg border backdrop-blur-sm transition-all duration-200 flex-shrink-0 min-w-[130px] lg:min-w-0 lg:flex-1 ${
        isDragging
          ? "opacity-50 scale-95"
          : task.completed
          ? "bg-brand-500/8 border-brand-500/20"
          : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.14]"
      }`}
    >
      {/* Checkbox (Reduced to half size) */}
      <button
        onClick={() => isToday && onToggle(task.id)}
        disabled={!isToday}
        className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-all duration-300 ${
          task.completed
            ? "bg-brand-500 border-brand-500 shadow-[0_0_8px_rgba(var(--brand-500-rgb),0.3)]"
            : isToday
            ? "border-white/20 hover:border-brand-400/60 hover:bg-brand-500/10"
            : "border-white/10 opacity-50"
        }`}
      >
        <AnimatePresence>
          {task.completed && (
            <motion.i
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 45 }}
              transition={SPRING_SNAPPY}
              className="fi fi-sr-check text-[6px] text-white flex items-center"
            />
          )}
        </AnimatePresence>
      </button>

      {/* Task Name */}
      {isEditing && isToday ? (
        <input
          autoFocus
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSubmitName}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmitName();
            if (e.key === "Escape") {
              setEditValue(task.taskName);
              setIsEditing(false);
            }
          }}
          className="flex-1 bg-transparent text-[11px] text-white font-medium outline-none border-b border-brand-500/50 pb-0.5 pr-4 min-w-0"
        />
      ) : (
        <span
          onClick={() => isToday && setIsEditing(true)}
          className={`flex-1 text-[11px] font-medium leading-tight truncate pr-4 ${
            isToday ? "cursor-text" : ""
          } ${
            task.completed
              ? "text-white/40 line-through"
              : "text-white/75"
          }`}
          title={isToday ? "Click to rename" : task.taskName}
        >
          {task.taskName}
        </span>
      )}

      {/* Drag handle (vertically centered on right, only on hover and for today) */}
      {isToday && (
        <div
          {...attributes}
          {...listeners}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded flex items-center justify-center cursor-grab active:cursor-grabbing text-white/0 group-hover:text-white/20 hover:!text-white/40 transition-colors"
        >
          <i className="fi fi-sr-grip-dots text-[8px]" />
        </div>
      )}
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function DailyTasksGrid({
  tasks,
  onToggle,
  onRename,
  onReorder,
  isToday,
}: DailyTasksGridProps) {
  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(arrayMove(tasks, oldIndex, newIndex));
      }
    }
  }

  // Color for progress bar based on percentage
  const getProgressColor = () => {
    if (percentage >= 80) return "from-emerald-500 to-emerald-400";
    if (percentage >= 60) return "from-yellow-500 to-emerald-500";
    if (percentage >= 40) return "from-orange-500 to-yellow-500";
    if (percentage >= 20) return "from-red-500 to-orange-500";
    return "from-red-600 to-red-500";
  };

  return (
    <div className={`p-5 ${CLASSES.card} space-y-4`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">✅</span>
          <h3 className="text-sm font-bold text-white/85">Daily Tasks</h3>
          <span className="text-[10px] font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full">
            {completed}/{total}
          </span>
        </div>
        {percentage === 100 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={SPRING_SNAPPY}
            className="text-xs font-bold text-brand-400 flex items-center gap-1"
          >
            🎉 All done!
          </motion.span>
        )}
      </div>

      {/* Tasks Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={rectSortingStrategy}
        >
          <div className="flex flex-row gap-2 overflow-x-auto pb-2 custom-scrollbar snap-x snap-mandatory">
            {tasks.map((task) => (
              <SortableTaskCard
                key={task.id}
                task={task}
                onToggle={onToggle}
                onRename={onRename}
                isToday={isToday}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold uppercase tracking-widest text-white/35">
            Completion
          </span>
          <span className="text-[10px] font-bold text-white/50">
            {percentage}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${getProgressColor()}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 30, mass: 0.8 }}
          />
        </div>
      </div>
    </div>
  );
}

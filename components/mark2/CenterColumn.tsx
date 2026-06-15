"use client";

import React, { useState } from "react";
import { useEditMode } from "@/providers/edit-mode-provider";
import { Task } from "@/types/task";
import { Domain } from "@/types/domain";
import { createTask } from "@/features/tasks/actions/createTask";
import { toggleTask } from "@/features/tasks/actions/toggleTask";
import { deleteTask } from "@/features/tasks/actions/deleteTask";
import { cn } from "@/lib/utils";

interface CenterColumnProps {
  tasks: Task[];
  domains: Domain[];
  onRefresh?: () => void;
}

export default function CenterColumn({ tasks, domains, onRefresh }: CenterColumnProps) {
  const { isEditMode } = useEditMode();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDomainId, setNewTaskDomainId] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Get current date in local format (YYYY-MM-DD)
  const todayStr = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

  // Group tasks
  const overdueTasks = tasks.filter((t) => !t.completed && t.dueDate < todayStr);
  const goalCriticalTasks = tasks.filter((t) => !t.completed && t.weeklyTargetId && t.dueDate === todayStr);
  const todayPlannedTasks = tasks.filter((t) => !t.completed && !t.weeklyTargetId && t.dueDate === todayStr);
  const completedTasks = tasks.filter((t) => t.completed);

  // Calculate HUD Stats
  const totalTodayCount = tasks.filter((t) => t.dueDate === todayStr).length;
  const completedTodayCount = tasks.filter((t) => t.dueDate === todayStr && t.completed).length;
  const rateToday = totalTodayCount > 0 ? Math.round((completedTodayCount / totalTodayCount) * 100) : 0;

  const handleToggle = async (taskId: string, currentStatus: boolean) => {
    const response = await toggleTask({ id: taskId, completed: !currentStatus });
    if (response.success && onRefresh) {
      onRefresh();
    }
  };

  const handleDelete = async (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      const response = await deleteTask(taskId);
      if (response.success && onRefresh) {
        onRefresh();
      }
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsAdding(true);
    const response = await createTask({
      title: newTaskTitle.trim(),
      domainId: newTaskDomainId || null,
      dueDate: todayStr,
      weight: 1.0,
    });

    setIsAdding(false);
    if (response.success) {
      setNewTaskTitle("");
      setNewTaskDomainId("");
      if (onRefresh) onRefresh();
    } else {
      alert(response.error?.message || "Failed to create task");
    }
  };

  const renderTaskRow = (task: Task) => {
    const domain = domains.find((d) => d.id === task.domainId);
    const domainColor = domain?.colorHex || "#3f3f46";

    return (
      <div
        key={task.id}
        className="flex items-center justify-between border border-white/5 p-3 rounded bg-white/[0.01] hover:bg-white/[0.02] transition-all"
      >
        <div className="flex items-center gap-3">
          {!isEditMode && (
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggle(task.id, task.completed)}
              className="w-4 h-4 accent-brand-500 rounded border-white/10 bg-transparent focus:ring-0 cursor-pointer"
            />
          )}
          <div>
            <span className={cn(
              "text-xs text-white",
              task.completed && "line-through text-white/40"
            )}>
              {task.title}
            </span>
            {domain && (
              <span
                className="text-[9px] font-mono ml-2 px-1 rounded uppercase tracking-wider font-bold"
                style={{ backgroundColor: `${domainColor}20`, color: domainColor }}
              >
                {domain.name}
              </span>
            )}
          </div>
        </div>

        {isEditMode && (
          <button
            onClick={() => handleDelete(task.id)}
            className="text-rose-500 hover:text-rose-400 text-xs font-mono"
          >
            DELETE
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Execution HUD Card */}
      <div className="prod-card border-white/10">
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-white/50">
            EXECUTION HUD & TELEMETRY
          </h2>
          <span className="prod-badge">REALTIME</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-white/5 rounded p-3 bg-white/[0.01]">
            <p className="text-[10px] font-mono text-white/45">TODAY'S RATE</p>
            <p className="text-xl font-bold font-mono text-brand-400 mt-1">{rateToday}%</p>
            <p className="text-[9px] font-mono text-white/30 mt-0.5">{completedTodayCount}/{totalTodayCount} tasks</p>
          </div>

          <div className="border border-white/5 rounded p-3 bg-white/[0.01]">
            <p className="text-[10px] font-mono text-white/45">VELOCITY</p>
            <p className="text-xl font-bold font-mono text-white mt-1">
              {tasks.filter((t) => t.completed).length}
            </p>
            <p className="text-[9px] font-mono text-white/30 mt-0.5">total completed</p>
          </div>

          <div className="border border-white/5 rounded p-3 bg-white/[0.01]">
            <p className="text-[10px] font-mono text-white/45">ACTIVE BACKLOG</p>
            <p className="text-xl font-bold font-mono text-white mt-1">
              {tasks.filter((t) => !t.completed).length}
            </p>
            <p className="text-[9px] font-mono text-white/30 mt-0.5">tasks pending</p>
          </div>

          <div className="border border-white/5 rounded p-3 bg-white/[0.01]">
            <p className="text-[10px] font-mono text-white/45">SYSTEM INTEGRITY</p>
            <p className="text-xl font-bold font-mono text-brand-400 mt-1">100%</p>
            <p className="text-[9px] font-mono text-emerald-400 mt-0.5">optimal status</p>
          </div>
        </div>
      </div>

      {/* Execution List Panel */}
      <div className={cn(
        "prod-card flex-1 transition-all duration-300",
        isEditMode ? "border-dashed border-white/20" : "border-white/10"
      )}>
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-white/50">
            TODAY'S EXECUTION QUEUE
          </h2>
          <span className="prod-badge">TASK ENGINE</span>
        </div>

        {/* Task Creator Form */}
        <form onSubmit={handleCreate} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="[+] Add execution task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            disabled={isAdding}
            className="flex-1 rounded-[2px] bg-white/[0.02] border border-white/10 px-3 py-1.5 font-mono text-xs text-white outline-none focus:border-brand-500/30 transition-all"
          />
          <select
            value={newTaskDomainId}
            onChange={(e) => setNewTaskDomainId(e.target.value)}
            disabled={isAdding}
            className="rounded-[2px] bg-white/[0.02] border border-white/10 px-3 py-1.5 font-mono text-xs text-white outline-none focus:border-brand-500/30 transition-all"
          >
            <option value="" className="bg-surface-raised">Global (All)</option>
            {domains.map((d) => (
              <option key={d.id} value={d.id} className="bg-surface-raised">
                {d.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={isAdding}
            className="px-4 py-1.5 bg-brand-500 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] hover:bg-brand-400 active:scale-95 disabled:opacity-50"
          >
            ADD
          </button>
        </form>

        <div className="space-y-4">
          {/* 1. Overdue Category */}
          {overdueTasks.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold font-mono text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                OVERDUE
              </h3>
              {overdueTasks.map(renderTaskRow)}
            </div>
          )}

          {/* 2. Goal Critical Category */}
          {goalCriticalTasks.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold font-mono text-brand-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                GOAL CRITICAL
              </h3>
              {goalCriticalTasks.map(renderTaskRow)}
            </div>
          )}

          {/* 3. Planned Tasks Category */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold font-mono text-white/55 uppercase tracking-widest">
              PLANNED TODAY
            </h3>
            {todayPlannedTasks.length === 0 ? (
              <div className="text-[11px] font-mono text-white/30 italic py-2 pl-1">
                No standard tasks planned. Use input box to add.
              </div>
            ) : (
              todayPlannedTasks.map(renderTaskRow)
            )}
          </div>

          {/* 4. Completed Category */}
          {completedTasks.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/5">
              <h3 className="text-xs font-bold font-mono text-white/30 uppercase tracking-widest">
                COMPLETED
              </h3>
              {completedTasks.map(renderTaskRow)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

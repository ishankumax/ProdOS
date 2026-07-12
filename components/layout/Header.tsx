"use client";

import { useMemo } from "react";
import { WorkspaceType } from "./BottomNavbar";
import { SURFACE } from "@/lib/theme";
import { useData } from "@/components/providers/DataProvider";
import { toKey } from "@/utils/date";

interface HeaderProps {
  activeWorkspace: WorkspaceType;
}

export default function Header({ activeWorkspace }: HeaderProps) {
  const { tasks } = useData();

  // Dynamically calculate completion rate for today's tasks
  const progressPercent = useMemo(() => {
    const today = new Date();
    const todayKey = toKey(today.getFullYear(), today.getMonth(), today.getDate());

    const todayTasks = tasks.filter(t => !t.dateKey || t.dateKey === todayKey);
    const totalCount = todayTasks.length;
    if (totalCount === 0) return 0;

    const completedCount = todayTasks.filter(t => t.completed).length;
    return Math.round((completedCount / totalCount) * 100);
  }, [tasks]);

  return (
    <header className={`h-16 border-b border-white/[0.06] flex items-center justify-between px-8 ${SURFACE.tw.base}/80 backdrop-blur-sm sticky top-0 z-10`}>
      <h1 className="text-xl font-bold tracking-tight text-white uppercase">{activeWorkspace}</h1>

      {/* Daily Progress Bar */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-medium text-white/40 uppercase tracking-widest">Today</span>
        <div className="w-48 h-2 bg-white/[0.05] rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-xs font-mono text-white/60">{progressPercent}%</span>
      </div>
    </header>
  );
}

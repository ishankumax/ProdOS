"use client";

import { useState } from "react";
import Shell from "@/components/layout/Shell";
import { WorkspaceType } from "@/components/layout/Sidebar";
import TasksWidget from "@/components/workspaces/TasksWidget";
import HealthWidget from "@/components/workspaces/HealthWidget";
import RightPanel from "@/components/layout/RightPanel";

export default function HomePage() {
  const [workspace, setWorkspace] = useState<WorkspaceType>("Personal Life");

  return (
    <Shell activeWorkspace={workspace} onWorkspaceChange={setWorkspace}>
      {workspace === "Financial Dashboard" ? (
        <div className="h-full flex items-center justify-center text-white/40">
          Financial Dashboard Grid (Phase 3)
        </div>
      ) : (
        <div className="flex h-full">
          <div className="flex-1 flex gap-6 p-8">
            <TasksWidget />
            {workspace === "Personal Life" && <HealthWidget />}
            {workspace !== "Personal Life" && (
              <div className="w-[300px] bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/40 italic">
                {workspace} Widget Placeholder
              </div>
            )}
          </div>
          <RightPanel />
        </div>
      )}
    </Shell>
  );
}

"use client";

import { useState } from "react";
import Shell from "@/components/layout/Shell";
import { WorkspaceType } from "@/components/layout/BottomNavbar";
import TasksWidget from "@/components/workspaces/TasksWidget";
import HealthWidget from "@/components/workspaces/HealthWidget";
import FinanceDashboard from "@/components/workspaces/FinanceDashboard";
import { DataProvider } from "@/components/providers/DataProvider";
import { EditModeProvider } from "@/contexts/EditModeContext";

export default function HomePage() {
  const [workspace, setWorkspace] = useState<WorkspaceType>("Personal Life");

  return (
    <EditModeProvider>
      <DataProvider>
        <Shell activeWorkspace={workspace} onWorkspaceChange={setWorkspace}>
          {workspace === "Financial Dashboard" ? (
            <FinanceDashboard />
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
            </div>
          )}
        </Shell>
      </DataProvider>
    </EditModeProvider>
  );
}

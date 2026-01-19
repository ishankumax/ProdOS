"use client";

import { useState } from "react";
import Shell from "@/components/layout/Shell";
import { WorkspaceType } from "@/components/layout/BottomNavbar";
import { DataProvider } from "@/components/providers/DataProvider";
import { EditModeProvider } from "@/contexts/EditModeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Workspace Components
import Dashboard from "@/components/workspaces/Dashboard";
import FinanceDashboard from "@/components/workspaces/FinanceDashboard";
import Goals from "@/components/workspaces/Goals";
import Fitness from "@/components/workspaces/Fitness";
import SkillLearning from "@/components/workspaces/SkillLearning";
import Journal from "@/components/workspaces/Journal";

export default function HomePage() {
  const [workspace, setWorkspace] = useState<WorkspaceType>("Dashboard");

  const renderWorkspace = () => {
    switch (workspace.toLowerCase()) {
      case "dashboard":
      case "home":
        return <Dashboard />;
      case "finance":
        return <FinanceDashboard />;
      case "goals":
        return <Goals />;
      case "fitness":
      case "health":
        return <Fitness />;
      case "skills":
      case "skill learning":
      case "learning":
        return <SkillLearning />;
      case "journal":
      case "notes":
        return <Journal />;
      default:
        return (
          <div className="flex h-full items-center justify-center text-white/40 italic flex-col gap-4">
            <i className="fi fi-sr-box-open text-4xl mb-2 text-white/20"></i>
            <p>No workspace selected or created yet.</p>
            <p className="text-xs">Turn on Edit Mode (top right) to create a new workspace.</p>
          </div>
        );
    }
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        <EditModeProvider>
          <DataProvider>
            <Shell activeWorkspace={workspace} onWorkspaceChange={setWorkspace}>
              {renderWorkspace()}
            </Shell>
          </DataProvider>
        </EditModeProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

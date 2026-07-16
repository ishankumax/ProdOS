"use client";

import { useState, useEffect } from "react";
import Shell from "@/components/layout/Shell";
import { WorkspaceType } from "@/components/layout/BottomNavbar";
import { DataProvider } from "@/components/providers/DataProvider";
import { EditModeProvider } from "@/contexts/EditModeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

import Login from "@/components/auth/Login";
import OnboardingView from "@/components/onboarding/OnboardingView";

// Workspace Components
import Dashboard from "@/components/workspaces/Dashboard";
import FinanceDashboard from "@/components/workspaces/FinanceDashboard";
import Goals from "@/components/workspaces/Goals";
import WellnessView from "@/components/workspaces/WellnessView";
import FocusView from "@/components/workspaces/FocusView";
import ProfileView from "@/components/workspaces/ProfileView";

function HomeContent() {
  const [workspace, setWorkspace] = useState<WorkspaceType>("Home");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Check credentials simulation or NextAuth session
    const demoUser = localStorage.getItem("prod_os_demo_user");
    if (demoUser || user) {
      setIsAuthenticated(true);
      const onboardingCompleted = localStorage.getItem("prod_os_onboarding_completed");
      if (!onboardingCompleted) {
        setNeedsOnboarding(true);
      }
    }
  }, [user]);

  if (!isAuthenticated) {
    return <Login />;
  }

  if (needsOnboarding) {
    return <OnboardingView onComplete={() => setNeedsOnboarding(false)} />;
  }

  const renderWorkspace = () => {
    switch (workspace.toLowerCase()) {
      case "dashboard":
      case "home":
        return <Dashboard />;
      case "finance":
        return <FinanceDashboard />;
      case "goals":
        return <Goals />;
      case "wellness":
      case "health":
        return <WellnessView />;
      case "focus":
      case "timer":
        return <FocusView />;
      case "profile":
        return <ProfileView />;
      default:
        return (
          <div className="flex h-full items-center justify-center text-white/40 italic flex-col gap-4">
            <i className="fi fi-sr-box-open text-4xl mb-2 text-white/20"></i>
            <p>No workspace selected or created yet.</p>
            <p className="text-xs">Turn on Edit Mode (bottom right) to customize.</p>
          </div>
        );
    }
  };

  return (
    <Shell activeWorkspace={workspace} onWorkspaceChange={setWorkspace}>
      {renderWorkspace()}
    </Shell>
  );
}

export default function HomePage() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <EditModeProvider>
          <DataProvider>
            <HomeContent />
          </DataProvider>
        </EditModeProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

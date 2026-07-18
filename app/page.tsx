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
import FocusView from "@/components/workspaces/FocusView";
import ProfileView from "@/components/workspaces/ProfileView";
import JournalView from "@/components/workspaces/JournalView";

function HomeContent() {
  const [workspace, setWorkspace] = useState<WorkspaceType>("Journal");
  const [calendarJournalDate, setCalendarJournalDate] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Load persisted workspace on mount
    const savedWs = localStorage.getItem("prod_os_active_workspace");
    if (savedWs) {
      const lower = savedWs.toLowerCase();
      if (lower === "home" || lower === "dashboard") {
        setWorkspace("Journal");
      } else {
        setWorkspace(savedWs);
      }
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    
    // Check credentials simulation or NextAuth session
    const demoUser = localStorage.getItem("prod_os_demo_user");
    if (demoUser || user) {
      setIsAuthenticated(true);
      const onboardingCompleted = localStorage.getItem("prod_os_onboarding_completed");
      if (!onboardingCompleted) {
        setNeedsOnboarding(true);
      }
    } else {
      setIsAuthenticated(false);
    }
    setIsAuthChecked(true);
  }, [user, isLoading]);

  const handleWorkspaceChange = (newWs: WorkspaceType) => {
    setWorkspace(newWs);
    localStorage.setItem("prod_os_active_workspace", newWs);
  };

  if (!isAuthChecked) {
    return (
      <div className="fixed inset-0 bg-[#0d0d14] flex items-center justify-center z-[10000]">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  if (needsOnboarding) {
    return <OnboardingView onComplete={() => setNeedsOnboarding(false)} />;
  }

  const renderWorkspace = () => {
    switch (workspace.toLowerCase()) {
      case "focus":
      case "timer":
        return <FocusView />;
      case "profile":
        return <ProfileView />;
      case "journal":
      case "home":
      case "dashboard":
        return <JournalView calendarSelectedDate={calendarJournalDate} />;
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
    <Shell
      activeWorkspace={workspace}
      onWorkspaceChange={handleWorkspaceChange}
      onCalendarDateSelect={(dateKey) => {
        if (workspace.toLowerCase() === "journal") {
          setCalendarJournalDate(dateKey);
        }
      }}
    >
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

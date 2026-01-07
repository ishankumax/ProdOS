"use client";

import Sidebar from "./Sidebar";
import FloatingThemeSelector from "@/components/ui/FloatingThemeSelector";
import ContextSwitcher from "./ContextSwitcher";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  userEmail?: string;
  children: React.ReactNode;
}

export default function DashboardShell({ userEmail, children }: DashboardShellProps) {
  return (
    <div className="flex h-dvh bg-surface overflow-hidden relative">
      {/* 1. Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative pb-28 pt-6 lg:pt-0">
        {children}
      </main>

      {/* 2. Floating Bottom-Center Navigation Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-auto max-w-[95vw] md:max-w-none flex justify-center">
        <Sidebar userEmail={userEmail} />
      </div>

      {/* 3. Floating Theme Selector (sharing layout coordinates) */}
      <FloatingThemeSelector />

      {/* 4. Floating Top-Right Context Switcher */}
      <ContextSwitcher />
    </div>
  );
}

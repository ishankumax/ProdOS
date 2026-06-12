"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import RightPanel from "./RightPanel";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  userEmail?: string;
  children: React.ReactNode;
}

export default function DashboardShell({ userEmail, children }: DashboardShellProps) {
  const [rightOpen, setRightOpen] = useState(false);

  return (
    <div className="flex h-dvh bg-surface overflow-hidden relative">
      {/* Info Toggle (Right) - Visible on XL only */}
      <div className={cn(
        "fixed top-6 z-50 transition-all duration-300 hidden xl:block",
        rightOpen ? "right-[208px]" : "right-6"
      )}>
        <button
          onClick={() => setRightOpen(!rightOpen)}
          className="group flex flex-col items-start gap-1.5 p-2 transition-all hover:opacity-80 focus:outline-none bg-surface/40 backdrop-blur-sm rounded-lg border border-white/5"
          title={rightOpen ? "Collapse Panel" : "Expand Panel"}
        >
          <div className={cn("h-0.5 bg-brand-400 transition-all duration-300", rightOpen ? "w-4" : "w-6")} />
          <div className={cn("h-0.5 bg-brand-400 transition-all duration-300", rightOpen ? "w-6" : "w-4")} />
          <div className={cn("h-0.5 bg-brand-400 transition-all duration-300", rightOpen ? "w-5" : "w-2")} />
        </button>
      </div>

      {/* 1. Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative pb-28 pt-6 lg:pt-0">
        {children}
      </main>

      {/* 2. Right Panel - Collapsible side-by-side on XL */}
      <aside 
        className={cn(
          "transition-all duration-300 ease-in-out border-l border-white/5 bg-surface z-40 hidden xl:block",
          rightOpen ? "w-[260px] opacity-100" : "w-0 opacity-0 overflow-hidden border-none"
        )}
      >
        <div className="w-[260px] h-full">
           <RightPanel />
        </div>
      </aside>

      {/* 3. Floating Bottom-Center Navigation Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-auto max-w-[95vw] md:max-w-none flex justify-center">
        <Sidebar userEmail={userEmail} />
      </div>
    </div>
  );
}

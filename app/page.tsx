"use client";

import { useState } from "react";
import Shell from "@/components/layout/Shell";
import { WorkspaceType } from "@/components/layout/Sidebar";

export default function HomePage() {
  const [workspace, setWorkspace] = useState<WorkspaceType>("Personal Life");

  return (
    <Shell activeWorkspace={workspace} onWorkspaceChange={setWorkspace}>
      <div className="p-8">
        <div className="border border-dashed border-white/20 rounded-xl h-96 flex flex-col items-center justify-center text-white/40">
          <p className="text-xl font-medium mb-2">{workspace} Content</p>
          <p className="text-sm">Widgets will be placed here.</p>
        </div>
      </div>
    </Shell>
  );
}

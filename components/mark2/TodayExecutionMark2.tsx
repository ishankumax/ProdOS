"use client";

import React from "react";
import { EditModeProvider } from "@/providers/edit-mode-provider";
import LeftColumn from "./LeftColumn";
import CenterColumn from "./CenterColumn";
import RightColumn from "./RightColumn";
import ControlCenter from "./ControlCenter";
import { GoalHierarchyNode } from "@/features/goals/queries/getGoalsHierarchy";
import { Domain } from "@/types/domain";
import { Task } from "@/types/task";
import { KpiDefinition, KpiLog } from "@/types/kpi";
import { useRouter } from "next/navigation";

interface TodayExecutionMark2Props {
  v2Goals: GoalHierarchyNode[];
  v2Domains: Domain[];
  v2Tasks: Task[];
  v2Kpis: KpiDefinition[];
  v2Logs: KpiLog[];
}

export default function TodayExecutionMark2({
  v2Goals,
  v2Domains,
  v2Tasks,
  v2Kpis,
  v2Logs,
}: TodayExecutionMark2Props) {
  const router = useRouter();

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <EditModeProvider>
      {/* 3-Column Command Grid Viewport */}
      <div className="w-full flex flex-col lg:flex-row lg:h-[calc(100vh-140px)] gap-6 font-sans">
        
        {/* Left Column (25%) - Strategy */}
        <section className="w-full lg:w-1/4 flex flex-col gap-6 lg:overflow-y-auto pr-1">
          <LeftColumn goals={v2Goals} onRefresh={handleRefresh} />
        </section>

        {/* Center Column (50%) - Execution */}
        <section className="w-full lg:w-1/2 flex flex-col gap-6 lg:overflow-y-auto px-1">
          <CenterColumn tasks={v2Tasks} domains={v2Domains} onRefresh={handleRefresh} />
        </section>

        {/* Right Column (25%) - Intelligence */}
        <section className="w-full lg:w-1/4 flex flex-col gap-6 lg:overflow-y-auto pl-1">
          <RightColumn
            domains={v2Domains}
            kpiDefinitions={v2Kpis}
            kpiLogs={v2Logs}
            onRefresh={handleRefresh}
          />
        </section>

        {/* Floating Controls */}
        <ControlCenter />
      </div>
    </EditModeProvider>
  );
}

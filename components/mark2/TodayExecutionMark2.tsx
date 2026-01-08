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
  const [activeDomainId, setActiveDomainId] = React.useState<string | null>(null);

  React.useEffect(() => {
    // 1. Read active domain cookie on mount
    const match = document.cookie.match(/v2_active_domain_id=([^;]+)/);
    setActiveDomainId(match ? match[1] : null);

    // 2. Listen to changes in context switcher
    const handleContextChange = (e: CustomEvent<string | null>) => {
      setActiveDomainId(e.detail);
    };

    window.addEventListener("context-change", handleContextChange as EventListener);
    return () => {
      window.removeEventListener("context-change", handleContextChange as EventListener);
    };
  }, []);

  const handleRefresh = () => {
    router.refresh();
  };

  // Perform dynamic filtering based on the active domain context
  const filteredGoals = activeDomainId
    ? v2Goals.filter((g) => g.domainId === activeDomainId)
    : v2Goals;

  const filteredTasks = activeDomainId
    ? v2Tasks.filter((t) => t.domainId === activeDomainId)
    : v2Tasks;

  const filteredKpis = activeDomainId
    ? v2Kpis.filter((k) => k.domainId === activeDomainId)
    : v2Kpis;

  const filteredLogs = activeDomainId
    ? v2Logs.filter((l) => {
        const kpi = v2Kpis.find((k) => k.id === l.kpiDefinitionId);
        return kpi ? kpi.domainId === activeDomainId : false;
      })
    : v2Logs;

  return (
    <EditModeProvider>
      {/* 3-Column Command Grid Viewport */}
      <div className="w-full flex flex-col lg:flex-row lg:h-[calc(100vh-140px)] gap-6 font-sans">
        {/* Floating Controls */}
        <ControlCenter />
      </div>
    </EditModeProvider>
  );
}

"use client";

import React, { useState } from "react";
import { useEditMode } from "@/providers/edit-mode-provider";
import { Domain } from "@/types/domain";
import { KpiDefinition, KpiLog } from "@/types/kpi";
import { defineKpi } from "@/features/kpis/actions/defineKpi";
import { logKpiValue } from "@/features/kpis/actions/logKpiValue";
import { createDomain } from "@/features/domains/actions/createDomain";
import { archiveDomain } from "@/features/domains/actions/archiveDomain";
import { setActiveDomain } from "@/features/domains/actions/setActiveDomain";
import { cn } from "@/lib/utils";

interface RightColumnProps {
  domains: Domain[];
  kpiDefinitions: KpiDefinition[];
  kpiLogs: KpiLog[];
  activeDomainId?: string | null;
  onRefresh?: () => void;
}

export default function RightColumn({ domains, kpiDefinitions, kpiLogs, activeDomainId, onRefresh }: RightColumnProps) {
  const { isEditMode } = useEditMode();
  const [newKpiName, setNewKpiName] = useState("");
  const [newKpiUnit, setNewKpiUnit] = useState("");
  const [newKpiType, setNewKpiType] = useState<"input" | "output" | "outcome">("input");
  const [selectedDomainId, setSelectedDomainId] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // For quick log logging
  const [logValueKpiId, setLogValueKpiId] = useState("");
  const [logValue, setLogValue] = useState("");
  const [isLogging, setIsLogging] = useState(false);

  const todayStr = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

  // For defining a new focus domain
  const [newDomainName, setNewDomainName] = useState("");
  const [newDomainColor, setNewDomainColor] = useState("#10B981");
  const [newDomainDesc, setNewDomainDesc] = useState("");
  const [newDomainPriority, setNewDomainPriority] = useState<"critical" | "high" | "medium" | "low">("medium");
  const [isAddingDomain, setIsAddingDomain] = useState(false);
  const [isArchivingDomainId, setIsArchivingDomainId] = useState<string | null>(null);

  const handleDefineDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleDefineDomain clicked. Name:", newDomainName, "Color:", newDomainColor);
    if (!newDomainName.trim() || !newDomainColor.trim()) {
      console.warn("Name or Color is empty!");
      return;
    }

    setIsAddingDomain(true);
    try {
      console.log("Invoking createDomain Server Action with data:", {
        name: newDomainName.trim(),
        colorHex: newDomainColor.trim(),
        description: newDomainDesc.trim() || undefined,
        priority: newDomainPriority,
        status: "active",
        iconKey: "circle",
      });
      const response = await createDomain({
        name: newDomainName.trim(),
        colorHex: newDomainColor.trim(),
        description: newDomainDesc.trim() || undefined,
        priority: newDomainPriority,
        status: "active",
        iconKey: "circle",
      });
      console.log("createDomain Server Action response received:", response);
      setIsAddingDomain(false);

      if (response.success) {
        console.log("Domain created successfully. Resetting form states...");
        setNewDomainName("");
        setNewDomainColor("#10B981");
        setNewDomainDesc("");
        setNewDomainPriority("medium");
        
        // Notify ContextSwitcher to reload options list
        window.dispatchEvent(new CustomEvent("domain-change"));
        if (onRefresh) onRefresh();
      } else {
        console.error("createDomain failed:", response.error);
        alert(response.error?.message || "Failed to define domain");
      }
    } catch (err: any) {
      setIsAddingDomain(false);
      console.error("Error defining domain:", err);
      alert(err.message || "An unexpected error occurred while defining the domain.");
    }
  };

  const handleArchiveDomain = async (id: string) => {
    if (!confirm("Are you sure you want to archive this focus domain?")) return;

    setIsArchivingDomainId(id);
    try {
      const response = await archiveDomain(id);
      setIsArchivingDomainId(null);

      if (response.success) {
        // If the archived domain was the active context, switch back to Global View
        if (activeDomainId === id) {
          await setActiveDomain(null);
          window.dispatchEvent(new CustomEvent("context-change", { detail: null }));
        }

        // Notify ContextSwitcher to reload options list
        window.dispatchEvent(new CustomEvent("domain-change"));
        if (onRefresh) onRefresh();
      } else {
        alert(response.error?.message || "Failed to archive domain");
      }
    } catch (err: any) {
      setIsArchivingDomainId(null);
      console.error("Error archiving domain:", err);
      alert(err.message || "An unexpected error occurred while archiving the domain.");
    }
  };

  const handleDefineKpi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKpiName.trim() || !newKpiUnit.trim() || !selectedDomainId) return;

    setIsAdding(true);
    const response = await defineKpi({
      domainId: selectedDomainId,
      name: newKpiName.trim(),
      metricType: newKpiType,
      unit: newKpiUnit.trim(),
    });

    setIsAdding(false);
    if (response.success) {
      setNewKpiName("");
      setNewKpiUnit("");
      setSelectedDomainId("");
      if (onRefresh) onRefresh();
    } else {
      alert(response.error?.message || "Failed to define KPI");
    }
  };

  const handleLogKpi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logValueKpiId || !logValue.trim()) return;

    setIsLogging(true);
    const response = await logKpiValue({
      kpiDefinitionId: logValueKpiId,
      value: Number(logValue),
      logDate: todayStr,
    });

    setIsLogging(false);
    if (response.success) {
      setLogValue("");
      setLogValueKpiId("");
      if (onRefresh) onRefresh();
    } else {
      alert(response.error?.message || "Failed to log KPI value");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Domain Performance Card */}
      <div className={cn(
        "prod-card transition-all duration-300",
        isEditMode ? "border-dashed border-white/20" : "border-white/10"
      )}>
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-white/50">
            DOMAIN PERFORMANCE
          </h2>
          <span className="prod-badge">OS CARDS</span>
        </div>

        {domains.length === 0 ? (
          <div className="text-center py-6 text-white/30 text-xs font-mono">
            No domains configured.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {domains.map((domain) => {
              // Count total KPIs defined in this domain
              const domainKpis = kpiDefinitions.filter((k) => k.domainId === domain.id);
              const isActiveContext = domain.id === activeDomainId;

              return (
                <div
                  key={domain.id}
                  className={cn(
                    "border rounded p-3 bg-white/[0.01] flex flex-col justify-between relative overflow-hidden transition-all duration-300",
                    isActiveContext
                      ? "border-brand-500/40 shadow-[0_0_12px_rgba(var(--brand-500-rgb),0.15)] bg-brand-500/[0.02]"
                      : "border-white/5"
                  )}
                >
                  {isActiveContext && (
                    <div className="absolute top-0 right-0 bg-brand-500 text-white text-[7px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-bl">
                      FOCUS
                    </div>
                  )}
                  <div>
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: domain.colorHex }}
                        />
                        <span className="text-xs font-bold text-white tracking-tight truncate">
                          {domain.name}
                        </span>
                      </div>
                      {isEditMode && (
                        <button
                          type="button"
                          onClick={() => handleArchiveDomain(domain.id)}
                          disabled={isArchivingDomainId === domain.id}
                          className="text-white/40 hover:text-rose-400 hover:bg-rose-500/10 p-0.5 rounded transition-all shrink-0 text-[10px]"
                          title="Archive Domain"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <p className="text-[9px] font-mono text-white/40 mt-1 uppercase tracking-wider">
                      {domain.priority} PRIORITY
                    </p>
                  </div>

                  <div className="mt-3 flex justify-between items-center text-[10px] font-mono text-white/50">
                    <span>KPIs: {domainKpis.length}</span>
                    <span className="text-brand-400 capitalize">{domain.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Define KPI Form in Edit Mode */}
        {isEditMode && domains.length > 0 && (
          <form onSubmit={handleDefineKpi} className="mt-4 pt-3 border-t border-white/5 space-y-2">
            <h3 className="font-mono text-[9px] font-bold text-white/30 uppercase tracking-widest">
              [+] DEFINE CUSTOM KPI METRIC
            </h3>
            <div className="flex flex-col gap-2">
              <select
                value={selectedDomainId}
                onChange={(e) => setSelectedDomainId(e.target.value)}
                disabled={isAdding}
                className="w-full rounded-[2px] bg-white/[0.02] border border-white/10 px-2 py-1 font-mono text-[10px] text-white outline-none focus:border-brand-500/30 transition-all"
              >
                <option value="" className="bg-surface-raised">Select Domain...</option>
                {domains.map((d) => (
                  <option key={d.id} value={d.id} className="bg-surface-raised">{d.name}</option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Metric name (e.g. Sales)"
                  value={newKpiName}
                  onChange={(e) => setNewKpiName(e.target.value)}
                  disabled={isAdding}
                  className="w-full rounded-[2px] bg-white/[0.02] border border-white/10 px-2 py-1 font-mono text-[10px] text-white outline-none focus:border-brand-500/30 transition-all"
                />
                <input
                  type="text"
                  placeholder="Unit (e.g. USD)"
                  value={newKpiUnit}
                  onChange={(e) => setNewKpiUnit(e.target.value)}
                  disabled={isAdding}
                  className="w-full rounded-[2px] bg-white/[0.02] border border-white/10 px-2 py-1 font-mono text-[10px] text-white outline-none focus:border-brand-500/30 transition-all"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={newKpiType}
                  onChange={(e: any) => setNewKpiType(e.target.value)}
                  disabled={isAdding}
                  className="flex-1 rounded-[2px] bg-white/[0.02] border border-white/10 px-2 py-1 font-mono text-[10px] text-white outline-none focus:border-brand-500/30 transition-all"
                >
                  <option value="input" className="bg-surface-raised">Input Metric</option>
                  <option value="output" className="bg-surface-raised">Output Metric</option>
                  <option value="outcome" className="bg-surface-raised">Outcome Metric</option>
                </select>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="px-3 py-1 bg-brand-500 text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded-[2px] hover:bg-brand-400 active:scale-95"
                >
                  DEFINE
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Define Focus Domain Form in Edit Mode */}
        {isEditMode && (
          <form onSubmit={handleDefineDomain} className="mt-4 pt-3 border-t border-white/5 space-y-2">
            <h3 className="font-mono text-[9px] font-bold text-white/30 uppercase tracking-widest">
              [+] DEFINE FOCUS DOMAIN
            </h3>
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Domain name (e.g. Health)"
                  value={newDomainName}
                  onChange={(e) => setNewDomainName(e.target.value)}
                  disabled={isAddingDomain}
                  required
                  className="w-full rounded-[2px] bg-white/[0.02] border border-white/10 px-2 py-1 font-mono text-[10px] text-white outline-none focus:border-brand-500/30 transition-all"
                />
                <input
                  type="text"
                  placeholder="Color Hex (e.g. #10B981)"
                  value={newDomainColor}
                  onChange={(e) => setNewDomainColor(e.target.value)}
                  disabled={isAddingDomain}
                  required
                  className="w-full rounded-[2px] bg-white/[0.02] border border-white/10 px-2 py-1 font-mono text-[10px] text-white outline-none focus:border-brand-500/30 transition-all"
                />
              </div>
              <input
                type="text"
                placeholder="Description (optional)"
                value={newDomainDesc}
                onChange={(e) => setNewDomainDesc(e.target.value)}
                disabled={isAddingDomain}
                className="w-full rounded-[2px] bg-white/[0.02] border border-white/10 px-2 py-1 font-mono text-[10px] text-white outline-none focus:border-brand-500/30 transition-all"
              />
              <div className="flex gap-2">
                <select
                  value={newDomainPriority}
                  onChange={(e: any) => setNewDomainPriority(e.target.value)}
                  disabled={isAddingDomain}
                  className="flex-1 rounded-[2px] bg-white/[0.02] border border-white/10 px-2 py-1 font-mono text-[10px] text-white outline-none focus:border-brand-500/30 transition-all"
                >
                  <option value="low" className="bg-surface-raised">Low Priority</option>
                  <option value="medium" className="bg-surface-raised">Medium Priority</option>
                  <option value="high" className="bg-surface-raised">High Priority</option>
                  <option value="critical" className="bg-surface-raised">Critical Priority</option>
                </select>
                <button
                  type="submit"
                  disabled={isAddingDomain}
                  className="px-3 py-1 bg-brand-500 text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded-[2px] hover:bg-brand-400 active:scale-95"
                >
                  ADD DOMAIN
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Growth Engine Card */}
      <div className="prod-card border-white/10">
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-white/50">
            GROWTH TELEMETRY ENGINE
          </h2>
          <span className="prod-badge">METRICS</span>
        </div>

        {kpiDefinitions.length === 0 ? (
          <div className="text-center py-6 text-white/30 text-xs font-mono">
            No KPI metrics defined. Define one in Edit Mode.
          </div>
        ) : (
          <div className="space-y-3">
            {/* Log Quick KPI Value Form */}
            <form onSubmit={handleLogKpi} className="flex gap-2 mb-3 bg-white/[0.02] border border-white/5 p-2 rounded">
              <select
                value={logValueKpiId}
                onChange={(e) => setLogValueKpiId(e.target.value)}
                disabled={isLogging}
                className="flex-1 rounded-[2px] bg-transparent border border-white/10 px-2 py-1 font-mono text-[9px] text-white outline-none focus:border-brand-500/30 transition-all"
              >
                <option value="" className="bg-surface-raised">Log value for...</option>
                {kpiDefinitions.map((k) => (
                  <option key={k.id} value={k.id} className="bg-surface-raised">{k.name}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Value"
                value={logValue}
                onChange={(e) => setLogValue(e.target.value)}
                disabled={isLogging}
                className="w-16 rounded-[2px] bg-transparent border border-white/10 px-2 py-1 font-mono text-[9px] text-white outline-none focus:border-brand-500/30 transition-all"
              />
              <button
                type="submit"
                disabled={isLogging}
                className="px-2 py-1 bg-brand-500 text-white font-mono text-[9px] font-bold uppercase tracking-wider rounded-[2px] hover:bg-brand-400"
              >
                LOG
              </button>
            </form>

            {/* List defined KPIs */}
            {["input", "output", "outcome"].map((type) => {
              const typedKpis = kpiDefinitions.filter((k) => k.metricType === type);
              if (typedKpis.length === 0) return null;

              return (
                <div key={type} className="space-y-1.5">
                  <h3 className="font-mono text-[9px] font-bold text-white/30 uppercase tracking-widest">
                    {type} METRICS
                  </h3>
                  {typedKpis.map((k) => {
                    // Get latest log value if any
                    const logs = kpiLogs.filter((l) => l.kpiDefinitionId === k.id);
                    const latestLog = logs[0]; // ordered desc
                    return (
                      <div key={k.id} className="flex justify-between items-center text-xs font-mono border-b border-white/[0.03] pb-1.5">
                        <span className="text-white/80">{k.name}</span>
                        <span className="text-brand-400">
                          {latestLog ? `${latestLog.value} ${k.unit}` : `0 ${k.unit}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Intelligence Hub / Feed */}
      <div className="prod-card border-white/10">
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-white/50">
            INTELLIGENCE HUB
          </h2>
          <span className="prod-badge">ADVISORY</span>
        </div>

        <div className="space-y-3 font-mono text-[10px] tracking-tight">
          <div className="border-l-2 border-emerald-500 pl-2 py-0.5">
            <span className="text-emerald-400 font-bold">✓ GOOD GOING:</span>
            <p className="text-white/60 mt-0.5">Daily task lists are kept clean. Velocity is holding optimal status.</p>
          </div>

          <div className="border-l-2 border-amber-500 pl-2 py-0.5">
            <span className="text-amber-400 font-bold">⚠ ATTENTION REQUIRED:</span>
            <p className="text-white/60 mt-0.5">No yearly strategy goals have breached expected deadlines.</p>
          </div>

          <div className="border-l-2 border-brand-500 pl-2 py-0.5">
            <span className="text-brand-400 font-bold">» PREDICTIVE ADVISORY:</span>
            <p className="text-white/60 mt-0.5">Add yearly metrics to domains to enable deep growth telemetry calculations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

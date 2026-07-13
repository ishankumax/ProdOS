"use client";

import { useState, useEffect } from "react";
import { useData } from "@/components/providers/DataProvider";
import { useEditMode } from "@/contexts/EditModeContext";
import { CLASSES, TEXT, ICONS } from "@/lib/theme";

export default function FinanceDashboard() {
  const { investments, addInvestment } = useData();
  const { isEditing } = useEditMode();
  const [logText, setLogText] = useState("");
  
  const [visibleModules, setVisibleModules] = useState({
    investments: true,
    distribution: true,
    savings: true,
    logging: true
  });

  useEffect(() => {
    const stored = localStorage.getItem("prod_os_finance_modules");
    if (stored) {
      try {
        setVisibleModules(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("prod_os_finance_modules", JSON.stringify(visibleModules));
  }, [visibleModules]);

  const hideModule = (key: keyof typeof visibleModules) => {
    setVisibleModules(prev => ({ ...prev, [key]: false }));
  };

  const totalNetWorth = 1245000 + investments.reduce((acc, inv) => acc + (inv.amount || 0), 0);

  const handleLog = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!logText.trim()) return;
    const match = logText.match(/invested[^\d]*(\d+)[^a-z]*in\s+([a-z\s]+)/i);
    if (match?.[1] && match[2]) {
      addInvestment({ amount: parseInt(match[1], 10), company: match[2].trim(), type: "Equity" });
      setLogText("");
    } else {
      alert("Could not parse command. Try: 'Invested 500 in SBI'");
    }
  };

  return (
    <div className="h-full w-full p-8 overflow-auto">
      {/* Header */}
      <div className="flex justify-between items-end mb-8 border-b border-white/[0.06] pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Finance Command</h2>
          <div className="flex items-center gap-4 mt-1">
            <p className={`text-sm ${TEXT.muted}`}>Portfolio &amp; Cashflow</p>
            {isEditing && Object.values(visibleModules).some(v => !v) && (
              <button 
                onClick={() => setVisibleModules({ investments: true, distribution: true, savings: true, logging: true })}
                className="text-xs text-brand-400 hover:text-brand-300 transition-colors bg-brand-500/10 px-2 py-0.5 rounded"
              >
                Restore Modules
              </button>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-mono text-brand-400">₹{totalNetWorth.toLocaleString("en-IN")}</div>
          <div className={`text-xs uppercase tracking-widest mt-1 ${TEXT.muted}`}>Net Worth</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Investments Card */}
        {visibleModules.investments && (
        <div className={`col-span-1 lg:col-span-2 ${CLASSES.card} p-6 relative group`}>
          {isEditing && (
            <button onClick={() => hideModule('investments')} className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center bg-black/20 rounded text-white/40 hover:text-red-400 hover:bg-black/40 transition-all z-10" title="Delete Module">
              <i className={`${ICONS.delete} text-[10px]`} />
            </button>
          )}
          <div className="flex justify-between mb-4">
            <h3 className={`font-bold ${TEXT.base}`}>Investments</h3>
            <button className="text-brand-400 text-sm hover:text-brand-300 transition-colors">
              <i className={`${ICONS.add} mr-1`} />Add
            </button>
          </div>
          <div className="space-y-3">
            {investments.length === 0 ? (
              <div className={`${TEXT.muted} italic p-3 text-center`}>
                No investments yet. Use the chat to log one!
              </div>
            ) : (
              investments.map(inv => {
                const safeAmount = inv.amount || 0;
                return (
                  <div key={inv.id} className={`flex justify-between items-center p-3 ${CLASSES.cardHover} px-4`}>
                    <div>
                      <div className="font-bold text-white/85">{inv.company}</div>
                      <div className={`text-xs ${TEXT.muted}`}>{inv.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-white/80">₹{safeAmount.toLocaleString("en-IN")}</div>
                      <div className="text-xs text-brand-400">+0%</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        )}

        {/* Distribution Ring */}
        {visibleModules.distribution && (
        <div className={`${CLASSES.card} p-6 flex flex-col items-center justify-center relative group`}>
          {isEditing && (
            <button onClick={() => hideModule('distribution')} className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center bg-black/20 rounded text-white/40 hover:text-red-400 hover:bg-black/40 transition-all z-10" title="Delete Module">
              <i className={`${ICONS.delete} text-[10px]`} />
            </button>
          )}
          <h3 className={`text-xs font-bold uppercase tracking-widest w-full text-left mb-6 ${TEXT.muted}`}>
            Distribution
          </h3>
          <div className="w-40 h-40 rounded-full border-8 border-white/[0.08] border-t-brand-400 border-r-blue-400 border-b-purple-400 relative flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">{investments.length}</div>
              <div className={`text-[10px] uppercase tracking-widest ${TEXT.muted}`}>Assets</div>
            </div>
          </div>
        </div>
        )}

        {/* Savings & Emergency */}
        {visibleModules.savings && (
        <div className={`${CLASSES.card} p-6 relative group`}>
          {isEditing && (
            <button onClick={() => hideModule('savings')} className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center bg-black/20 rounded text-white/40 hover:text-red-400 hover:bg-black/40 transition-all z-10" title="Delete Module">
              <i className={`${ICONS.delete} text-[10px]`} />
            </button>
          )}
          <h3 className={`font-bold mb-4 ${TEXT.base}`}>Savings &amp; Emergency</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className={TEXT.subtle}>Emergency Fund</span>
                <span className="font-mono">₹3,00,000</span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className={TEXT.subtle}>Monthly Savings</span>
                <span className="font-mono">₹45,000</span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full w-[60%]" />
              </div>
            </div>
          </div>
        </div>
        )}

        {/* AI Logging */}
        {visibleModules.logging && (
        <form
          onSubmit={handleLog}
          className={`col-span-1 lg:col-span-2 ${CLASSES.card} p-6 flex flex-col justify-end relative group`}
        >
          {isEditing && (
            <button type="button" onClick={() => hideModule('logging')} className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center bg-black/20 rounded text-white/40 hover:text-red-400 hover:bg-black/40 transition-all z-10" title="Delete Module">
              <i className={`${ICONS.delete} text-[10px]`} />
            </button>
          )}
          <div className={`text-xs mb-2 ${TEXT.muted}`}>AI-Assisted Logging</div>
          <div className="flex gap-2">
            <input
              type="text"
              value={logText}
              onChange={(e) => setLogText(e.target.value)}
              placeholder='e.g., "Invested 500 in SBI"'
              className={`flex-1 ${CLASSES.input}`}
            />
            <button
              type="submit"
              className="bg-brand-500 hover:bg-brand-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Log
            </button>
          </div>
        </form>
        )}

      </div>
    </div>
  );
}

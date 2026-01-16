"use client";

import { useState } from "react";
import { useData } from "@/components/providers/DataProvider";
import { CLASSES, TEXT, ICONS } from "@/lib/theme";

export default function FinanceDashboard() {
  const { investments, addInvestment } = useData();
  const [logText, setLogText] = useState("");

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
          <p className={`text-sm mt-1 ${TEXT.muted}`}>Portfolio &amp; Cashflow</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-mono text-brand-400">₹{totalNetWorth.toLocaleString("en-IN")}</div>
          <div className={`text-xs uppercase tracking-widest mt-1 ${TEXT.muted}`}>Net Worth</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Investments Card */}
        <div className={`col-span-1 lg:col-span-2 ${CLASSES.card} p-6`}>
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

        {/* Distribution Ring */}
        <div className={`${CLASSES.card} p-6 flex flex-col items-center justify-center`}>
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

        {/* Savings & Emergency */}
        <div className={`${CLASSES.card} p-6`}>
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

        {/* AI Logging */}
        <form
          onSubmit={handleLog}
          className={`col-span-1 lg:col-span-2 ${CLASSES.card} p-6 flex flex-col justify-end`}
        >
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

      </div>
    </div>
  );
}

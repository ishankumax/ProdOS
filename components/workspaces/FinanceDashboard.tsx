"use client";

import { useState } from "react";
import { useData } from "@/components/providers/DataProvider";

export default function FinanceDashboard() {
  const { investments, addInvestment } = useData();
  const [logText, setLogText] = useState("");

  const totalNetWorth = 1245000 + investments.reduce((acc, inv) => acc + (inv.amount || 0), 0);

  const handleLog = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!logText.trim()) return;

    // Simple AI parsing mock: "Invested ₹500 in SBI" -> { amount: 500, company: "SBI" }
    const match = logText.match(/invested[^\d]*(\d+)[^a-z]*in\s+([a-z\s]+)/i);
    
    if (match?.[1] && match[2]) {
      addInvestment({
        amount: parseInt(match[1], 10),
        company: match[2].trim(),
        type: "Equity"
      });
      setLogText("");
    } else {
      alert("Could not parse command. Try: 'Invested 500 in SBI'");
    }
  };

  return (
    <div className="h-full w-full p-8 overflow-auto">
      <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Finance Command</h2>
          <p className="text-white/40 text-sm mt-1">Portfolio & Cashflow</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-mono text-green-400">₹{totalNetWorth.toLocaleString('en-IN')}</div>
          <div className="text-xs uppercase tracking-widest text-white/40 mt-1">Net Worth</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Investments Card */}
        <div className="col-span-1 lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex justify-between mb-4">
            <h3 className="font-bold text-white/80">Investments</h3>
            <button className="text-blue-400 text-sm hover:text-blue-300">+ Add</button>
          </div>
          <div className="space-y-3">
            {investments.length === 0 ? (
              <div className="text-white/40 italic p-3 text-center">No investments yet. Use the chat to log one!</div>
            ) : (
              investments.map(inv => {
                const safeAmount = inv.amount || 0;
                return (
                  <div key={inv.id} className="flex justify-between items-center p-3 bg-white/5 rounded">
                    <div>
                      <div className="font-bold">{inv.company}</div>
                      <div className="text-xs text-white/40">{inv.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono">₹{safeAmount.toLocaleString('en-IN')}</div>
                      <div className="text-xs text-green-400">+0%</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Analytics Circle */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 w-full text-left mb-6">Distribution</h3>
          <div className="w-40 h-40 rounded-full border-8 border-white/10 border-t-green-400 border-r-blue-400 border-b-purple-400 relative flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">{investments.length}</div>
              <div className="text-[10px] uppercase tracking-widest text-white/40">Assets</div>
            </div>
          </div>
        </div>

        {/* Savings & Emergency */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="font-bold text-white/80 mb-4">Savings & Emergency</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/60">Emergency Fund</span>
                <span className="font-mono">₹3,00,000</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full w-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/60">Monthly Savings</span>
                <span className="font-mono">₹45,000</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full w-[60%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Chat / AI Logging */}
        <form onSubmit={handleLog} className="col-span-1 lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col justify-end">
          <div className="text-xs text-white/40 mb-2">AI-Assisted Logging</div>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={logText}
              onChange={(e) => setLogText(e.target.value)}
              placeholder='e.g., "Invested 500 in SBI"' 
              className="flex-1 bg-[#0d0d14] border border-white/10 rounded px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <button type="submit" className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
              Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { Bill } from "@/types/finance";
import EditableText from "@/components/ui/EditableText";

interface BillsSystemProps {
  bills: Bill[];
  onUpdate: (id: string, updates: Partial<Bill>) => Promise<void>;
  onAdd: () => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function BillsSystem({ bills, onUpdate, onAdd, onDelete }: BillsSystemProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shadow-[0_0_10px_rgba(var(--brand-500-rgb),0.5)]" />
          Recurring Bills
        </h2>
        <button 
          onClick={() => onAdd()}
          className="text-[10px] font-bold text-brand-400 uppercase tracking-widest hover:text-brand-300 transition-colors"
        >
          + Add Bill
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bills.map((bill) => (
          <div 
            key={bill.id} 
            className="group p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <EditableText 
                  value={bill.title} 
                  onSave={(val) => onUpdate(bill.id, { title: val })}
                  className="text-[15px] font-bold text-white block"
                />
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                  Due {new Date(bill.dueDate).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => onUpdate(bill.id, { status: bill.status === 'Paid' ? 'Unpaid' : 'Paid' })}
                className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                  bill.status === 'Paid'
                    ? "bg-brand-500 border-brand-500 text-white"
                    : "border-white/10 text-white/10 hover:border-brand-500/50"
                }`}
              >
                {bill.status === 'Paid' && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.03]">
              <EditableText 
                value={bill.amount} 
                type="number"
                prefix="$"
                onSave={(val) => onUpdate(bill.id, { amount: parseFloat(val) })}
                className="text-sm font-mono text-white/80"
              />
              {bill.recurring && (
                <span className="text-[9px] font-black text-brand-400/50 uppercase tracking-widest border border-brand-500/10 px-1.5 py-0.5 rounded">
                  Recurring
                </span>
              )}
            </div>

            <button
              onClick={() => onDelete(bill.id)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-2 text-white/5 hover:text-rose-400 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        {bills.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-white/10 italic border border-dashed border-white/5 rounded-2xl">
            No bills scheduled.
          </div>
        )}
      </div>
    </div>
  );
}

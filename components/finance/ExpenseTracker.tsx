"use client";

import { Expense, ExpenseType } from "@/types/finance";
import EditableText from "@/components/ui/EditableText";

interface ExpenseTrackerProps {
  expenses: Expense[];
  onUpdate: (id: string, updates: Partial<Expense>) => Promise<void>;
  onAdd: () => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const TYPES: ExpenseType[] = ['Subscription', 'Tool', 'Travel', 'Food', 'Investment', 'Misc'];

export default function ExpenseTracker({ expenses, onUpdate, onAdd, onDelete }: ExpenseTrackerProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 shrink-0 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
          Expenses
        </h2>
        <button 
          onClick={() => onAdd()}
          className="text-[10px] font-bold text-rose-400 uppercase tracking-widest hover:text-rose-300 transition-colors"
        >
          + Add Entry
        </button>
      </div>

      <div className="prod-card overflow-hidden p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-6 py-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">Title</th>
              <th className="px-6 py-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">Type</th>
              <th className="px-6 py-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">Amount</th>
              <th className="px-6 py-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {expenses.map((expense) => (
              <tr key={expense.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <EditableText 
                    value={expense.title} 
                    onSave={(val) => onUpdate(expense.id, { title: val })}
                    className="text-sm font-medium text-white"
                  />
                </td>
                <td className="px-6 py-4">
                  <select
                    value={expense.type}
                    onChange={(e) => onUpdate(expense.id, { type: e.target.value as ExpenseType })}
                    className="bg-transparent text-xs text-white/50 border-none outline-none cursor-pointer hover:text-white transition-colors"
                  >
                    {TYPES.map(type => (
                      <option key={type} value={type} className="bg-surface">{type}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4">
                  <EditableText 
                    value={expense.amount} 
                    type="number"
                    prefix="$"
                    onSave={(val) => onUpdate(expense.id, { amount: parseFloat(val) })}
                    className="text-sm font-mono text-rose-400"
                  />
                </td>
                <td className="px-6 py-4 text-xs text-white/30 font-mono">
                  {new Date(expense.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-white/10 hover:text-rose-400 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-white/10 italic">
                  No expenses recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

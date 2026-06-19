import { getFinanceData } from "@/lib/queries/finance";
import FinanceOverview from "@/components/finance/FinanceOverview";
import EarningsTracker from "@/components/finance/EarningsTracker";
import ExpenseTracker from "@/components/finance/ExpenseTracker";
import BillsSystem from "@/components/finance/BillsSystem";
import FinanceAnalytics from "@/components/finance/FinanceAnalytics";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { 
  updateEarningAction, createEarningAction, deleteEarningAction,
  updateExpenseAction, createExpenseAction, deleteExpenseAction,
  updateBillAction, createBillAction, deleteBillAction 
} from "./actions";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export const metadata = {
  title: "Finance OS — Productivity OS",
  description: "Track your earnings, expenses, and recurring bills in a minimal terminal-inspired dashboard.",
};

export default async function FinanceOSPage() {
  const user = await getAuthenticatedUser();
  const email = user?.email || "demo@workspace.ai";

  const { earnings, expenses, bills } = await getFinanceData();

  // Calculate Summary
  const totalIncome = earnings.reduce((sum, e) => sum + (e.status === 'Paid' ? Number(e.amount) : 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const pendingPayments = earnings.reduce((sum, e) => sum + (e.status === 'Pending' ? Number(e.amount) : 0), 0);
  const monthlyProfit = totalIncome - totalExpenses;

  const summary = {
    totalIncome,
    incomeDelta: 12.5,
    totalExpenses,
    expenseDelta: -4.2,
    monthlyProfit,
    profitDelta: 18.1,
    pendingPayments,
  };

  return (
    <DashboardShell userEmail={email}>
      <div className="prod-container">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">Finance Management System</h1>
          <p className="text-sm text-white/30">Personal cash flow and revenue tracking protocol.</p>
        </div>

        {/* Overview Cards */}
        <FinanceOverview summary={summary} />

        {/* Main Content: Earnings + Expenses */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          <EarningsTracker 
            earnings={earnings}
            onUpdate={updateEarningAction}
            onAdd={createEarningAction}
            onDelete={deleteEarningAction}
          />
          <ExpenseTracker 
            expenses={expenses}
            onUpdate={updateExpenseAction}
            onAdd={createExpenseAction}
            onDelete={deleteExpenseAction}
          />
        </div>

        {/* Bottom Section: Bills */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          <div className="xl:col-span-2">
            <BillsSystem 
              bills={bills}
              onUpdate={updateBillAction}
              onAdd={createBillAction}
              onDelete={deleteBillAction}
            />
          </div>
          <div className="xl:col-span-1">
             <FinanceAnalytics 
               earnings={earnings}
               expenses={expenses}
             />
          </div>
        </div>

        <div className="pt-20 pb-10 text-center opacity-10 text-[9px] uppercase font-bold tracking-[0.4em]">
           Financial Sovereignty Protocol active
        </div>
      </div>
    </DashboardShell>
  );
}

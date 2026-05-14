export type EarningCategory = 'InTheBox' | 'Freelancing' | 'Consulting' | 'Events' | 'Other';
export type EarningStatus = 'Pending' | 'Paid';

export interface Earning {
  id: string;
  source: string;
  amount: number;
  category: EarningCategory;
  paymentDate: string;
  status: EarningStatus;
  user_id: string;
}

export type ExpenseType = 'Subscription' | 'Tool' | 'Travel' | 'Food' | 'Investment' | 'Misc';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  type: ExpenseType;
  date: string;
  user_id: string;
}

export interface Bill {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid';
  recurring: boolean;
  user_id: string;
}

export interface FinanceSummary {
  totalIncome: number;
  incomeDelta: number; // e.g., 5.2
  totalExpenses: number;
  expenseDelta: number; // e.g., -2.1
  monthlyProfit: number;
  profitDelta: number;
  pendingPayments: number;
}

import { Earning, Expense, Bill } from "@/types/finance";

const MOCK_EARNINGS: Earning[] = [
  { id: '1', source: 'Freelancing - Web App', amount: 2500, category: 'Freelancing', paymentDate: '2024-05-01', status: 'Paid', user_id: 'mock' },
  { id: '2', source: 'Consulting - Fintech', amount: 1200, category: 'Consulting', paymentDate: '2024-05-10', status: 'Pending', user_id: 'mock' },
  { id: '3', source: 'Events - Workshop', amount: 500, category: 'Events', paymentDate: '2024-05-15', status: 'Paid', user_id: 'mock' },
];

const MOCK_EXPENSES: Expense[] = [
  { id: '1', title: 'Adobe Creative Cloud', amount: 52, type: 'Subscription', date: '2024-05-01', user_id: 'mock' },
  { id: '2', title: 'Vercel Pro', amount: 20, type: 'Subscription', date: '2024-05-02', user_id: 'mock' },
  { id: '3', title: 'Business Travel - NYC', amount: 450, type: 'Travel', date: '2024-05-05', user_id: 'mock' },
];

const MOCK_BILLS: Bill[] = [
  { id: '1', title: 'Domain - kumar.dev', amount: 15, dueDate: '2024-06-01', status: 'Unpaid', recurring: true, user_id: 'mock' },
  { id: '2', title: 'AWS Hosting', amount: 45, dueDate: '2024-05-28', status: 'Paid', recurring: true, user_id: 'mock' },
];

export async function getFinanceData() {
  return {
    earnings: MOCK_EARNINGS,
    expenses: MOCK_EXPENSES,
    bills: MOCK_BILLS,
  };
}

export async function updateEarning(id: string, updates: Partial<Earning>) {
  console.log("Mock update earning", id, updates);
}

export async function createEarning() {
  console.log("Mock create earning");
}

export async function deleteEarning(id: string) {
  console.log("Mock delete earning", id);
}

export async function updateExpense(id: string, updates: Partial<Expense>) {
  console.log("Mock update expense", id, updates);
}

export async function createExpense() {
  console.log("Mock create expense");
}

export async function deleteExpense(id: string) {
  console.log("Mock delete expense", id);
}

export async function updateBill(id: string, updates: Partial<Bill>) {
  console.log("Mock update bill", id, updates);
}

export async function createBill() {
  console.log("Mock create bill");
}

export async function deleteBill(id: string) {
  console.log("Mock delete bill", id);
}

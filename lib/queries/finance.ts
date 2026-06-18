import { createClient } from "@/lib/supabase-server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import type { Earning, Expense, Bill } from "@/types/finance";

/**
 * Fetch all finance data (earnings, expenses, bills) for the authenticated user.
 */
export async function getFinanceData() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        earnings: [],
        expenses: [],
        bills: [],
      };
    }

    const supabase = createClient();

    const [earningsRes, expensesRes, billsRes] = await Promise.all([
      supabase
        .from("earnings")
        .select("*")
        .eq("user_id", user.id)
        .order("payment_date", { ascending: false }),
      supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false }),
      supabase
        .from("bills")
        .select("*")
        .eq("user_id", user.id)
        .order("due_date", { ascending: false }),
    ]);

    if (earningsRes.error) console.error("Error fetching earnings:", earningsRes.error.message);
    if (expensesRes.error) console.error("Error fetching expenses:", expensesRes.error.message);
    if (billsRes.error) console.error("Error fetching bills:", billsRes.error.message);

    const earnings = (earningsRes.data || []).map((e) => ({
      id: e.id,
      source: e.source,
      amount: Number(e.amount),
      category: e.category,
      paymentDate: e.payment_date,
      status: e.status,
      user_id: e.user_id,
    })) as Earning[];

    const expenses = (expensesRes.data || []).map((e) => ({
      id: e.id,
      title: e.title,
      amount: Number(e.amount),
      type: e.type,
      date: e.date,
      user_id: e.user_id,
    })) as Expense[];

    const bills = (billsRes.data || []).map((b) => ({
      id: b.id,
      title: b.title,
      amount: Number(b.amount),
      dueDate: b.due_date,
      status: b.status,
      recurring: b.recurring,
      user_id: b.user_id,
    })) as Bill[];

    return { earnings, expenses, bills };
  } catch (err) {
    console.error("Error in getFinanceData:", err);
    return {
      earnings: [],
      expenses: [],
      bills: [],
    };
  }
}

/**
 * Update an existing earning.
 */
export async function updateEarning(id: string, updates: Partial<Earning>): Promise<void> {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  const supabase = createClient();

  const mappedUpdates: Record<string, unknown> = { ...updates } as Record<string, unknown>;
  if (mappedUpdates.paymentDate !== undefined) {
    mappedUpdates.payment_date = mappedUpdates.paymentDate;
    delete mappedUpdates.paymentDate;
  }
  delete mappedUpdates.id;
  delete mappedUpdates.user_id;

  const { error } = await supabase
    .from("earnings")
    .update(mappedUpdates)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating earning:", error.message);
    throw new Error(error.message);
  }
}

/**
 * Create a new default earning for the user.
 */
export async function createEarning(): Promise<void> {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase.from("earnings").insert({
    user_id: user.id,
    source: "New Earning Source",
    amount: 0,
    category: "Other",
    payment_date: new Date().toISOString().split("T")[0]!,
    status: "Pending",
  });

  if (error) {
    console.error("Error creating earning:", error.message);
    throw new Error(error.message);
  }
}

/**
 * Delete an earning.
 */
export async function deleteEarning(id: string): Promise<void> {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase
    .from("earnings")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting earning:", error.message);
    throw new Error(error.message);
  }
}

/**
 * Update an existing expense.
 */
export async function updateExpense(id: string, updates: Partial<Expense>): Promise<void> {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  const supabase = createClient();

  const mappedUpdates: Record<string, unknown> = { ...updates } as Record<string, unknown>;
  delete mappedUpdates.id;
  delete mappedUpdates.user_id;

  const { error } = await supabase
    .from("expenses")
    .update(mappedUpdates)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating expense:", error.message);
    throw new Error(error.message);
  }
}

/**
 * Create a new default expense.
 */
export async function createExpense(): Promise<void> {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase.from("expenses").insert({
    user_id: user.id,
    title: "New Expense",
    amount: 0,
    type: "Misc",
    date: new Date().toISOString().split("T")[0]!,
  });

  if (error) {
    console.error("Error creating expense:", error.message);
    throw new Error(error.message);
  }
}

/**
 * Delete an expense.
 */
export async function deleteExpense(id: string): Promise<void> {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting expense:", error.message);
    throw new Error(error.message);
  }
}

/**
 * Update an existing bill.
 */
export async function updateBill(id: string, updates: Partial<Bill>): Promise<void> {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  const supabase = createClient();

  const mappedUpdates: Record<string, unknown> = { ...updates } as Record<string, unknown>;
  if (mappedUpdates.dueDate !== undefined) {
    mappedUpdates.due_date = mappedUpdates.dueDate;
    delete mappedUpdates.dueDate;
  }
  delete mappedUpdates.id;
  delete mappedUpdates.user_id;

  const { error } = await supabase
    .from("bills")
    .update(mappedUpdates)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating bill:", error.message);
    throw new Error(error.message);
  }
}

/**
 * Create a new default bill.
 */
export async function createBill(): Promise<void> {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase.from("bills").insert({
    user_id: user.id,
    title: "New Bill",
    amount: 0,
    due_date: new Date().toISOString().split("T")[0]!,
    status: "Unpaid",
    recurring: false,
  });

  if (error) {
    console.error("Error creating bill:", error.message);
    throw new Error(error.message);
  }
}

/**
 * Delete a bill.
 */
export async function deleteBill(id: string): Promise<void> {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase
    .from("bills")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting bill:", error.message);
    throw new Error(error.message);
  }
}

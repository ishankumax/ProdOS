"use server";

import { revalidatePath } from "next/cache";
import * as db from "@/lib/queries/finance";
import { Earning, Expense, Bill } from "@/types/finance";

const PATH = "/projects/finance-os";

export async function updateEarningAction(id: string, updates: Partial<Earning>) {
  await db.updateEarning(id, updates);
  revalidatePath(PATH);
}

export async function createEarningAction() {
  await db.createEarning();
  revalidatePath(PATH);
}

export async function deleteEarningAction(id: string) {
  await db.deleteEarning(id);
  revalidatePath(PATH);
}

export async function updateExpenseAction(id: string, updates: Partial<Expense>) {
  await db.updateExpense(id, updates);
  revalidatePath(PATH);
}

export async function createExpenseAction() {
  await db.createExpense();
  revalidatePath(PATH);
}

export async function deleteExpenseAction(id: string) {
  await db.deleteExpense(id);
  revalidatePath(PATH);
}

export async function updateBillAction(id: string, updates: Partial<Bill>) {
  await db.updateBill(id, updates);
  revalidatePath(PATH);
}

export async function createBillAction() {
  await db.createBill();
  revalidatePath(PATH);
}

export async function deleteBillAction(id: string) {
  await db.deleteBill(id);
  revalidatePath(PATH);
}

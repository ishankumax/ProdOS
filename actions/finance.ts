"use server";

import dbConnect from "@/lib/mongodb";
import { FinanceRecord, IFinanceRecord } from "@/database/models/FinanceRecord";
import { revalidatePath } from "next/cache";

const DEFAULT_USER_ID = "default-user-ishan";

export async function getFinanceRecords() {
  try {
    await dbConnect();
    const records = await FinanceRecord.find({ userId: DEFAULT_USER_ID }).sort({ loggedDate: -1 });
    return JSON.parse(JSON.stringify(records)) as IFinanceRecord[];
  } catch (error) {
    console.error("Failed to fetch finance records from MongoDB:", error);
    return [];
  }
}

export async function addFinanceRecord(assetName: string, amount: number, category: string = "Equity") {
  try {
    await dbConnect();
    const newRecord = await FinanceRecord.create({
      userId: DEFAULT_USER_ID,
      assetName,
      amount,
      category,
    });
    revalidatePath("/");
    return JSON.parse(JSON.stringify(newRecord)) as IFinanceRecord;
  } catch (error) {
    console.error("Failed to add finance record to MongoDB:", error);
    throw new Error("Failed to add finance record");
  }
}

import mongoose, { Schema, model, models } from 'mongoose';

export interface IFinanceRecord {
  _id: mongoose.Types.ObjectId;
  userId: string;
  assetName: string;
  amount: number;
  category: string;
  loggedDate: Date;
}

const FinanceRecordSchema = new Schema<IFinanceRecord>({
  userId: { type: String, required: true },
  assetName: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true, default: 'Equity' },
  loggedDate: { type: Date, default: Date.now },
});

export const FinanceRecord = models.FinanceRecord || model<IFinanceRecord>('FinanceRecord', FinanceRecordSchema);

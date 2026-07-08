import mongoose, { Schema, model, models } from 'mongoose';

export interface ITask {
  _id: mongoose.Types.ObjectId;
  userId: string;
  workspace: string; // e.g. "Personal Life"
  text: string;
  completed: boolean;
  createdAt: Date;
}

const TaskSchema = new Schema<ITask>({
  userId: { type: String, required: true },
  workspace: { type: String, required: true },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Task = models.Task || model<ITask>('Task', TaskSchema);

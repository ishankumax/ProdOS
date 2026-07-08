"use server";

import dbConnect from "@/lib/mongodb";
import { Task, ITask } from "@/database/models/Task";
import { revalidatePath } from "next/cache";

const DEFAULT_USER_ID = "default-user-ishan";

export async function getTasks(workspace: string) {
  try {
    await dbConnect();
    const tasks = await Task.find({ userId: DEFAULT_USER_ID, workspace }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(tasks)) as ITask[];
  } catch (error) {
    console.error("Failed to fetch tasks from MongoDB:", error);
    return [];
  }
}

export async function addTask(text: string, workspace: string) {
  try {
    await dbConnect();
    const newTask = await Task.create({
      userId: DEFAULT_USER_ID,
      workspace,
      text,
      completed: false,
    });
    revalidatePath("/");
    return JSON.parse(JSON.stringify(newTask)) as ITask;
  } catch (error) {
    console.error("Failed to add task to MongoDB:", error);
    throw new Error("Failed to add task");
  }
}

export async function toggleTask(taskId: string) {
  try {
    await dbConnect();
    const task = await Task.findById(taskId);
    if (!task) throw new Error("Task not found");

    task.completed = !task.completed;
    await task.save();
    
    revalidatePath("/");
    return JSON.parse(JSON.stringify(task)) as ITask;
  } catch (error) {
    console.error("Failed to toggle task in MongoDB:", error);
    throw new Error("Failed to toggle task");
  }
}

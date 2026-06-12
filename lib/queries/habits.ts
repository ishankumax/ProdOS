import { createClient } from "@/lib/supabase-server";
import { Habit, HabitLog, HabitWithStats } from "@/types/habits";
import { computeHabitStreaks } from "@/lib/analytics";
import { HabitSchema, HabitLogSchema } from "@/lib/validation/schemas";
import { z } from "zod";
import { invalidateCache } from "@/lib/cache/redis";

const MOCK_HABITS: HabitWithStats[] = [
  { id: '1', name: 'Physical Training', user_id: 'mock', created_at: new Date().toISOString(), current_streak: 5, today_completed: false, history_7_days: [true, true, true, true, true, false, false] },
  { id: '2', name: 'Deep Work Session', user_id: 'mock', created_at: new Date().toISOString(), current_streak: 12, today_completed: true, history_7_days: [true, true, true, true, true, true, true] },
  { id: '3', name: 'Reading (Technical)', user_id: 'mock', created_at: new Date().toISOString(), current_streak: 2, today_completed: false, history_7_days: [false, false, true, true, false, false, false] },
];

export async function getUserHabitsWithStats(): Promise<HabitWithStats[]> {
  return MOCK_HABITS;
}

export async function createHabit(name: string): Promise<Habit> {
  console.log("Mock create habit", name);
  return MOCK_HABITS[0]!;
}

export async function toggleHabitToday(habitId: string, completed: boolean): Promise<void> {
  console.log("Mock toggle habit", habitId, completed);
}

export async function deleteHabit(id: string): Promise<void> {
  console.log("Mock delete habit", id);
}

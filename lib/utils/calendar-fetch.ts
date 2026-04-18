
import { createClient } from "@/lib/supabase";
import { Goal } from "@/types/goals";
import { Habit, HabitLog } from "@/types/habits";
import { WeeklyDataSchema } from "@/lib/validation/schemas";

/**
 * Fetch calendar data from the client side.
 */
export async function fetchWeeklyDataClient(startDate: Date, endDate: Date) {
  const supabase = createClient();

  const startStr = startDate.toISOString();
  // Ensure the end date covers the whole day
  const endStr = new Date(endDate.getTime()).toISOString();

  // Fetch goals created within this range
  const { data: goalsData, error: goalsError } = await supabase
    .from("goals")
    .select("*")
    .gte("created_at", startStr)
    .lte("created_at", endStr);

  if (goalsError) throw new Error(goalsError.message);

  // Fetch all habits
  const { data: habitsData, error: habitsError } = await supabase
    .from("habits")
    .select("*")
    .order("created_at", { ascending: true });

  if (habitsError) throw new Error(habitsError.message);

  // Fetch logs for these habits in the date range
  const startDay = startStr.split("T")[0];
  const endDay = endStr.split("T")[0];

  const { data: logsData, error: logsError } = await supabase
    .from("habit_logs")
    .select("*")
    .gte("date", startDay)
    .lte("date", endDay);

  if (logsError) throw new Error(logsError.message);

  const rawData = {
    goals: goalsData || [],
    habits: habitsData || [],
    logs: logsData || [],
  };

  // Validate with Zod
  const validated = WeeklyDataSchema.safeParse(rawData);
  if (!validated.success) {
    console.error("Zod Validation Error:", validated.error.format());
    return rawData as { goals: Goal[], habits: Habit[], logs: HabitLog[] };
  }

  return validated.data as { goals: Goal[], habits: Habit[], logs: HabitLog[] };
}


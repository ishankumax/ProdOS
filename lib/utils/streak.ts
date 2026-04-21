import { HabitLog } from "@/types/habits";

/**
 * Calculates the current streak of a habit based on its logs.
 * A streak is the number of consecutive days (backwards from today) 
 * where the habit was completed.
 * 
 * Logic:
 * 1. Get today's UTC date.
 * 2. Check if today is completed.
 * 3. If not, check if yesterday was completed. If not, streak is 0.
 * 4. Count backwards until a missed day is found.
 */
export function calculateCurrentStreak(logs: HabitLog[]): number {
  if (logs.length === 0) return 0;

  // Assume logs are filtered for the specific habit and sorted by date DESC
  const today = new Date().toISOString().split("T")[0]!;
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]!;

  const logMap = new Map<string, boolean>();
  logs.forEach((log) => {
    if (log.completed) {
      logMap.set(log.date, true);
    }
  });

  let streak = 0;
  let currentDateStr = today;

  // Check if today is completed. 
  // If not, we check if yesterday was to see if the streak is still "active" but today hasn't happened yet.
  if (!logMap.has(today)) {
    if (!logMap.has(yesterday)) {
      return 0;
    }
    currentDateStr = yesterday;
  }

  // Count backwards
  while (logMap.has(currentDateStr)) {
    streak++;
    const prevDate = new Date(new Date(currentDateStr).getTime() - 86400000);
    currentDateStr = prevDate.toISOString().split("T")[0]!;
  }

  return streak;
}

/**
 * Returns a boolean array for the last 7 days (including today).
 */
export function get7DayHistory(logs: HabitLog[]): boolean[] {
  const history: boolean[] = [];
  const logMap = new Map<string, boolean>();
  logs.forEach((log) => {
    if (log.completed) {
      logMap.set(log.date, true);
    }
  });

  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().split("T")[0]!;
    history.push(logMap.has(d));
  }

  return history;
}

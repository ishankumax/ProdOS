export interface GeneratedMonthlyTarget {
  month: string; // YYYY-MM-01
  targetValue: number;
}

export interface GeneratedWeeklyTarget {
  weekStart: string; // YYYY-MM-DD (Monday)
  weekEnd: string;   // YYYY-MM-DD (Sunday)
  targetValue: number;
}

/**
 * Splits a yearly target evenly across the months spanned by the start and end dates.
 * Disributes rounding differences to the final month.
 */
export function generateMonthlyTargets(
  yearlyTarget: number,
  startDateStr: string,
  endDateStr: string
): GeneratedMonthlyTarget[] {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
    throw new Error("Invalid start or end date");
  }

  const months: string[] = [];
  let current = new Date(start.getFullYear(), start.getMonth(), 1);
  const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);

  while (current <= endMonth) {
    const yearStr = current.getFullYear();
    const monthStr = String(current.getMonth() + 1).padStart(2, "0");
    months.push(`${yearStr}-${monthStr}-01`);
    current.setMonth(current.getMonth() + 1);
  }

  const count = months.length;
  if (count === 0) return [];

  // Divide and handle 2 decimal rounding
  const baseValue = Math.round((yearlyTarget / count) * 100) / 100;
  const targets: GeneratedMonthlyTarget[] = [];
  let accumulated = 0;

  for (let i = 0; i < count; i++) {
    let targetValue = baseValue;
    
    // For the last month, reconcile rounding differences
    if (i === count - 1) {
      targetValue = Math.round((yearlyTarget - accumulated) * 100) / 100;
    } else {
      accumulated = Math.round((accumulated + baseValue) * 100) / 100;
    }

    targets.push({
      month: months[i]!,
      targetValue,
    });
  }

  return targets;
}

/**
 * Splits a monthly target value evenly across the calendar weeks (Monday-Sunday)
 * that touch the calendar month.
 */
export function generateWeeklyTargets(
  monthlyTargetValue: number,
  monthStr: string // Format: YYYY-MM-01
): GeneratedWeeklyTarget[] {
  const parts = monthStr.split("-");
  const year = parseInt(parts[0] || "0", 10);
  const monthIdx = parseInt(parts[1] || "0", 10) - 1;

  const firstOfMonth = new Date(year, monthIdx, 1);
  const lastOfMonth = new Date(year, monthIdx + 1, 0);

  // Find the Monday of the week containing the first of the month
  const firstMonday = new Date(firstOfMonth);
  const dayOfWeek = firstMonday.getDay(); // 0 = Sunday, 1 = Monday, ...
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  firstMonday.setDate(firstMonday.getDate() - daysToSubtract);

  const weeks: { start: string; end: string }[] = [];
  let currentMonday = new Date(firstMonday);

  // Collect weeks that touch the month (their week start or week end falls in the month,
  // or the week spans across the month).
  while (currentMonday <= lastOfMonth) {
    const sunday = new Date(currentMonday);
    sunday.setDate(sunday.getDate() + 6);

    const weekStartStr = formatDate(currentMonday);
    const weekEndStr = formatDate(sunday);

    weeks.push({
      start: weekStartStr,
      end: weekEndStr,
    });

    currentMonday.setDate(currentMonday.getDate() + 7);
  }

  const count = weeks.length;
  if (count === 0) return [];

  const baseValue = Math.round((monthlyTargetValue / count) * 100) / 100;
  const targets: GeneratedWeeklyTarget[] = [];
  let accumulated = 0;

  for (let i = 0; i < count; i++) {
    let targetValue = baseValue;

    if (i === count - 1) {
      targetValue = Math.round((monthlyTargetValue - accumulated) * 100) / 100;
    } else {
      accumulated = Math.round((accumulated + baseValue) * 100) / 100;
    }

    const weekItem = weeks[i]!;
    targets.push({
      weekStart: weekItem.start,
      weekEnd: weekItem.end,
      targetValue,
    });
  }

  return targets;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

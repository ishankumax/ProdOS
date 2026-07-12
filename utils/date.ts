export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function toKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

export function getMonthName(month: number, short = false): string {
  const name = MONTH_NAMES[Math.max(0, Math.min(11, month))] ?? MONTH_NAMES[0];
  return short ? name.slice(0, 3) : name;
}

export const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

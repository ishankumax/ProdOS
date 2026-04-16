import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function formatDate(date: Date | string, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

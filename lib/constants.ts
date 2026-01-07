import type { NavItem, Feature } from "@/types";

export const APP_NAME = "Productivity OS" as const;
export const APP_DESCRIPTION =
  "Your goals, habits, and progress — managed in one execution system.";

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Goals", href: "/goals" },
  { label: "Habits", href: "/habits" },
];

export const FEATURES: Feature[] = [
  {
    id: "goals",
    title: "Daily Goal Tracking",
    description:
      "Set what matters each day and actually follow through. No noise — just clarity on what to execute.",
    icon: "◎",
  },
  {
    id: "habits",
    title: "Habit Streak System",
    description:
      "Build consistency that compounds. Track streaks, spot gaps, and reinforce the behaviors that stick.",
    icon: "⟳",
  },
  {
    id: "insights",
    title: "Weekly Progress Insights",
    description:
      "See your output in context. Weekly summaries surface patterns so you can iterate, not just repeat.",
    icon: "↗",
  },
];

export interface ContextItem {
  id: string;
  label: string;
  icon: string;
  desc: string;
}

export const CONTEXTS: ContextItem[] = [
  { id: "personal", label: "Personal Workspace", icon: "⊞", desc: "Private dashboard & routine registry." },
  { id: "acme", label: "Acme Corporation", icon: "⌬", desc: "Enterprise operations & protocol ledger." },
  { id: "vanguard", label: "Vanguard Labs", icon: "⎊", desc: "R&D sandbox & venture seed allocations." },
  { id: "helix", label: "Helix Ventures", icon: "⧉", desc: "Secondary portfolio & growth assets." }
];

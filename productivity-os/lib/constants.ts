import type { NavItem, Feature } from "@/types";

export const APP_NAME = "Productivity OS" as const;
export const APP_DESCRIPTION =
  "A unified workspace to manage tasks, focus, and goals.";

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Tasks", href: "/tasks" },
  { label: "Focus", href: "/focus" },
  { label: "Goals", href: "/goals" },
];

export const FEATURES: Feature[] = [
  {
    id: "tasks",
    title: "Smart Task Management",
    description:
      "Capture, organize, and prioritize tasks with intelligent sorting and deadline tracking.",
    icon: "✓",
  },
  {
    id: "focus",
    title: "Deep Focus Mode",
    description:
      "Block distractions and enter a flow state with a built-in Pomodoro timer and ambient sounds.",
    icon: "⏱",
  },
  {
    id: "goals",
    title: "Goal Tracking",
    description:
      "Set meaningful milestones, visualize progress, and stay accountable with weekly reviews.",
    icon: "◎",
  },
  {
    id: "analytics",
    title: "Productivity Analytics",
    description:
      "Understand your patterns with detailed charts and personalized insights.",
    icon: "↗",
  },
];

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export type Theme = "light" | "dark" | "system";

export type Status = "idle" | "loading" | "success" | "error";

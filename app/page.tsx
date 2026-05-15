import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "Personal OS — Execution Portal",
  description: "A private system for goals, habits, and progress.",
};

import { redirect } from "next/navigation";

export default async function HomePage() {
  redirect("/dashboard");
}

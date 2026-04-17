"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useState } from "react";

/**
 * Logout button — client component.
 * Signs out via browser client then redirects to /login.
 */
export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-xs text-white/50 hover:text-white transition-colors disabled:opacity-40"
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const supabase = createClient();

  // Server-side auth check — getUser() verifies JWT with Supabase servers
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Double-guard: middleware handles the redirect, this is a safety net
  if (!user) redirect("/login");

  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      {/* Dashboard Navbar */}
      <header className="border-b border-white/8 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center text-white text-xs font-bold">
            P
          </span>
          <span className="text-sm font-semibold text-white">
            Productivity OS
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-white/40 hidden sm:block">
            {user.email}
          </span>
          <LogoutButton />
        </div>
      </header>

      {/* Dashboard body */}
      <main className="flex-1 px-6 py-12 max-w-4xl mx-auto w-full">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-white/50 text-sm mt-1">
            Good to have you back. What are we executing today?
          </p>
        </div>

        {/* Placeholder cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Goals", count: "—", icon: "◎" },
            { label: "Habits", count: "—", icon: "⟳" },
            { label: "Streak", count: "—", icon: "↗" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 space-y-3"
            >
              <div className="w-9 h-9 rounded-lg bg-brand-500/15 border border-brand-500/20 flex items-center justify-center text-brand-300 text-base">
                {item.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{item.count}</p>
                <p className="text-xs text-white/40 mt-0.5">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

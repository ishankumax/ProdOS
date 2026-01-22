"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mimic sign in
    setTimeout(() => {
      localStorage.setItem("prod_os_demo_user", JSON.stringify({ email, name: email.split("@")[0] }));
      window.location.reload();
    }, 1200);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    signIn("google");
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#0d0d14] overflow-hidden text-white font-sans">
      {/* Sleek background design */}
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md p-8 bg-[#12121c]/90 border border-white/10 rounded-2xl relative z-10 mx-4 flex flex-col items-center gap-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="text-center space-y-2">
          <div className="text-emerald-400 text-3xl font-bold tracking-wider flex items-center justify-center gap-2">
            <i className="fi fi-sr-spa text-emerald-400 text-xl flex items-center" /> ProdOS
          </div>
          <p className="text-[10px] text-white/40 tracking-wide uppercase font-semibold">Zen-inspired productivity dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="text-[10px] text-white/45 uppercase font-semibold mb-1 block">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. mindfulness@gmail.com"
              required
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] text-white/45 uppercase font-semibold mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold tracking-wider transition-all shadow-[0_0_16px_rgba(16,185,129,0.3)] disabled:opacity-50"
          >
            {isLoading ? "LOADING..." : "ENTER WORKSPACE"}
          </button>
        </form>

        <div className="flex items-center w-full gap-2 text-white/20 text-[10px] font-mono">
          <div className="h-px bg-white/10 flex-1" />
          OR
          <div className="h-px bg-white/10 flex-1" />
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 text-white/80 hover:text-white text-xs font-semibold tracking-wider transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          CONTINUE WITH GOOGLE
        </button>
      </div>
    </div>
  );
}

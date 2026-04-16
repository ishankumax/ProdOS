import Link from "next/link";
import { APP_NAME, NAV_ITEMS } from "@/lib/constants";

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 backdrop-blur-md bg-surface/80">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 text-white font-semibold tracking-tight group"
        >
          <span className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-110">
            P
          </span>
          <span className="hidden sm:block">{APP_NAME}</span>
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="px-3 py-1.5 rounded-md text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-ghost text-sm hidden sm:flex">
            Sign in
          </Link>
          <Link href="/signup" className="btn-primary text-sm">
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}

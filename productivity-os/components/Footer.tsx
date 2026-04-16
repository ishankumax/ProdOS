import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted">
          © {year} {APP_NAME}. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-sm text-muted">
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}

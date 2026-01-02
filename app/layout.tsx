import type { Metadata, Viewport } from "next";
import { Outfit, Space_Mono } from "next/font/google";
import "./globals.css";
import FloatingThemeSelector from "@/components/ui/FloatingThemeSelector";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Productivity OS",
    template: "%s | Productivity OS",
  },
  description:
    "Your goals, habits, and weekly progress in one unified system. Productivity OS is built for people who execute — not just plan.",
  keywords: ["productivity", "goal tracking", "habit tracker", "execution", "focus", "workspace"],
  authors: [{ name: "Ishan Kumar" }],
  creator: "Ishan Kumar",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Productivity OS",
    description:
      "A unified productivity workspace to manage tasks, focus, and goals.",
    siteName: "Productivity OS",
  },
  twitter: {
    card: "summary_large_image",
    title: "Productivity OS",
    description:
      "A unified productivity workspace to manage tasks, focus, and goals.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0d14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('prod_os_theme') || 'default';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${outfit.variable} ${spaceMono.variable} font-sans bg-surface text-white antialiased`}
      >
        {children}
        <FloatingThemeSelector />
      </body>
    </html>
  );
}

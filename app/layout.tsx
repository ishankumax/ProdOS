import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
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
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-surface text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

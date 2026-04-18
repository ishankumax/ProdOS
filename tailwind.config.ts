import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        brand: {
          50: "hsl(250 100% 97%)",
          100: "hsl(250 95% 92%)",
          200: "hsl(250 90% 84%)",
          300: "hsl(250 85% 72%)",
          400: "hsl(250 80% 60%)",
          500: "hsl(250 75% 50%)",
          600: "hsl(250 70% 42%)",
          700: "hsl(250 68% 34%)",
          800: "hsl(250 65% 24%)",
          900: "hsl(250 60% 14%)",
          950: "hsl(250 55% 8%)",
        },
        surface: {
          DEFAULT: "hsl(240 6% 10%)",
          raised: "hsl(240 5% 13%)",
          overlay: "hsl(240 4% 16%)",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-mesh":
          "radial-gradient(at 40% 20%, hsl(250 75% 20%) 0px, transparent 50%), radial-gradient(at 80% 0%, hsl(210 80% 15%) 0px, transparent 50%), radial-gradient(at 0% 50%, hsl(270 60% 15%) 0px, transparent 50%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "shimmer-slide": {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "fade-in": "fade-in 0.4s ease-out both",
        shimmer: "shimmer 2.5s linear infinite",
        "shimmer-slide": "shimmer-slide 2s infinite",
      },

    },
  },
  plugins: [],
};

export default config;

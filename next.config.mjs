/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Fallback so prerendering doesn't throw "TypeError: Invalid URL"
    // when NEXTAUTH_URL is not set at build time.
    // The real value MUST be set in Vercel → Settings → Environment Variables.
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "https://localhost:3000",
  },
};

export default nextConfig;

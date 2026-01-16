import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      // Supabase storage public URLs
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

export default nextConfig;

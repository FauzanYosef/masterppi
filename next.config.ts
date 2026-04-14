import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const basePath = isProd ? "/MasterPPI" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    // NEXT_PUBLIC_SUPABASE_URL: "https://vfiikiikssljzqrkervl.supabase.co",
    // NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmaWlraWlrc3NsanpxcmtlcnZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MDQ3NDgsImV4cCI6MjA5MTA4MDc0OH0.hnpgBG9hk8ppo6q2zfM-r-EEBGIvi_adCzkvlbJydZw",
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/MasterPPI" : "";

const nextConfig: NextConfig = {
  // output: "export",

  basePath,
  assetPrefix: basePath,

  images: {
    unoptimized: true, // kalau masih mau static image
    domains: ['vfiikiikssljzqrkervl.supabase.co'],
  },

  trailingSlash: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
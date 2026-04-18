import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ❌ HAPUS ini
  // output: "export",

  // ❌ sementara hapus dulu
  // basePath: "/MasterPPI",
  // assetPrefix: "/MasterPPI",

  images: {
    domains: ['vfiikiikssljzqrkervl.supabase.co'],
  },

  trailingSlash: true,

  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
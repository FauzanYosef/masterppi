import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['vfiikiikssljzqrkervl.supabase.co'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
      },
    ],
  },
};

export default nextConfig;
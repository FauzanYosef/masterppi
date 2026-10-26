import type { NextConfig } from 'next'

/**
 * Host gambar yang diizinkan untuk next/image diambil dari NEXT_PUBLIC_API_URL,
 * sehingga gambar dari API (/storage/**) tampil di localhost maupun production
 * tanpa hostname yang ditulis langsung di sini.
 */
function getRemotePatterns(): NonNullable<NonNullable<NextConfig['images']>['remotePatterns']> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) return []

  try {
    const url = new URL(apiUrl)
    return [
      {
        protocol: url.protocol.replace(':', '') as 'http' | 'https',
        hostname: url.hostname,
        port: url.port,
        pathname: '/storage/**',
      },
    ]
  } catch {
    return []
  }
}

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  images: {
    remotePatterns: getRemotePatterns(),
    // Next 16 menolak gambar dari IP lokal; izinkan hanya saat development (API di localhost).
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== 'production',
    // Docker lokal: optimizer di dalam container tidak bisa menjangkau API di localhost host.
    unoptimized: process.env.NEXT_IMAGE_UNOPTIMIZED === 'true',
  },
}

export default nextConfig

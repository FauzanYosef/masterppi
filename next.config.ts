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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // YouTube menolak embed tanpa referrer; jangan memakai no-referrer/same-origin.
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        // Halaman (HTML/RSC) jangan disimpan CDN/proxy bersama: Next memberi s-maxage setahun pada
        // halaman prerender, sehingga deploy baru tidak tampil. Aset ber-hash (_next/static) dan
        // file di /public tetap boleh di-cache.
        source: '/:path((?!_next/static|_next/image|images|menu|robots\\.txt|sitemap\\.xml|favicon\\.ico).*)',
        headers: [{ key: 'Cache-Control', value: 'private, no-cache, no-store, max-age=0, must-revalidate' }],
      },
    ]
  },
}

export default nextConfig

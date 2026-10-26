import { NextRequest } from 'next/server'

const SITE_DOMAIN = process.env.NEXT_PUBLIC_SITE_DOMAIN

/** Folder file API yang boleh diproxy (hanya PDF di dalamnya). */
const ALLOWED_PATHS = [
  '/storage/documents/academic-calendar/',
  '/storage/documents/academic-guides/',
]

const text = (body: string, status: number) =>
  new Response(body, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })

/**
 * Normalisasi path dari query: harus berawalan "/", tanpa "..", "\\", "%", "?", "#",
 * atau karakter kontrol, sehingga tidak bisa keluar dari folder yang diizinkan.
 */
function safePath(raw: string | null): string | null {
  if (!raw || !raw.startsWith('/')) return null
  if (/[\\%?#\u0000-\u001f]/.test(raw)) return null
  if (raw.split('/').some((segment) => segment === '..' || segment === '.')) return null
  if (raw.includes('//')) return null
  return raw
}

export async function GET(request: NextRequest) {
  const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) return text('API belum dikonfigurasi', 500)

  const filePath = safePath(request.nextUrl.searchParams.get('path'))
  if (!filePath) return text('Parameter path tidak valid', 400)
  if (!ALLOWED_PATHS.some((allowed) => filePath.startsWith(allowed))) {
    return text('Path file tidak diizinkan', 403)
  }
  if (!filePath.toLowerCase().endsWith('.pdf')) return text('File harus berupa PDF', 400)

  try {
    const response = await fetch(`${apiUrl.replace(/\/+$/, '')}${filePath}`, {
      headers: SITE_DOMAIN ? { 'X-Site-Domain': SITE_DOMAIN } : {},
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    })

    if (!response.ok) return text('File tidak ditemukan', response.status === 404 ? 404 : 502)

    return new Response(await response.arrayBuffer(), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
        'Cache-Control': 'public, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('PDF proxy gagal:', error instanceof Error ? error.message : error)
    return text('Gagal mengambil PDF', 502)
  }
}

import { NextResponse, type NextRequest } from 'next/server'

/**
 * Routing bahasa (semua halaman ada di app/[lang]):
 * - /en/...  → dilayani langsung (bahasa Inggris)
 * - /id/...  → dialihkan permanen ke URL tanpa awalan (satu URL kanonis per halaman)
 * - lainnya  → ditulis ulang diam-diam ke /id/... (bahasa Indonesia, URL tidak berubah)
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/en' || pathname.startsWith('/en/')) return NextResponse.next()

  if (pathname === '/id' || pathname.startsWith('/id/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(3) || '/'
    return NextResponse.redirect(url, 308)
  }

  const url = request.nextUrl.clone()
  url.pathname = `/id${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  // Lewati API, aset Next, dan file statis (apa pun yang berekstensi: gambar, robots.txt, sitemap.xml, favicon).
  matcher: ['/((?!api/|_next/|.*\\.[^/]+$).*)'],
}

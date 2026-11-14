/**
 * Pengambil data fisip-api untuk Server Component (metadata, sitemap, 404 asli).
 * Cache 5 menit; gagal/404 → null.
 */
export const SITE = {
  name: 'Program Magister Pemikiran Politik Islam',
  institution: 'UIN Sunan Gunung Djati Bandung',
  description:
    'Website resmi Program Magister Pemikiran Politik Islam, Fakultas Ilmu Sosial dan Ilmu Politik UIN Sunan Gunung Djati Bandung.',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3002').replace(/\/+$/, ''),
} as const

const REVALIDATE_SECONDS = Number(process.env.API_REVALIDATE_SECONDS ?? '300')

function apiBaseUrl(): string | null {
  const url = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL
  return url ? url.replace(/\/+$/, '') : null
}

/** `lang` selain 'id' → ?lang= (terjemahan konten dari CMS bila ada). */
export async function getServerApi<T>(endpoint: string, lang?: string): Promise<T | null> {
  const base = apiBaseUrl()
  const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN
  if (!base || !domain) return null
  const url =
    lang && lang !== 'id' ? `${base}${endpoint}${endpoint.includes('?') ? '&' : '?'}lang=${encodeURIComponent(lang)}` : `${base}${endpoint}`

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json', 'X-Site-Domain': domain },
      next: { revalidate: REVALIDATE_SECONDS, tags: ['api'] },
      signal: AbortSignal.timeout(10_000),
    })
    return response.ok ? ((await response.json()) as T) : null
  } catch {
    return null
  }
}

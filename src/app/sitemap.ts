import type { MetadataRoute } from 'next'
import { getServerApi, SITE } from '@/lib/server-api'
import { LOCALES, localizePath } from '@/i18n/config'

// Dibuat saat diminta (data dari API), bukan saat build.
export const dynamic = 'force-dynamic'

const STATIC_PATHS = [
  '/',
  '/berita',
  '/profil/sejarah',
  '/profil/program',
  '/profil/lulusan',
  '/profil/visi',
  '/profil/dosen',
  '/profil/organisasi',
  '/profil/fasilitas',
  '/profil/kontak',
  '/akademik/kurikulum',
  '/akademik/kalender',
  '/akademik/matkul',
  '/akademik/panduan',
  '/akademik/kegiatan',
  '/akademik/admisi',
]

interface Row {
  slug: string
  updated_at?: string | null
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, events] = await Promise.all([
    getServerApi<{ data?: Row[] }>('/api/articles?limit=200'),
    getServerApi<{ data?: Row[] }>('/api/events?limit=200'),
  ])

  // Setiap halaman tercantum dalam semua bahasa, masing-masing dengan tautan hreflang ke versi lainnya.
  const entries = (path: string, row?: Row): MetadataRoute.Sitemap => {
    const languages = Object.fromEntries(LOCALES.map((l) => [l, `${SITE.url}${localizePath(path, l)}`]))
    return LOCALES.map((l) => ({
      url: languages[l],
      lastModified: row?.updated_at ? new Date(row.updated_at) : undefined,
      alternates: { languages },
    }))
  }

  return [
    ...STATIC_PATHS.flatMap((path) => entries(path)),
    ...(articles?.data ?? []).flatMap((row) => entries(`/berita/${row.slug}`, row)),
    ...(events?.data ?? []).flatMap((row) => entries(`/akademik/kegiatan/${row.slug}`, row)),
  ]
}

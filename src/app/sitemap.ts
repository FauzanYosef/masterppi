import type { MetadataRoute } from 'next'
import { getServerApi, SITE } from '@/lib/server-api'

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

  const entry = (path: string, row?: Row) => ({
    url: `${SITE.url}${path}`,
    lastModified: row?.updated_at ? new Date(row.updated_at) : undefined,
  })

  return [
    ...STATIC_PATHS.map((path) => entry(path)),
    ...(articles?.data ?? []).map((row) => entry(`/berita/${row.slug}`, row)),
    ...(events?.data ?? []).map((row) => entry(`/akademik/kegiatan/${row.slug}`, row)),
  ]
}

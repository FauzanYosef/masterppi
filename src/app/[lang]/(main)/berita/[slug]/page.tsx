import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import DetailBeritaPage from '@/components/Berita/Detail'
import { getImageUrl } from '@/lib/api'
import { getServerApi } from '@/lib/server-api'
import { getDictionary } from '@/i18n'
import { localizePath } from '@/i18n/config'
import { languageAlternates, resolveLang } from '@/i18n/metadata'

interface ArticleSummary {
  title: string
  excerpt: string | null
  cover_img: string | null
  published_at: string | null
  /** API ?lang=en: true bila sudah diterjemahkan di CMS. */
  translated?: boolean
}

type Props = { params: Promise<{ lang: string; slug: string }> }

async function getArticle(slug: string, lang?: string): Promise<ArticleSummary | null> {
  const res = await getServerApi<{ data?: ArticleSummary }>(`/api/articles/slug/${encodeURIComponent(slug)}`, lang)
  return res?.data ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const lang = await resolveLang(params)
  const t = getDictionary(lang)
  const article = await getArticle(slug, lang)
  if (!article) return { title: t.detail.notFoundMeta, robots: { index: false } }

  const description = article.excerpt?.slice(0, 160) || undefined
  const image = article.cover_img ? getImageUrl(article.cover_img) : undefined

  return {
    title: article.title,
    description,
    // Belum diterjemahkan di CMS: versi Indonesia jadi canonical (tanpa hreflang) agar tidak dianggap duplikat.
    alternates:
      lang !== 'id' && article.translated !== true
        ? { canonical: localizePath(`/berita/${slug}`, 'id') }
        : languageAlternates(`/berita/${slug}`, lang),
    openGraph: {
      type: 'article',
      title: article.title,
      description,
      siteName: t.site.name,
      publishedTime: article.published_at ?? undefined,
      images: image ? [{ url: image }] : undefined,
    },
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  // Slug yang tidak ada → 404 sungguhan (bukan halaman "tidak tersedia" berstatus 200).
  if (!(await getArticle(slug))) notFound()
  return <DetailBeritaPage />
}

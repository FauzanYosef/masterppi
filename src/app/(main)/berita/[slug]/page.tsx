import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import DetailBeritaPage from '@/components/Berita/Detail'
import { getImageUrl } from '@/lib/api'
import { getServerApi, SITE } from '@/lib/server-api'

interface ArticleSummary {
  title: string
  excerpt: string | null
  cover_img: string | null
  published_at: string | null
}

type Props = { params: Promise<{ slug: string }> }

async function getArticle(slug: string): Promise<ArticleSummary | null> {
  const res = await getServerApi<{ data?: ArticleSummary }>(`/api/articles/slug/${encodeURIComponent(slug)}`)
  return res?.data ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return { title: 'Berita tidak ditemukan', robots: { index: false } }

  const description = article.excerpt?.slice(0, 160) || undefined
  const image = article.cover_img ? getImageUrl(article.cover_img) : undefined

  return {
    title: article.title,
    description,
    alternates: { canonical: `/berita/${slug}` },
    openGraph: {
      type: 'article',
      title: article.title,
      description,
      siteName: SITE.name,
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

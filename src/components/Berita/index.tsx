'use client'

import PageHeader from '@/components/UI/PageHeader'
import PostCard, { PostCardSkeleton } from '@/components/UI/PostCard'
import Pagination from '@/components/UI/Pagination'
import EmptyState from '@/components/UI/EmptyState'
import { useEffect, useState } from 'react'
import {
  apiFetch,
  getImageUrl,
} from '@/lib/api'

/* =====================================================
   TYPE
===================================================== */

type Article = {
  id?: number
  title: string
  slug: string
  author: string | null
  content: string | null
  category: string | null
  published_date: string | null
  cover_img: string | null
}

type ArticleResponse = {
  success: boolean
  data: Article[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  message?: string
}

/* =====================================================
   HELPERS
===================================================== */

const stripHtml = (
  html?: string | null
) => {
  if (!html) return ''

  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

const formatDate = (
  date?: string | null
) => {
  if (!date) return ''

  return new Date(date).toLocaleDateString(
    'id-ID',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }
  )
}

/* =====================================================
   PAGE
===================================================== */

const BeritaPage = () => {
  const [data, setData] =
    useState<Article[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [page, setPage] =
    useState(1)

  const [limit, setLimit] =
    useState(9)

  const [total, setTotal] =
    useState(0)

  const [totalPage, setTotalPage] =
    useState(0)

  /* =====================================================
     FETCH ARTICLES
  ===================================================== */

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        setError('')

        const result =
          await apiFetch<ArticleResponse>(
            `/api/articles?page=${page}&limit=${limit}`,
            {
              method: 'GET',
              cache: 'no-store',
            }
          )

        if (result.success) {
          setData(result.data || [])

          setTotal(
            result.pagination?.total || 0
          )

          setTotalPage(
            result.pagination?.totalPages ||
              Math.ceil(
                (result.pagination?.total || 0) /
                  limit
              )
          )
        } else {
          setData([])

          setError(
            result.message ||
              'Gagal mengambil data berita'
          )
        }
      } catch (error) {
        console.error(
          'GET ARTICLES ERROR:',
          error
        )

        setError(
          error instanceof Error
            ? error.message
            : 'Gagal mengambil data berita'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [page, limit])

  /* =====================================================
     RANGE
  ===================================================== */

  const start =
    total === 0
      ? 0
      : (page - 1) * limit + 1

  const end =
    Math.min(page * limit, total)

  const header = (
    <PageHeader
      title="Berita & Informasi"
      description="Informasi terbaru seputar kegiatan, akademik, prestasi, dan berbagai aktivitas Program Magister Pemikiran Politik Islam."
    />
  )

  if (error) {
    return (
      <main className="bg-secondary dark:bg-darklight">
        {header}
        <div className="container py-16 lg:py-24">
          <EmptyState
            tone="error"
            title="Gagal memuat berita"
            description={error}
            action={
              <button onClick={() => window.location.reload()} className="btn-primary">
                Coba Lagi
              </button>
            }
          />
        </div>
      </main>
    )
  }

  return (
    <main className="bg-secondary dark:bg-darklight">
      {header}

      <div className="container py-16 lg:py-24">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : data.length === 0 ? (
          <EmptyState icon="tabler:news" title="Belum ada berita" description="Belum tersedia berita atau informasi untuk ditampilkan." />
        ) : (
          <>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm">
                Menampilkan <span className="font-semibold text-darkblue dark:text-white">{start}–{end}</span> dari{' '}
                <span className="font-semibold text-darkblue dark:text-white">{total}</span> berita
              </p>
              <label className="flex items-center gap-3 text-sm">
                Tampilkan
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value))
                    setPage(1)
                  }}
                  className="cursor-pointer rounded-full border border-darkblue/10 bg-white px-4 py-2 text-darkblue focus:border-primary focus:outline-none dark:border-white/15 dark:bg-lightdarkblue dark:text-white"
                >
                  {[6, 9, 12, 24].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {data.map((item) => (
                <PostCard
                  key={item.id ?? item.slug}
                  href={`/berita/${item.slug}`}
                  image={getImageUrl(item.cover_img)}
                  title={item.title}
                  excerpt={stripHtml(item.content).slice(0, 140) || 'Baca informasi selengkapnya mengenai berita ini.'}
                  category={item.category}
                  date={formatDate(item.published_date)}
                  footer={<span className="truncate">Oleh {item.author || 'Admin'}</span>}
                />
              ))}
            </div>

            <Pagination page={page} totalPages={totalPage} onChange={setPage} />
          </>
        )}
      </div>
    </main>
  )
}

export default BeritaPage

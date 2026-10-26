'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  apiFetch,
  getImageUrl,
} from '@/lib/api'

/* =====================================================
   TYPE
===================================================== */

type Article = {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  cover_img: string | null
  status: string
  published_at: string | null
  views: number
  category_id: number | null
  user_id: number | null
  created_at: string
  updated_at: string
  author?: string | null
  category?: string | null
}

type ArticleResponse = {
  success: boolean
  data: Article
  message?: string
}

/* =====================================================
   FORMAT DATE
===================================================== */

const formatDate = (date?: string | null) => {
  if (!date) return '-'

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return '-'
  }

  return parsedDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/* =====================================================
   FORMAT TIME
===================================================== */

const formatTime = (date?: string | null) => {
  if (!date) return ''

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return ''
  }

  return parsedDate.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/* =====================================================
   PAGE
===================================================== */

const DetailBeritaPage = () => {
  const params = useParams<{ slug: string | string[] }>()

  const slug = Array.isArray(params.slug)
    ? params.slug[0]
    : params.slug

  // Hasil per slug; "loading" = hasil belum untuk slug yang diminta.
  const [result, setResult] = useState<{
    slug?: string
    article: Article | null
    error: string
  } | null>(null)

  /* =====================================================
     FETCH ARTICLE BY SLUG
  ===================================================== */

  useEffect(() => {
    if (!slug) return

    let cancelled = false

    /*
     * PENTING:
     * Gunakan endpoint /slug/:slug,
     * bukan /articles/:id.
     */
    apiFetch<ArticleResponse>(
      `/api/articles/slug/${encodeURIComponent(slug)}`,
      {
        method: 'GET',
        cache: 'no-store',
        auth: false,
      }
    )
      .then((response) => {
        if (cancelled) return
        setResult(
          response.success && response.data
            ? { slug, article: response.data, error: '' }
            : { slug, article: null, error: response.message || 'Berita tidak ditemukan' }
        )
      })
      .catch((fetchError) => {
        if (cancelled) return
        console.error('GET ARTICLE DETAIL ERROR:', fetchError)
        setResult({
          slug,
          article: null,
          error:
            fetchError instanceof Error
              ? fetchError.message
              : 'Gagal mengambil detail berita',
        })
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  const current = result && result.slug === slug ? result : null
  const article = current?.article ?? null
  const loading = Boolean(slug) && !current
  const error = !slug ? 'Slug berita tidak ditemukan' : (current?.error ?? '')

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <main className="min-h-screen pt-[140px] pb-[100px] bg-gray-50 dark:bg-darklight">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-8" />

            <div className="h-[400px] md:h-[520px] rounded-[28px] bg-gray-200 dark:bg-gray-800 animate-pulse" />

            <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8 mt-8">
              <div className="bg-white dark:bg-dark rounded-3xl p-8 space-y-5">
                <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-5 w-1/2 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-5 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-5 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-5 w-5/6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              </div>

              <div className="h-72 bg-white dark:bg-dark rounded-3xl animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error || !article) {
    return (
      <main className="min-h-screen pt-[160px] pb-[100px] bg-gray-50 dark:bg-darklight">
        <div className="container">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-4xl">
              📰
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
              Berita Tidak Ditemukan
            </h1>

            <p className="mt-3 text-gray-500 dark:text-gray-400">
              {error || 'Data berita tidak tersedia.'}
            </p>

            <div className="flex justify-center gap-3 mt-8 flex-wrap">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition"
              >
                Coba Lagi
              </button>

              <Link
                href="/berita"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                ← Kembali ke Berita
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const imageUrl = getImageUrl(article.cover_img)

  /* =====================================================
     CONTENT
  ===================================================== */

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-darklight pt-[120px] pb-[100px]">
      <div className="container">
        <div className="max-w-6xl mx-auto">

          {/* BREADCRUMB */}

          <div className="flex flex-wrap items-center gap-2 text-sm mb-7">
            <Link
              href="/"
              className="text-gray-400 hover:text-primary transition"
            >
              Beranda
            </Link>

            <span className="text-gray-300">/</span>

            <Link
              href="/berita"
              className="text-gray-400 hover:text-primary transition"
            >
              Berita
            </Link>

            <span className="text-gray-300">/</span>

            <span className="text-gray-600 dark:text-gray-300 truncate max-w-[250px]">
              Detail
            </span>
          </div>

          {/* HERO */}

          <section className="relative overflow-hidden rounded-[28px] shadow-2xl bg-gray-900">
            <div className="relative h-[400px] md:h-[520px]">

              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={article.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white/60">
                  Gambar berita tidak tersedia
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10 pointer-events-none" />

              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none" />

              <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 lg:p-12">
                <div className="max-w-4xl">

                  <div className="mb-5">
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-sm font-medium">
                      {article.category || 'Berita'}
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-white">
                    {article.title}
                  </h1>

                  <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm md:text-base text-white/85">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📅</span>
                      <span>{formatDate(article.published_at)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-lg">⏰</span>
                      <span>{formatTime(article.published_at)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-lg">👁</span>
                      <span>{article.views || 0} kali dilihat</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </section>

          {/* MAIN CONTENT */}

          <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8 mt-8">

            {/* ARTICLE */}

            <article className="bg-white dark:bg-dark rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-7 md:p-10 lg:p-12">

                <div className="flex items-center gap-3 pb-6 mb-7 border-b border-gray-100 dark:border-gray-800">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="text-lg">✦</span>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400">
                      Berita
                    </p>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Informasi & Publikasi
                    </p>
                  </div>
                </div>

                {/* EXCERPT */}

                {article.excerpt && (
                  <div className="mb-8 p-5 md:p-6 rounded-2xl bg-primary/5 border-l-4 border-primary">
                    <p className="text-base md:text-lg font-medium leading-7 text-gray-700 dark:text-gray-200">
                      {article.excerpt}
                    </p>
                  </div>
                )}

                {/* CONTENT */}

                {article.content ? (
                  <div
                    className="
                      prose prose-lg prose-gray max-w-none dark:prose-invert
                      prose-headings:font-bold
                      prose-headings:text-gray-900
                      dark:prose-headings:text-white
                      prose-p:text-gray-600
                      dark:prose-p:text-gray-300
                      prose-p:leading-8
                      prose-li:text-gray-600
                      dark:prose-li:text-gray-300
                      prose-a:text-primary
                      prose-a:no-underline
                      hover:prose-a:underline
                      prose-strong:text-gray-800
                      dark:prose-strong:text-white
                      prose-img:rounded-2xl
                      prose-img:shadow-md
                      prose-blockquote:border-primary
                      prose-blockquote:text-gray-600
                      dark:prose-blockquote:text-gray-300
                      prose-table:text-sm
                    "
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: article.content,
                      }}
                    />
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="text-4xl mb-4">📝</div>
                    <p className="text-gray-400">
                      Isi berita belum tersedia.
                    </p>
                  </div>
                )}

              </div>
            </article>

            {/* SIDEBAR */}

            <aside className="space-y-5">

              <div className="bg-white dark:bg-dark rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                  Informasi Berita
                </h2>

                <div className="space-y-1">

                  {/* DATE */}

                  <div className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition">
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                      📅
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wider text-gray-400">
                        Dipublikasikan
                      </p>
                      <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {formatDate(article.published_at)}
                      </p>
                    </div>
                  </div>

                  {/* TIME */}

                  <div className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition">
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                      ⏰
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wider text-gray-400">
                        Waktu
                      </p>
                      <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {formatTime(article.published_at)}
                      </p>
                    </div>
                  </div>

                  {/* VIEWS */}

                  <div className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition">
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                      👁
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wider text-gray-400">
                        Dibaca
                      </p>
                      <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {article.views || 0} kali
                      </p>
                    </div>
                  </div>

                  {/* STATUS */}

                  <div className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition">
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                      ✓
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wider text-gray-400">
                        Status
                      </p>
                      <p className="mt-1 text-sm font-semibold text-emerald-600">
                        Dipublikasikan
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              <Link
                href="/berita"
                className="group flex items-center justify-center gap-3 w-full rounded-2xl bg-primary px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="transition-transform group-hover:-translate-x-1">
                  ←
                </span>
                Kembali ke Berita
              </Link>

            </aside>
          </div>

          {/* BOTTOM */}

          <div className="mt-8 pt-7 border-t border-gray-200 dark:border-gray-800">
            <Link
              href="/berita"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition"
            >
              <span>←</span>
              Lihat semua berita
            </Link>
          </div>

        </div>
      </div>
    </main>
  )
}

export default DetailBeritaPage
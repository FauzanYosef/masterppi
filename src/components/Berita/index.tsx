'use client'

import Image from 'next/image'
import Link from 'next/link'
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

  /* =====================================================
     PAGE NUMBERS
  ===================================================== */

  const getPageNumbers = () => {
    if (totalPage <= 5) {
      return Array.from(
        { length: totalPage },
        (_, index) => index + 1
      )
    }

    let startPage = Math.max(
      1,
      page - 2
    )

    const endPage = Math.min(
      totalPage,
      startPage + 4
    )

    if (endPage - startPage < 4) {
      startPage = Math.max(
        1,
        endPage - 4
      )
    }

    return Array.from(
      {
        length:
          endPage - startPage + 1,
      },
      (_, index) =>
        startPage + index
    )
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <main className="min-h-screen pt-[140px] pb-[100px] bg-gray-50 dark:bg-darklight">

        <div className="container">

          {/* Header Skeleton */}

          <div className="max-w-2xl mx-auto text-center mb-12">

            <div className="h-10 w-72 mx-auto bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />

            <div className="h-5 w-full max-w-xl mx-auto mt-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />

          </div>

          {/* Grid Skeleton */}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">

            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-dark rounded-3xl overflow-hidden"
              >

                <div className="h-56 bg-gray-200 dark:bg-gray-800 animate-pulse" />

                <div className="p-6 space-y-4">

                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />

                  <div className="h-6 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />

                  <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />

                  <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />

                </div>

              </div>
            ))}

          </div>

        </div>

      </main>
    )
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <main className="min-h-screen pt-[160px] pb-[100px] bg-gray-50 dark:bg-darklight">

        <div className="container">

          <div className="max-w-xl mx-auto text-center">

            <div className="w-20 h-20 mx-auto rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-4xl">
              ⚠️
            </div>

            <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
              Gagal Memuat Berita
            </h1>

            <p className="mt-3 text-gray-500 dark:text-gray-400">
              {error}
            </p>

            <button
              onClick={() =>
                window.location.reload()
              }
              className="mt-7 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition"
            >
              Coba Lagi
            </button>

          </div>

        </div>

      </main>
    )
  }

  return (
    <main className="min-h-screen pt-[140px] pb-[100px] bg-gray-50 dark:bg-darklight">

      <div className="container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="max-w-3xl mx-auto text-center mb-12">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
            <span>✦</span>
            <span>Informasi & Publikasi</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            Berita & Informasi
          </h1>

          <p className="mt-5 text-gray-500 dark:text-gray-400 leading-7 max-w-2xl mx-auto">
            Informasi terbaru seputar kegiatan,
            akademik, prestasi, dan berbagai
            aktivitas Program Magister Pemikiran
            Politik Islam.
          </p>

        </div>

        {/* =================================================
            TOOLBAR
        ================================================= */}

        {total > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

            {/* INFO */}

            <div className="text-sm text-gray-500 dark:text-gray-400">

              Menampilkan{' '}

              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {start}–{end}
              </span>

              {' '}dari{' '}

              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {total}
              </span>

              {' '}berita

            </div>

            {/* LIMIT */}

            <div className="flex items-center gap-3">

              <span className="text-sm text-gray-500">
                Tampilkan
              </span>

              <div className="bg-white dark:bg-dark border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 shadow-sm">

                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(
                      Number(e.target.value)
                    )
                    setPage(1)
                  }}
                  className="bg-transparent text-sm text-gray-700 dark:text-gray-200 focus:outline-none cursor-pointer"
                >
                  <option value={6}>
                    6
                  </option>

                  <option value={9}>
                    9
                  </option>

                  <option value={12}>
                    12
                  </option>

                  <option value={24}>
                    24
                  </option>
                </select>

              </div>

            </div>

          </div>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {data.length === 0 ? (
          <div className="max-w-xl mx-auto text-center py-20">

            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-4xl">
              📰
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-800 dark:text-white">
              Belum Ada Berita
            </h2>

            <p className="mt-3 text-gray-500 dark:text-gray-400">
              Belum tersedia berita atau informasi
              untuk ditampilkan.
            </p>

          </div>
        ) : (
          <>
            {/* =================================================
                GRID
            ================================================= */}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">

              {data.map((item) => {

                const imageUrl =
                  getImageUrl(
                    item.cover_img
                  )

                const description =
                  stripHtml(
                    item.content
                  )

                return (
                  <Link
                    key={
                      item.id ??
                      item.slug
                    }
                    href={`/berita/${item.slug}`}
                    className="group"
                  >

                    <article className="h-full bg-white dark:bg-dark rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

                      {/* IMAGE */}

                      <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-800">

                        <Image
                          src={imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />

                        {/* IMAGE GRADIENT */}

                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

                        {/* CATEGORY */}

                        <div className="absolute top-4 left-4">

                          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-primary text-xs font-semibold shadow-sm">
                            {item.category ||
                              'Umum'}
                          </span>

                        </div>

                      </div>

                      {/* BODY */}

                      <div className="p-6">

                        {/* DATE */}

                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">

                          <span>
                            📅
                          </span>

                          <span>
                            {formatDate(
                              item.published_date
                            )}
                          </span>

                        </div>

                        {/* TITLE */}

                        <h2 className="text-xl font-bold leading-snug text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors duration-300">
                          {item.title}
                        </h2>

                        {/* DESCRIPTION */}

                        <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400 line-clamp-3">
                          {description
                            ? `${description.slice(
                                0,
                                130
                              )}${
                                description.length >
                                130
                                  ? '...'
                                  : ''
                              }`
                            : 'Baca informasi selengkapnya mengenai berita ini.'}
                        </p>

                        {/* FOOTER */}

                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">

                          <div className="flex items-center gap-2 min-w-0">

                            <div className="w-8 h-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                              {(item.author ||
                                'A')
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {item.author ||
                                'Admin'}
                            </span>

                          </div>

                          <span className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">

                            Baca

                            <span>
                              →
                            </span>

                          </span>

                        </div>

                      </div>

                    </article>

                  </Link>
                )
              })}

            </div>

            {/* =================================================
                PAGINATION
            ================================================= */}

            {totalPage > 1 && (
              <div className="flex justify-center items-center gap-2 pt-12 flex-wrap">

                {/* PREVIOUS */}

                <button
                  onClick={() =>
                    setPage(
                      Math.max(
                        1,
                        page - 1
                      )
                    )
                  }
                  disabled={page === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  aria-label="Halaman sebelumnya"
                >
                  ←
                </button>

                {/* FIRST PAGE */}

                {page > 3 && (
                  <>
                    <button
                      onClick={() =>
                        setPage(1)
                      }
                      className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                      1
                    </button>

                    {page > 4 && (
                      <span className="px-1 text-gray-400">
                        ...
                      </span>
                    )}
                  </>
                )}

                {/* PAGE NUMBERS */}

                {getPageNumbers().map(
                  (pageNumber) => (
                    <button
                      key={
                        pageNumber
                      }
                      onClick={() =>
                        setPage(
                          pageNumber
                        )
                      }
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                        page ===
                        pageNumber
                          ? 'bg-primary text-white shadow-lg shadow-primary/20'
                          : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {
                        pageNumber
                      }
                    </button>
                  )
                )}

                {/* LAST PAGE */}

                {page <
                  totalPage - 2 && (
                  <>
                    {page <
                      totalPage -
                        3 && (
                      <span className="px-1 text-gray-400">
                        ...
                      </span>
                    )}

                    <button
                      onClick={() =>
                        setPage(
                          totalPage
                        )
                      }
                      className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                      {
                        totalPage
                      }
                    </button>
                  </>
                )}

                {/* NEXT */}

                <button
                  onClick={() =>
                    setPage(
                      Math.min(
                        totalPage,
                        page + 1
                      )
                    )
                  }
                  disabled={
                    page ===
                    totalPage
                  }
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  aria-label="Halaman berikutnya"
                >
                  →
                </button>

              </div>
            )}

          </>
        )}

      </div>

    </main>
  )
}

export default BeritaPage
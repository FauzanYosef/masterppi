'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  apiFetch,
  getImageUrl,
} from '@/lib/api'

const LIMIT = 6

type Event = {
  id: number
  faculty_id: number | null
  study_program_id: number | null
  title: string
  slug: string
  description: string | null
  category: string | null
  location: string | null
  start_date: string
  end_date: string | null
  cover_image: string | null
  status:
    | 'draft'
    | 'published'
    | 'cancelled'
    | 'completed'
}

type EventResponse = {
  success: boolean
  message?: string
  data: Event[]
  total: number
  page: number
  limit: number
  totalPages: number
}

const EventPage = () => {
  const [page, setPage] = useState(1)
  // Hasil per halaman; "loading" = hasil belum untuk halaman yang diminta.
  const [result, setResult] = useState<{
    page: number
    data: Event[]
    total: number
    totalPages: number
    error: string
  } | null>(null)

  useEffect(() => {
    let active = true

    apiFetch<EventResponse>(`/api/events?page=${page}&limit=${LIMIT}`, {
      method: 'GET',
      cache: 'no-store',
    })
      .then((response) => {
        if (!response.success) {
          throw new Error(response.message || 'Gagal mengambil data kegiatan')
        }
        if (!active) return
        setResult({
          page,
          data: response.data || [],
          total: response.total || 0,
          totalPages: response.totalPages || 0,
          error: '',
        })
      })
      .catch((err) => {
        console.error('FETCH EVENTS ERROR:', err)
        if (!active) return
        setResult({
          page,
          data: [],
          total: 0,
          totalPages: 0,
          error:
            err instanceof Error
              ? err.message
              : 'Terjadi kesalahan saat mengambil data kegiatan',
        })
      })

    return () => {
      active = false
    }
  }, [page])

  const loading = result?.page !== page
  const data = result?.data ?? []
  const total = result?.total ?? 0
  const totalPages = result?.totalPages ?? 0
  const error = result && result.page === page ? result.error : ''

  const formatDate = (
    date?: string | null
  ) => {
    if (!date) return ''

    return new Date(
      date
    ).toLocaleDateString(
      'id-ID',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }
    )
  }

  const getStatusLabel = (
    status: Event['status']
  ) => {
    switch (status) {
      case 'published':
        return 'Akan Datang'

      case 'completed':
        return 'Selesai'

      case 'cancelled':
        return 'Dibatalkan'

      case 'draft':
        return 'Draft'

      default:
        return status
    }
  }

  const getStatusClass = (
    status: Event['status']
  ) => {
    switch (status) {
      case 'published':
        return 'bg-blue-500'

      case 'completed':
        return 'bg-gray-500'

      case 'cancelled':
        return 'bg-red-500'

      case 'draft':
        return 'bg-yellow-500'

      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="pt-[160px] pb-[120px] dark:bg-darklight">

      <div className="container space-y-14">

        {/* HEADER */}
        <div className="mx-auto max-w-2xl space-y-4 text-center">

          <h1 className="text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
            Agenda & Kegiatan
          </h1>

          <p className="text-gray-500 dark:text-gray-400">
            Informasi agenda dan kegiatan akademik
            Program Magister Pemikiran Politik Islam,
            mencakup seminar, workshop, dan diskusi
            ilmiah.
          </p>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              Memuat agenda...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">

            <p className="font-medium text-red-600">
              Gagal memuat agenda
            </p>

            <p className="mt-2 text-sm text-red-500">
              {error}
            </p>

          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          data.length === 0 && (
            <div className="py-12 text-center">

              <p className="text-gray-500">
                Belum ada agenda tersedia.
              </p>

            </div>
          )}

        {/* DATA */}
        {!loading &&
          !error &&
          data.length > 0 && (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

                {data.map((item) => (

                  <Link
                    key={item.id}
                    href={`/akademik/kegiatan/${item.slug}`}
                    className="group block"
                  >

                    <div className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-xl dark:bg-dark">

                      {/* IMAGE */}
                      <div className="relative h-52 overflow-hidden">

                        <Image
                          src={
                            getImageUrl(
                              item.cover_image
                            )
                          }
                          alt={item.title}
                          fill
                          className="object-cover transition duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />

                        {/* STATUS */}
                        <span
                          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs text-white ${getStatusClass(
                            item.status
                          )}`}
                        >
                          {getStatusLabel(
                            item.status
                          )}
                        </span>

                      </div>

                      {/* CONTENT */}
                      <div className="space-y-3 p-5">

                        {/* CATEGORY + DATE */}
                        <div className="flex items-center justify-between gap-3">

                          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            {item.category ||
                              'Umum'}
                          </span>

                          <span className="text-xs text-gray-500">
                            {formatDate(
                              item.start_date
                            )}
                          </span>

                        </div>

                        {/* TITLE */}
                        <h3 className="line-clamp-2 text-lg font-semibold text-gray-800 transition group-hover:text-primary dark:text-white">
                          {item.title}
                        </h3>

                        {/* DESCRIPTION */}
                        <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
                          {item.description
                            ? item.description.length >
                              120
                              ? item.description.slice(
                                  0,
                                  120
                                ) + '...'
                              : item.description
                            : 'Belum ada deskripsi.'}
                        </p>

                        {/* LOCATION */}
                        <p className="text-xs text-gray-400">
                          📍{' '}
                          {item.location ||
                            'Lokasi belum tersedia'}
                        </p>

                      </div>

                    </div>

                  </Link>

                ))}

              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-10">

                  {/* PREV */}
                  <button
                    onClick={() =>
                      setPage(
                        (current) =>
                          current - 1
                      )
                    }
                    disabled={page === 1}
                    className="rounded-lg border px-4 py-2 text-sm transition hover:bg-gray-100 disabled:opacity-40 dark:hover:bg-dark"
                  >
                    ← Prev
                  </button>

                  {/* NUMBER */}
                  {Array.from(
                    {
                      length: totalPages,
                    },
                    (_, index) =>
                      index + 1
                  ).map(
                    (pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() =>
                          setPage(
                            pageNumber
                          )
                        }
                        className={`rounded-lg px-4 py-2 text-sm transition ${
                          page ===
                          pageNumber
                            ? 'bg-primary text-white shadow'
                            : 'border hover:bg-gray-100 dark:hover:bg-dark'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    )
                  )}

                  {/* NEXT */}
                  <button
                    onClick={() =>
                      setPage(
                        (current) =>
                          current + 1
                      )
                    }
                    disabled={
                      page === totalPages
                    }
                    className="rounded-lg border px-4 py-2 text-sm transition hover:bg-gray-100 disabled:opacity-40 dark:hover:bg-dark"
                  >
                    Next →
                  </button>

                </div>
              )}

              {/* TOTAL */}
              <p className="text-center text-sm text-gray-400">
                Menampilkan {data.length} dari{' '}
                {total} kegiatan
              </p>

            </>
          )}

      </div>
    </div>
  )
}

export default EventPage
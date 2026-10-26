'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  apiFetch,
  getImageUrl,
} from '@/lib/api'

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
  created_at: string
  updated_at: string
}

type EventResponse = {
  success: boolean
  data: Event
  message?: string
}

/* =====================================================
   FORMAT DATE
===================================================== */

const formatDate = (
  date?: string | null
) => {
  if (!date) return '-'

  return new Date(date).toLocaleDateString(
    'id-ID',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  )
}

/* =====================================================
   FORMAT TIME
===================================================== */

const formatTime = (
  date?: string | null
) => {
  if (!date) return '-'

  return new Date(date).toLocaleTimeString(
    'id-ID',
    {
      hour: '2-digit',
      minute: '2-digit',
    }
  )
}

/* =====================================================
   STATUS LABEL
===================================================== */

const getStatusLabel = (
  event: Event
) => {
  if (event.status === 'cancelled') {
    return 'Dibatalkan'
  }

  if (event.status === 'completed') {
    return 'Selesai'
  }

  if (event.status === 'draft') {
    return 'Draft'
  }

  const now = new Date()
  const start = new Date(event.start_date)

  const end = event.end_date
    ? new Date(event.end_date)
    : start

  if (now < start) {
    return 'Akan Datang'
  }

  if (now >= start && now <= end) {
    return 'Sedang Berlangsung'
  }

  return 'Selesai'
}

/* =====================================================
   STATUS STYLE
===================================================== */

const getStatusClass = (
  event: Event
) => {
  if (event.status === 'cancelled') {
    return 'bg-red-500/90'
  }

  if (event.status === 'completed') {
    return 'bg-gray-600/90'
  }

  if (event.status === 'draft') {
    return 'bg-yellow-500/90'
  }

  const now = new Date()
  const start = new Date(event.start_date)

  const end = event.end_date
    ? new Date(event.end_date)
    : start

  if (now < start) {
    return 'bg-blue-500/90'
  }

  if (now >= start && now <= end) {
    return 'bg-emerald-500/90'
  }

  return 'bg-gray-600/90'
}

/* =====================================================
   PAGE
===================================================== */

const EventDetailPage = () => {
  const params = useParams()

  const slug = Array.isArray(params.slug)
    ? params.slug[0]
    : params.slug

  const [event, setEvent] =
    useState<Event | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  /* =====================================================
     FETCH EVENT
  ===================================================== */

  useEffect(() => {
    if (!slug) return

    const fetchEvent = async () => {
      try {
        setLoading(true)
        setError('')

        const result =
          await apiFetch<EventResponse>(
            `/api/events/${encodeURIComponent(
              slug
            )}`,
            {
              method: 'GET',
              cache: 'no-store',
            }
          )

        if (result.success) {
          setEvent(result.data)
        } else {
          setError(
            result.message ||
              'Kegiatan tidak ditemukan'
          )
        }
      } catch (error) {
        console.error(
          'GET EVENT DETAIL ERROR:',
          error
        )

        setError(
          error instanceof Error
            ? error.message
            : 'Gagal mengambil data kegiatan'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [slug])

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <main className="min-h-screen pt-[140px] pb-24 bg-gray-50 dark:bg-darklight">

        <div className="container">

          <div className="max-w-5xl mx-auto">

            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-8" />

            <div className="h-[420px] md:h-[520px] bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse" />

            <div className="mt-8 space-y-4">

              <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />

              <div className="h-5 w-1/2 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />

              <div className="h-5 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />

            </div>

          </div>

        </div>

      </main>
    )
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error || !event) {
    return (
      <main className="min-h-screen pt-[160px] pb-24 bg-gray-50 dark:bg-darklight">

        <div className="container">

          <div className="max-w-xl mx-auto text-center">

            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-4xl">
              📅
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
              Kegiatan Tidak Ditemukan
            </h1>

            <p className="mt-3 text-gray-500 dark:text-gray-400">
              {error ||
                'Data kegiatan tidak tersedia.'}
            </p>

            <Link
              href="/akademik/kegiatan"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition"
            >
              <span>←</span>
              Kembali ke Kegiatan
            </Link>

          </div>

        </div>

      </main>
    )
  }

  const imageUrl =
    getImageUrl(event.cover_image)

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-darklight pt-[120px] pb-24">

      {/* =================================================
          BREADCRUMB
      ================================================= */}

      <div className="container mb-7">

        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm">

          <Link
            href="/"
            className="text-gray-400 hover:text-primary transition"
          >
            Beranda
          </Link>

          <span className="text-gray-300">
            /
          </span>

          <Link
            href="/akademik/kegiatan"
            className="text-gray-400 hover:text-primary transition"
          >
            Kegiatan
          </Link>

          <span className="text-gray-300">
            /
          </span>

          <span className="text-gray-600 dark:text-gray-300 truncate">
            Detail
          </span>

        </div>

      </div>

      <div className="container">

        <div className="max-w-6xl mx-auto">

          {/* =================================================
              HERO
          ================================================= */}

          <section className="relative overflow-hidden rounded-[28px] shadow-2xl bg-gray-900">

            {/* Image */}

            <div className="relative h-[420px] md:h-[540px]">

              <Image
                src={imageUrl}
                alt={event.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
              />

              {/* Gradient */}

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/5" />

              {/* Additional gradient */}

              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

              {/* Hero Content */}

              <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 lg:p-12">

                <div className="max-w-4xl">

                  {/* Badge */}

                  <div className="flex flex-wrap gap-3 mb-5">

                    {event.category && (
                      <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-sm font-medium">
                        {event.category}
                      </span>
                    )}

                    <span
                      className={`inline-flex items-center px-4 py-2 rounded-full backdrop-blur-md border border-white/20 text-white text-sm font-medium ${getStatusClass(
                        event
                      )}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white mr-2" />
                      {getStatusLabel(event)}
                    </span>

                  </div>

                  {/* Title */}

                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-white tracking-tight">
                    {event.title}
                  </h1>

                  {/* Meta */}

                  <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-sm md:text-base text-white/85">

                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        📅
                      </span>

                      <span>
                        {formatDate(
                          event.start_date
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        ⏰
                      </span>

                      <span>
                        {formatTime(
                          event.start_date
                        )}

                        {event.end_date &&
                          ` - ${formatTime(
                            event.end_date
                          )}`}
                      </span>
                    </div>

                    {event.location && (
                      <div className="flex items-center gap-2">

                        <span className="text-lg">
                          📍
                        </span>

                        <span>
                          {event.location}
                        </span>

                      </div>
                    )}

                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              MAIN CONTENT
          ================================================= */}

          <div className="grid lg:grid-cols-[minmax(0,1fr)_330px] gap-8 mt-8">

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <article className="bg-white dark:bg-dark rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">

              <div className="p-7 md:p-10">

                <div className="flex items-center gap-3 mb-7">

                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="text-lg">
                      ✦
                    </span>
                  </div>

                  <div>

                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                      Tentang Kegiatan
                    </h2>

                    <p className="text-sm text-gray-400 mt-1">
                      Informasi dan deskripsi kegiatan
                    </p>

                  </div>

                </div>

                {event.description ? (
                  <div
                    className="
                      prose
                      prose-gray
                      max-w-none
                      dark:prose-invert

                      prose-headings:font-bold
                      prose-headings:text-gray-900
                      dark:prose-headings:text-white

                      prose-p:text-gray-600
                      dark:prose-p:text-gray-300

                      prose-p:leading-8

                      prose-li:text-gray-600
                      dark:prose-li:text-gray-300

                      prose-a:text-primary

                      prose-strong:text-gray-800
                      dark:prose-strong:text-white
                    "
                  >

                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          event.description,
                      }}
                    />

                  </div>
                ) : (
                  <div className="py-10 text-center">

                    <div className="text-4xl mb-3">
                      📝
                    </div>

                    <p className="text-gray-400">
                      Belum ada deskripsi kegiatan.
                    </p>

                  </div>
                )}

              </div>

            </article>

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="space-y-5">

              {/* Information Card */}

              <div className="bg-white dark:bg-dark rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                  Informasi Kegiatan
                </h3>

                <div className="space-y-1">

                  {/* Date */}

                  <div className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition">

                    <div className="w-11 h-11 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="text-lg">
                        📅
                      </span>
                    </div>

                    <div className="min-w-0">

                      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Tanggal
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {formatDate(
                          event.start_date
                        )}
                      </p>

                    </div>

                  </div>

                  {/* Time */}

                  <div className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition">

                    <div className="w-11 h-11 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="text-lg">
                        ⏰
                      </span>
                    </div>

                    <div className="min-w-0">

                      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Waktu
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {formatTime(
                          event.start_date
                        )}

                        {event.end_date &&
                          ` - ${formatTime(
                            event.end_date
                          )}`}
                      </p>

                    </div>

                  </div>

                  {/* Location */}

                  <div className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition">

                    <div className="w-11 h-11 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="text-lg">
                        📍
                      </span>
                    </div>

                    <div className="min-w-0">

                      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Lokasi
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {event.location ||
                          'Lokasi belum tersedia'}
                      </p>

                    </div>

                  </div>

                  {/* Category */}

                  <div className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition">

                    <div className="w-11 h-11 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="text-lg">
                        🏷️
                      </span>
                    </div>

                    <div className="min-w-0">

                      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Kategori
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {event.category ||
                          'Umum'}
                      </p>

                    </div>

                  </div>

                  {/* Status */}

                  <div className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition">

                    <div className="w-11 h-11 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="text-lg">
                        ✓
                      </span>
                    </div>

                    <div className="min-w-0">

                      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Status
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {getStatusLabel(
                          event
                        )}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* Back Button */}

              <Link
                href="/akademik/kegiatan"
                className="group flex items-center justify-center gap-3 w-full rounded-2xl bg-primary px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >

                <span className="transition-transform group-hover:-translate-x-1">
                  ←
                </span>

                Kembali ke Agenda

              </Link>

            </aside>

          </div>

          {/* =================================================
              BOTTOM NAVIGATION
          ================================================= */}

          <div className="mt-8 pt-7 border-t border-gray-200 dark:border-gray-800">

            <Link
              href="/akademik/kegiatan"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition"
            >
              <span>
                ←
              </span>

              Lihat semua agenda dan kegiatan

            </Link>

          </div>

        </div>

      </div>

    </main>
  )
}

export default EventDetailPage
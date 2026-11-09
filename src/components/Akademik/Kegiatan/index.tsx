'use client'

import PageHeader from '@/components/UI/PageHeader'
import { Icon } from '@iconify/react'
import PostCard, { PostCardSkeleton, formatDateId, stripHtml } from '@/components/UI/PostCard'
import EventStatusBadge from '@/components/UI/EventStatusBadge'
import Pagination from '@/components/UI/Pagination'
import EmptyState from '@/components/UI/EmptyState'
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

  return (
    <main className="bg-white dark:bg-darklight">
      <PageHeader
        title="Kegiatan Akademik"
        description="Agenda dan kegiatan akademik yang mendorong pertukaran gagasan, penguatan riset, dan keterlibatan publik."
      />

      <div className="container py-16 lg:py-24">

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            tone="error"
            title="Gagal memuat kegiatan"
            description={error}
            action={
              <button onClick={() => window.location.reload()} className="btn-primary">
                Coba Lagi
              </button>
            }
          />
        ) : data.length === 0 ? (
          <EmptyState icon="tabler:calendar-event" title="Belum ada kegiatan" description="Belum tersedia kegiatan untuk ditampilkan." />
        ) : (
          <>
            <p className="mb-8 text-sm">
              <span className="font-semibold text-darkblue dark:text-white">{total}</span> kegiatan ditemukan
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {data.map((item) => (
                <PostCard
                  key={item.id}
                  href={`/akademik/kegiatan/${item.slug}`}
                  image={getImageUrl(item.cover_image)}
                  title={item.title}
                  excerpt={stripHtml(item.description, 140) || 'Belum ada deskripsi.'}
                  category={item.category}
                  date={formatDateId(item.start_date)}
                  badge={<EventStatusBadge status={item.status} />}
                  footer={
                    <span className="flex items-center gap-1.5">
                      <Icon icon="tabler:map-pin" width={14} className="shrink-0" aria-hidden />
                      <span className="truncate">{item.location || 'Lokasi belum tersedia'}</span>
                    </span>
                  }
                />
              ))}
            </div>

            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </main>
  )
}

export default EventPage

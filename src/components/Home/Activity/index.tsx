'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { apiFetch, getImageUrl } from '@/lib/api'
import EmptyState from '@/components/UI/EmptyState'
import SectionHeading from '@/components/UI/SectionHeading'
import PostCard, { PostCardSkeleton, formatDateId, stripHtml } from '@/components/UI/PostCard'
import EventStatusBadge from '@/components/UI/EventStatusBadge'

type EventType = {
  id?: number
  title: string
  slug: string
  description?: string
  category?: string
  start_date?: string
  cover_image?: string
  location?: string
  status?: string
}

type EventsResponse = {
  success: boolean
  data: EventType[]
}

const Activity = () => {
  const [events, setEvents] = useState<EventType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFetch<EventsResponse>('/api/events')
        // Tiga agenda terbaru.
        const time = (date?: string) => (date ? new Date(date).getTime() : 0)
        setEvents([...(response.data || [])].sort((a, b) => time(b.start_date) - time(a.start_date)).slice(0, 3))
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <section id='agenda' className='scroll-mt-24 bg-white dark:bg-darklight'>
      <div className='container'>
        <SectionHeading
          align='left'
          eyebrow='Agenda'
          title='Agenda dan Kegiatan'
          description='Agenda dan kegiatan akademik yang mendorong pertukaran gagasan, penguatan riset, dan keterlibatan publik di tingkat nasional hingga global.'
          action={
            <Link href='/akademik/kegiatan' className='btn-outline'>
              Semua Kegiatan
              <Icon icon='tabler:arrow-right' width={18} aria-hidden />
            </Link>
          }
        />

        {loading ? (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8'>
            {Array.from({ length: 3 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <EmptyState icon='tabler:calendar-event' title='Belum ada agenda' description='Agenda dan kegiatan terbaru akan tampil di sini.' />
        ) : (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8'>
            {events.map((item) => (
              <PostCard
                key={item.id ?? item.slug}
                href={`/akademik/kegiatan/${item.slug}`}
                image={getImageUrl(item.cover_image)}
                title={item.title}
                excerpt={stripHtml(item.description, 140) || 'Tidak ada deskripsi.'}
                category={item.category}
                date={formatDateId(item.start_date)}
                badge={<EventStatusBadge status={item.status} />}
                footer={
                  <span className='flex items-center gap-1.5 truncate'>
                    <Icon icon='tabler:map-pin' width={14} className='shrink-0' aria-hidden />
                    <span className='truncate'>{item.location || 'Lokasi belum tersedia'}</span>
                  </span>
                }
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Activity

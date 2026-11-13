'use client'

import { useEffect, useState } from 'react'
import Link from '@/components/UI/LocaleLink'
import { Icon } from '@iconify/react'
import { apiFetch, getImageUrl } from '@/lib/api'
import EmptyState from '@/components/UI/EmptyState'
import SectionHeading from '@/components/UI/SectionHeading'
import PostCard, { PostCardSkeleton, stripHtml } from '@/components/UI/PostCard'
import { useI18n } from '@/i18n/I18nProvider'
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
  const { t, date } = useI18n()
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
          eyebrow={t.home.agenda.eyebrow}
          title={t.home.agenda.title}
          description={t.home.agenda.description}
          action={
            <Link href='/akademik/kegiatan' className='btn-outline'>
              {t.home.agenda.all}
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
          <EmptyState icon='tabler:calendar-event' title={t.home.agenda.empty} description={t.home.agenda.emptyHint} />
        ) : (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8'>
            {events.map((item) => (
              <PostCard
                key={item.id ?? item.slug}
                href={`/akademik/kegiatan/${item.slug}`}
                image={getImageUrl(item.cover_image)}
                title={item.title}
                excerpt={stripHtml(item.description, 140) || t.common.noDescription}
                category={item.category}
                date={date(item.start_date)}
                badge={<EventStatusBadge status={item.status} />}
                footer={
                  <span className='flex items-center gap-1.5 truncate'>
                    <Icon icon='tabler:map-pin' width={14} className='shrink-0' aria-hidden />
                    <span className='truncate'>{item.location || t.common.locationUnavailable}</span>
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

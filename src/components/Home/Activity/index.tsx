'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { apiFetch, getImageUrl } from '@/lib/api'

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
        const response = await apiFetch<EventsResponse>(
          '/api/events'
        )

        // Ambil hanya 3 event terbaru
        const latestEvents = [...(response.data || [])]
          .sort((a, b) => {
            const dateA = a.start_date
              ? new Date(a.start_date).getTime()
              : 0

            const dateB = b.start_date
              ? new Date(b.start_date).getTime()
              : 0

            return dateB - dateA
          })
          .slice(0, 3)

        setEvents(latestEvents)
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (date?: string) => {
    if (!date) return ''

    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <section
      id="agenda"
      className="relative bg-white dark:bg-darklight scroll-mt-12 py-16"
    >
      <div className="container">

        {/* HEADER */}
        <div className="text-center mb-12">
          <h2 className="mb-6">
            Agenda dan Kegiatan
          </h2>

          <p className="text-lg font-normal max-w-2xl mx-auto">
            Laman ini menyajikan informasi agenda dan kegiatan akademik
            Program Magister Pemikiran Politik Islam yang mendorong
            pertukaran gagasan, penguatan riset, dan keterlibatan publik
            di tingkat nasional hingga global.
          </p>
        </div>

        {/* LOADING */}
        {loading ? (
          <p className="text-center">
            Loading...
          </p>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-500">
            Belum ada agenda dan kegiatan.
          </p>
        ) : (
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 items-stretch">

            {events.map((item) => (
              <Link
                key={item.id ?? item.slug}
                href={`/agenda/${item.slug}`}
                className="group h-full"
              >
                <div className="bg-white dark:bg-dark rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 h-full flex flex-col">

                  {/* IMAGE */}
                  <div className="relative w-full h-52 shrink-0 overflow-hidden">
                    <Image
                      src={getImageUrl(item.cover_image)}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />

                    {/* STATUS BADGE */}
                    <span
                      className={`
                        absolute top-3 left-3 text-xs px-3 py-1 rounded-full text-white
                        ${
                          item.status === 'upcoming'
                            ? 'bg-blue-500'
                            : ''
                        }
                        ${
                          item.status === 'ongoing'
                            ? 'bg-green-500'
                            : ''
                        }
                        ${
                          item.status === 'finished'
                            ? 'bg-gray-500'
                            : ''
                        }
                        ${
                          !['upcoming', 'ongoing', 'finished'].includes(
                            item.status || ''
                          )
                            ? 'bg-primary'
                            : ''
                        }
                      `}
                    >
                      {item.status || 'upcoming'}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6 flex flex-col flex-1">

                    {/* CATEGORY + DATE */}
                    <div className="flex justify-between items-center gap-3 text-sm mb-3">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs shrink-0">
                        {item.category || 'Umum'}
                      </span>

                      <span className="text-gray-500 text-xs whitespace-nowrap">
                        {formatDate(item.start_date)}
                      </span>
                    </div>

                    {/* TITLE */}
                    <h5 className="font-bold text-lg line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition">
                      {item.title}
                    </h5>

                    {/* DESCRIPTION */}
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 min-h-[4.5rem] mt-3">
                      {item.description
                        ? item.description.length > 100
                          ? `${item.description.slice(0, 100)}...`
                          : item.description
                        : 'Tidak ada deskripsi.'}
                    </p>

                    {/* LOCATION */}
                    <p className="text-xs text-gray-400 mt-auto pt-4">
                      📍 {item.location || 'Lokasi belum tersedia'}
                    </p>

                  </div>
                </div>
              </Link>
            ))}

          </div>
        )}
      </div>

      {/* FLOATING */}
      <div className="absolute top-28 -left-9 dark:opacity-5">
        <Image
          src="/images/banner/pattern1.svg"
          alt="pattern"
          width={141}
          height={141}
        />
      </div>

      <div className="absolute -bottom-7 -right-7 dark:opacity-5 z-10">
        <Image
          src="/images/banner/pattern2.svg"
          alt="pattern"
          width={141}
          height={141}
        />
      </div>
    </section>
  )
}

export default Activity

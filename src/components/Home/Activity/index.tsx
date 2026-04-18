'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type EventType = {
  title: string
  slug: string
  description?: string
  category?: string
  start_date?: string
  cover_img?: string
  location?: string
  status?: string
}

const Activity = () => {
  const [events, setEvents] = useState<EventType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('title, slug, description, category, start_date, cover_img, location, status')
          .order('start_date', { ascending: false }) // 🔥 terbaru dulu
          .limit(3) // 🔥 hanya 3 data

        if (error) console.error(error)
        if (data) setEvents(data)
      } catch (error) {
        console.error('Error fetching events', error)
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
    <section id='agenda' className='relative bg-white dark:bg-darklight scroll-mt-12 py-16'>
      <div className='container'>

        {/* HEADER */}
        <div className='text-center mb-12'>
          <h2 className='mb-6'>Agenda dan Kegiatan</h2>
          <p className='text-lg font-normal max-w-2xl mx-auto'>
            Laman ini menyajikan informasi agenda dan kegiatan akademik Program Magister Pemikiran Politik Islam yang mendorong pertukaran gagasan, penguatan riset, dan keterlibatan publik di tingkat nasional hingga global.
          </p>
        </div>

        {/* LOADING */}
        {loading ? (
          <p className='text-center'>Loading...</p>
        ) : (
          <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8'>

            {events.map((item) => (
              <Link
                key={item.slug}
                href={`/agenda/${item.slug}`}
                className='group'
              >
                <div className='bg-white dark:bg-dark rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300'>

                  {/* IMAGE */}
                  <div className='relative w-full h-52 overflow-hidden'>
                    <Image
                      src={item.cover_img || '/images/default-news.jpg'}
                      alt={item.title}
                      fill
                      className='object-cover group-hover:scale-105 transition'
                    />

                    {/* STATUS BADGE */}
                    <span className={`
                      absolute top-3 left-3 text-xs px-3 py-1 rounded-full text-white
                      ${item.status === 'upcoming' && 'bg-blue-500'}
                      ${item.status === 'ongoing' && 'bg-green-500'}
                      ${item.status === 'finished' && 'bg-gray-500'}
                    `}>
                      {item.status || 'upcoming'}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className='p-6 space-y-3'>

                    <div className='flex justify-between items-center text-sm'>
                      <span className='px-3 py-1 bg-primary/10 text-primary rounded-full text-xs'>
                        {item.category || 'Umum'}
                      </span>

                      <span className='text-gray-500 text-xs'>
                        {formatDate(item.start_date)}
                      </span>
                    </div>

                    <h5 className='font-bold text-lg line-clamp-2 group-hover:text-primary transition'>
                      {item.title}
                    </h5>

                    <p className='text-sm text-gray-600 dark:text-gray-300 line-clamp-3'>
                      {item.description?.slice(0, 100)}...
                    </p>

                    <p className='text-xs text-gray-400'>
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
      <div className='absolute top-28 -left-9 dark:opacity-5'>
        <Image src='/images/banner/pattern1.svg' alt='pattern' width={141} height={141} />
      </div>

      <div className='absolute -bottom-7 -right-7 dark:opacity-5 z-10'>
        <Image src='/images/banner/pattern2.svg' alt='pattern' width={141} height={141} />
      </div>
    </section>
  )
}

export default Activity
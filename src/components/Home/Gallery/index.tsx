'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import CategorySkeleton from '../../Skeleton/Category'
import { supabase } from '@/lib/supabase'

type GalleryItem = {
  imgSrc: string
  title: string
  slug: string
}

const Category = () => {
  const [category, setCategory] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: events } = await supabase
          .from('events')
          .select('id, title, slug, cover_img')
          .order('start_date', { ascending: false })
          .limit(5)

        if (!events) return

        const mapped: GalleryItem[] = await Promise.all(
          events.map(async (event) => {
            const { data: gallery } = await supabase
              .from('event_galleries')
              .select('image_url')
              .eq('event_id', event.id)
              .limit(1)
              .maybeSingle()

            return {
              imgSrc:
                gallery?.image_url ||
                event.cover_img ||
                '/images/default-news.jpg',
              title: event.title,
              slug: event.slug,
            }
          })
        )

        setCategory(mapped)
      } catch (error) {
        console.error('Error fetching gallery', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <section id='categories' className='scroll-mt-12'>
      <div className='container'>
        <div className='text-center'>
          <h2>Gallery</h2>
          <p className='text-lg font-normal max-w-sm md:max-w-md lg:max-w-2xl mx-auto my-6 px-4'>
            Terhubung bersama kami di Instagram untuk mengikuti perkembangan riset, diskusi ilmiah, serta berbagai agenda akademik terbaru.
          </p>
        </div>

        {/* GRID TETAP */}
        <div>
          <div className='grid lg:grid-cols-4 grid-cols-2 gap-6'>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <CategorySkeleton key={i} />
                ))
              : category.map((item, i) => (
                  <div
                    key={i}
                    className={`${
                      i === 0
                        ? 'col-span-2 row-span-2'
                        : 'sm:col-span-1 col-span-2 row-span-1'
                    }`}
                  >
                    {/* 🔥 FIX: BOX GRID FULL */}
                    <div className='relative w-full h-full min-h-[200px] lg:min-h-[250px] group overflow-hidden rounded-lg'>

                      {/* IMAGE FULL COVER */}
                      <Image
                        src={item.imgSrc}
                        alt={item.title}
                        fill
                        className='object-cover rounded-lg transition duration-500 group-hover:scale-110'
                      />

                      {/* OVERLAY */}
                      <Link href={`/akademik/kegiatan/${item.slug}`}>
                        <div className='absolute inset-0 bg-gradient-to-b from-darklight/0 from-60% to-darklight/80 lg:translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out flex items-end rounded-lg'>
                          <div className={`${i === 0 ? 'p-10' : 'p-5'}`}>
                            <div className='flex items-center gap-3'>
                              <Image
                                src='/images/banner/greentick.svg'
                                alt='tick'
                                width={16}
                                height={16}
                              />
                              <p className='text-2xl font-medium text-white'>
                                {item.title}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>

                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* BUTTON */}
        <div className='mt-10 text-center'>
          <Link
            href='/akademik/kegiatan'
            className='inline-block rounded-full bg-primary px-6 py-3 text-white font-medium hover:bg-primary/90 transition'
          >
            More Gallery →
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Category
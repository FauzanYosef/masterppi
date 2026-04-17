'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type NewsType = {
  title: string
  slug: string
  cover_img?: string
  content?: string
  category?: string
  published_date?: string
}

const News = () => {
  const [news, setNews] = useState<NewsType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('title, slug, cover_img, content, category, published_date')
          .order('published_date', { ascending: false })
          .limit(6)

        if (error) {
          console.error(error)
        }

        if (data) {
          setNews(data)
        }
      } catch (error) {
        console.error('Error fetching news', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <section id='news' className='relative bg-secondary dark:bg-darklight scroll-mt-12 py-16'>
      <div className='container'>

        {/* HEADER */}
        <div className='text-center mb-12'>
          <h2 className='mb-6'>Berita Terbaru</h2>
          <p className='text-lg font-normal max-w-2xl mx-auto'>
            Informasi terkini seputar publikasi, kegiatan ilmiah, kolaborasi institusi,
            serta perkembangan kajian pemikiran politik Islam.
          </p>
        </div>

        {/* LOADING */}
        {loading ? (
          <p className='text-center'>Loading...</p>
        ) : (
          <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8'>

            {news.map((item) => (
              <Link
                key={item.slug}
                href={`/berita/${item.slug}`}
                className='group'
              >
                <div className='bg-white dark:bg-darklight rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300'>

                  {/* IMAGE */}
                  <div className='relative w-full h-52 overflow-hidden'>
                    <Image
                      src={item.cover_img || '/images/default-news.jpg'}
                      alt={item.title}
                      fill
                      className='object-cover group-hover:scale-105 transition'
                    />
                  </div>

                  {/* CONTENT */}
                  <div className='p-6'>

                    {/* CATEGORY & DATE */}
                    <div className='flex justify-between items-center text-sm mb-3'>
                      <span className='px-3 py-1 bg-primary/10 text-primary rounded-full text-xs'>
                        {item.category || 'Umum'}
                      </span>

                      <span className='text-gray-500 text-xs'>
                        {item.published_date &&
                          new Date(item.published_date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                      </span>
                    </div>

                    {/* TITLE */}
                    <h5 className='font-bold text-lg mb-3 line-clamp-2 group-hover:text-primary transition'>
                      {item.title}
                    </h5>

                    {/* DESCRIPTION */}
                    <p className='text-sm text-gray-600 dark:text-gray-300 line-clamp-3'>
                      {item.content
                        ?.replace(/<[^>]+>/g, '')
                        .slice(0, 100)}...
                    </p>

                  </div>
                </div>
              </Link>
            ))}

          </div>
        )}
      </div>

      {/* FLOATING IMAGES */}
      <div className='absolute top-28 -left-9 dark:opacity-5'>
        <Image
          src='/images/banner/pattern1.svg'
          alt='pattern'
          width={141}
          height={141}
        />
      </div>

      <div className='absolute -bottom-7 -right-7 dark:opacity-5 z-10'>
        <Image
          src='/images/banner/pattern2.svg'
          alt='pattern'
          width={141}
          height={141}
        />
      </div>
    </section>
  )
}

export default News
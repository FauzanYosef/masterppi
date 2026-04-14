'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getDataPath, getImgPath } from '@/app/(main)/utils/paths'

type NewsType = {
  imgSrc: string
  title: string
  desc: string
  date: string
  category: string
}

const Activity = () => {
  const [news, setNews] = useState<NewsType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(getDataPath('/data.json'))
        const data = await res.json()
        setNews(data.NewsData)
      } catch (error) {
        console.error('Error fetching news', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <section id='news' className='bg-white dark:bg-darklight scroll-mt-12 py-16'>
      <div className='container'>
        <div className='text-center mb-12'>
          <h2 className='mb-6'>Agenda dan Kegiatan</h2>
          <p className='text-lg font-normal max-w-2xl mx-auto'>
            Laman ini menyajikan informasi agenda dan kegiatan akademik Program Magister Pemikiran Politik Islam yang mendorong pertukaran gagasan, penguatan riset, dan keterlibatan publik di tingkat nasional hingga global.
          </p>
        </div>

        <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8'>
          {news.map((item, i) => (
            <div
              key={i}
              className='bg-white dark:bg-darklight rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300'
            >
              {/* Image */}
              <div className='relative w-full h-52'>
                <Image
                  src={getImgPath(item.imgSrc)}
                  alt={item.title}
                  fill
                  className='object-cover'
                />
              </div>

              {/* Content */}
              <div className='p-6'>
                {/* Category & Date */}
                <div className='flex justify-between items-center text-sm mb-3'>
                  <span className='px-3 py-1 bg-primary/10 text-primary rounded-full'>
                    {item.category}
                  </span>
                  <span className='text-gray-500'>{item.date}</span>
                </div>

                {/* Title */}
                <h5 className='font-bold text-lg mb-3 line-clamp-2'>
                  {item.title}
                </h5>

                {/* Description */}
                <p className='text-base text-gray-600 dark:text-gray-300 line-clamp-3'>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        
      </div>
      {/* floating images */}
                <div className='absolute top-28 -left-9 dark:opacity-5'>
                  <Image
                    src={getImgPath('/images/banner/pattern1.svg')}
                    alt='ptrn1'
                    width={141}
                    height={141}
                  />
                </div>
                <div className='absolute -bottom-7 -right-7 dark:opacity-5 z-10'>
                  <Image
                    src={getImgPath('/images/banner/pattern2.svg')}
                    alt='ptrn1'
                    width={141}
                    height={141}
                  />
                </div>
    </section>
  )
}

export default Activity
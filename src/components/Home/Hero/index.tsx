'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const Hero = () => {
  const [iframe, setIframe] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchYT = async () => {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('content')
          .eq('key', 'yt_profile')
          .single()

        if (error) throw error

        let rawIframe = data?.content || ''

        // 🔥 ambil src & video ID
        const srcMatch = rawIframe.match(/src="([^"]+)"/)
        const videoIdMatch = rawIframe.match(/embed\/([^"?]+)/)

        const src = srcMatch ? srcMatch[1] : ''
        const videoId = videoIdMatch ? videoIdMatch[1] : ''

        // 🔥 inject autoplay + loop
        const newSrc = `${src}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}`

        // 🔥 replace src lama dengan yang baru
        rawIframe = rawIframe.replace(src, newSrc)

        setIframe(rawIframe)
      } catch (err) {
        console.error('Error fetch youtube:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchYT()
  }, [])

  return (
    <section>
      <div className='overflow-hidden'>
        <div className='container relative z-20 pt-24'>
          <div className='grid lg:grid-cols-12 gap-20 items-center pb-10'>

            {/* TEXT */}
            <div className='lg:col-span-7'>
              <div className='flex flex-col gap-8'>
                <h1 className='lg:text-left text-center'>
                  Program Magister Pemikiran Politik Islam
                </h1>

                <h5 className='lg:text-left text-center'>
                  “Pemikiran Politik Islam yang Kritis dan Relevan
                  Menghubungkan Tradisi, Teori, dan Realitas
                  Untuk Kontribusi Nyata bagi Kebijakan Global”
                </h5>

                <div className='flex gap-4 justify-center lg:justify-start'>
                  <Link href='/akademik/kurikulum'>
                    <button className='px-8 py-3 text-white bg-primary rounded-lg'>
                      Lihat Kurikulum
                    </button>
                  </Link>

                  <Link href='/berita'>
                    <button className='px-8 py-3 text-primary border border-primary rounded-lg'>
                      Berita
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* VIDEO */}
            <div className='lg:col-span-5 w-full'>
              {loading ? (
                <div className='w-full h-[300px] bg-gray-200 animate-pulse rounded-xl' />
              ) : iframe ? (
                <div className='w-full aspect-video rounded-2xl overflow-hidden shadow-xl'>
                  <div
                    className='w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0'
                    dangerouslySetInnerHTML={{ __html: iframe }}
                  />
                </div>
              ) : (
                <p>Video tidak tersedia</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
'use client'

import Image from 'next/image'
import Link from '@/components/UI/LocaleLink'
import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { apiFetch, getImageUrl } from '@/lib/api'
import SectionHeading from '@/components/UI/SectionHeading'
import { useI18n } from '@/i18n/I18nProvider'

type GalleryItem = {
  id: number
  event_id?: number | null
  article_id?: number | null
  title: string
  slug: string
  description?: string | null
  cover_image?: string | null
  event_title?: string | null
  event_slug?: string | null
}

type GalleriesResponse = {
  success: boolean
  data: GalleryItem[]
}

const Gallery = () => {
  const { t } = useI18n()
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await apiFetch<GalleriesResponse>('/api/galleries')
        setGallery(response.data || [])
      } catch (error) {
        console.error('Error fetching gallery:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchGallery()
  }, [])

  // Tanpa foto, section disembunyikan agar beranda tidak menampilkan blok kosong.
  if (!loading && gallery.length === 0) return null

  return (
    <section id='gallery' className='scroll-mt-24 bg-secondary dark:bg-darkmode'>
      <div className='container'>
        <SectionHeading
          eyebrow={t.home.gallery.eyebrow}
          title={t.home.gallery.title}
          description={t.home.gallery.description}
        />

        <div className='grid auto-rows-[200px] grid-cols-2 gap-4 lg:auto-rows-[240px] lg:grid-cols-4 lg:gap-6'>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`animate-pulse rounded-2xl bg-darkblue/[0.06] ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
                />
              ))
            : gallery.slice(0, 5).map((item, i) => {
                // Galeri dari agenda memakai judul agenda dan menautkan ke halaman agenda tersebut.
                const displayTitle = item.event_title || item.title
                const href = item.event_slug ? `/akademik/kegiatan/${item.event_slug}` : null
                const content = (
                  <>
                    {item.cover_image ? (
                      <Image
                        src={getImageUrl(item.cover_image)}
                        alt={displayTitle}
                        fill
                        priority={i === 0}
                        sizes={i === 0 ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, 50vw'}
                        className='object-cover transition-transform duration-700 group-hover:scale-105'
                      />
                    ) : (
                      <div className='absolute inset-0 flex items-center justify-center bg-darkblue/10'>
                        <Icon icon='tabler:photo' width={32} className='text-lightgrey' aria-hidden />
                      </div>
                    )}
                    <div className='absolute inset-0 bg-gradient-to-t from-darkblue/85 via-darkblue/10 to-transparent opacity-90 transition-opacity group-hover:opacity-100' />
                    <div className={`absolute inset-x-0 bottom-0 ${i === 0 ? 'p-6 md:p-8' : 'p-4 md:p-5'}`}>
                      <p className={`font-semibold !text-white ${i === 0 ? 'text-xl md:text-2xl' : 'line-clamp-2 text-sm md:text-base'}`}>
                        {displayTitle}
                      </p>
                    </div>
                  </>
                )
                const className = `group relative overflow-hidden rounded-2xl ${i === 0 ? 'col-span-2 row-span-2' : ''}`

                return href ? (
                  <Link key={item.id} href={href} className={className} aria-label={`${t.home.gallery.viewEvent}: ${displayTitle}`}>
                    {content}
                  </Link>
                ) : (
                  <div key={item.id} className={className}>
                    {content}
                  </div>
                )
              })}
        </div>
      </div>
    </section>
  )
}

export default Gallery

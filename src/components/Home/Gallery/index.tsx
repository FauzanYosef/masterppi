'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import CategorySkeleton from '../../Skeleton/Category'
import { apiFetch, getImageUrl } from '@/lib/api'

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
  scope?: {
    faculty_id: number | null
    study_program_id: number | null
  }
  data: GalleryItem[]
}

const Gallery = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await apiFetch<GalleriesResponse>(
          '/api/galleries'
        )

        setGallery(response.data || [])
      } catch (error) {
        console.error('Error fetching gallery:', error)
        setGallery([])
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  }, [])

  return (
    <section
      id="gallery"
      className="scroll-mt-12"
    >
      <div className="container">

        {/* =========================================
            TITLE
        ========================================== */}
        <div className="text-center">
          <h2>Gallery</h2>

          <p className="text-lg font-normal max-w-sm md:max-w-md lg:max-w-2xl mx-auto my-6 px-4">
            Dokumentasi berbagai kegiatan, agenda akademik,
            serta aktivitas Magister Pemikiran Politik Islam.
          </p>
        </div>

        {/* =========================================
            GRID
        ========================================== */}
        <div className="mt-8">
          <div className="grid lg:grid-cols-4 grid-cols-2 gap-6">

            {/* =====================================
                LOADING
            ====================================== */}
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <CategorySkeleton key={i} />
              ))
            ) : gallery.length === 0 ? (

              /* ===================================
                  EMPTY
              ==================================== */
              <div className="col-span-full text-center py-10 text-gray-500">
                Belum ada gallery.
              </div>

            ) : (

              /* ===================================
                  GALLERY
              ==================================== */
              gallery.slice(0, 5).map((item, i) => {

                // Jika gallery berasal dari event,
                // gunakan judul event.
                const displayTitle =
                  item.event_title || item.title

                return (
                  <div
                    key={item.id}
                    className={
                      i === 0
                        ? 'col-span-2 row-span-2'
                        : 'sm:col-span-1 col-span-2 row-span-1'
                    }
                  >

                    <div className="relative w-full h-full min-h-[200px] lg:min-h-[250px] group overflow-hidden rounded-lg">

                      {/* =================================
                          COVER IMAGE
                          1 FOTO PER EVENT
                      ================================== */}
                      {item.cover_image ? (
                        <Image
                          src={getImageUrl(item.cover_image)}
                          alt={displayTitle}
                          fill
                          priority={i === 0}
                          className="object-cover rounded-lg transition duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">
                            Tidak ada gambar
                          </span>
                        </div>
                      )}

                      {/* =================================
                          LINK DETAIL GALLERY
                      ================================== */}
                      <Link
                        href={`/akademik/gallery/${item.slug}`}
                        className="absolute inset-0"
                        aria-label={`Lihat gallery ${displayTitle}`}
                      >

                        <div className="absolute inset-0 bg-gradient-to-b from-darklight/0 from-60% to-darklight/80 lg:translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out flex items-end rounded-lg">

                          <div
                            className={
                              i === 0
                                ? 'p-10'
                                : 'p-5'
                            }
                          >

                            <div className="flex items-start gap-3">

                              <Image
                                src="/images/banner/greentick.svg"
                                alt=""
                                width={16}
                                height={16}
                                className="mt-2 shrink-0"
                              />

                              <p className="text-xl lg:text-2xl font-medium text-white">
                                {displayTitle}
                              </p>

                            </div>

                          </div>

                        </div>

                      </Link>

                    </div>

                  </div>
                )
              })
            )}

          </div>
        </div>

        {/* =========================================
            MORE GALLERY
        ========================================== */}
        <div className="mt-10 text-center">

          <Link
            href="/akademik/gallery"
            className="inline-block rounded-full bg-primary px-6 py-3 text-white font-medium hover:bg-primary/90 transition"
          >
            More Gallery →
          </Link>

        </div>

      </div>
    </section>
  )
}

export default Gallery
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { apiFetch, getImageUrl } from '@/lib/api'
import { toHtml } from '@/lib/site-content'

type SambutanData = {
  title: string | null
  subtitle: string | null
  description: string | null
  image: string | null
}

type HomeResponse = {
  success: boolean
  data: {
    sambutan?: SambutanData
  }
}

const SambutanPage = () => {
  const [sambutan, setSambutan] = useState<SambutanData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFetch<HomeResponse>(
          '/api/home'
        )

        setSambutan(response.data?.sambutan || null)
      } catch (error) {
        console.error('Error fetching sambutan:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <section className="py-20 bg-secondary dark:bg-black">
      <div className="container max-w-6xl">

        {/* GRID */}
        <div className="grid lg:grid-cols-[40%_60%] gap-16">

          {/* LEFT (STICKY FOTO) */}
          <div className="lg:sticky top-32 h-fit">

            <div className="w-full max-w-[420px]">
              <Image
                src={getImageUrl(sambutan?.image)}
                alt="Kaprodi"
                width={420}
                height={520}
                className="w-full h-auto object-cover rounded-xl shadow-lg"
              />
            </div>

          </div>

          {/* RIGHT (CONTENT) */}
          <div>

            {/* HEADER */}
            <div className="mb-10">
              <span className="text-sm uppercase tracking-widest text-primary font-semibold">
                Sambutan
              </span>

              <h2 className="text-4xl lg:text-5xl font-bold leading-tight mt-3 text-gray-900 dark:text-white">
                Ketua Program Magister
                <br />
                Pemikiran Politik Islam
              </h2>

              <div className="w-16 h-[2px] bg-primary mt-6"></div>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : !sambutan ? (
              <p className="text-gray-500">
                Sambutan belum tersedia.
              </p>
            ) : (
              <>
                {/* QUOTE HIGHLIGHT */}
                <blockquote className="border-l-4 border-primary pl-6 italic text-lg text-gray-600 dark:text-gray-300 mb-8">
                  “Membangun pemikiran politik Islam yang kritis,
                  inklusif, dan relevan dengan tantangan global.”
                </blockquote>

                {/* CONTENT */}
                <div
                  className={`prose max-w-none text-gray-700 dark:text-gray-300 leading-relaxed text-justify transition-all duration-500 ${
                    expanded ? '' : 'line-clamp-[12]'
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: toHtml(sambutan.description)
                  }}
                />

                {/* BUTTON */}
                <div className="mt-10">
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-white transition rounded-md text-sm font-medium"
                  >
                    {expanded
                      ? 'Tutup'
                      : 'Baca Selengkapnya'}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </section>
  )
}

export default SambutanPage
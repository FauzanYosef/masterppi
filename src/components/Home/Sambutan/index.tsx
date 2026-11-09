'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import { getImageUrl } from '@/lib/api'
import { getHomeData, type HomeSection } from '@/lib/home'
import { toHtml } from '@/lib/site-content'

const SambutanPage = () => {
  const [sambutan, setSambutan] = useState<HomeSection | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    let active = true
    getHomeData().then((data) => {
      if (!active) return
      setSambutan(data?.sambutan ?? null)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <section className='bg-secondary dark:bg-darkmode'>
      <div className='container'>
        <div className='grid items-start gap-12 lg:grid-cols-12 lg:gap-16'>
          {/* Foto */}
          <div className='lg:sticky lg:top-32 lg:col-span-5'>
            <div className='relative mx-auto max-w-[420px]'>
              <div className='absolute -left-4 -top-4 h-full w-full rounded-3xl border-2 border-sec-yellow/60' />
              <div className='relative overflow-hidden rounded-3xl bg-gradient-to-b from-primary/10 to-primary/30 shadow-lift'>
                <Image
                  src={getImageUrl(sambutan?.image)}
                  alt='Ketua Program Studi Magister Pemikiran Politik Islam'
                  width={420}
                  height={520}
                  sizes='(min-width: 1024px) 420px, 90vw'
                  className='h-auto w-full object-cover'
                />
              </div>
            </div>
          </div>

          {/* Isi */}
          <div className='lg:col-span-7'>
            <span className='eyebrow'>Sambutan</span>
            <h2 className='mt-4'>
              Ketua Program Magister <span className='text-primary dark:text-sec-yellow'>Pemikiran Politik Islam</span>
            </h2>
            <span className='accent-bar mt-6' />

            {loading ? (
              <div className='mt-10 space-y-3'>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className='h-4 animate-pulse rounded bg-darkblue/[0.06]' style={{ width: `${95 - i * 6}%` }} />
                ))}
              </div>
            ) : !sambutan ? (
              <p className='mt-10'>Sambutan belum tersedia.</p>
            ) : (
              <>
                <figure className='card relative mt-10 p-6 md:p-8'>
                  <Icon icon='tabler:quote' width={40} className='absolute -top-5 left-6 rounded-xl bg-primary p-2 text-white' aria-hidden />
                  <blockquote className='text-lg font-medium italic leading-relaxed text-darkblue md:text-xl dark:text-white'>
                    “Membangun pemikiran politik Islam yang kritis, inklusif, dan relevan dengan tantangan global.”
                  </blockquote>
                </figure>

                <div className='relative mt-8'>
                  <div
                    className={`prose max-w-none text-justify leading-relaxed text-lightgrey dark:prose-invert ${
                      expanded ? '' : 'max-h-[340px] overflow-hidden'
                    }`}
                    dangerouslySetInnerHTML={{ __html: toHtml(sambutan.description) }}
                  />
                  {!expanded && (
                    <div className='pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-secondary dark:from-darkmode' />
                  )}
                </div>

                <button onClick={() => setExpanded(!expanded)} className='btn-outline mt-8' aria-expanded={expanded}>
                  {expanded ? 'Tutup' : 'Baca Selengkapnya'}
                  <Icon icon='tabler:chevron-down' width={18} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SambutanPage

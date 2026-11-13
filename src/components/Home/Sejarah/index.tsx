'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from '@/components/UI/LocaleLink'
import { Icon } from '@iconify/react'
import { getImageUrl } from '@/lib/api'
import { getHomeData, type HomeSection } from '@/lib/home'
import { toHtml } from '@/lib/site-content'
import { useI18n } from '@/i18n/I18nProvider'

const FALLBACK_IMAGE = '/images/banner/uin.jpg'

// Gambar bawaan website ada di /images; selain itu berasal dari penyimpanan API.
const resolveImage = (path?: string | null) =>
  !path ? FALLBACK_IMAGE : path.startsWith('/images/') ? path : getImageUrl(path)

const SejarahPage = () => {
  const { lang, t } = useI18n()
  const [sejarah, setSejarah] = useState<HomeSection | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getHomeData(lang).then((data) => {
      if (!active) return
      setSejarah(data?.sejarah ?? null)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [lang])

  return (
    <section className='bg-white dark:bg-darklight'>
      <div className='container'>
        <div className='grid items-center gap-12 lg:grid-cols-12 lg:gap-16'>
          {/* Konten */}
          <div className='order-2 lg:order-1 lg:col-span-6'>
            <span className='eyebrow'>{sejarah?.subtitle || t.home.sejarah.eyebrow}</span>
            <h2 className='mt-4'>
              {sejarah?.title || t.home.sejarah.defaultTitle}
            </h2>
            <span className='accent-bar mt-6' />

            {loading ? (
              <div className='mt-8 space-y-3'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className='h-4 animate-pulse rounded bg-darkblue/[0.06]' style={{ width: `${95 - i * 7}%` }} />
                ))}
              </div>
            ) : !sejarah ? (
              <p className='mt-8'>{t.home.sejarah.empty}</p>
            ) : (
              <>
                <div className='relative mt-8'>
                  <div
                    className='prose max-h-[220px] max-w-none overflow-hidden text-justify leading-relaxed text-lightgrey dark:prose-invert'
                    dangerouslySetInnerHTML={{ __html: toHtml(sejarah.description) }}
                  />
                  <div className='pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white dark:from-darklight' />
                </div>
                <Link href='/profil/sejarah' className='btn-primary mt-8'>
                  {t.home.sejarah.readFull}
                  <Icon icon='tabler:arrow-right' width={18} aria-hidden />
                </Link>
              </>
            )}
          </div>

          {/* Gambar */}
          <div className='order-1 lg:order-2 lg:col-span-6'>
            <div className='relative'>
              <div className='absolute -right-4 -top-4 hidden h-32 w-32 rounded-2xl bg-dots sm:block' />
              <div className='relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lift'>
                <Image
                  src={resolveImage(sejarah?.image)}
                  alt={sejarah?.title || t.site.campusAlt}
                  fill
                  sizes='(min-width: 1024px) 50vw, 100vw'
                  className='object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-darkblue/40 via-transparent to-transparent' />
              </div>
              <div className='card absolute -bottom-6 left-6 flex items-center gap-3 px-5 py-4 shadow-lift'>
                <span className='flex h-11 w-11 items-center justify-center rounded-xl bg-sec-yellow/15 text-sec-yellow'>
                  <Icon icon='tabler:building-community' width={24} aria-hidden />
                </span>
                <div className='leading-tight'>
                  <p className='text-sm font-semibold !text-darkblue dark:!text-white'>{t.home.sejarah.campus}</p>
                  <p className='text-xs'>{t.home.sejarah.city}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SejarahPage

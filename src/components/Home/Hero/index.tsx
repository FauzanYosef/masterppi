'use client'

import { useEffect, useState } from 'react'
import Link from '@/components/UI/LocaleLink'
import { Icon } from '@iconify/react'
import { getHomeData, type HomeSection } from '@/lib/home'
import { useI18n } from '@/i18n/I18nProvider'

const QUICK_LINKS = [
  { href: '/akademik/kurikulum', key: 'kurikulum', icon: 'tabler:books' },
  { href: '/akademik/admisi', key: 'admisi', icon: 'tabler:school' },
  { href: '/profil/dosen', key: 'dosen', icon: 'tabler:users' },
] as const

const isExternal = (url: string) => /^https?:\/\//i.test(url)

const HeroButton = ({ text, url, variant }: { text?: string | null; url?: string | null; variant: 'primary' | 'outline' }) => {
  const { path } = useI18n()
  if (!text || !url) return null
  const className = variant === 'primary' ? 'btn-primary !px-7 !py-3.5' : 'btn-outline !px-7 !py-3.5'
  const arrow = variant === 'primary' && <Icon icon='tabler:arrow-right' width={18} aria-hidden />

  return isExternal(url) ? (
    <a href={url} target='_blank' rel='noopener noreferrer' className={className}>
      {text}
      {arrow}
    </a>
  ) : (
    <Link href={path(url)} className={className}>
      {text}
      {arrow}
    </Link>
  )
}

// Parameter autoplay/mute/loop diset sekali saja (URL dari CMS bisa sudah memuatnya). Loop YouTube
// membutuhkan `playlist` berisi id video yang sama.
function buildVideoUrl(raw?: string | null): string | null {
  if (!raw) return null
  try {
    const url = new URL(raw)
    url.searchParams.set('autoplay', '1')
    url.searchParams.set('mute', '1')
    url.searchParams.set('controls', '0')
    url.searchParams.set('loop', '1')
    url.searchParams.set('playsinline', '1')
    const id = url.pathname.match(/\/embed\/([\w-]+)/)?.[1]
    if (id) url.searchParams.set('playlist', id)
    return url.toString()
  } catch {
    return raw
  }
}

const Hero = () => {
  const { lang, t } = useI18n()
  const [hero, setHero] = useState<HomeSection | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getHomeData(lang).then((data) => {
      if (cancelled) return
      setHero(data?.hero ?? null)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [lang])

  if (!loading && !hero) return null

  const videoUrl = buildVideoUrl(hero?.video_url)

  return (
    <section className='relative isolate overflow-hidden bg-gradient-to-b from-secondary via-white to-white pt-36 pb-20 lg:pt-44 lg:pb-28 dark:from-darkmode dark:via-darklight dark:to-darklight'>
      <div className='absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]' />
      <div className='absolute -top-40 right-0 -z-10 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl' />
      <div className='absolute top-1/2 -left-32 -z-10 h-72 w-72 rounded-full bg-sec-yellow/15 blur-3xl' />

      <div className='container'>
        <div className='grid items-center gap-14 lg:grid-cols-12 lg:gap-16'>
          {/* Teks */}
          <div className='flex flex-col items-center text-center lg:col-span-6 lg:items-start lg:text-left'>
            <span className='mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-4 py-1.5 text-xs font-semibold text-primary shadow-soft backdrop-blur dark:bg-white/5 dark:text-white'>
              <span className='h-2 w-2 rounded-full bg-sec-yellow' />
              {t.site.faculty}
            </span>

            {loading ? (
              <div className='w-full space-y-4'>
                <div className='h-14 w-full animate-pulse rounded-xl bg-darkblue/[0.06]' />
                <div className='h-14 w-4/5 animate-pulse rounded-xl bg-darkblue/[0.06]' />
                <div className='h-6 w-3/4 animate-pulse rounded-lg bg-darkblue/[0.05]' />
              </div>
            ) : (
              <>
                <h1>{hero?.title}</h1>
                {hero?.subtitle && <p className='mt-6 max-w-xl text-lg md:text-xl'>{hero.subtitle}</p>}
                <div className='mt-10 flex flex-wrap justify-center gap-3 lg:justify-start'>
                  <HeroButton text={hero?.button_1_text} url={hero?.button_1_url} variant='primary' />
                  <HeroButton text={hero?.button_2_text} url={hero?.button_2_url} variant='outline' />
                </div>
              </>
            )}

            <div className='mt-12 grid w-full max-w-lg grid-cols-3 gap-3'>
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className='card card-hover flex flex-col items-center gap-2 px-3 py-4 text-sm font-medium text-darkblue dark:text-white'>
                  <span className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary/[0.08] text-primary dark:bg-white/10 dark:text-white'>
                    <Icon icon={link.icon} width={22} aria-hidden />
                  </span>
                  {t.home.hero.quickLinks[link.key]}
                </Link>
              ))}
            </div>
          </div>

          {/* Video */}
          <div className='relative lg:col-span-6'>
            <div className='absolute -bottom-5 -right-5 -z-10 hidden h-2/3 w-2/3 rounded-3xl bg-sec-yellow/80 sm:block' />
            <div className='absolute -top-5 -left-5 -z-10 hidden h-24 w-24 rounded-2xl bg-dots sm:block' />
            <div className='overflow-hidden rounded-3xl border-4 border-white bg-darkblue shadow-lift dark:border-white/10'>
              {loading ? (
                <div className='aspect-video w-full animate-pulse bg-darkblue/10' />
              ) : videoUrl ? (
                <iframe
                  src={videoUrl}
                  className='aspect-video w-full border-0'
                  title={hero?.title || t.home.hero.videoTitle}
                  allow='autoplay; encrypted-media; picture-in-picture'
                  // Situs mengirim Referrer-Policy: same-origin; YouTube menolak embed tanpa referrer (error 153).
                  referrerPolicy='strict-origin-when-cross-origin'
                  allowFullScreen
                />
              ) : (
                <div className='flex aspect-video w-full items-center justify-center bg-gradient-to-br from-primary to-darkblue'>
                  <p className='!text-white/70'>{t.home.hero.videoUnavailable}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

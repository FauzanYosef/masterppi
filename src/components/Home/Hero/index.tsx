 'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'

type HeroData = {
  id?: number
  title: string | null
  subtitle: string | null
  video_url: string | null
  button_1_text: string | null
  button_1_url: string | null
  button_2_text: string | null
  button_2_url: string | null
}

type HomeResponse = {
  success: boolean
  scope?: {
    faculty_id: number
    study_program_id: number | null
  }
  data?: {
    hero?: HeroData
  }
}

const Hero = () => {
  const [hero, setHero] = useState<HeroData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const fetchHome = async () => {
      try {
        const response = await apiFetch<HomeResponse>('/api/home')

        console.log('HERO API RESPONSE:', response)
        console.log('HERO SCOPE:', response.scope)
        console.log('HERO DATA:', response.data?.hero)

        if (cancelled) return

        if (!response.success) {
          throw new Error('API gagal mengambil data halaman utama')
        }

        setHero(response.data?.hero ?? null)
      } catch (error) {
        if (!cancelled) {
          console.error('Error fetching home hero:', error)
          setHero(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchHome()

    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <section>
        <div className="overflow-hidden">
          <div className="container relative z-20 pt-24">
            <div className="grid lg:grid-cols-12 gap-20 items-center pb-10">
              <div className="lg:col-span-7">
                <div className="flex flex-col gap-8">
                  <div className="h-16 bg-gray-200 animate-pulse rounded-lg" />
                  <div className="h-20 bg-gray-200 animate-pulse rounded-lg" />
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="w-full aspect-video bg-gray-200 animate-pulse rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!hero) {
    return null
  }

  const renderButton = (
    text: string | null,
    url: string | null,
    secondary = false
  ) => {
    if (!text || !url) return null

    const className = secondary
      ? 'inline-flex px-8 py-3 text-primary border border-primary rounded-lg'
      : 'inline-flex px-8 py-3 text-white bg-primary rounded-lg'

    if (/^https?:\/\//i.test(url)) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {text}
        </a>
      )
    }

    return (
      <Link href={url} className={className}>
        {text}
      </Link>
    )
  }

  const videoUrl = hero.video_url
    ? (() => {
        const separator = hero.video_url!.includes('?') ? '&' : '?'
        return `${hero.video_url}${separator}autoplay=1&mute=1&controls=0&loop=1`
      })()
    : null

  return (
    <section>
      <div className="overflow-hidden">
        <div className="container relative z-20 pt-24">
          <div className="grid lg:grid-cols-12 gap-20 items-center pb-10">
            {/* TEXT */}
            <div className="lg:col-span-7">
              <div className="flex flex-col gap-8">
                <h1 className="lg:text-left text-center">
                  {hero.title}
                </h1>

                <h5 className="lg:text-left text-center">
                  {hero.subtitle}
                </h5>

                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  {renderButton(
                    hero.button_1_text,
                    hero.button_1_url
                  )}

                  {renderButton(
                    hero.button_2_text,
                    hero.button_2_url,
                    true
                  )}
                </div>
              </div>
            </div>

            {/* VIDEO */}
            <div className="lg:col-span-5 w-full">
              {videoUrl ? (
                <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-xl">
                  <iframe
                    src={videoUrl}
                    className="w-full h-full border-0"
                    title={hero.title || 'Video'}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="w-full aspect-video rounded-2xl bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500">
                    Video tidak tersedia
                  </p>
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
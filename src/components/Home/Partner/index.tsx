'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Slider from 'react-slick'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import { apiFetch, getImageUrl } from '@/lib/api'

type Partner = {
  id: number
  name: string
  logo: string | null
  website?: string | null
  description?: string | null
}

type PartnersResponse = {
  success: boolean
  scope?: {
    faculty_id: number | null
    study_program_id: number | null
  }
  data: Partner[]
}

const Partners = () => {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await apiFetch<PartnersResponse>(
          '/api/partners'
        )

        setPartners(response.data || [])
      } catch (error) {
        console.error('Error fetching partners:', error)
        setPartners([])
      } finally {
        setLoading(false)
      }
    }

    fetchPartners()
  }, [])

  const settings = {
    dots: false,
    arrows: false,
    infinite: partners.length > 4,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: partners.length > 4,
    autoplaySpeed: 2800,
    speed: 900,
    cssEase: 'ease-in-out',
    pauseOnHover: true,

    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  return (
    <section className='relative overflow-hidden bg-secondary dark:bg-darklight py-20 lg:py-24'>

      {/* Decorative Background */}
      <div className='absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary/5 blur-3xl' />
      <div className='absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-primary/5 blur-3xl' />

      <div className='container relative z-10'>

        {/* Header */}
        <div className='max-w-3xl mx-auto text-center mb-14'>

          {/* Small Label */}
          <div className='flex items-center justify-center gap-3 mb-4'>
            <span className='h-px w-10 bg-primary' />

            <span className='text-sm font-semibold uppercase tracking-[0.2em] text-primary'>
              Mitra Strategis
            </span>

            <span className='h-px w-10 bg-primary' />
          </div>

          <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight'>
            Kerjasama
          </h2>

          <p className='text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mt-5 leading-relaxed'>
            Membangun kemitraan strategis dengan berbagai institusi
            akademik dan riset untuk memperluas kontribusi ilmiah
            dalam kajian pemikiran politik Islam.
          </p>

        </div>

        {/* Loading */}
        {loading ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className='h-36 rounded-2xl bg-white dark:bg-lightdarkblue shadow-sm animate-pulse'
              />
            ))}

          </div>
        ) : partners.length === 0 ? (

          /* Empty State */
          <div className='max-w-md mx-auto text-center py-12 px-6 rounded-2xl bg-white dark:bg-lightdarkblue shadow-sm'>

            <div className='w-14 h-14 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-darklight flex items-center justify-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='26'
                height='26'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.5'
                className='text-gray-400'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 6v12m-6-6h12'
                />
              </svg>
            </div>

            <p className='text-gray-500 dark:text-gray-400'>
              Belum ada data kerja sama.
            </p>

          </div>

        ) : (

          /* Partner Slider */
          <div className='relative -mx-2'>

            <Slider {...settings}>

              {partners.map((partner) => {

                const Card = (
                  <div className='group px-3 py-4'>

                    <div className='relative h-36 md:h-40 flex items-center justify-center rounded-2xl bg-white dark:bg-lightdarkblue border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden'>

                      {/* Hover Gradient */}
                      <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

                      {/* Top Accent */}
                      <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

                      {partner.logo ? (
                        <div className='relative z-10 flex items-center justify-center w-full h-full p-7'>

                          <Image
                            src={getImageUrl(partner.logo)}
                            alt={partner.name}
                            width={180}
                            height={90}
                            className='object-contain max-w-[170px] max-h-[80px] w-auto h-auto grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500'
                          />

                        </div>
                      ) : (

                        <div className='relative z-10 px-6 text-center'>

                          <div className='text-sm md:text-base font-semibold text-gray-500 dark:text-gray-300 group-hover:text-primary transition-colors duration-300'>
                            {partner.name}
                          </div>

                        </div>

                      )}

                      {/* Partner Name */}
                      <div className='absolute bottom-0 left-0 right-0 px-4 py-2 bg-white/90 dark:bg-lightdarkblue/90 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300'>

                        <p className='text-xs font-medium text-center text-gray-600 dark:text-gray-300 truncate'>
                          {partner.name}
                        </p>

                      </div>

                    </div>

                  </div>
                )

                return partner.website ? (
                  <a
                    key={partner.id}
                    href={partner.website}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={`Website ${partner.name}`}
                  >
                    {Card}
                  </a>
                ) : (
                  <div key={partner.id}>
                    {Card}
                  </div>
                )
              })}

            </Slider>

          </div>

        )}

        {/* Bottom Information */}
        {!loading && partners.length > 0 && (
          <div className='mt-10 text-center'>

            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 dark:bg-lightdarkblue/70 border border-gray-200 dark:border-gray-700 backdrop-blur-sm'>

              <span className='w-2 h-2 rounded-full bg-primary' />

              <span className='text-xs md:text-sm text-gray-500 dark:text-gray-400'>
                {partners.length} institusi mitra
              </span>

            </div>

          </div>
        )}

      </div>
    </section>
  )
}

export default Partners
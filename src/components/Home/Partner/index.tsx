'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Slider from 'react-slick'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import { Icon } from '@iconify/react'
import { apiFetch, getImageUrl } from '@/lib/api'
import SectionHeading from '@/components/UI/SectionHeading'

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
    <section className='relative overflow-hidden bg-white dark:bg-darklight'>
      <div className='container relative'>
        <SectionHeading
          eyebrow='Mitra Strategis'
          title='Kerja Sama'
          description='Membangun kemitraan strategis dengan berbagai institusi akademik dan riset untuk memperluas kontribusi ilmiah dalam kajian pemikiran politik Islam.'
        />

        {loading ? (
          <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className='h-32 animate-pulse rounded-2xl bg-darkblue/[0.06]' />
            ))}
          </div>
        ) : partners.length === 0 ? (
          <div className='card mx-auto max-w-md px-6 py-10 text-center'>
            <Icon icon='tabler:heart-handshake' width={32} className='mx-auto mb-3 text-lightgrey' aria-hidden />
            <p>Belum ada data kerja sama.</p>
          </div>
        ) : (
          <div className='relative -mx-2 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]'>
            <Slider {...settings}>
              {partners.map((partner) => {
                const Card = (
                  <div className='group px-2 py-3'>
                    <div className='card card-hover relative flex h-32 items-center justify-center md:h-36'>
                      {partner.logo ? (
                        <div className='flex h-full w-full items-center justify-center p-6'>
                          <Image
                            src={getImageUrl(partner.logo)}
                            alt={partner.name}
                            width={180}
                            height={90}
                            className='h-auto max-h-[72px] w-auto max-w-[150px] object-contain opacity-70 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0'
                          />
                        </div>
                      ) : (
                        <p className='px-6 text-center text-sm font-semibold transition-colors group-hover:text-primary'>
                          {partner.name}
                        </p>
                      )}
                      <div className='absolute inset-x-0 bottom-0 translate-y-full bg-white/95 px-4 py-2 backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0 dark:bg-lightdarkblue/95'>
                        <p className='truncate text-center text-xs font-medium !text-darkblue dark:!text-white'>{partner.name}</p>
                      </div>
                    </div>
                  </div>
                )

                return partner.website ? (
                  <a key={partner.id} href={partner.website} target='_blank' rel='noopener noreferrer' aria-label={`Website ${partner.name}`}>
                    {Card}
                  </a>
                ) : (
                  <div key={partner.id}>{Card}</div>
                )
              })}
            </Slider>
          </div>
        )}

        {!loading && partners.length > 0 && (
          <p className='mt-8 text-center text-sm'>
            <span className='font-semibold text-primary'>{partners.length}</span> institusi mitra
          </p>
        )}
      </div>
    </section>
  )
}

export default Partners
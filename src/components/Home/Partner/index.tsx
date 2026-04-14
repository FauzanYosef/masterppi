'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { getDataPath, getImgPath } from '@/app/(main)/utils/paths'

const Review = () => {
  const [partners, setPartners] = useState<{ imgSrc: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(getDataPath('/data.json'))
        const data = await res.json()
        setPartners(data.PartnerData)
      } catch (error) {
        console.error('Error fetching partners', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    speed: 800,
    cssEase: 'linear',
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 576,
        settings: { slidesToShow: 1 },
      },
    ],
  }

  return (
    <section className='bg-secondary dark:bg-darklight py-16'>
      <div className='container'>
        <div className='mb-10 text-center'>
          <h2>Kerjasama</h2>
          <p className='text-lg max-w-2xl mx-auto mt-4'>
            Membangun kemitraan strategis dengan institusi akademik dan riset
            untuk memperluas kontribusi ilmiah dalam kajian pemikiran politik Islam.
          </p>
        </div>

        <Slider {...settings}>
          {loading
            ? null
            : partners.map((item, i) => (
                <div key={i} className='px-4'>
                  <div className='flex items-center justify-center bg-white dark:bg-lightdarkblue rounded-lg p-6 h-32'>
                    <Image
                      src={getImgPath(item.imgSrc)}
                      alt='partner-logo'
                      width={150}
                      height={80}
                      className='object-contain'
                    />
                  </div>
                </div>
              ))}
        </Slider>
      </div>
    </section>
  )
}

export default Review
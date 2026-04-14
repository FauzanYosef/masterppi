'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getImgPath } from '@/app/(main)/utils/paths'
import { supabase } from '@/lib/supabase'

const PanduanPage = () => {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)

  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('panduan')
        .select('title, deskripsi, link_panduan')
        .order('title', { ascending: true })

      if (error) console.error(error)
      if (data) setData(data)

      setLoading(false)
    }

    fetchData()
  }, [])

  return (
    <div className="pt-[160px] pb-[120px] dark:bg-darklight">

      {/* HERO */}
      <div className="container mb-16">
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={getImgPath('/images/banner/uin.jpg')}
            alt="Banner"
            width={1400}
            height={500}
            className="w-full h-[300px] md:h-[400px] object-cover"
          />

          <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Panduan Akademik
            </h1>

            {/* BREADCRUMB */}
            <div className="flex gap-2 flex-wrap justify-center text-sm text-white/80 mt-3">
              <Link href="/">Home</Link>

              {pathSegments.map((segment, index) => {
                const href =
                  '/' + pathSegments.slice(0, index + 1).join('/')
                const isLast = index === pathSegments.length - 1

                const label =
                  segment.charAt(0).toUpperCase() + segment.slice(1)

                return (
                  <span key={href} className="flex gap-2 items-center">
                    <span className="opacity-60">›</span>

                    {isLast ? (
                      <span className="text-white font-medium">
                        {label}
                      </span>
                    ) : (
                      <Link href={href}>{label}</Link>
                    )}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container space-y-14">

        {/* TITLE */}
        <div className="text-center space-y-5">
          <h2 className="text-3xl md:text-4xl font-bold">
            Panduan <span className="text-primary">Akademik</span>
          </h2>

          <p className="text-gray-500 dark:text-gray-400">
            Kumpulan panduan resmi untuk mendukung kegiatan akademik mahasiswa
          </p>

          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        {/* DATA */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : data.length === 0 ? (
          <p className="text-center text-gray-500">
            Data panduan belum tersedia
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((item, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-dark rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800"
              >
                {/* CONTENT */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary group-hover:underline">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-justify line-clamp-4">
                    {item.deskripsi || 'Belum ada deskripsi.'}
                  </p>
                </div>

                {/* BUTTON */}
                <div className="mt-6">
                  <a
                    href={item.link_panduan}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition"
                  >
                    Lihat Panduan →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PanduanPage
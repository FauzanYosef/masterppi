'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getImgPath } from '@/app/(main)/utils/paths'
import { supabase } from '@/lib/supabase'

const SejarahPage = () => {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)

  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from('profile')
        .select('content')
        .eq('key', 'sejarah_content')
        .single()

      if (error) console.error('Supabase error:', error)
      if (data) setContent(data.content)

      setLoading(false)
    }

    fetchContent()
  }, [])

  return (
    <div className="pt-[160px] pb-[120px] dark:bg-darklight">

      {/* 🔥 HERO */}
      <div className="container mb-20">
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={getImgPath('/images/banner/uin.jpg')}
            alt="Profile Banner"
            width={1400}
            height={500}
            className="w-full h-[300px] md:h-[400px] object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center px-4">

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Sejarah Pemikiran Politik Islam
            </h1>

            {/* Breadcrumb */}
            <div className="flex gap-2 flex-wrap justify-center text-sm text-white/80">
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>

              {pathSegments.map((segment, index) => {
                const href =
                  '/' + pathSegments.slice(0, index + 1).join('/')
                const isLast = index === pathSegments.length - 1

                const label = segment
                  .replace(/-/g, ' ')
                  .replace(/\b\w/g, (l) => l.toUpperCase())

                return (
                  <span key={href} className="flex items-center gap-2">
                    <span className="opacity-60">›</span>

                    {isLast ? (
                      <span className="text-white font-medium">
                        {label}
                      </span>
                    ) : (
                      <Link
                        href={href}
                        className="hover:text-white transition"
                      >
                        {label}
                      </Link>
                    )}
                  </span>
                )
              })}
            </div>

          </div>
        </div>
      </div>

      {/* 🔥 CONTENT */}
      <div className="container">

        {/* TITLE SECTION */}
        <div className="text-center space-y-5 mb-12">

          {/* <div className="inline-block px-4 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
            Profil
          </div> */}

          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Sejarah Program Magister <br />
            <span className="text-primary">
              Pemikiran Politik Islam
            </span>
          </h2>

          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>

        </div>

        {/* GRID CONTENT */}
        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* IMAGE */}
          <div className="relative group">
            <div className="overflow-hidden rounded-2xl shadow-xl">
              <Image
                src={getImgPath('/images/banner/uin.jpg')}
                alt="Sejarah"
                width={600}
                height={400}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* subtle border */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-black/10"></div>
          </div>

          {/* TEXT */}
          <div className="flex flex-col justify-center">

            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : (
              <div
                className="prose prose-lg max-w-none dark:prose-invert text-justify leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}

          </div>

        </div>

      </div>
    </div>
  )
}

export default SejarahPage
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getImgPath } from '@/app/(main)/utils/paths'
import { supabase } from '@/lib/supabase'

const LulusanPage = () => {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)

  // ✅ STATE
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from('profile')
        .select('content')
        .eq('key', 'lulusan_content') // ✅ ganti key
        .single()

      if (error) {
        console.error('Supabase error:', error)
      }

      if (data) {
        setContent(data.content)
      }

      setLoading(false)
    }

    fetchContent()
  }, [])

  return (
    <div className="pt-[160px] pb-[120px] dark:bg-darklight">

      {/* HERO */}
      {/* <div className="container mb-16">
        <div className="relative rounded-2xl overflow-hidden">
          <Image
            src={getImgPath('/images/banner/uin.jpg')}
            alt="Profile Banner"
            width={1400}
            height={500}
            className="w-full h-[300px] md:h-[400px] object-cover"
          />

          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
              Profil Lulusan
            </h1>

            <div className="text-sm md:text-base text-white/90 flex items-center gap-2 flex-wrap">
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
                    <span className="opacity-70">›</span>
                    {isLast ? (
                      <span className="text-white font-medium">
                        {label}
                      </span>
                    ) : (
                      <Link href={href} className="hover:text-white transition">
                        {label}
                      </Link>
                    )}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </div> */}

      {/* CONTENT */}
      <div className="container">
        <div className="pb-10 text-center">
          {/* TITLE SECTION */}
        <div className="text-center space-y-5 mb-12">

          {/* <div className="inline-block px-4 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
            Profil
          </div> */}

          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Profile Lulusan Magister <br />
            <span className="text-primary">
              Pemikiran Politik Islam ?
            </span>
          </h2>

          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>

        </div>

          {/* 🔥 CONTENT DARI SUPABASE */}
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <div
              className="
                prose prose-lg max-w-none 
                dark:prose-invert 
                prose-p:text-justify
                prose-li:marker:text-primary
                mx-auto text-left
              "
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default LulusanPage
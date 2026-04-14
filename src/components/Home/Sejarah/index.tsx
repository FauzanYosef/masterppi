'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const SejarahPage = () => {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('content')
          .eq('key', 'sejarah_content')

        if (error) throw error
        setContent(data?.[0]?.content || '')
      } catch (err) {
        console.error('Error fetch sejarah:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <section className="py-16 bg-white">
      <div className="container">

        {/* GRID 60:40 */}
        <div className="grid lg:grid-cols-[60%_40%] gap-12 items-stretch">

          {/* KONTEN */}
          <div className="flex flex-col h-full">
            <div className="relative flex flex-col h-full overflow-hidden">

              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  {/* TITLE */}
                  <div className="text-left mb-8">

                    {/* BADGE */}
                    <span className="inline-block px-4 py-1 mb-4 text-xs font-semibold tracking-wider uppercase rounded-full bg-primary/10 text-primary">
                        Sejarah Singkat
                    </span>

                    {/* TITLE */}
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white leading-tight">
                        Program Magister <br className="hidden lg:block" />
                        Pemikiran Politik Islam
                    </h2>

                    {/* SUBTLE LINE */}
                    <div className="mt-4 w-20 h-1 bg-primary rounded-full"></div>

                    </div>

                  {/* TEXT (preview saja) */}
                  <div
                    className="prose max-w-none text-gray-700 dark:text-gray-300 leading-relaxed overflow-hidden max-h-[200px] mr-10 text-justify"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />

                  {/* GRADIENT */}
                  <div className="pointer-events-none absolute bottom-0 left-0 w-full h-24 " />
                </>
              )}
            </div>

            {/* BUTTON → LINK */}
            {!loading && (
              <div className="flex justify-start mt-8">
                <Link
                  href="/profil/sejarah"
                  className="px-10 py-3 rounded-lg bg-primary text-white text-sm font-semibold shadow hover:scale-105 hover:shadow-lg transition-all duration-300 inline-block"
                >
                  Baca Selengkapnya
                </Link>
              </div>
            )}
          </div>

          {/* GAMBAR */}
          <div className="flex justify-center items-start">
            <div className="relative w-full h-[300px] lg:h-[420px]">
              <Image
                src="/images/banner/uin.jpg"
                alt="UIN Bandung"
                fill
                className="object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default SejarahPage
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase' // ✅ pakai dari lib

const SambutanPage = () => {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('content')
          .eq('key', 'sambutan_content')
          .single()

        if (error) throw error
        setContent(data?.content || '')
      } catch (err) {
        console.error('Error fetch sambutan:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <section className="py-16 bg-gray-50 dark:bg-black">
      <div className="container">

        {/* GRID 40:60 */}
        <div className="grid lg:grid-cols-[30%_70%] gap-12 items-stretch">

          {/* FOTO */}
          <div className="flex flex-col items-center text-center lg:text-left h-full">
            <div className="relative w-[280px] h-[360px] lg:w-[320px] lg:h-[420px]">
              <Image
                src="/images/dosen/kajur.png"
                alt="Kaprodi"
                fill
                className="object-cover rounded-2xl shadow-xl"
              />
            </div>

            <div className="mt-6">
              <h3 className="text-gray-800 dark:text-white text-lg font-semibold">
                Asep Muhamad Iqbal, Ph.D.
              </h3>
              <p className="text-gray-500 text-sm">
                Ketua Program Magister PPI
              </p>
            </div>
          </div>

          {/* SAMBUTAN */}
          <div className="flex flex-col h-full">
            <div className="relative flex flex-col h-full overflow-hidden">

              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  {/* TEXT FIX */}
                  <div className="text-left mb-8">

                    {/* BADGE */}
                    <span className="inline-block px-4 py-1 mb-4 text-xs font-semibold tracking-wider uppercase rounded-full bg-primary/10 text-primary">
                      Sambutan
                    </span>

                    {/* TITLE */}
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white leading-tight">
                      Ketua Program Magister <br className="hidden lg:block" />
                      Pemikiran Politik Islam
                    </h2>

                    {/* SUBTLE LINE */}
                    <div className="mt-4 w-20 h-1 bg-primary rounded-full"></div>

                  </div>

                  <div
                    className={`prose max-w-none text-gray-700 dark:text-gray-300 leading-relaxed transition-all duration-500 overflow-hidden ${
                      expanded ? 'max-h-[2000px]' : 'max-h-[370px] text-justify'
                    }`}
                    dangerouslySetInnerHTML={{ __html: content }}
                  />

                  {/* GRADIENT */}
                  {!expanded && (
                    <div className="pointer-events-none absolute bottom-0 left-0 w-full h-24 " />
                  )}
                </>
              )}
            </div>

            {/* BUTTON */}
            {!loading && (
              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="px-12 py-3 rounded-lg border-primary bg-primary text-white text-sm font-semibold shadow hover:scale-105 hover:shadow-lg transition-all duration-300"
                >
                  {expanded ? 'Tutup' : 'Baca Selengkapnya'}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}

export default SambutanPage
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

const SambutanPage = () => {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('profile')
        .select('content')
        .eq('key', 'sambutan_content')
        .single()

      if (!error) setContent(data?.content || '')
      setLoading(false)
    }

    fetchData()
  }, [])

  return (
    <section className="py-20 bg-secondary dark:bg-black">
      <div className="container max-w-6xl">

        {/* GRID */}
        <div className="grid lg:grid-cols-[40%_60%] gap-16">

          {/* LEFT (STICKY FOTO) */}
          <div className="lg:sticky top-32 h-fit">

            <div className="w-full max-w-[420px]">
              <Image
                src="/images/dosen/kaprodi.png"
                alt="Kaprodi"
                width={420}
                height={520}
                className="w-full h-auto object-cover rounded-xl shadow-lg"
              />
            </div>

            {/* IDENTITAS */}
            {/* <div className="mt-6 border-l-4 border-primary pl-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Asep Muhamad Iqbal, Ph.D.
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Ketua Program Magister Pemikiran Politik Islam
              </p>
            </div> */}

          </div>

          {/* RIGHT (CONTENT) */}
          <div>

            {/* HEADER */}
            <div className="mb-10">
              <span className="text-sm uppercase tracking-widest text-primary font-semibold">
                Sambutan
              </span>

              <h2 className="text-4xl lg:text-5xl font-bold leading-tight mt-3 text-gray-900 dark:text-white">
                Ketua Program Magister
                <br />
                Pemikiran Politik Islam
              </h2>

              <div className="w-16 h-[2px] bg-primary mt-6"></div>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {/* QUOTE HIGHLIGHT */}
                <blockquote className="border-l-4 border-primary pl-6 italic text-lg text-gray-600 dark:text-gray-300 mb-8">
                  “Membangun pemikiran politik Islam yang kritis,
                  inklusif, dan relevan dengan tantangan global.”
                </blockquote>

                {/* CONTENT */}
                <div
                  className={`prose max-w-none text-gray-700 dark:text-gray-300 leading-relaxed text-justify transition-all duration-500 ${
                    expanded ? '' : 'line-clamp-[12]'
                  }`}
                  dangerouslySetInnerHTML={{ __html: content }}
                />

                {/* BUTTON */}
                <div className="mt-10">
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-white transition rounded-md text-sm font-medium"
                  >
                    {expanded ? 'Tutup' : 'Baca Selengkapnya'}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </section>
  )
}

export default SambutanPage
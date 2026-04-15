'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { getImgPath } from '@/app/(main)/utils/paths'
import { supabase } from '@/lib/supabase'

const BiayaPage = () => {
  const [linkBiaya, setLinkBiaya] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('panduan')
        .select('link_panduan')
        .limit(1)
        .single()

      if (error) console.error(error)
      if (data) setLinkBiaya(data.link_panduan)

      setLoading(false)
    }

    fetchData()
  }, [])

  return (
    <div className="pt-[160px] pb-[120px] dark:bg-darklight">

      {/* CONTENT */}
      <div className="container space-y-14">

        {/* HERO CARD */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-100 to-blue-200 dark:from-dark dark:to-darklight p-8 md:p-12">

          <div className="grid md:grid-cols-2 gap-10 items-center">

            {/* LEFT */}
            <div className="space-y-6">

              <h2 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-white">
                Informasi Biaya Akademik
              </h2>

              <p className="text-gray-600 dark:text-gray-300">
                Biaya kuliah Program Magister Pemikiran Politik Islam mengikuti 
                ketentuan resmi universitas. Silakan akses informasi lengkap 
                melalui laman yang tersedia.
              </p>

              {/* INPUT + BUTTON */}
              <div className="flex items-center bg-white dark:bg-dark rounded-full shadow-md overflow-hidden">

                <input
                  type="text"
                  placeholder="Kunjungi halaman biaya resmi"
                  className="flex-1 px-5 py-3 outline-none bg-transparent text-sm"
                  disabled
                />

                <a
                  href={linkBiaya || '#'}
                  target="_blank"
                  className="bg-black text-white px-6 py-3 text-sm font-medium rounded-full m-1 hover:bg-gray-800 transition"
                >
                  {loading ? 'Loading...' : 'Lihat Biaya'}
                </a>
              </div>

              {/* STEPS */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">

                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-black text-xs font-bold">1</span>
                  Akses halaman biaya
                </span>

                <span className="opacity-50">|</span>

                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-black text-xs font-bold">2</span>
                  Pilih program studi
                </span>

                <span className="opacity-50">|</span>

                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-black text-xs font-bold">3</span>
                  Lihat rincian biaya
                </span>
              </div>
            </div>

            {/* RIGHT CARD */}
            <div className="relative hidden md:block">

              <div className="bg-white dark:bg-dark rounded-2xl shadow-lg p-6 space-y-4">

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">
                    Estimasi Biaya
                  </span>
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    Transparan
                  </span>
                </div>

                <div className="text-3xl font-bold text-gray-800 dark:text-white">
                  Rp 8 - 12 Jt
                </div>

                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-primary rounded-full"></div>
                </div>

                <p className="text-xs text-gray-500">
                  *Estimasi dapat berbeda sesuai kebijakan universitas
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BiayaPage
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getImgPath } from '@/app/(main)/utils/paths'
import { supabase } from '@/lib/supabase'

const MatkulPage = () => {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)

  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('mata_kuliah')
        .select(`
          kode_mk,
          nama_mk,
          sks,
          deskripsi,
          tipe_matkul:tipe_mk (
            tipe_id
          )
        `)
        .order('nama_mk', { ascending: true })

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
              Mata Kuliah
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
            Deskripsi <span className="text-primary">Mata Kuliah</span>
          </h2>

          <p className="text-gray-500 dark:text-gray-400">
            Informasi lengkap mengenai setiap mata kuliah dalam program studi
          </p>

          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        {/* DATA */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : data.length === 0 ? (
          <p className="text-center text-gray-500">
            Data mata kuliah belum tersedia
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {data.map((mk, index) => (
              <div
                key={index}
                className="bg-white dark:bg-dark rounded-2xl shadow-md p-6 space-y-4 hover:shadow-xl transition"
              >
                {/* HEADER */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-primary">
                      {mk.nama_mk}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {mk.kode_mk}
                    </p>
                  </div>

                  <span className="text-sm font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {mk.sks} SKS
                  </span>
                </div>

                {/* TIPE */}
                <div>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      mk.tipe_matkul?.tipe_id === 'Wajib'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {mk.tipe_matkul?.tipe_id}
                  </span>
                </div>

                {/* DESKRIPSI */}
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed text-justify">
                  {mk.deskripsi || 'Belum ada deskripsi mata kuliah.'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MatkulPage
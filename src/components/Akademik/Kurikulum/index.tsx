'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getImgPath } from '@/app/(main)/utils/paths'
import { supabase } from '@/lib/supabase'

const KurikulumPage = () => {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)

  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('kurikulum_detail')
        .select(`
          kurikulum:kurikulum_id (
            nama_kurikulum,
            tahun
          ),
          semester:semester_id (
            nama_semester
          ),
          mata_kuliah:mk_id (
            kode_mk,
            nama_mk,
            sks,
            tipe_matkul:tipe_mk (
              tipe_id
            )
          )
        `)
        .order('semester_id', { ascending: true })

      if (error) console.error(error)
      if (data) setData(data)

      setLoading(false)
    }

    fetchData()
  }, [])

  // 🔥 GROUPING DATA
  const grouped = data.reduce((acc: any, item: any) => {
    const kurName = item.kurikulum?.nama_kurikulum
    const tahun = item.kurikulum?.tahun
    const semester = item.semester?.nama_semester

    if (!acc[kurName]) {
      acc[kurName] = {
        tahun,
        semesters: {}
      }
    }

    if (!acc[kurName].semesters[semester]) {
      acc[kurName].semesters[semester] = []
    }

    acc[kurName].semesters[semester].push(item.mata_kuliah)

    return acc
  }, {})

  return (
    <div className="pt-[160px] pb-[120px] dark:bg-darklight">

      {/* HERO */}
      <div className="container mb-16">
        <div className="relative rounded-2xl overflow-hidden">
          <Image
            src={getImgPath('/images/banner/uin.jpg')}
            alt="Banner"
            width={1400}
            height={500}
            className="w-full h-[300px] md:h-[400px] object-cover"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Kurikulum Akademik
            </h1>

            {/* BREADCRUMB */}
            <div className="text-white/90 flex gap-2 mt-3 flex-wrap justify-center text-sm">
              <Link href="/" className="hover:underline">
                Home
              </Link>

              {pathSegments.map((segment, index) => {
                const href =
                  '/' + pathSegments.slice(0, index + 1).join('/')
                const isLast = index === pathSegments.length - 1

                const label =
                  segment.charAt(0).toUpperCase() + segment.slice(1)

                return (
                  <span key={href} className="flex gap-2 items-center">
                    <span className="opacity-70">/</span>

                    {isLast ? (
                      <span className="text-white font-medium">
                        {label}
                      </span>
                    ) : (
                      <Link href={href} className="hover:underline">
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

      {/* CONTENT */}
      <div className="container space-y-12">
        <div className="text-center space-y-4">

          {/* BADGE */}
          {/* <div className="inline-block px-4 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
            Akademik
          </div> */}

          {/* TITLE */}
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Kurikulum <span className="text-primary">Akademik</span>
          </h2>

          {/* SUBTITLE */}
          <p className="max-w-2xl mx-auto text-gray-500 dark:text-gray-400">
            Struktur kurikulum dirancang untuk memberikan keseimbangan antara teori dan praktik, 
            serta mendukung pengembangan kompetensi akademik dan profesional mahasiswa.
          </p>

          {/* GARIS AKSEN */}
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>

        </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          Object.keys(grouped).map((kurName) => {
            const kur = grouped[kurName]

            return (
              <div key={kurName} className="space-y-8">

                {/* HEADER */}
                {/* <div className="text-center">
                  <h3 className="text-2xl font-bold text-primary">
                    {kurName}
                  </h3>
                  <p className="text-gray-500">
                    Tahun {kur.tahun}
                  </p>
                </div> */}

                {/* SEMESTER */}
                {Object.keys(kur.semesters).map((semester) => (
                  <div
                    key={semester}
                    className="bg-white dark:bg-dark rounded-2xl shadow-md p-6"
                  >
                    <h4 className="text-lg font-semibold mb-6">
                      {semester}
                    </h4>

                    {/* 🔥 MODERN TABLE */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-separate border-spacing-y-2">

                        {/* HEADER */}
                        <thead>
                          <tr className="text-xs uppercase text-gray-500 dark:text-gray-400">
                            <th className="px-4 py-2 text-left">Kode</th>
                            <th className="px-4 py-2 text-left">Mata Kuliah</th>
                            <th className="px-4 py-2 text-center">SKS</th>
                            <th className="px-4 py-2 text-center">Tipe</th>
                          </tr>
                        </thead>

                        {/* BODY */}
                        <tbody>
                          {kur.semesters[semester].map((mk: any, i: number) => (
                            <tr
                              key={i}
                              className="bg-white dark:bg-darklight shadow-sm hover:shadow-md transition-all"
                            >
                              <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300 rounded-l-xl">
                                {mk.kode_mk}
                              </td>

                              <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                {mk.nama_mk}
                              </td>

                              <td className="px-4 py-3 text-center font-semibold">
                                {mk.sks}
                              </td>

                              <td className="px-4 py-3 text-center rounded-r-xl">
                                <span
                                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                                    mk.tipe_matkul?.tipe_id === 'Wajib'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-yellow-100 text-yellow-700'
                                  }`}
                                >
                                  {mk.tipe_matkul?.tipe_id}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </div>
                ))}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default KurikulumPage
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

  // 🔥 GROUPING
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

          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Kurikulum Akademik
            </h1>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container space-y-12">
        <h2 className="text-3xl font-bold text-center">
          Kurikulum Akademik
        </h2>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          Object.keys(grouped).map((kurName) => {
            const kur = grouped[kurName]

            return (
              <div key={kurName} className="space-y-8">

                {/* HEADER */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-primary">
                    {kurName}
                  </h3>
                  <p className="text-gray-500">
                    Tahun {kur.tahun}
                  </p>
                </div>

                {/* SEMESTER */}
                {Object.keys(kur.semesters).map((semester) => (
                  <div
                    key={semester}
                    className="bg-white rounded-2xl shadow-md p-6"
                  >
                    <h4 className="text-lg font-semibold mb-4">
                      {semester}
                    </h4>

                    <div className="overflow-x-auto">
                      <table className="w-full border rounded-xl overflow-hidden">
                        <thead className="bg-primary text-white">
                          <tr>
                            <th className="px-4 py-2">Kode Mata Kuliah</th>
                            <th className="px-4 py-2">Mata Kuliah</th>
                            <th className="px-4 py-2">SKS</th>
                            <th className="px-4 py-2">Tipe Mata Kuliah</th>
                          </tr>
                        </thead>

                        <tbody>
                          {kur.semesters[semester].map((mk: any, i: number) => (
                            <tr key={i} className="border-t hover:bg-gray-50">
                              <td className="px-4 py-2">{mk.kode_mk}</td>
                              <td className="px-4 py-2">{mk.nama_mk}</td>
                              <td className="px-4 py-2">{mk.sks}</td>
                              <td className="px-4 py-2">
                                <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
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
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getImgPath } from '@/app/(main)/utils/paths'
import { supabase } from '@/lib/supabase'

const DosenPage = () => {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)

  const [lecturers, setLecturers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLecturers = async () => {
      const { data, error } = await supabase
        .from('lecturers')
        .select('*')

      if (error) console.error(error)
      if (data) setLecturers(data)

      setLoading(false)
    }

    fetchLecturers()
  }, [])

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
              Dosen
            </h1>

            <div className="text-white/90 flex gap-2 mt-2 flex-wrap">
              <Link href="/">Home</Link>
              {pathSegments.map((segment, index) => {
                const href =
                  '/' + pathSegments.slice(0, index + 1).join('/')
                const isLast = index === pathSegments.length - 1

                return (
                  <span key={href} className="flex gap-2">
                    ›
                    {isLast ? (
                      <span>{segment}</span>
                    ) : (
                      <Link href={href}>{segment}</Link>
                    )}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container">
        <div className="text-center space-y-4 mb-6">

          {/* BADGE */}
          {/* <div className="inline-block px-4 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
            Akademik
          </div> */}

          {/* TITLE */}
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Daftar <span className="text-primary">Dosen</span>
          </h2>

          {/* SUBTITLE */}
          <p className="max-w-2xl mx-auto text-gray-500 dark:text-gray-400">
            Dosen tetap Program Magister Pemikiran Politik Islam terdiri atas para akademisi dengan latar kepakaran yang saling melengkapi dalam bidang politik Islam, agama dan politik, pemikiran Islam, serta studi agama. Komposisi ini menunjukkan kekuatan program dalam membangun kajian yang interdisipliner, sekaligus tetap berakar kuat pada tradisi intelektual Islam dan isu-isu politik kontemporer.
          </p>

          {/* GARIS AKSEN */}
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>

        </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-10">

            {lecturers.map((dosen, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
              >

                {/* TOP */}
                <div className="flex flex-col md:flex-row gap-6 p-6">

                  {/* FOTO */}
                  <div className="flex-shrink-0">
                    <div className="w-[180px] h-[220px] relative rounded-xl overflow-hidden">
                      <Image
                        src={dosen.foto || getImgPath('/images/dosen/1.png')}
                        alt={dosen.nama}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* TEXT */}
                  <div className="flex-1 text-left">
                    <h3 className="text-xl font-bold text-primary mb-2">
                      {dosen.nama}
                    </h3>

                    <p>
                      <span className="font-semibold">Jabatan:</span> {dosen.jabatan}
                    </p>

                    <p>
                      <span className="font-semibold">Keahlian:</span> {dosen.skills}
                    </p>

                    <p>
                      <span className="font-semibold">Mata Kuliah Diampu:</span>{' '}
                      {dosen.matkul}
                    </p>
                  </div>

                </div>

                {/* BOTTOM LOGO */}
                <div className="p-6">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-6"></div>

                    <div className="flex justify-center gap-6 flex-wrap items-center">
                        <Image
                    src={getImgPath('/images/dosen/akademik/google-scholar.png')}
                    alt="google scholar"
                    width={120}
                    height={40}
                    className="opacity-70 hover:opacity-100 transition"
                  />

                  <Image
                    src={getImgPath('/images/dosen/akademik/sinta.png')}
                    alt="sinta"
                    width={100}
                    height={40}
                    className="opacity-70 hover:opacity-100 transition"
                  />

                  <Image
                    src={getImgPath('/images/dosen/akademik/scopus.png')}
                    alt="scopus"
                    width={100}
                    height={40}
                    className="opacity-70 hover:opacity-100 transition"
                  />

                  <Image
                    src={getImgPath('/images/dosen/akademik/orcid.png')}
                    alt="orcid"
                    width={100}
                    height={40}
                    className="opacity-70 hover:opacity-100 transition"
                  />
                    </div>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  )
}

export default DosenPage
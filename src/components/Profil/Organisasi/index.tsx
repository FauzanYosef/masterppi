'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { getImgPath } from '@/app/(main)/utils/paths'

const OrganisasiPage = () => {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)

  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // 🔥 GET FOTO
  const getFoto = (foto: string | null) => {
    if (!foto) return '/images/dosen/kajur.png'
    if (foto.startsWith('http')) return foto

    const { data } = supabase
      .storage
      .from('organization')
      .getPublicUrl(foto)

    return data.publicUrl
  }

  // 🔥 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('organization')
        .select('*')

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
              Struktur Organisasi
            </h1>

            <div className="text-white/90 flex gap-2 mt-2 flex-wrap">
              <Link href="/">Home</Link>
              {pathSegments.map((segment, index) => {
                const href = '/' + pathSegments.slice(0, index + 1).join('/')
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

        <div className="pb-12 text-center">
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900">
            Struktur Organisasi <br />
            <span className="text-primary">
              Pemikiran Politik Islam
            </span>
          </h2>
        </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="flex flex-col items-center">

            {(() => {
              // 🔥 PAKAI KEY
              const dekan = data.find((d) => d.key === 'dekan')
              const kajur = data.find((d) => d.key === 'kajur')
              const staff = data.filter((d) => d.key === 'staff')

              return (
                <>
                  {/* DEKAN */}
                  {dekan && (
                    <motion.div
                      initial={{ opacity: 0, y: -40 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center"
                    >
                      <Card item={dekan} getFoto={getFoto} />
                      <div className="w-[3px] h-20 bg-primary rounded-full"></div>
                    </motion.div>
                  )}

                  {/* KAJUR */}
                  {kajur && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center"
                    >
                      <Card item={kajur} getFoto={getFoto} />

                      {/* GARIS TURUN */}
                      <div className="w-[3px] h-20 bg-primary rounded-full"></div>

                      {/* STAFF */}
                      {staff.length > 0 && (
                        <>
                          {/* GARIS CABANG */}
                          {/* <div className="w-[80%] h-[3px] bg-primary rounded-full"></div> */}

                          <div className="flex justify-center flex-wrap gap-10  w-full">
                            {staff.map((item, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex flex-col items-center"
                              >
                                {/* <div className="w-[3px] h-6 bg-primary mb-2"></div> */}

                                <Card item={item} getFoto={getFoto} />
                              </motion.div>
                            ))}
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </>
              )
            })()}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrganisasiPage



const Card = ({ item, getFoto }: any) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 text-center w-[350px] hover:shadow-xl transition">
      <div className="relative w-28 h-36 mx-auto mb-4 rounded-xl overflow-hidden">
        <Image
          src={getFoto(item.foto)}
          alt={item.nama}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <h3 className="font-semibold text-lg text-primary">
        {item.nama}
      </h3>
      <p className="text-sm text-gray-500">
        {item.jabatan}
      </p>
    </div>
  )
}
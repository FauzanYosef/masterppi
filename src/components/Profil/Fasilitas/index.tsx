'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { getImgPath } from '@/app/(main)/utils/paths'
import { Calendar, BookOpen, Building2, Users, Database, FlaskConical } from 'lucide-react'

const FasilitasPage = () => {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)

  const fasilitas = [
    {
      title: 'Ruang Kuliah Modern',
      desc: 'Fasilitas ruang belajar yang nyaman dan dilengkapi teknologi pembelajaran terbaru.',
      icon: Calendar
    },
    {
      title: 'Akses Jurnal Internasional',
      desc: 'Akses ke berbagai jurnal ilmiah internasional dari database universitas.',
      icon: BookOpen
    },
    {
      title: 'Research Laboratory',
      desc: 'Islamic Governance, Policy and Digital Politics Lab sebagai pusat riset.',
      icon: FlaskConical
    },
    {
      title: 'Perpustakaan',
      desc: 'Koleksi buku dan referensi akademik lengkap untuk menunjang studi.',
      icon: Building2
    },
    {
      title: 'Ruang Diskusi',
      desc: 'Area kolaboratif untuk diskusi akademik dan pengembangan ide.',
      icon: Users
    },
    {
      title: 'Repository Riset',
      desc: 'Sistem penyimpanan dan akses hasil penelitian mahasiswa dan dosen.',
      icon: Database
    }
  ]

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
              Fasilitas
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

        {/* TITLE */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900">
            Fasilitas <br />
            <span className="text-primary">
              Program Magister Pemikiran Politik Islam
            </span>
          </h2>
        </div>

        {/* GRID FITUR */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">

          {fasilitas.map((item, i) => {
            const Icon = item.icon

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center px-6"
              >
                {/* ICON */}
                <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon size={28} />
                </div>

                {/* TITLE */}
                <h3 className="font-semibold text-lg text-gray-800 mb-2">
                  {item.title}
                </h3>

                {/* DESC */}
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            )
          })}

        </div>
      </div>
    </div>
  )
}

export default FasilitasPage
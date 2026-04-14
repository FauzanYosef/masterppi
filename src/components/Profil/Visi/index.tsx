'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getImgPath } from '@/app/(main)/utils/paths'
import { CalendarDays, User } from 'lucide-react'

const VisiPage = () => {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)

  return (
    <div className="pt-[160px] pb-[120px] dark:bg-darklight">

      {/* HERO */}
      <div className="container mb-16">
        <div className="relative rounded-2xl overflow-hidden">
          <Image
            src={getImgPath('/images/banner/uin.jpg')}
            alt="Profile Banner"
            width={1400}
            height={500}
            className="w-full h-[300px] md:h-[400px] object-cover"
          />

          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
              Visi Program Studi
            </h1>

            {/* Breadcrumb */}
            <div className="text-sm md:text-base text-white/90 flex items-center gap-2 flex-wrap">
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>

              {pathSegments.map((segment, index) => {
                const href =
                  '/' + pathSegments.slice(0, index + 1).join('/')
                const isLast = index === pathSegments.length - 1

                const label = segment
                  .replace(/-/g, ' ')
                  .replace(/\b\w/g, (l) => l.toUpperCase())

                return (
                  <span key={href} className="flex items-center gap-2">
                    <span className="opacity-70">›</span>
                    {isLast ? (
                      <span className="text-white font-medium">
                        {label}
                      </span>
                    ) : (
                      <Link
                        href={href}
                        className="hover:text-white transition"
                      >
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
      <div className="container">

        <div className="max-w-3xl mx-auto text-center ">

          {/* TITLE */}
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
            Visi & Misi <br />
            <span className="text-primary">
              Magister Pemikiran Politik Islam
            </span>
          </h2>

          {/* META */}
          {/* <div className="flex justify-center items-center gap-8 text-gray-500 text-sm mb-12">

            <div className="flex items-center gap-2">
              <CalendarDays size={18} className="text-yellow-500" />
              29 March 2021
            </div>

            <div className="flex items-center gap-2">
              <User size={18} className="text-yellow-500" />
              Oleh : Admin
            </div>

          </div> */}

          {/* VISI QUOTE */}
          <div className="relative  px-10 py-16">

            {/* Quote Left */}
            <span className="absolute left-6 top-6 text-6xl text-gray-300">
              “
            </span>

            {/* Quote Right */}
            <span className="absolute right-6 bottom-6 text-6xl text-gray-300">
              ”
            </span>

            <p className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
              “Menjadi Program Magister Pemikiran Politik Islam rujukan di Asia Tenggara pada tahun 2030 yang unggul dalam riset, publikasi, dan kontribusi kebijakan, berlandaskan nilai  <span className="font-semibold">Rahmatan lil Alamin</span>
            </p>

          </div>

        </div>

      </div>
    </div>
  )
}

export default VisiPage
'use client'

import Image from 'next/image'
import { getImgPath } from '@/app/(main)/utils/paths'

const RegistrationBanner = () => {
  return (
    <section className="py-16 bg-secondary">
      <div className="container">
        
        <div className="relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 bg-primary/10 rounded-2xl px-6 md:px-12 py-8 shadow-md hover:shadow-lg transition">
          
          {/* BACKGROUND PATTERN */}
          <div className="pointer-events-none absolute top-16 -left-10 opacity-20 blur-sm hidden md:block">
            <Image
              src={getImgPath('/images/banner/pattern1.svg')}
              alt="pattern"
              width={141}
              height={141}
            />
          </div>

          <div className="pointer-events-none absolute bottom-0 left-[53%] opacity-20 blur-sm hidden md:block">
            <Image
              src={getImgPath('/images/banner/pattern2.svg')}
              alt="pattern"
              width={141}
              height={141}
            />
          </div>

          {/* LEFT TEXT */}
          <div className="max-w-xl z-10">
            <p className="text-sm text-primary font-semibold mb-4 mt-2">
              Pendaftaran Mahasiswa Baru
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-snug mb-2">
              Bergabung bersama Program Magister <br />
              <span className="text-primary">
                Pemikiran Politik Islam
              </span>
            </h2>
          </div>

          {/* RIGHT BUTTON */}
          <div className="z-10">
            <a
              href="https://pmb.uinsgd.ac.id"
              target="_blank"
              className="bg-primary text-white px-7 py-3 rounded-xl font-medium border border-primary hover:bg-transparent hover:text-primary transition-all duration-300 active:scale-95"
            >
              Daftar Sekarang
            </a>
          </div>

          {/* DECOR DOT */}
          <div className="absolute top-4 right-6 text-primary opacity-30">
            ✦✦✦
          </div>

          <div className="absolute top-4 left-8 opacity-20 hidden md:block">
            <div className="grid grid-cols-4 gap-1">
                {Array.from({ length: 16 }).map((_, i) => (
                <span
                    key={i}
                    className="w-1.5 h-1.5 bg-primary rounded-full block"
                ></span>
                ))}
            </div>
          </div>

          <div className="absolute -bot-10 -right-10 w-32 h-32 bg-primary opacity-20 rounded-full blur-2xl"></div>


        </div>

      </div>
    </section>
  )
}

export default RegistrationBanner
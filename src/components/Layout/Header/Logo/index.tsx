'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getImgPath } from '@/app/(main)/utils/paths'
import { getSiteIdentity } from '@/lib/site-identity'

interface LogoProps {
  withText?: boolean
  /** Varian teks putih untuk latar gelap (footer). */
  inverted?: boolean
  compact?: boolean
}

const Logo = ({ withText = true, inverted = false, compact = false }: LogoProps) => {
  const size = compact ? 'w-10 h-10' : 'w-12 h-12'
  // Logo program dari CMS (Pengaturan Website); bila kosong memakai logo bawaan.
  const [programLogo, setProgramLogo] = useState<string | null>(null)
  useEffect(() => {
    let cancelled = false
    getSiteIdentity().then((identity) => {
      if (!cancelled) setProgramLogo(identity.logo)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Link href='/' className='flex items-center gap-3 shrink-0' aria-label='Beranda Magister Pemikiran Politik Islam'>
      <div className='flex items-center gap-2'>
        <div className={`relative ${size} transition-all duration-300`}>
          <Image src={getImgPath('/images/logo/logo.png')} alt='Logo UIN Sunan Gunung Djati' fill sizes='48px' className='object-contain' priority />
        </div>
        <div className={`relative ${size} transition-all duration-300`}>
          <Image src={programLogo ?? getImgPath('/images/logo/ppi_logo.png')} alt='Logo Magister PPI' fill sizes='48px' className='object-contain' priority unoptimized={programLogo !== null} />
        </div>
      </div>

      {withText && (
        <>
          <div className={`hidden sm:block w-px h-9 ${inverted ? 'bg-white/20' : 'bg-darkblue/10 dark:bg-white/20'}`} />
          <div className='hidden sm:flex flex-col leading-tight'>
            <span className={`font-bold text-[15px] ${inverted ? 'text-white' : 'text-darkblue dark:text-white'}`}>
              Magister Pemikiran Politik Islam
            </span>
            <span className={`text-xs ${inverted ? 'text-white/60' : 'text-lightgrey dark:text-white/60'}`}>
              FISIP · UIN Sunan Gunung Djati Bandung
            </span>
          </div>
        </>
      )}
    </Link>
  )
}

export default Logo

'use client'

import { useEffect, useState } from 'react'
import Link from '@/components/UI/LocaleLink'
import Image from 'next/image'
import { getImgPath } from '@/lib/paths'
import { getSiteIdentity } from '@/lib/site-identity'
import { useI18n } from '@/i18n/I18nProvider'

interface LogoProps {
  withText?: boolean
  /** Varian teks putih untuk latar gelap (footer). */
  inverted?: boolean
  compact?: boolean
}

const Logo = ({ withText = true, inverted = false, compact = false }: LogoProps) => {
  const { t } = useI18n()
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
    <Link href='/' className='flex items-center gap-3 shrink-0' aria-label={t.site.logoHomeLabel}>
      <div className='flex items-center gap-2'>
        <div className={`relative ${size} transition-all duration-300`}>
          <Image src={getImgPath('/images/logo/logo.png')} alt={t.site.logoUin} fill sizes='48px' className='object-contain' priority />
        </div>
        <div className={`relative ${size} transition-all duration-300`}>
          <Image src={programLogo ?? getImgPath('/images/logo/ppi_logo.png')} alt={t.site.logoProgram} fill sizes='48px' className='object-contain' priority unoptimized={programLogo !== null} />
        </div>
      </div>

      {withText && (
        <>
          <div className={`hidden sm:block w-px h-9 ${inverted ? 'bg-white/20' : 'bg-darkblue/10 dark:bg-white/20'}`} />
          <div className='hidden sm:flex flex-col leading-tight'>
            <span className={`font-bold text-[15px] ${inverted ? 'text-white' : 'text-darkblue dark:text-white'}`}>
              {t.site.shortName}
            </span>
            <span className={`text-xs ${inverted ? 'text-white/60' : 'text-lightgrey dark:text-white/60'}`}>
              {t.site.faculty}
            </span>
          </div>
        </>
      )}
    </Link>
  )
}

export default Logo

import Link from 'next/link'
import Image from 'next/image'
import { getImgPath } from '@/app/(main)/utils/paths'

interface LogoProps {
  withText?: boolean
}

const Logo = ({ withText = true }: LogoProps) => {
  return (
    <Link href="/" className="flex items-center gap-3">
      {/* Logo */}
      <div className="relative w-16 h-20">
        <Image
          src={getImgPath('/images/logo/logo.png')}
          alt="logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="relative w-16 h-16">
        <Image
          src={getImgPath('/images/logo/ppi_logo.png')}
          alt="logo"
          fill
          className="object-contain"
          priority
        />
      </div>

      {withText && (
        <>
          {/* Divider */}
          <div className="w-px h-10 bg-gray-300 dark:bg-gray-600 transition-colors duration-300" />

          {/* Text */}
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-base text-primary dark:text-white transition-colors duration-300">
              Program Magister Pemikiran Politik Islam
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
              UIN Sunan Gunung Djati Bandung
            </span>
          </div>
        </>
      )}
    </Link>
  )
}

export default Logo
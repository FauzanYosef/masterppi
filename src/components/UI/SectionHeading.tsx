import type { ReactNode } from 'react'

type SectionHeadingProps = {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'center' | 'left'
  /** Elemen tambahan di kanan judul (mis. tombol "Lihat semua"); hanya untuk align="left". */
  action?: ReactNode
  className?: string
}

/** Judul section yang seragam: label kecil, judul, garis aksen, dan deskripsi. */
const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = 'center',
  action,
  className = '',
}: SectionHeadingProps) => {
  const centered = align === 'center'

  return (
    <div
      className={`mb-12 flex flex-col gap-6 ${
        centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'
      } ${className}`}>
      <div className={`flex flex-col gap-4 ${centered ? 'items-center max-w-2xl' : 'max-w-2xl'}`}>
        {eyebrow && <span className='eyebrow'>{eyebrow}</span>}
        <h2>{title}</h2>
        {description && <p className='text-base md:text-lg'>{description}</p>}
      </div>
      {action && !centered && <div className='shrink-0'>{action}</div>}
    </div>
  )
}

export default SectionHeading

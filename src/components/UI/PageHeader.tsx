'use client'

import Image from 'next/image'
import Link from '@/components/UI/LocaleLink'
import { useCurrentPath, useI18n } from '@/i18n/I18nProvider'
import type { ReactNode } from 'react'
import { getImgPath } from '@/lib/paths'

type PageHeaderProps = {
  title: ReactNode
  description?: ReactNode
  /** Label kecil di atas judul; bawaan diambil dari menu induk halaman. */
  eyebrow?: string
  /** Label terakhir breadcrumb (mis. judul berita). */
  currentLabel?: string
  image?: string
}

const toLabel = (labels: Record<string, string>, href: string, segment: string) =>
  labels[href] ??
  decodeURIComponent(segment)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())

/** Banner judul halaman dalam yang seragam: latar navy, foto kampus samar, dan breadcrumb. */
const PageHeader = ({ title, description, eyebrow, currentLabel, image }: PageHeaderProps) => {
  const { t } = useI18n()
  const pathname = useCurrentPath()
  const segments = pathname.split('/').filter(Boolean)
  const crumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const isLast = index === segments.length - 1
    return { href, label: isLast && currentLabel ? currentLabel : toLabel(t.nav, href, segment), isLast }
  })
  const parentLabel = eyebrow ?? (segments.length > 1 ? toLabel(t.nav, '/' + segments[0], segments[0]) : undefined)

  return (
    <div className='relative isolate overflow-hidden bg-darkblue pt-36 pb-16 md:pt-44 md:pb-20'>
      <Image
        src={image ?? getImgPath('/images/banner/uin.jpg')}
        alt=''
        fill
        priority
        sizes='100vw'
        className='-z-20 object-cover opacity-25'
      />
      <div className='absolute inset-0 -z-10 bg-gradient-to-br from-darkblue via-darkblue/90 to-primary/70' />
      <div className='absolute inset-0 -z-10 bg-grid opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]' />
      <div className='absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-sec-yellow/20 blur-3xl' />

      <div className='container'>
        <nav aria-label={t.common.breadcrumb} className='mb-6'>
          <ol className='flex flex-wrap items-center gap-2 text-sm text-white/60'>
            <li>
              <Link href='/' className='transition hover:text-white'>
                {t.nav['/']}
              </Link>
            </li>
            {crumbs.map((crumb) => (
              <li key={crumb.href} className='flex items-center gap-2'>
                <span aria-hidden className='text-white/30'>
                  /
                </span>
                {crumb.isLast ? (
                  <span aria-current='page' className='line-clamp-1 font-medium text-white'>
                    {crumb.label}
                  </span>
                ) : (
                  <span>{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className='max-w-3xl'>
          {parentLabel && (
            <span className='eyebrow mb-4 !text-sec-yellow'>{parentLabel}</span>
          )}
          <h1 className='!text-white text-3xl md:text-5xl'>{title}</h1>
          {description && <p className='mt-5 max-w-2xl text-base text-white/75 md:text-lg'>{description}</p>}
        </div>
      </div>
    </div>
  )
}

export default PageHeader

'use client'

import Image from 'next/image'
import Link from '@/components/UI/LocaleLink'
import { Icon } from '@iconify/react'
import type { ReactNode } from 'react'
import { useI18n } from '@/i18n/I18nProvider'

type PostCardProps = {
  href: string
  image: string
  title: string
  excerpt?: string
  category?: string | null
  date?: string
  /** Label di pojok gambar (mis. status agenda). */
  badge?: ReactNode
  /** Baris info di bagian bawah kartu (mis. lokasi). */
  footer?: ReactNode
  priority?: boolean
}

/** Kartu konten (berita, agenda) yang dipakai di beranda dan halaman daftar. */
const PostCard = ({ href, image, title, excerpt, category, date, badge, footer, priority }: PostCardProps) => {
  const { t } = useI18n()
  return (
  <Link href={href} className='group card card-hover flex h-full flex-col'>
    <div className='relative aspect-[16/10] shrink-0 overflow-hidden bg-secondary'>
      <Image
        src={image}
        alt={title}
        fill
        priority={priority}
        sizes='(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
        className='object-cover transition-transform duration-700 group-hover:scale-105'
      />
      {badge && <div className='absolute left-4 top-4'>{badge}</div>}
    </div>

    <div className='flex flex-1 flex-col p-6'>
      <div className='mb-4 flex items-center justify-between gap-3'>
        <span className='chip'>{category || t.common.general}</span>
        {date && (
          <span className='flex items-center gap-1.5 whitespace-nowrap text-xs text-lightgrey'>
            <Icon icon='tabler:calendar' width={14} aria-hidden />
            {date}
          </span>
        )}
      </div>

      <h5 className='line-clamp-2 text-lg leading-snug transition-colors group-hover:text-primary dark:group-hover:text-sec-yellow'>
        {title}
      </h5>
      {excerpt && <p className='mt-3 line-clamp-3 text-sm'>{excerpt}</p>}

      <div className='mt-auto flex items-center justify-between gap-3 pt-6'>
        <div className='min-w-0 text-xs text-lightgrey'>{footer}</div>
        <span className='flex items-center gap-1 text-sm font-semibold text-primary dark:text-sec-yellow'>
          {t.common.read}
          <Icon icon='tabler:arrow-right' width={16} className='transition-transform group-hover:translate-x-1' aria-hidden />
        </span>
      </div>
    </div>
  </Link>
  )
}

export const PostCardSkeleton = () => (
  <div className='card flex h-full flex-col'>
    <div className='aspect-[16/10] animate-pulse bg-darkblue/[0.06]' />
    <div className='space-y-3 p-6'>
      <div className='h-5 w-20 animate-pulse rounded-full bg-darkblue/[0.06]' />
      <div className='h-5 w-full animate-pulse rounded bg-darkblue/[0.06]' />
      <div className='h-5 w-2/3 animate-pulse rounded bg-darkblue/[0.06]' />
      <div className='h-4 w-full animate-pulse rounded bg-darkblue/[0.04]' />
    </div>
  </div>
)

export const stripHtml = (html?: string | null, max?: number) => {
  if (!html) return ''
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
  return max && text.length > max ? `${text.slice(0, max).trimEnd()}…` : text
}

export default PostCard

'use client'

import NextLink from 'next/link'
import type { ComponentProps } from 'react'
import { useI18n } from '@/i18n/I18nProvider'

type LinkProps = ComponentProps<typeof NextLink>

/**
 * Pengganti `next/link` yang otomatis menambahkan awalan bahasa:
 * di versi Inggris, href="/berita" menjadi "/en/berita".
 */
const LocaleLink = ({ href, ...props }: LinkProps) => {
  const { path } = useI18n()
  const localized = typeof href === 'string' ? path(href) : { ...href, pathname: href.pathname ? path(href.pathname) : href.pathname }
  return <NextLink href={localized} {...props} />
}

export default LocaleLink

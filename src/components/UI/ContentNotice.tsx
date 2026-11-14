'use client'

import { useI18n } from '@/i18n/I18nProvider'
import { DEFAULT_LOCALE } from '@/i18n/config'

/** true bila konten dari API tampil dalam bahasa Indonesia di halaman bahasa lain. */
export function isIndonesianOnly(lang: string, item: { translated?: boolean } | null | undefined): boolean {
  return lang !== DEFAULT_LOCALE && item?.translated !== true
}

/**
 * Catatan "konten hanya tersedia dalam bahasa Indonesia" pada halaman bahasa Inggris untuk
 * konten CMS yang belum diterjemahkan (API ?lang=en → translated !== true).
 */
export default function ContentNotice({
  item,
  className = '',
}: {
  item: { translated?: boolean } | null | undefined
  className?: string
}) {
  const { lang, t } = useI18n()
  if (!isIndonesianOnly(lang, item)) return null

  return (
    <p
      role="note"
      className={`flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200 ${className}`}
    >
      <span aria-hidden>🌐</span>
      <span>{t.detail.indonesianOnly}</span>
    </p>
  )
}

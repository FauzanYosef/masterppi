/**
 * Bahasa website.
 * - `id` (bawaan) tampil di URL tanpa awalan: /profil/dosen
 * - `en` tampil dengan awalan: /en/profil/dosen
 * proxy.ts menulis ulang URL tanpa awalan ke /id/... agar semua halaman ada di app/[lang].
 */
export const LOCALES = ['id', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'id'

export const hasLocale = (value: string | undefined | null): value is Locale =>
  !!value && (LOCALES as readonly string[]).includes(value)

/** Locale untuk format tanggal & angka (Intl). */
export const INTL_LOCALE: Record<Locale, string> = { id: 'id-ID', en: 'en-GB' }

/** Locale Open Graph. */
export const OG_LOCALE: Record<Locale, string> = { id: 'id_ID', en: 'en_US' }

/** Buang awalan bahasa dari pathname: /en/berita → /berita, /id → /. */
export function stripLocale(pathname: string): string {
  const match = pathname.match(/^\/(id|en)(?=\/|$)/)
  if (!match) return pathname || '/'
  return pathname.slice(match[0].length) || '/'
}

/** Tambahkan awalan bahasa ke path internal; tautan eksternal, hash, dan /api dibiarkan. */
export function localizePath(href: string, locale: Locale): string {
  if (!href.startsWith('/') || href.startsWith('//') || href.startsWith('/api/')) return href
  const path = stripLocale(href)
  if (locale === DEFAULT_LOCALE) return path
  return path === '/' ? `/${locale}` : `/${locale}${path}`
}

/** Bahasa dari pathname browser (untuk kode di luar React, mis. apiFetch). */
export function localeFromPath(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : DEFAULT_LOCALE
}

export const formatDate = (
  date: string | null | undefined,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' },
) => (date ? new Date(date).toLocaleDateString(INTL_LOCALE[locale], options) : '')

/**
 * Bahasa dari URL browser, untuk helper di luar komponen yang hanya dipakai pada data yang
 * diambil di browser (setelah useEffect). Di server selalu bahasa bawaan.
 */
export function clientLocale(): Locale {
  return typeof window === 'undefined' ? DEFAULT_LOCALE : localeFromPath(window.location.pathname)
}

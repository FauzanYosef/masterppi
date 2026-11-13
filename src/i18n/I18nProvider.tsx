'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { dictionaries, type Dictionary } from './index'
import { usePathname } from 'next/navigation'
import { DEFAULT_LOCALE, formatDate, localizePath, stripLocale, type Locale } from './config'

type I18nValue = {
  lang: Locale
  t: Dictionary
  /** Path internal untuk bahasa aktif: /berita → /en/berita. */
  path: (href: string) => string
  /** Format tanggal sesuai bahasa aktif. */
  date: (value: string | null | undefined, options?: Intl.DateTimeFormatOptions) => string
}

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({ lang, children }: { lang: Locale; children: ReactNode }) {
  const value = useMemo<I18nValue>(
    () => ({
      lang,
      t: dictionaries[lang],
      path: (href) => localizePath(href, lang),
      date: (v, options) => formatDate(v, lang, options),
    }),
    [lang],
  )
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

/** Path halaman aktif tanpa awalan bahasa (/en/berita → /berita), untuk menandai menu aktif & breadcrumb. */
export function useCurrentPath(): string {
  return stripLocale(usePathname() ?? '/')
}

/** Bahasa aktif + kamus untuk komponen client. */
export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (ctx) return ctx
  // Di luar provider (seharusnya tidak terjadi): pakai bahasa bawaan.
  return {
    lang: DEFAULT_LOCALE,
    t: dictionaries[DEFAULT_LOCALE],
    path: (href) => href,
    date: (v, options) => formatDate(v, DEFAULT_LOCALE, options),
  }
}

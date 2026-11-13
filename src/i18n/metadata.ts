import type { Metadata } from 'next'
import { DEFAULT_LOCALE, LOCALES, hasLocale, localizePath, type Locale } from './config'
import { getDictionary, type Dictionary } from './index'

/** canonical + hreflang untuk sebuah path (tanpa awalan bahasa). */
export function languageAlternates(path: string, lang: Locale): Metadata['alternates'] {
  return {
    canonical: localizePath(path, lang),
    languages: {
      ...Object.fromEntries(LOCALES.map((l) => [l, localizePath(path, l)])),
      'x-default': localizePath(path, DEFAULT_LOCALE),
    },
  }
}

export async function resolveLang(params: Promise<{ lang: string }>): Promise<Locale> {
  const { lang } = await params
  return hasLocale(lang) ? lang : DEFAULT_LOCALE
}

/**
 * generateMetadata untuk halaman statis:
 *   export const generateMetadata = pageMetadata('dosen', '/profil/dosen')
 */
export function pageMetadata(key: keyof Dictionary['pages'], path: string) {
  return async ({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> => {
    const lang = await resolveLang(params)
    const t = getDictionary(lang)
    const page = t.pages[key]
    return {
      title: key === 'home' ? `${t.site.name} | ${t.site.institution}` : `${page.title} | ${t.site.shortName}`,
      description: page.description || t.site.description,
      alternates: languageAlternates(path, lang),
    }
  }
}

import type { NavLinkType } from '@/types/navlink'
import type { Dictionary } from './dictionaries/id'
import { DEFAULT_LOCALE, stripLocale, type Locale } from './config'

/**
 * Menu dari CMS hanya berbahasa Indonesia. Di versi lain, label diganti dari kamus
 * berdasarkan href; menu yang tidak dikenal kamus tetap memakai label dari CMS.
 */
export function localizeNav(items: NavLinkType[], lang: Locale, t: Dictionary): NavLinkType[] {
  if (lang === DEFAULT_LOCALE) return items
  const label = (href: string, fallback: string) => t.nav[stripLocale(href)] ?? fallback
  return items.map((item) => ({
    ...item,
    label: label(item.href, item.label),
    submenu: item.submenu?.map((sub) => ({ ...sub, label: label(sub.href, sub.label) })),
  }))
}

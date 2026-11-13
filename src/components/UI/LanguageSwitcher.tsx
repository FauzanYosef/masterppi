'use client'

import { useCurrentPath, useI18n } from '@/i18n/I18nProvider'
import { LOCALES, localizePath } from '@/i18n/config'

/** Tombol ID / EN: membuka halaman yang sama dalam bahasa lain. */
const LanguageSwitcher = ({ className = '' }: { className?: string }) => {
  const { lang, t } = useI18n()
  const current = useCurrentPath()

  return (
    <div
      role='group'
      aria-label={t.header.language}
      className={`inline-flex items-center rounded-full border border-darkblue/10 bg-white/70 p-1 text-xs font-semibold dark:border-white/15 dark:bg-white/5 ${className}`}>
      {LOCALES.map((locale) => {
        const active = locale === lang
        return (
          // <a> biasa (muat halaman penuh): root layout berganti bahasa sepenuhnya, termasuk <html lang>.
          <a
            key={locale}
            href={localizePath(current, locale)}
            hrefLang={locale}
            lang={locale}
            aria-current={active ? 'true' : undefined}
            title={active ? undefined : t.header.switchTo}
            className={`rounded-full px-3 py-1.5 uppercase tracking-wide transition ${
              active
                ? 'bg-primary text-white shadow-soft'
                : 'text-darkblue/70 hover:text-primary dark:text-white/70 dark:hover:text-white'
            }`}>
            {locale}
          </a>
        )
      })}
    </div>
  )
}

export default LanguageSwitcher

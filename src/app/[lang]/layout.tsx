import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DM_Sans } from 'next/font/google'
import '../globals.css'
import { ThemeProvider } from 'next-themes'
import { SITE, getServerApi } from '@/lib/server-api'
import { mediaUrl } from '@/lib/site-identity'
import { getDictionary, hasLocale, LOCALES, OG_LOCALE, DEFAULT_LOCALE } from '@/i18n'
import { I18nProvider } from '@/i18n/I18nProvider'

const DMSans = DM_Sans({
  variable: '--font-DM-Sans',
  subsets: ['latin'],
})

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang: raw } = await params
  const lang = hasLocale(raw) ? raw : DEFAULT_LOCALE
  const t = getDictionary(lang)

  // Favicon dari CMS (Pengaturan Website); bila belum diisi memakai /favicon.ico bawaan.
  const settings = await getServerApi<{ data?: Record<string, string | null | undefined> }>('/api/site-settings')
  const favicon = mediaUrl(settings?.data?.['site.favicon']) ?? '/favicon.ico'

  return {
    metadataBase: new URL(SITE.url),
    title: { default: `${t.site.name} | ${t.site.institution}`, template: '%s' },
    description: t.site.description,
    applicationName: t.site.name,
    icons: { icon: favicon },
    openGraph: {
      type: 'website',
      locale: OG_LOCALE[lang],
      alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      siteName: t.site.name,
      title: t.site.name,
      description: t.site.description,
      images: [{ url: '/images/banner/uin.jpg', alt: t.site.name }],
    },
    robots: { index: true, follow: true },
  }
}

export default async function RootLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`${DMSans.variable} antialiased dark:bg-darkmode`}>
        <ThemeProvider attribute='class' enableSystem={false} defaultTheme='light'>
          <I18nProvider lang={lang}>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

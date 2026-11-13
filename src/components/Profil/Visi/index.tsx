'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { getPage, PROFILE_PAGES } from '@/lib/site-content'
import PageHeader from '@/components/UI/PageHeader'
import RichText from '@/components/UI/RichText'
import { useI18n } from '@/i18n/I18nProvider'

const VisiPage = () => {
  const { t } = useI18n()
  const [content, setContent] = useState<string | null>(null)

  // Visi Misi dari CMS (Profil → Visi Misi); tanpa isi, kutipan visi bawaan yang tampil.
  useEffect(() => {
    let active = true
    getPage(PROFILE_PAGES.visi).then((page) => {
      if (active && page?.content) setContent(page.content)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <main className='bg-white dark:bg-darklight'>
      <PageHeader title={t.pages.visi.title} description={t.pages.visi.description} />

      <div className='container py-16 lg:py-24'>
        <div className='mx-auto max-w-3xl'>
          {content ? (
            <RichText html={content} />
          ) : (
            <figure className='card relative overflow-hidden px-8 py-14 text-center md:px-14'>
              <div className='absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-sec-yellow' />
              <span className='mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white'>
                <Icon icon='tabler:target-arrow' width={28} aria-hidden />
              </span>
              <span className='eyebrow justify-center'>{t.profil.visiEyebrow}</span>
              <blockquote className='mt-6 text-xl font-medium leading-relaxed text-darkblue md:text-2xl dark:text-white'>
                “{t.profil.visiQuote}{' '}
                <span className='font-semibold text-primary dark:text-sec-yellow'>{t.profil.visiValue}</span>.”
              </blockquote>
            </figure>
          )}
        </div>
      </div>
    </main>
  )
}

export default VisiPage

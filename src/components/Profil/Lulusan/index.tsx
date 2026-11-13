'use client'

import { useState, useEffect } from 'react'
import { getPage, PROFILE_PAGES } from '@/lib/site-content'
import PageHeader from '@/components/UI/PageHeader'
import RichText, { RichTextSkeleton } from '@/components/UI/RichText'
import EmptyState from '@/components/UI/EmptyState'
import { useI18n } from '@/i18n/I18nProvider'

const LulusanPage = () => {
  const { t } = useI18n()
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  // Isi halaman dari CMS (fisip-api: /api/pages/<slug>).
  useEffect(() => {
    let active = true
    getPage(PROFILE_PAGES.lulusan).then((page) => {
      if (!active) return
      setContent(page?.content ?? '')
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <main className='bg-white dark:bg-darklight'>
      <PageHeader
        title={t.pages.lulusan.title}
        description={t.pages.lulusan.description}
      />

      <div className='container py-16 lg:py-24'>
        <article className='mx-auto max-w-3xl'>
          {loading ? (
            <RichTextSkeleton lines={12} />
          ) : !content ? (
            <EmptyState icon='tabler:certificate' title={t.common.contentPreparing} />
          ) : (
            <RichText html={content} />
          )}
        </article>
      </div>
    </main>
  )
}

export default LulusanPage

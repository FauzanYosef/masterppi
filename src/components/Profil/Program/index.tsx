'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { getImgPath } from '@/app/(main)/utils/paths'
import { getPage, PROFILE_PAGES } from '@/lib/site-content'
import PageHeader from '@/components/UI/PageHeader'
import RichText, { RichTextSkeleton } from '@/components/UI/RichText'
import EmptyState from '@/components/UI/EmptyState'

const ProgramPage = () => {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  // Isi halaman dari CMS (fisip-api: /api/pages/<slug>).
  useEffect(() => {
    let active = true
    getPage(PROFILE_PAGES.program).then((page) => {
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
        title='Apa Itu Magister PPI?'
        description='Mengenal Program Magister Pemikiran Politik Islam: fokus kajian, pendekatan, dan arah pengembangannya.'
      />

      <div className='container py-16 lg:py-24'>
        <div className='grid items-start gap-12 lg:grid-cols-12 lg:gap-16'>
          <aside className='lg:sticky lg:top-32 lg:col-span-5'>
            <div className='relative'>
              <div className='absolute -left-4 -top-4 hidden h-32 w-32 rounded-2xl bg-dots sm:block' />
              <div className='relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lift'>
                <Image
                  src={getImgPath('/images/banner/uin.jpg')}
                  alt='Gedung UIN Sunan Gunung Djati Bandung'
                  fill
                  sizes='(min-width: 1024px) 40vw, 100vw'
                  className='object-cover'
                />
              </div>
            </div>
          </aside>

          <article className='lg:col-span-7'>
            <span className='eyebrow'>Profil Program</span>
            <h2 className='mt-4'>
              Magister <span className='text-primary dark:text-sec-yellow'>Pemikiran Politik Islam</span>
            </h2>
            <span className='accent-bar mt-6 mb-10' />
            {loading ? (
              <RichTextSkeleton />
            ) : !content ? (
              <EmptyState icon='tabler:file-text' title='Konten sedang disiapkan' />
            ) : (
              <RichText html={content} />
            )}
          </article>
        </div>
      </div>
    </main>
  )
}

export default ProgramPage

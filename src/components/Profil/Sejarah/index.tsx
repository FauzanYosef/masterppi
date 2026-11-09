'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { getImgPath } from '@/app/(main)/utils/paths'
import { getHistory } from '@/lib/site-content'
import PageHeader from '@/components/UI/PageHeader'
import RichText, { RichTextSkeleton } from '@/components/UI/RichText'
import EmptyState from '@/components/UI/EmptyState'

const SejarahPage = () => {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  // Isi dari CMS: Profil → Sejarah, atau teks Sejarah di beranda prodi.
  useEffect(() => {
    let active = true
    getHistory().then((page) => {
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
        title='Sejarah Program'
        description='Perjalanan Program Magister Pemikiran Politik Islam di FISIP UIN Sunan Gunung Djati Bandung.'
      />

      <div className='container py-16 lg:py-24'>
        <div className='grid items-start gap-12 lg:grid-cols-12 lg:gap-16'>
          <aside className='lg:sticky lg:top-32 lg:col-span-5'>
            <div className='relative'>
              <div className='absolute -bottom-4 -right-4 hidden h-2/3 w-2/3 rounded-3xl bg-sec-yellow/70 sm:block' />
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
            <span className='eyebrow'>Sejarah Singkat</span>
            <h2 className='mt-4'>
              Program Magister <span className='text-primary dark:text-sec-yellow'>Pemikiran Politik Islam</span>
            </h2>
            <span className='accent-bar mt-6 mb-10' />
            {loading ? (
              <RichTextSkeleton />
            ) : !content ? (
              <EmptyState icon='tabler:history' title='Konten sedang disiapkan' />
            ) : (
              <RichText html={content} />
            )}
          </article>
        </div>
      </div>
    </main>
  )
}

export default SejarahPage

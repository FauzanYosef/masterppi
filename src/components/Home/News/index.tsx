'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { apiFetch, getImageUrl } from '@/lib/api'
import EmptyState from '@/components/UI/EmptyState'
import SectionHeading from '@/components/UI/SectionHeading'
import PostCard, { PostCardSkeleton, formatDateId, stripHtml } from '@/components/UI/PostCard'

type NewsType = {
  id?: number
  title: string
  slug: string
  cover_img?: string | null
  content?: string | null
  category?: string | null
  published_date?: string | null
}

type ArticlesResponse = {
  success: boolean
  data: NewsType[]
}

const News = () => {
  const [news, setNews] = useState<NewsType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFetch<ArticlesResponse>('/api/articles')
        setNews(response.success && Array.isArray(response.data) ? response.data.slice(0, 3) : [])
      } catch (error) {
        console.error('Error fetching news:', error)
        setError('Gagal memuat berita.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <section id='news' className='scroll-mt-24 bg-secondary dark:bg-darkmode'>
      <div className='container'>
        <SectionHeading
          align='left'
          eyebrow='Kabar Terkini'
          title='Berita Terbaru'
          description='Informasi terkini seputar publikasi, kegiatan ilmiah, kolaborasi institusi, serta perkembangan kajian pemikiran politik Islam.'
          action={
            <Link href='/berita' className='btn-outline'>
              Semua Berita
              <Icon icon='tabler:arrow-right' width={18} aria-hidden />
            </Link>
          }
        />

        {loading ? (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8'>
            {Array.from({ length: 3 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <EmptyState tone='error' title={error} description='Silakan muat ulang halaman beberapa saat lagi.' />
        ) : news.length === 0 ? (
          <EmptyState icon='tabler:news' title='Belum ada berita' description='Berita terbaru akan tampil di sini.' />
        ) : (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8'>
            {news.map((item) => (
              <PostCard
                key={item.id ?? item.slug}
                href={`/berita/${item.slug}`}
                image={getImageUrl(item.cover_img)}
                title={item.title}
                excerpt={stripHtml(item.content, 140) || 'Baca selengkapnya mengenai berita ini.'}
                category={item.category}
                date={formatDateId(item.published_date)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default News

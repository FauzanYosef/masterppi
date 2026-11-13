'use client'

import { useEffect, useState } from 'react'
import Link from '@/components/UI/LocaleLink'
import { Icon } from '@iconify/react'
import { apiFetch, getImageUrl } from '@/lib/api'
import EmptyState from '@/components/UI/EmptyState'
import SectionHeading from '@/components/UI/SectionHeading'
import PostCard, { PostCardSkeleton, stripHtml } from '@/components/UI/PostCard'
import { useI18n } from '@/i18n/I18nProvider'

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
  const { t, date } = useI18n()
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
        setError('error')
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
          eyebrow={t.home.news.eyebrow}
          title={t.home.news.title}
          description={t.home.news.description}
          action={
            <Link href='/berita' className='btn-outline'>
              {t.home.news.all}
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
          <EmptyState tone='error' title={t.home.news.error} description={t.common.reloadHint} />
        ) : news.length === 0 ? (
          <EmptyState icon='tabler:news' title={t.home.news.empty} description={t.home.news.emptyHint} />
        ) : (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8'>
            {news.map((item) => (
              <PostCard
                key={item.id ?? item.slug}
                href={`/berita/${item.slug}`}
                image={getImageUrl(item.cover_img)}
                title={item.title}
                excerpt={stripHtml(item.content, 140) || t.home.news.fallbackExcerpt}
                category={item.category}
                date={date(item.published_date)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default News

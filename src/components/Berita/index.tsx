'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const BeritaPage = () => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit, setLimit] = useState(10)

  const totalPage = Math.ceil(total / limit)

  const fetchData = async (currentPage: number, currentLimit: number) => {
    setLoading(true)

    const from = (currentPage - 1) * currentLimit
    const to = from + currentLimit - 1

    const { data, error, count } = await supabase
      .from('articles')
      .select(
        'title, slug, author, content, category, published_date, cover_img',
        { count: 'exact' }
      )
      .order('published_date', { ascending: false })
      .range(from, to)

    if (error) console.error(error)
    if (data) setData(data)
    if (count !== null) setTotal(count)

    setLoading(false)
  }

  useEffect(() => {
    fetchData(page, limit)
  }, [page, limit])

  // 🔥 Info range
  const start = (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  return (
    <div className="pt-[140px] pb-[100px] bg-gray-50 dark:bg-darklight min-h-screen">
      <div className="container space-y-10">

        {/* HEADER */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
            Agenda & Kegiatan
          </h1>

          <p className="text-gray-500 dark:text-gray-400">
            Informasi agenda dan kegiatan akademik Program Magister Pemikiran Politik Islam,
            mencakup seminar, workshop, dan diskusi ilmiah.
          </p>
        </div>

      {/* LIMIT + INFO */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          {/* LEFT: INFO */}
          <p className="text-gray-500 text-sm">
            Menampilkan {start}–{end} dari {total} berita
          </p>

          {/* RIGHT: SELECT */}
          <div className="flex items-center gap-2 bg-white dark:bg-dark px-3 py-2 rounded-xl shadow-sm border dark:border-gray-700 w-fit">
            <span className="text-sm text-gray-500">Show</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value))
                setPage(1)
              }}
              className="bg-transparent text-sm focus:outline-none"
            >
              <option value={6}>6</option>
              <option value={10}>10</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
            </select>
          </div>

        </div>

        {/* CONTENT */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : data.length === 0 ? (
          <p className="text-center text-gray-400">Belum ada berita</p>
        ) : (
          <>
            {/* GRID */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((item) => (
                <Link key={item.slug} href={`/berita/${item.slug}`} className="group">

                  <div className="bg-white dark:bg-dark rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition duration-300">

                    {/* IMAGE */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={item.cover_img || '/images/default-news.jpg'}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>

                    {/* BODY */}
                    <div className="p-5 space-y-3">

                      {/* META */}
                      <div className="flex justify-between items-center text-xs">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                          {item.category || 'Umum'}
                        </span>

                        <span className="text-gray-400">
                          {item.published_date &&
                            new Date(item.published_date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                        </span>
                      </div>

                      {/* TITLE (STYLE DARI AWAL) */}
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-2 leading-snug group-hover:text-primary transition">
                        {item.title}
                      </h3>

                      {/* DESC */}
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                        {item.content?.replace(/<[^>]+>/g, '').slice(0, 110)}...
                      </p>

                      {/* AUTHOR */}
                      <p className="text-xs text-gray-400 pt-1">
                        Oleh {item.author || 'Admin'}
                      </p>

                    </div>
                  </div>

                </Link>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-2 pt-10 flex-wrap">

              {/* PREV */}
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 text-sm rounded-lg border bg-white dark:bg-dark hover:bg-gray-100 dark:hover:bg-darklight disabled:opacity-40"
              >
                ←
              </button>

              {/* PAGE NUMBER (MAX 5) */}
              {[...Array(totalPage)]
                .slice(
                  Math.max(0, page - 3),
                  Math.min(totalPage, page + 2)
                )
                .map((_, i) => {
                  const pageNumber = i + Math.max(1, page - 2)

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      className={`px-4 py-2 text-sm rounded-lg transition
                        ${
                          page === pageNumber
                            ? 'bg-primary text-white shadow'
                            : 'bg-white dark:bg-dark border hover:bg-gray-100 dark:hover:bg-darklight'
                        }
                      `}
                    >
                      {pageNumber}
                    </button>
                  )
                })}

              {/* NEXT */}
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPage}
                className="px-4 py-2 text-sm rounded-lg border bg-white dark:bg-dark hover:bg-gray-100 dark:hover:bg-darklight disabled:opacity-40"
              >
                →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default BeritaPage
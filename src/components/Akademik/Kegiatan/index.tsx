'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const LIMIT = 6

const EventPage = () => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const totalPage = Math.ceil(total / LIMIT)

  const fetchData = async (currentPage: number) => {
    setLoading(true)

    const from = (currentPage - 1) * LIMIT
    const to = from + LIMIT - 1

    const { data, error, count } = await supabase
      .from('events')
      .select(
        'title, slug, description, category, start_date, end_date, cover_img, location, status',
        { count: 'exact' }
      )
      .order('start_date', { ascending: true })
      .range(from, to)

    if (error) console.error(error)

    if (data) setData(data)
    if (count !== null) setTotal(count)

    setLoading(false)
  }

  useEffect(() => {
    fetchData(page)
  }, [page])

  const formatDate = (date?: string) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="pt-[160px] pb-[120px] dark:bg-darklight">
      <div className="container space-y-14">

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

        {/* DATA */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : data.length === 0 ? (
          <p className="text-center text-gray-500">
            Belum ada agenda tersedia
          </p>
        ) : (
          <>
            {/* GRID */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.map((item) => (
                <Link
                  key={item.slug}
                  href={`/akademik/kegiatan/${item.slug}`}
                  className="block group"
                >
                  <div className="bg-white dark:bg-dark rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition">

                    {/* IMAGE */}
                    <div className="relative h-52 overflow-hidden">
                      <Image
                        src={item.cover_img || '/images/default-news.jpg'}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />

                      {/* STATUS */}
                      <span className={`
                        absolute top-3 left-3 text-xs px-3 py-1 rounded-full text-white
                        ${item.status === 'upcoming' && 'bg-blue-500'}
                        ${item.status === 'ongoing' && 'bg-green-500'}
                        ${item.status === 'finished' && 'bg-gray-500'}
                      `}>
                        {item.status || 'upcoming'}
                      </span>
                    </div>

                    {/* CONTENT */}
                    <div className="p-5 space-y-3">

                      {/* CATEGORY + DATE */}
                      <div className="flex justify-between items-center text-sm">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                          {item.category || 'Umum'}
                        </span>

                        <span className="text-gray-500 text-xs">
                          {formatDate(item.start_date)}
                        </span>
                      </div>

                      {/* TITLE */}
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-2 group-hover:text-primary transition">
                        {item.title}
                      </h3>

                      {/* DESCRIPTION */}
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                        {item.description?.slice(0, 120)}...
                      </p>

                      {/* LOCATION */}
                      <p className="text-xs text-gray-400">
                        📍 {item.location || 'Lokasi belum tersedia'}
                      </p>
                    </div>

                  </div>
                </Link>
              ))}
            </div>

            {/* ================= PAGINATION ================= */}
            <div className="flex justify-center items-center gap-2 pt-10 flex-wrap">

              {/* PREV */}
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-dark transition"
              >
                ← Prev
              </button>

              {/* NUMBER */}
              {[...Array(totalPage)].map((_, i) => {
                const pageNumber = i + 1

                return (
                  <button
                    key={i}
                    onClick={() => setPage(pageNumber)}
                    className={`px-4 py-2 rounded-lg text-sm transition
                      ${
                        page === pageNumber
                          ? 'bg-primary text-white shadow'
                          : 'border hover:bg-gray-100 dark:hover:bg-dark'
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
                className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-dark transition"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default EventPage
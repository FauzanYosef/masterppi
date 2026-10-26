'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getImgPath } from '@/app/(main)/utils/paths'
import { apiFetch } from '@/lib/api'

type AcademicGuide = {
  id: number
  faculty_id: number | null
  study_program_id: number
  title: string
  academic_year: string | null
  description: string | null
  file_path: string | null
  file_name: string | null
  file_type: string | null
  file_size: number | null
  is_active: number
  created_at: string
  updated_at: string

  study_program_name: string | null
  study_program_short_name: string | null
  study_program_code: string | null

  faculty_name: string | null
  faculty_short_name: string | null
}

type AcademicGuideResponse = {
  success: boolean
  message?: string
  data: AcademicGuide[]
  total?: number
}

const PanduanPage = () => {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)

  const [data, setData] = useState<AcademicGuide[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError('')

        const result =
          await apiFetch<AcademicGuideResponse>(
            '/api/academic-guides',
            {
              method: 'GET',
              cache: 'no-store',
            }
          )

        if (!result.success) {
          throw new Error(
            result.message ||
              'Gagal mengambil data panduan akademik'
          )
        }

        setData(result.data || [])
      } catch (err) {
        console.error(
          'FETCH PANDUAN AKADEMIK ERROR:',
          err
        )

        setError(
          err instanceof Error
            ? err.message
            : 'Terjadi kesalahan saat mengambil data panduan akademik'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="pt-[160px] pb-[120px] dark:bg-darklight">

      {/* HERO */}
      <div className="container mb-16">
        <div className="relative overflow-hidden rounded-2xl shadow-lg">

          <Image
            src={getImgPath('/images/banner/uin.jpg')}
            alt="Banner"
            width={1400}
            height={500}
            className="h-[300px] w-full object-cover md:h-[400px]"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 px-4 text-center">

            <h1 className="text-3xl font-bold text-white md:text-4xl">
              Panduan Akademik
            </h1>

            {/* BREADCRUMB */}
            <div className="mt-3 flex flex-wrap justify-center gap-2 text-sm text-white/80">

              <Link href="/">
                Home
              </Link>

              {pathSegments.map((segment, index) => {
                const href =
                  '/' +
                  pathSegments
                    .slice(0, index + 1)
                    .join('/')

                const isLast =
                  index === pathSegments.length - 1

                const label =
                  segment.charAt(0).toUpperCase() +
                  segment.slice(1)

                return (
                  <span
                    key={href}
                    className="flex items-center gap-2"
                  >
                    <span className="opacity-60">
                      ›
                    </span>

                    {isLast ? (
                      <span className="font-medium text-white">
                        {label}
                      </span>
                    ) : (
                      <Link href={href}>
                        {label}
                      </Link>
                    )}
                  </span>
                )
              })}

            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container space-y-14">

        {/* TITLE */}
        <div className="space-y-5 text-center">

          <h2 className="text-3xl font-bold md:text-4xl">
            Panduan{' '}
            <span className="text-primary">
              Akademik
            </span>
          </h2>

          <p className="text-gray-500 dark:text-gray-400">
            Kumpulan panduan resmi untuk mendukung
            kegiatan akademik mahasiswa
          </p>

          <div className="mx-auto h-1 w-20 rounded-full bg-primary" />

        </div>

        {/* LOADING */}
        {loading && (
          <div className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Memuat panduan akademik...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30">

            <p className="font-medium text-red-600 dark:text-red-400">
              Gagal memuat panduan akademik
            </p>

            <p className="mt-2 text-sm text-red-500 dark:text-red-300">
              {error}
            </p>

          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          data.length === 0 && (
            <div className="py-12 text-center">

              <div className="mb-4 text-5xl">
                📚
              </div>

              <p className="text-gray-500 dark:text-gray-400">
                Data panduan belum tersedia.
              </p>

            </div>
          )}

        {/* DATA */}
        {!loading &&
          !error &&
          data.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {data.map((item) => {

                const fileUrl = item.file_path
                  ? `/api/pdf?path=${encodeURIComponent(
                      item.file_path
                    )}`
                  : ''

                return (
                  <div
                    key={item.id}
                    className="group flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl dark:border-gray-800 dark:bg-dark"
                  >

                    {/* CONTENT */}
                    <div className="space-y-4">

                      {/* ICON */}
                      <div className="flex items-center justify-between">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                          📘
                        </div>

                        {item.academic_year && (
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            {item.academic_year}
                          </span>
                        )}

                      </div>

                      {/* TITLE */}
                      <h3 className="text-lg font-semibold text-primary group-hover:underline">
                        {item.title}
                      </h3>

                      {/* DESCRIPTION */}
                      <p className="line-clamp-4 text-justify text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                        {item.description ||
                          'Belum ada deskripsi.'}
                      </p>

                    </div>

                    {/* BUTTON */}
                    <div className="mt-6">

                      {fileUrl ? (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
                        >
                          Lihat Panduan →
                        </a>
                      ) : (
                        <span className="block w-full rounded-lg bg-gray-100 px-4 py-2 text-center text-sm text-gray-400 dark:bg-gray-800">
                          File belum tersedia
                        </span>
                      )}

                    </div>

                  </div>
                )
              })}

            </div>
          )}

      </div>
    </div>
  )
}

export default PanduanPage
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getImgPath } from '@/app/(main)/utils/paths'
import { apiFetch } from '@/lib/api'

type Course = {
  id: number
  curriculum_id: number
  study_program_id: number
  code: string
  name: string
  semester: number | null
  sks: number | string
  course_type: string
  description: string | null
}

type CourseResponse = {
  success: boolean
  message?: string
  data: Course[]
  total?: number
}

const MatkulPage = () => {
  const pathname = usePathname()
  const pathSegments = pathname
    .split('/')
    .filter(Boolean)

  const [data, setData] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError('')

        const result =
          await apiFetch<CourseResponse>(
            '/api/courses',
            {
              method: 'GET',
              cache: 'no-store',
            }
          )

        if (!result.success) {
          throw new Error(
            result.message ||
              'Gagal mengambil data mata kuliah'
          )
        }

        setData(result.data || [])
      } catch (err) {
        console.error(
          'FETCH MATA KULIAH ERROR:',
          err
        )

        setError(
          err instanceof Error
            ? err.message
            : 'Terjadi kesalahan saat mengambil data mata kuliah'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getCourseTypeLabel = (
    type: string
  ) => {
    switch (type) {
      case 'wajib':
        return 'Wajib'

      case 'pilihan':
        return 'Pilihan'

      case 'konsentrasi':
        return 'Konsentrasi'

      case 'tesis':
        return 'Tesis'

      case 'disertasi':
        return 'Disertasi'

      case 'praktikum':
        return 'Praktikum'

      default:
        return 'Lainnya'
    }
  }

  const getCourseTypeClass = (
    type: string
  ) => {
    switch (type) {
      case 'wajib':
        return 'bg-green-100 text-green-700'

      case 'pilihan':
        return 'bg-yellow-100 text-yellow-700'

      case 'konsentrasi':
        return 'bg-purple-100 text-purple-700'

      case 'tesis':
        return 'bg-blue-100 text-blue-700'

      case 'disertasi':
        return 'bg-indigo-100 text-indigo-700'

      case 'praktikum':
        return 'bg-orange-100 text-orange-700'

      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="pt-[160px] pb-[120px] dark:bg-darklight">

      {/* HERO */}
      <div className="container mb-16">
        <div className="relative overflow-hidden rounded-2xl shadow-lg">

          <Image
            src={getImgPath(
              '/images/banner/uin.jpg'
            )}
            alt="Banner Mata Kuliah"
            width={1400}
            height={500}
            className="w-full h-[300px] md:h-[400px] object-cover"
          />

          <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center px-4">

            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Mata Kuliah
            </h1>

            {/* BREADCRUMB */}
            <div className="flex gap-2 flex-wrap justify-center items-center text-sm text-white/80 mt-3">

              <Link
                href="/"
                className="hover:text-white transition"
              >
                Home
              </Link>

              {pathSegments.map(
                (segment, index) => {
                  const href =
                    '/' +
                    pathSegments
                      .slice(0, index + 1)
                      .join('/')

                  const isLast =
                    index ===
                    pathSegments.length - 1

                  const label =
                    segment.charAt(0).toUpperCase() +
                    segment.slice(1)

                  return (
                    <span
                      key={href}
                      className="flex gap-2 items-center"
                    >
                      <span className="opacity-60">
                        ›
                      </span>

                      {isLast ? (
                        <span className="text-white font-medium">
                          {label}
                        </span>
                      ) : (
                        <Link
                          href={href}
                          className="hover:text-white transition"
                        >
                          {label}
                        </Link>
                      )}
                    </span>
                  )
                }
              )}

            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container space-y-14">

        {/* TITLE */}
        <div className="text-center space-y-5">

          <h2 className="text-3xl md:text-4xl font-bold">
            Deskripsi{' '}
            <span className="text-primary">
              Mata Kuliah
            </span>
          </h2>

          <p className="max-w-2xl mx-auto text-gray-500 dark:text-gray-400">
            Informasi lengkap mengenai setiap
            mata kuliah dalam program studi.
          </p>

          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />

        </div>

        {/* LOADING */}
        {loading && (
          <div className="py-16 text-center">
            <div className="inline-flex items-center gap-3 text-gray-500">

              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />

              <span>
                Memuat mata kuliah...
              </span>

            </div>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="max-w-xl mx-auto p-6 rounded-2xl border border-red-200 bg-red-50 text-center">

            <h3 className="font-semibold text-red-700">
              Gagal Memuat Data
            </h3>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          data.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Data mata kuliah belum tersedia.
              </p>
            </div>
          )}

        {/* DATA */}
        {!loading &&
          !error &&
          data.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8">

              {data.map((mk) => (
                <div
                  key={mk.id}
                  className="bg-white dark:bg-dark rounded-2xl shadow-md p-6 space-y-5 hover:shadow-xl transition-all duration-300"
                >

                  {/* HEADER */}
                  <div className="flex justify-between items-start gap-4">

                    <div className="min-w-0">

                      <h3 className="text-lg font-semibold text-primary leading-snug">
                        {mk.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {mk.code}
                      </p>

                    </div>

                    {/* SKS */}
                    <span className="shrink-0 text-sm font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {Number(mk.sks)} SKS
                    </span>

                  </div>

                  {/* INFO */}
                  <div className="flex flex-wrap items-center gap-2">

                    {/* TIPE */}
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${getCourseTypeClass(
                        mk.course_type
                      )}`}
                    >
                      {getCourseTypeLabel(
                        mk.course_type
                      )}
                    </span>

                    {/* SEMESTER */}
                    {mk.semester && (
                      <span className="px-3 py-1 text-xs rounded-full font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        Semester {mk.semester}
                      </span>
                    )}

                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed text-justify">
                    {mk.description ||
                      'Belum ada deskripsi mata kuliah.'}
                  </p>

                </div>
              ))}

            </div>
          )}

      </div>
    </div>
  )
}

export default MatkulPage
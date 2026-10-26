'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getImgPath } from '@/app/(main)/utils/paths'
import { apiFetch } from '@/lib/api'

type AcademicCalendar = {
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
}

type AcademicCalendarResponse = {
  success: boolean
  message?: string
  data: AcademicCalendar[]
  total?: number
}

const KalenderPage = () => {
  const pathname = usePathname()

  const pathSegments = pathname
    .split('/')
    .filter(Boolean)

  const [data, setData] = useState<AcademicCalendar[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError('')

        const result =
          await apiFetch<AcademicCalendarResponse>(
            '/api/academic-calendars',
            {
              method: 'GET',
              cache: 'no-store',
            }
          )

        if (!result.success) {
          throw new Error(
            result.message ||
              'Gagal mengambil data kalender akademik'
          )
        }

        setData(result.data || [])
      } catch (err) {
        console.error(
          'FETCH KALENDER AKADEMIK ERROR:',
          err
        )

        setError(
          err instanceof Error
            ? err.message
            : 'Terjadi kesalahan saat mengambil data kalender akademik'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  /*
   * =========================================================
   * MENENTUKAN KALENDER TERBARU
   * =========================================================
   */

  const getAcademicYearNumber = (
    academicYear: string | null
  ) => {
    if (!academicYear) return 0

    /*
     * Contoh:
     *
     * 2026/2027 -> 2026
     * 2025/2026 -> 2025
     * 2024/2025 -> 2024
     */

    const match =
      academicYear.match(/\d{4}/)

    return match
      ? Number(match[0])
      : 0
  }

  const sortedData = [...data].sort(
    (a, b) =>
      getAcademicYearNumber(
        b.academic_year
      ) -
      getAcademicYearNumber(
        a.academic_year
      )
  )

  const latestCalendar =
    sortedData[0]

  const previousCalendars =
    sortedData.slice(1)

  return (
    <div className="pt-[160px] pb-[120px] dark:bg-darklight">

      {/* =====================================================
          HERO
      ===================================================== */}

      <div className="container mb-16">

        <div className="relative rounded-2xl overflow-hidden shadow-lg">

          <Image
            src={getImgPath('/images/banner/uin.jpg')}
            alt="Banner Kalender Akademik"
            width={1400}
            height={500}
            className="w-full h-[300px] md:h-[400px] object-cover"
          />

          <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center px-4">

            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Kalender Akademik
            </h1>

            {/* BREADCRUMB */}

            <div className="flex gap-2 flex-wrap justify-center text-sm text-white/80 mt-3">

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
                    segment
                      .charAt(0)
                      .toUpperCase() +
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

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="container space-y-14">

        {/* TITLE */}

        <div className="text-center space-y-5">

          <h2 className="text-3xl md:text-4xl font-bold">

            Kalender{' '}

            <span className="text-primary">
              Akademik
            </span>

          </h2>

          <p className="max-w-2xl mx-auto text-gray-500 dark:text-gray-400">
            Informasi jadwal kegiatan akademik
            Program Studi setiap tahun akademik.
          </p>

          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />

        </div>

        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading && (
          <div className="py-16 text-center">

            <div className="inline-flex items-center gap-3 text-gray-500">

              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />

              <span>
                Memuat kalender akademik...
              </span>

            </div>

          </div>
        )}

        {/* =====================================================
            ERROR
        ===================================================== */}

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

        {/* =====================================================
            EMPTY
        ===================================================== */}

        {!loading &&
          !error &&
          data.length === 0 && (

            <div className="py-16 text-center">

              <p className="text-gray-500 dark:text-gray-400">
                Data kalender akademik belum tersedia.
              </p>

            </div>

          )}

        {/* =====================================================
            KALENDER TERBARU
        ===================================================== */}

        {!loading &&
          !error &&
          latestCalendar && (

            <section>

              {/* HEADER */}

              <div className="bg-white dark:bg-dark rounded-2xl shadow-md p-6 md:p-8 space-y-6">

                {/* DESCRIPTION */}

                {latestCalendar.description && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed">

                    {latestCalendar.description}

                  </p>
                )}
                 {latestCalendar.academic_year && (

                  <p className="mt-2 text-gray-500 dark:text-gray-400">

                    Tahun Akademik{' '}

                    {latestCalendar.academic_year}

                  </p>

                )}

                {/* PDF */}

                {latestCalendar.file_path ? (

                  <div className="w-full h-[600px] md:h-[800px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100">

                    <object
                      data={`/api/pdf?path=${encodeURIComponent(
                        latestCalendar.file_path
                      )}`}
                      type="application/pdf"
                      className="w-full h-full"
                    >

                      <div className="flex flex-col items-center justify-center h-full min-h-[300px] p-8 text-center">

                        <div className="mb-5 text-5xl">
                          📄
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Browser tidak dapat menampilkan PDF secara langsung.
                        </p>

                        <a
                          href={`/api/pdf?path=${encodeURIComponent(
                            latestCalendar.file_path
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-5 py-3 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition"
                        >
                          Buka PDF
                        </a>

                      </div>

                    </object>

                  </div>

                ) : (

                  <div className="py-12 text-center border rounded-xl">

                    <p className="text-gray-500">
                      File kalender belum tersedia.
                    </p>

                  </div>

                )}

                {/* FILE INFO */}

                <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">

                  {latestCalendar.file_name && (
                    <span>
                      File: {latestCalendar.file_name}
                    </span>
                  )}

                  {latestCalendar.file_type && (
                    <span>
                      Tipe: {latestCalendar.file_type}
                    </span>
                  )}

                  {latestCalendar.file_size && (

                    <span>

                      Ukuran:{' '}

                      {(
                        latestCalendar.file_size /
                        1024 /
                        1024
                      ).toFixed(2)}{' '}

                      MB

                    </span>

                  )}

                </div>

              </div>

            </section>

          )}

        {/* =====================================================
            ARSIP KALENDER SEBELUMNYA
        ===================================================== */}

        {!loading &&
          !error &&
          previousCalendars.length > 0 && (

            <section>

              {/* HEADER */}

              <div className="mb-8">

                <h3 className="text-2xl md:text-3xl font-bold">
                  Arsip Kalender Akademik
                </h3>

                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Kalender akademik tahun-tahun sebelumnya.
                </p>

              </div>

              {/* LIST */}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                {previousCalendars.map(
                  (item) => {

                    const fileUrl =
                      item.file_path
                        ? `/api/pdf?path=${encodeURIComponent(
                            item.file_path
                          )}`
                        : ''

                    return (

                      <div
                        key={item.id}
                        className="bg-white dark:bg-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition"
                      >

                        {/* ICON */}

                        <div className="flex items-start justify-between gap-4">

                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                            📄
                          </div>

                          <span className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
                            Arsip
                          </span>

                        </div>

                        {/* TITLE */}

                        <h4 className="mt-5 font-semibold text-lg text-primary">

                          {item.title}

                        </h4>

                        {/* YEAR */}

                        {item.academic_year && (

                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">

                            Tahun Akademik{' '}

                            {item.academic_year}

                          </p>

                        )}

                        {/* DESCRIPTION */}

                        {item.description && (

                          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-3">

                            {item.description}

                          </p>

                        )}

                        {/* BUTTON */}

                        <div className="mt-5">

                          {fileUrl ? (

                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-white transition"
                            >
                              Buka PDF ↗
                            </a>

                          ) : (

                            <span className="block text-center text-sm text-gray-400 py-2.5">
                              File tidak tersedia
                            </span>

                          )}

                        </div>

                      </div>

                    )
                  }
                )}

              </div>

            </section>

          )}

      </div>
    </div>
  )
}

export default KalenderPage
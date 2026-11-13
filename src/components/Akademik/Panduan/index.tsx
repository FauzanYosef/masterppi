'use client'

import PageHeader from '@/components/UI/PageHeader'
import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { useI18n } from '@/i18n/I18nProvider'

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
  const { t } = useI18n()

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
    <main className="bg-white dark:bg-darklight">
      <PageHeader
        title={t.pages.panduan.title}
        description={t.pages.panduan.description}
      />

      <div className="container  py-16 lg:py-24">

        {/* LOADING */}
        {loading && (
          <div className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {t.akademik.panduan.loading}
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30">

            <p className="font-medium text-red-600 dark:text-red-400">
              {t.akademik.panduan.error}
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
                {t.akademik.panduan.empty}
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
                          t.common.noDescription}
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
                          {t.akademik.panduan.view}
                        </a>
                      ) : (
                        <span className="block w-full rounded-lg bg-gray-100 px-4 py-2 text-center text-sm text-gray-400 dark:bg-gray-800">
                          {t.common.fileUnavailable}
                        </span>
                      )}

                    </div>

                  </div>
                )
              })}

            </div>
          )}

      </div>
    </main>
  )
}

export default PanduanPage
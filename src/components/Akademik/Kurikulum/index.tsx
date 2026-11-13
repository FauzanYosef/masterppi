'use client'

import PageHeader from '@/components/UI/PageHeader'
import { useEffect, useMemo, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { useI18n } from '@/i18n/I18nProvider'

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

type Curriculum = {
  id: number
  faculty_id: number | null
  study_program_id: number
  name: string
  code: string | null
  academic_year: string | null
  description: string | null
  total_sks: number | string | null
  is_active: number
}

type CurriculumResponse = {
  success: boolean
  message?: string
  data: Curriculum[]
  total?: number
}

type CourseResponse = {
  success: boolean
  message?: string
  data: Course[]
  total?: number
}

type SemesterGroup = {
  semester: number
  courses: Course[]
  totalSks: number
}

type CurriculumGroup = {
  curriculum: Curriculum
  semesters: SemesterGroup[]
}

const KurikulumPage = () => {
  const { t } = useI18n()
  const [curriculums, setCurriculums] = useState<Curriculum[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError('')

        const [curriculumResult, courseResult] =
          await Promise.all([
            apiFetch<CurriculumResponse>(
              '/api/curriculums',
              {
                method: 'GET',
                cache: 'no-store',
              }
            ),

            apiFetch<CourseResponse>(
              '/api/courses',
              {
                method: 'GET',
                cache: 'no-store',
              }
            ),
          ])

        if (!curriculumResult.success) {
          throw new Error(
            curriculumResult.message ||
              'Gagal mengambil data kurikulum'
          )
        }

        if (!courseResult.success) {
          throw new Error(
            courseResult.message ||
              'Gagal mengambil data mata kuliah'
          )
        }

        setCurriculums(curriculumResult.data || [])
        setCourses(courseResult.data || [])
      } catch (err) {
        console.error(
          'FETCH KURIKULUM ERROR:',
          err
        )

        setError(
          err instanceof Error
            ? err.message
            : 'Terjadi kesalahan saat mengambil data kurikulum'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const groupedData = useMemo<CurriculumGroup[]>(() => {
    return curriculums.map((curriculum) => {
      const curriculumCourses = courses.filter(
        (course) =>
          course.curriculum_id === curriculum.id
      )

      const semesterMap =
        curriculumCourses.reduce<
          Record<number, Course[]>
        >((acc, course) => {
          const semester = course.semester || 0

          if (!acc[semester]) {
            acc[semester] = []
          }

          acc[semester].push(course)

          return acc
        }, {})

      const semesters: SemesterGroup[] =
        Object.entries(semesterMap)
          .map(
            ([semester, semesterCourses]) => ({
              semester: Number(semester),
              courses: semesterCourses,
              totalSks: semesterCourses.reduce(
                (total, course) =>
                  total + Number(course.sks || 0),
                0
              ),
            })
          )
          .sort(
            (a, b) => a.semester - b.semester
          )

      return {
        curriculum,
        semesters,
      }
    })
  }, [curriculums, courses])

  const getCourseTypeLabel = (
    type: string
  ) => {
    switch (type) {
      case 'wajib':
        return t.courseType.wajib

      case 'pilihan':
        return t.courseType.pilihan

      case 'konsentrasi':
        return t.courseType.konsentrasi

      case 'tesis':
        return t.courseType.tesis

      case 'disertasi':
        return t.courseType.disertasi

      case 'praktikum':
        return t.courseType.praktikum

      default:
        return t.courseType.lainnya
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
    <main className="bg-white dark:bg-darklight">
      <PageHeader
        title={t.pages.kurikulum.title}
        description={t.pages.kurikulum.description}
      />

      <div className="container space-y-12 py-16 lg:py-24">

        {/* LOADING */}
        {loading && (
          <div className="py-16 text-center">
            <div className="inline-flex items-center gap-3 text-gray-500">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>
                {t.akademik.kurikulum.loading}
              </span>
            </div>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="max-w-xl mx-auto p-6 rounded-2xl border border-red-200 bg-red-50 text-center">
            <h3 className="font-semibold text-red-700">
              {t.akademik.loadError}
            </h3>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          groupedData.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                {t.akademik.kurikulum.empty}
              </p>
            </div>
          )}

        {/* CURRICULUM */}
        {!loading &&
          !error &&
          groupedData.map(
            ({
              curriculum,
              semesters,
            }) => (
              <section
                key={curriculum.id}
                className="space-y-8"
              >

                {/* CURRICULUM INFO */}
                <div className="text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-primary">
                    {curriculum.name}
                  </h2>

                  {curriculum.academic_year && (
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                      Tahun Akademik{' '}
                      {curriculum.academic_year}
                    </p>
                  )}

                  {curriculum.total_sks && (
                    <p className="mt-1 text-sm text-gray-500">
                      Total{' '}
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {Number(
                          curriculum.total_sks
                        )}{' '}
                        {t.akademik.kurikulum.credits}
                      </span>
                    </p>
                  )}

                  {curriculum.description && (
                    <p className="max-w-2xl mx-auto mt-3 text-sm text-gray-500 dark:text-gray-400">
                      {curriculum.description}
                    </p>
                  )}
                </div>

                {/* SEMESTERS */}
                {semesters.map(
                  ({
                    semester,
                    courses,
                    totalSks,
                  }) => (
                    <div
                      key={semester}
                      className="overflow-hidden bg-white dark:bg-dark rounded-2xl shadow-md"
                    >

                      {/* SEMESTER HEADER */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 px-6 py-5 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          {t.akademik.kurikulum.semester} {semester}
                        </h3>

                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {courses.length}{' '}
                          {t.akademik.kurikulum.course}
                          <span className="mx-2">
                            •
                          </span>
                          {totalSks} {t.akademik.kurikulum.credits}
                        </div>
                      </div>

                      {/* TABLE */}
                      <div className="overflow-x-auto p-4">
                        <table className="w-full text-sm border-separate border-spacing-y-2">

                          <thead>
                            <tr className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                              <th className="px-4 py-2 text-left">
                                {t.akademik.kurikulum.code}
                              </th>

                              <th className="px-4 py-2 text-left">
                                {t.akademik.kurikulum.course}
                              </th>

                              <th className="px-4 py-2 text-center">
                                {t.akademik.kurikulum.credits}
                              </th>

                              <th className="px-4 py-2 text-center">
                                {t.akademik.kurikulum.type}
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {courses.map(
                              (course) => (
                                <tr
                                  key={course.id}
                                  className="bg-gray-50 dark:bg-darklight hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >

                                  {/* KODE */}
                                  <td className="px-4 py-4 rounded-l-xl font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                    {course.code}
                                  </td>

                                  {/* MATA KULIAH */}
                                  <td className="px-4 py-4">
                                    <div className="font-medium text-gray-800 dark:text-gray-200">
                                      {course.name}
                                    </div>

                                    {course.description && (
                                      <p className="mt-1 text-xs leading-relaxed text-gray-400 dark:text-gray-500">
                                        {
                                          course.description
                                        }
                                      </p>
                                    )}
                                  </td>

                                  {/* SKS */}
                                  <td className="px-4 py-4 text-center font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                    {Number(
                                      course.sks
                                    )}
                                  </td>

                                  {/* TYPE */}
                                  <td className="px-4 py-4 text-center rounded-r-xl whitespace-nowrap">
                                    <span
                                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getCourseTypeClass(
                                        course.course_type
                                      )}`}
                                    >
                                      {getCourseTypeLabel(
                                        course.course_type
                                      )}
                                    </span>
                                  </td>

                                </tr>
                              )
                            )}
                          </tbody>

                        </table>
                      </div>
                    </div>
                  )
                )}
              </section>
            )
          )}
      </div>
    </main>
  )
}

export default KurikulumPage
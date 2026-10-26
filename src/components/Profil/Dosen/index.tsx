'use client'

/* eslint-disable @next/next/no-img-element -- foto dosen dari storage API (ukuran beragam) memakai <img> dengan fallback onError. */

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  apiFetch,
  getImageUrl,
} from '@/lib/api'

type Lecturer = {
  id: number
  faculty_id: number | null
  nidn: string | null
  nip: string | null
  name: string
  slug: string
  title_prefix: string | null
  title_suffix: string | null
  email: string | null
  phone: string | null
  photo: string | null
  position: string | null
  expertise: string | null
  education: string | null
  biography: string | null
  google_scholar: string | null
  scopus: string | null
  sinta: string | null
  orcid: string | null
  wos: string | null
  is_active: number
}

type LecturerResponse = {
  success: boolean
  message?: string
  data: Lecturer[]
  scope?: {
    site_id: number
    faculty_id: number | null
    study_program_id: number | null
  }
}

// =====================================================
// URL FOTO DOSEN
// =====================================================

const getLecturerImage = (
  photo: string | null
): string => {
  if (!photo) {
    return ''
  }

  const value = photo.trim()

  if (!value) {
    return ''
  }

  // Jika URL lengkap
  if (
    value.startsWith('http://') ||
    value.startsWith('https://')
  ) {
    return value
  }

  // Jika database menyimpan:
  // /storage/images/dosen/ridwan.png
  if (
    value.startsWith('/storage/')
  ) {
    return getImageUrl(value)
  }

  // Jika database menyimpan:
  // storage/images/dosen/ridwan.png
  if (
    value.startsWith('storage/')
  ) {
    return getImageUrl(value)
  }

  // Jika database menyimpan:
  // images/dosen/ridwan.png
  if (
    value.startsWith('images/')
  ) {
    return getImageUrl(
      `storage/${value}`
    )
  }

  // Jika database hanya menyimpan:
  // ridwan.png
  return getImageUrl(
    `storage/images/dosen/${value}`
  )
}

// =====================================================
// LOGO AKADEMIK
// =====================================================

const academicLogos = {
  googleScholar: getImageUrl(
    'storage/images/akademik/google-scholar.png'
  ),

  sinta: getImageUrl(
    'storage/images/akademik/sinta.png'
  ),

  scopus: getImageUrl(
    'storage/images/akademik/scopus.png'
  ),

  orcid: getImageUrl(
    'storage/images/akademik/orcid.png'
  ),

  wos: getImageUrl(
    'storage/images/akademik/wos.png'
  ),
}

// =====================================================
// KOMPONEN FOTO
// =====================================================

const LecturerPhoto = ({
  photo,
  name,
}: {
  photo: string | null
  name: string
}) => {
  const [imageError, setImageError] =
    useState(false)

  const imageUrl =
    getLecturerImage(photo)

  // Tidak ada foto
  if (!imageUrl || imageError) {
    return (
      <div
        className="
          w-full
          h-full
          flex
          flex-col
          items-center
          justify-center
          bg-gray-100
          text-gray-400
        "
      >
        <svg
          className="w-16 h-16 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0"
          />
        </svg>

        <span className="text-sm">
          Foto tidak tersedia
        </span>
      </div>
    )
  }

  return (
    <img
      src={imageUrl}
      alt={name || 'Dosen'}
      className="
        w-full
        h-full
        object-cover
        object-top
        group-hover:scale-105
        transition
        duration-300
      "
      onError={() => {
        console.error(
          'GAGAL MEMUAT FOTO DOSEN:',
          imageUrl
        )

        setImageError(true)
      }}
    />
  )
}

// =====================================================
// PAGE
// =====================================================

const DosenPage = () => {
  const [lecturers, setLecturers] =
    useState<Lecturer[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  // =====================================================
  // FETCH DOSEN
  // =====================================================

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        setLoading(true)
        setError('')

        const result =
          await apiFetch<LecturerResponse>(
            '/api/lecturers?is_active=1',
            {
              method: 'GET',
              cache: 'no-store',
            }
          )

        console.log(
          'LECTURERS API:',
          result
        )

        if (!result.success) {
          throw new Error(
            result.message ||
              'Gagal mengambil data dosen'
          )
        }

        result.data?.forEach(
          (dosen) => {
            console.log(
              '================================'
            )

            console.log(
              'DOSEN:',
              dosen.name
            )

            console.log(
              'PHOTO DATABASE:',
              dosen.photo
            )

            console.log(
              'PHOTO URL:',
              getLecturerImage(
                dosen.photo
              )
            )
          }
        )

        setLecturers(
          result.data || []
        )
      } catch (err) {
        console.error(
          'FETCH LECTURERS ERROR:',
          err
        )

        setError(
          err instanceof Error
            ? err.message
            : 'Terjadi kesalahan saat mengambil data dosen'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchLecturers()
  }, [])

  return (
    <div className="pt-[160px] pb-[120px] dark:bg-darklight">

      <div className="container">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="text-center space-y-4 mb-10">

          <h2 className="
            text-3xl
            md:text-4xl
            font-bold
            leading-tight
          ">

            Daftar{' '}

            <span className="text-primary">
              Dosen
            </span>

          </h2>

          <p className="
            max-w-2xl
            mx-auto
            text-gray-500
            dark:text-gray-400
          ">

            Dosen tetap Program Magister Pemikiran
            Politik Islam terdiri atas para akademisi
            dengan latar kepakaran yang saling
            melengkapi dalam bidang politik Islam,
            pemikiran Islam, dan studi agama.

          </p>

          <div className="
            w-20
            h-1
            bg-primary
            mx-auto
            rounded-full
          " />

        </div>

        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading && (

          <div className="text-center py-20">

            <div
              className="
                w-10
                h-10
                mx-auto
                mb-4
                border-4
                border-gray-200
                border-t-primary
                rounded-full
                animate-spin
              "
            />

            <p className="text-gray-500">
              Memuat data dosen...
            </p>

          </div>

        )}

        {/* =====================================================
            ERROR
        ===================================================== */}

        {!loading && error && (

          <div className="max-w-xl mx-auto">

            <div
              className="
                bg-red-50
                border
                border-red-200
                rounded-xl
                p-6
                text-center
              "
            >

              <p className="
                font-semibold
                text-red-600
              ">
                Gagal memuat data dosen
              </p>

              <p className="
                text-sm
                text-red-500
                mt-2
              ">
                {error}
              </p>

            </div>

          </div>

        )}

        {/* =====================================================
            EMPTY
        ===================================================== */}

        {!loading &&
          !error &&
          lecturers.length === 0 && (

            <div className="
              text-center
              py-20
            ">

              <p className="text-gray-500">
                Belum ada data dosen.
              </p>

            </div>

          )}

        {/* =====================================================
            DOSEN
        ===================================================== */}

        {!loading &&
          !error &&
          lecturers.length > 0 && (

            <div className="
              grid
              md:grid-cols-2
              gap-10
            ">

              {lecturers.map(
                (dosen) => (

                  <div
                    key={dosen.id}
                    className="
                      bg-white
                      dark:bg-dark
                      rounded-2xl
                      shadow-md
                      hover:shadow-xl
                      transition-all
                      duration-300
                      overflow-hidden
                      group
                    "
                  >

                    {/* =================================================
                        FOTO + INFORMASI
                    ================================================= */}

                    <div
                      className="
                        flex
                        flex-col
                        md:flex-row
                        gap-6
                        p-6
                      "
                    >

                      {/* FOTO */}

                      <div className="
                        flex-shrink-0
                      ">

                        <div
                          className="
                            w-[180px]
                            h-[220px]
                            relative
                            rounded-xl
                            overflow-hidden
                            bg-gray-100
                            mx-auto
                            md:mx-0
                          "
                        >

                          <LecturerPhoto
                            photo={dosen.photo}
                            name={
                              dosen.name ||
                              'Dosen'
                            }
                          />

                        </div>

                      </div>

                      {/* INFORMASI */}

                      <div className="
                        flex-1
                        text-left
                      ">

                        <h3
                          className="
                            text-xl
                            font-bold
                            text-primary
                            mb-3
                          "
                        >

                          {dosen.title_prefix && (
                            <>
                              {
                                dosen.title_prefix
                              }{' '}
                            </>
                          )}

                          {dosen.name}

                          {dosen.title_suffix && (
                            <>
                              {', '}
                              {
                                dosen.title_suffix
                              }
                            </>
                          )}

                        </h3>

                        {dosen.position && (

                          <p className="mb-2">

                            <span className="
                              font-semibold
                            ">
                              Jabatan:
                            </span>{' '}

                            {
                              dosen.position
                            }

                          </p>

                        )}

                        {dosen.expertise && (

                          <p className="mb-2">

                            <span className="
                              font-semibold
                            ">
                              Keahlian:
                            </span>{' '}

                            {
                              dosen.expertise
                            }

                          </p>

                        )}

                        {dosen.email && (

                          <p className="
                            mb-2
                            break-all
                          ">

                            <span className="
                              font-semibold
                            ">
                              Email:
                            </span>{' '}

                            {
                              dosen.email
                            }

                          </p>

                        )}

                        <Link
                          href={`/dosen/${dosen.slug}`}
                          className="
                            inline-flex
                            items-center
                            mt-3
                            text-sm
                            font-semibold
                            text-primary
                            hover:underline
                          "
                        >

                          Lihat Profil

                          <span className="ml-1">
                            →
                          </span>

                        </Link>

                      </div>

                    </div>

                    {/* =================================================
                        AKADEMIK
                    ================================================= */}

                    <div className="
                      px-6
                      pb-6
                    ">

                      <div
                        className="
                          h-px
                          w-full
                          bg-gradient-to-r
                          from-transparent
                          via-gray-300
                          to-transparent
                          mb-6
                        "
                      />

                      <div
                        className="
                          flex
                          justify-center
                          gap-6
                          flex-wrap
                          items-center
                        "
                      >

                        {/* GOOGLE SCHOLAR */}

                        {dosen.google_scholar && (

                          <a
                            href={
                              dosen.google_scholar
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Google Scholar"
                          >

                            <img
                              src={
                                academicLogos.googleScholar
                              }
                              alt="Google Scholar"
                              className="
                                w-[110px]
                                h-[40px]
                                object-contain
                                opacity-70
                                hover:opacity-100
                                transition
                              "
                            />

                          </a>

                        )}

                        {/* SINTA */}

                        {dosen.sinta && (

                          <a
                            href={
                              dosen.sinta
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            title="SINTA"
                          >

                            <img
                              src={
                                academicLogos.sinta
                              }
                              alt="SINTA"
                              className="
                                w-[90px]
                                h-[40px]
                                object-contain
                                opacity-70
                                hover:opacity-100
                                transition
                              "
                            />

                          </a>

                        )}

                        {/* SCOPUS */}

                        {dosen.scopus && (

                          <a
                            href={
                              dosen.scopus
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Scopus"
                          >

                            <img
                              src={
                                academicLogos.scopus
                              }
                              alt="Scopus"
                              className="
                                w-[90px]
                                h-[40px]
                                object-contain
                                opacity-70
                                hover:opacity-100
                                transition
                              "
                            />

                          </a>

                        )}

                        {/* ORCID */}

                        {dosen.orcid && (

                          <a
                            href={
                              dosen.orcid
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            title="ORCID"
                          >

                            <img
                              src={
                                academicLogos.orcid
                              }
                              alt="ORCID"
                              className="
                                w-[90px]
                                h-[40px]
                                object-contain
                                opacity-70
                                hover:opacity-100
                                transition
                              "
                            />

                          </a>

                        )}

                        {/* WEB OF SCIENCE */}

                        {dosen.wos && (

                          <a
                            href={
                              dosen.wos
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Web of Science"
                          >

                            <img
                              src={
                                academicLogos.wos
                              }
                              alt="Web of Science"
                              className="
                                w-[90px]
                                h-[40px]
                                object-contain
                                opacity-70
                                hover:opacity-100
                                transition
                              "
                            />

                          </a>

                        )}

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

      </div>

    </div>
  )
}

export default DosenPage
'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  apiFetch,
  getImageUrl,
} from '@/lib/api'

type Organization = {
  id: number
  faculty_id: number | null
  study_program_id: number | null
  parent_id: number | null
  name: string
  position: string | null
  person_name: string | null
  photo: string | null
  description: string | null
  sort_order: number
}

type OrganizationResponse = {
  success: boolean
  data: Organization[]
  scope?: {
    site_id: number
    faculty_id: number | null
    study_program_id: number | null
  }
}

const OrganisasiPage = () => {
  const [data, setData] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // =====================================================
  // FETCH ORGANIZATIONAL STRUCTURE
  // =====================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const result =
          await apiFetch<OrganizationResponse>(
            '/api/organizational-structures',
            {
              method: 'GET',
              cache: 'no-store',
            }
          )

        console.log(
          'ORGANIZATION API:',
          result
        )

        if (result.success) {
          setData(result.data || [])
        } else {
          throw new Error(
            'Gagal mengambil data organisasi'
          )
        }
      } catch (error) {
        console.error(
          'FETCH ORGANIZATION ERROR:',
          error
        )

        setError(
          error instanceof Error
            ? error.message
            : 'Gagal mengambil data struktur organisasi.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // =====================================================
  // ROOT ORGANIZATION
  // =====================================================

  const dekan = data.find(
    (item) =>
      item.parent_id === null &&
      item.name
        .toLowerCase()
        .includes('dekan')
  )

  // =====================================================
  // KAPRODI
  // =====================================================

  const kaprodi = dekan
    ? data.find(
        (item) =>
          item.parent_id === dekan.id &&
          (
            item.name
              .toLowerCase()
              .includes('ketua program studi') ||
            item.position
              ?.toLowerCase()
              .includes('ketua program studi') ||
            item.name
              .toLowerCase()
              .includes('kaprodi') ||
            item.position
              ?.toLowerCase()
              .includes('kaprodi')
          )
      )
    : data.find(
        (item) =>
          item.parent_id === null &&
          (
            item.name
              .toLowerCase()
              .includes('ketua program studi') ||
            item.position
              ?.toLowerCase()
              .includes('ketua program studi') ||
            item.name
              .toLowerCase()
              .includes('kaprodi') ||
            item.position
              ?.toLowerCase()
              .includes('kaprodi')
          )
      )

  // =====================================================
  // CHILDREN KAPRODI
  // =====================================================

  const children = kaprodi
    ? data
        .filter(
          (item) =>
            item.parent_id === kaprodi.id
        )
        .sort(
          (a, b) =>
            a.sort_order - b.sort_order
        )
    : []

  // =====================================================
  // FALLBACK STAFF
  // =====================================================

  const otherStaff = data
    .filter((item) => {
      if (
        item.id === dekan?.id ||
        item.id === kaprodi?.id
      ) {
        return false
      }

      return !children.some(
        (child) =>
          child.id === item.id
      )
    })
    .sort(
      (a, b) =>
        a.sort_order - b.sort_order
    )

  return (
    <div className="pt-[160px] pb-[120px] dark:bg-darklight">

      <div className="container">

        {/* =====================================================
            TITLE
        ===================================================== */}

        <div className="pb-12 text-center">

          <div className="text-center space-y-5 mb-12">

            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Struktur Organisasi Magister <br />

              <span className="text-primary">
                Pemikiran Politik Islam
              </span>
            </h2>

            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />

          </div>

        </div>

        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading && (
          <div className="text-center py-20">

            <div className="inline-flex items-center gap-3 text-gray-500">

              <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />

              <p>
                Loading struktur organisasi...
              </p>

            </div>

          </div>
        )}

        {/* =====================================================
            ERROR
        ===================================================== */}

        {!loading && error && (
          <div className="text-center py-20">

            <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-xl mx-auto">

              <p className="text-red-500">
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
          data.length === 0 && (

            <div className="text-center py-20">

              <p className="text-gray-500">
                Data struktur organisasi belum tersedia.
              </p>

            </div>
          )}

        {/* =====================================================
            ORGANIZATION
        ===================================================== */}

        {!loading &&
          !error &&
          data.length > 0 && (

            <div className="flex flex-col items-center">

              {/* =================================================
                  DEKAN
              ================================================= */}

              {dekan && (

                <motion.div
                  initial={{
                    opacity: 0,
                    y: -40,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="flex flex-col items-center"
                >

                  <Card item={dekan} />

                  {kaprodi && (
                    <div className="w-[3px] h-20 bg-primary rounded-full" />
                  )}

                </motion.div>
              )}

              {/* =================================================
                  KAPRODI
              ================================================= */}

              {kaprodi && (

                <motion.div
                  initial={{
                    opacity: 0,
                    y: -20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="flex flex-col items-center"
                >

                  <Card item={kaprodi} />

                  {children.length > 0 && (
                    <div className="w-[3px] h-20 bg-primary rounded-full" />
                  )}

                  {/* =================================================
                      CHILDREN / STAFF / IMPI
                  ================================================= */}

                  {children.length > 0 && (

                    <div className="flex justify-center flex-wrap gap-10 w-full">

                      {children.map(
                        (item, index) => (

                          <motion.div
                            key={item.id}
                            initial={{
                              opacity: 0,
                              y: 40,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            transition={{
                              delay:
                                index * 0.1,
                            }}
                            className="flex flex-col items-center"
                          >

                            <Card item={item} />

                          </motion.div>

                        )
                      )}

                    </div>
                  )}

                </motion.div>
              )}

              {/* =================================================
                  FALLBACK STAFF
              ================================================= */}

              {!dekan &&
                !kaprodi &&
                otherStaff.length > 0 && (

                  <div className="flex justify-center flex-wrap gap-10 w-full">

                    {otherStaff.map(
                      (item, index) => (

                        <motion.div
                          key={item.id}
                          initial={{
                            opacity: 0,
                            y: 40,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            delay:
                              index * 0.1,
                          }}
                        >

                          <Card item={item} />

                        </motion.div>
                      )
                    )}

                  </div>
                )}

            </div>
          )}

      </div>
    </div>
  )
}

export default OrganisasiPage


// =====================================================
// CARD
// =====================================================

const Card = ({
  item,
}: {
  item: Organization
}) => {

  return (

    <div className="bg-white rounded-2xl shadow-lg p-6 text-center w-[350px] hover:shadow-xl transition">

      {/* FOTO */}

      <div className="relative w-28 h-36 mx-auto mb-4 rounded-xl overflow-hidden">

        <Image
          src={getImageUrl(item.photo)}
          alt={
            item.person_name ||
            item.name
          }
          fill
          className="object-cover"
          unoptimized
        />

      </div>

      {/* NAMA */}

      <h3 className="font-semibold text-lg text-primary">

        {item.person_name ||
          item.name}

      </h3>

      {/* JABATAN */}

      <p className="text-sm text-gray-500">

        {item.position ||
          item.name}

      </p>

    </div>
  )
}
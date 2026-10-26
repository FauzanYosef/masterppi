'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { apiFetch } from '@/lib/api'

type ContactInfo = {
  id: number
  faculty_id: number | null
  study_program_id: number | null
  email: string | null
  phone: string | null
  address: string | null
  latitude: number | null
  longitude: number | null
  whatsapp: string | null
  website: string | null
  map_url: string | null
  created_at?: string
  updated_at?: string
}

type ContactInfoResponse = {
  success: boolean
  message?: string
  data: ContactInfo | null
  scope?: {
    faculty_id: number | null
    study_program_id: number | null
  }
}

const KontakPage = () => {
  const [data, setData] = useState<ContactInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError('')

        const result = await apiFetch<ContactInfoResponse>(
          '/api/contact-info',
          {
            method: 'GET',
            cache: 'no-store',
          }
        )

        console.log('CONTACT INFO API:', result)

        if (!result.success) {
          throw new Error(
            result.message || 'Gagal mengambil informasi kontak'
          )
        }

        setData(result.data)
      } catch (error) {
        console.error(
          'FETCH CONTACT INFO ERROR:',
          error
        )

        setError(
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan saat mengambil informasi kontak'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="pt-[180px] pb-[100px] text-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-[180px] pb-[100px]">
        <div className="container">
          <div className="max-w-xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="font-semibold text-red-600">
              Gagal memuat informasi kontak
            </p>

            <p className="text-sm text-red-500 mt-2">
              {error}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="pt-[180px] pb-[100px]">
        <div className="container text-center">
          <p className="text-gray-500">
            Informasi kontak belum tersedia.
          </p>
        </div>
      </div>
    )
  }

  const hasLocation =
    data.latitude !== null &&
    data.longitude !== null

  const mapUrl =
    data.map_url ||
    (hasLocation
      ? `https://maps.google.com/maps?q=${data.latitude},${data.longitude}&z=15&output=embed`
      : '')

  return (
    <div className="pt-[180px] pb-[100px] bg-gray-50 dark:bg-darklight">
      <div className="container">

        {/* TITLE */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 dark:text-white">
            Ada Pertanyaan? <br />
            <span className="text-primary">
              Kami Siap Membantu
            </span>
          </h2>
        </div>

        {/* CARD */}
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="bg-white dark:bg-dark rounded-2xl overflow-hidden shadow-sm"
        >

          {/* TOP CONTENT */}
          <div className="grid md:grid-cols-2 gap-10 p-10">

            {/* LEFT */}
            <div className="space-y-6">

              {/* EMAIL */}
              {data.email && (
                <div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Email
                  </p>

                  <a
                    href={`mailto:${data.email}`}
                    className="font-semibold text-lg hover:text-primary transition break-all"
                  >
                    {data.email}
                  </a>
                </div>
              )}

              {/* LOCATION */}
              {data.address && (
                <div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Location
                  </p>

                  <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {data.address}
                  </h4>
                </div>
              )}

            </div>

            {/* RIGHT */}
            <div className="space-y-6">

              {/* PHONE */}
              {data.phone && (
                <div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Call Us
                  </p>

                  <a
                    href={`tel:${data.phone}`}
                    className="font-semibold text-lg hover:text-primary transition"
                  >
                    {data.phone}
                  </a>
                </div>
              )}

              {/* WHATSAPP */}
              {data.whatsapp && (
                <div>
                  <p className="text-gray-500 dark:text-gray-400">
                    WhatsApp
                  </p>

                  <a
                    href={
                      data.whatsapp.startsWith('http')
                        ? data.whatsapp
                        : `https://wa.me/${data.whatsapp.replace(
                            /\D/g,
                            ''
                          )}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-lg hover:text-primary transition"
                  >
                    Hubungi via WhatsApp
                  </a>
                </div>
              )}

              {/* WEBSITE */}
              {data.website && (
                <div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Website
                  </p>

                  <a
                    href={data.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-lg hover:text-primary transition break-all"
                  >
                    {data.website}
                  </a>
                </div>
              )}

              {/* SOCIAL MEDIA */}
              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  Follow Us
                </p>

                <div className="flex gap-4">

                  {data.website && (
                    <a
                      href={data.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Website"
                    >
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary hover:text-white transition">
                        <Icon icon="mdi:web" />
                      </div>
                    </a>
                  )}

                  {data.whatsapp && (
                    <a
                      href={
                        data.whatsapp.startsWith('http')
                          ? data.whatsapp
                          : `https://wa.me/${data.whatsapp.replace(
                              /\D/g,
                              ''
                            )}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      title="WhatsApp"
                    >
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary hover:text-white transition">
                        <Icon icon="mdi:whatsapp" />
                      </div>
                    </a>
                  )}

                </div>
              </div>

            </div>
          </div>

          {/* MAP */}
          {hasLocation && (
            <div className="w-full h-[400px] relative">

              <iframe
                width="100%"
                height="100%"
                loading="lazy"
                className="border-0"
                src={mapUrl}
                title="Lokasi"
              />

              {/* LABEL */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md text-sm font-semibold text-primary">
                We Are Here
              </div>

            </div>
          )}

        </motion.div>
      </div>
    </div>
  )
}

export default KontakPage
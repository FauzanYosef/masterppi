'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { apiFetch } from '@/lib/api'
import PageHeader from '@/components/UI/PageHeader'
import EmptyState from '@/components/UI/EmptyState'
import { useI18n } from '@/i18n/I18nProvider'

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
  const { t } = useI18n()
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

  const header = (
    <PageHeader title={t.pages.kontak.title} description={t.pages.kontak.description} />
  )

  if (loading) {
    return (
      <main>
        {header}
        <div className="container py-16 lg:py-24">
          <div className="mx-auto h-64 max-w-4xl animate-pulse rounded-2xl bg-darkblue/[0.06]" />
        </div>
      </main>
    )
  }

  if (error || !data) {
    return (
      <main>
        {header}
        <div className="container py-16 lg:py-24">
          <EmptyState
            tone={error ? 'error' : 'default'}
            icon="tabler:address-book"
            title={error ? t.profil.kontak.error : t.profil.kontak.empty}
            description={error || undefined}
          />
        </div>
      </main>
    )
  }

  const hasLocation = data.latitude !== null && data.longitude !== null
  const mapUrl =
    data.map_url ||
    (hasLocation ? `https://maps.google.com/maps?q=${data.latitude},${data.longitude}&z=15&output=embed` : '')
  const whatsappUrl = data.whatsapp
    ? data.whatsapp.startsWith('http')
      ? data.whatsapp
      : `https://wa.me/${data.whatsapp.replace(/\D/g, '')}`
    : null

  const items = [
    data.address && { icon: 'tabler:map-pin', label: t.profil.kontak.address, value: data.address },
    data.email && { icon: 'tabler:mail', label: t.profil.kontak.email, value: data.email, href: `mailto:${data.email}` },
    data.phone && { icon: 'tabler:phone', label: t.profil.kontak.phone, value: data.phone, href: `tel:${data.phone}` },
    whatsappUrl && { icon: 'tabler:brand-whatsapp', label: t.profil.kontak.whatsapp, value: t.profil.kontak.whatsappCta, href: whatsappUrl, external: true },
    data.website && { icon: 'tabler:world', label: t.profil.kontak.website, value: data.website, href: data.website, external: true },
  ].filter(Boolean) as { icon: string; label: string; value: string; href?: string; external?: boolean }[]

  return (
    <main className="bg-secondary dark:bg-darklight">
      {header}

      <div className="container py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-6 lg:grid-cols-12"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {items.map((item) => (
              <div key={item.label} className="card flex items-start gap-4 p-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/[0.08] text-primary dark:bg-white/10 dark:text-white">
                  <Icon icon={item.icon} width={24} aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em]">{item.label}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="mt-1 block break-words font-semibold text-darkblue transition hover:text-primary dark:text-white"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-1 font-semibold !text-darkblue dark:!text-white">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="card relative min-h-[360px] lg:col-span-7">
            {hasLocation || mapUrl ? (
              <iframe
                loading="lazy"
                className="absolute inset-0 h-full w-full border-0"
                src={mapUrl}
                title={t.profil.kontak.mapTitle}
              />
            ) : (
              <div className="flex h-full min-h-[360px] items-center justify-center">
                <Icon icon="tabler:map-off" width={40} className="text-lightgrey" aria-hidden />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  )
}

export default KontakPage

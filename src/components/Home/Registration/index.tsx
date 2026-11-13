'use client'

import { useEffect, useState } from 'react'
import Link from '@/components/UI/LocaleLink'
import { Icon } from '@iconify/react'
import { getImageUrl } from '@/lib/api'
import { getCurrentAdmission } from '@/lib/site-content'
import { useI18n } from '@/i18n/I18nProvider'

const DEFAULT_REGISTRATION_URL = 'https://pmb.uinsgd.ac.id'

const RegistrationBanner = () => {
  const { t } = useI18n()
  const [registrationUrl, setRegistrationUrl] = useState(DEFAULT_REGISTRATION_URL)

  // Tautan pendaftaran dari CMS (Akademik → Penerimaan).
  useEffect(() => {
    let active = true
    getCurrentAdmission(getImageUrl, { withFiles: false }).then((admission) => {
      if (active && admission?.registrationUrl) setRegistrationUrl(admission.registrationUrl)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <section className='bg-white !py-12 lg:!py-16 dark:bg-darklight'>
      <div className='container'>
        <div className='relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-[#244b8f] to-darkblue px-6 py-12 shadow-lift md:px-14 md:py-16'>
          <div className='absolute inset-0 -z-10 bg-grid opacity-30 [mask-image:linear-gradient(to_left,black,transparent)]' />
          <div className='absolute -right-20 -top-20 -z-10 h-72 w-72 rounded-full bg-sec-yellow/30 blur-3xl' />
          <div className='absolute -bottom-24 left-1/3 -z-10 h-64 w-64 rounded-full bg-white/10 blur-3xl' />

          <div className='flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center'>
            <div className='max-w-2xl'>
              <span className='eyebrow !text-sec-yellow'>{t.home.registration.eyebrow}</span>
              <h2 className='mt-4 !text-white'>
                {t.home.registration.titleLead} <span className='text-sec-yellow'>{t.home.registration.titleAccent}</span>
              </h2>
              <p className='mt-4 !text-white/75 md:text-lg'>
                {t.home.registration.description}
              </p>
            </div>

            <div className='flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col xl:flex-row'>
              <a href={registrationUrl} target='_blank' rel='noopener noreferrer' className='btn-accent !px-8 !py-4'>
                {t.home.registration.register}
                <Icon icon='tabler:arrow-up-right' width={18} aria-hidden />
              </a>
              <Link
                href='/akademik/admisi'
                className='inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white hover:text-primary'>
                {t.home.registration.info}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RegistrationBanner

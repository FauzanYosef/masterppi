'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { getPage, PROFILE_PAGES } from '@/lib/site-content'
import PageHeader from '@/components/UI/PageHeader'
import RichText from '@/components/UI/RichText'
import { useI18n } from '@/i18n/I18nProvider'
import { Calendar, BookOpen, Building2, Users, Database, FlaskConical } from 'lucide-react'

const FasilitasPage = () => {
  const { t } = useI18n()
  const [content, setContent] = useState<string | null>(null)

  // Fasilitas dari CMS (Halaman → "Fasilitas"); tanpa itu, daftar bawaan di bawah yang tampil.
  useEffect(() => {
    let active = true
    getPage(PROFILE_PAGES.fasilitas).then((page) => {
      if (active && page?.content) setContent(page.content)
    })
    return () => {
      active = false
    }
  }, [])

  const icons = [Calendar, BookOpen, FlaskConical, Building2, Users, Database]
  const fasilitas = t.profil.fasilitas.map((item, i) => ({ ...item, icon: icons[i] }))

  return (
    <main className="bg-white dark:bg-darklight">
      <PageHeader
        title={t.pages.fasilitas.title}
        description={t.pages.fasilitas.description}
      />

      <div className="container py-16 lg:py-24">
        {content ? (
          <RichText html={content} className="mx-auto max-w-3xl" />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fasilitas.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="card card-hover p-7"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary dark:bg-white/10 dark:text-white">
                    <Icon size={26} />
                  </div>
                  <h5 className="mb-2">{item.title}</h5>
                  <p className="text-sm">{item.desc}</p>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

export default FasilitasPage

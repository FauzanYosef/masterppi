'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

// mapping biar sama dengan sidebar
const nameMap: Record<string, string> = {
  dashboard: 'Dashboard',
  articles: 'Articles',
  events: 'Events',
  'event-galleries': 'Event Galleries',
  publikasi: 'Publikasi',
  kurikulum: 'Kurikulum',
  'kurikulum-detail': 'Kurikulum Detail',
  'mata-kuliah': 'Mata Kuliah',
  'tipe-matkul': 'Tipe Matkul',
  semester: 'Semester',
  lecturers: 'Lecturers',
  organization: 'Organization',
  profile: 'Profile',
  panduan: 'Panduan',
  kontak: 'Kontak',
  thesis: 'Thesis',
  jurnal: 'Jurnal',
}

const formatLabel = (segment: string) => {
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

const Breadcrumb = () => {
  const pathname = usePathname()

  const segments = pathname
    .split('/')
    .filter(Boolean)
    .slice(1)

  return (
    <div className="px-6 mb-6 mt-6">
      <div className="flex items-center flex-wrap gap-2 text-sm bg-white px-4 py-3 rounded-xl shadow-sm">

        {/* HOME */}
        <Link
          href="/admin/dashboard"
          className="text-gray-500 hover:text-purple-600 transition font-small"
        >
          Dashboard
        </Link>

        {/* SEGMENTS */}
        {segments.map((segment, index) => {
          const href = '/admin/' + segments.slice(0, index + 1).join('/')
          const isLast = index === segments.length - 1

          // pakai mapping biar rapi
          const label = nameMap[segment] || formatLabel(segment)

          return (
            <div key={href} className="flex items-center gap-2">
              <ChevronRight size={16} className="text-gray-400" />

              {isLast ? (
                <span className="text-gray-800 font-semibold">
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className="text-gray-500 hover:text-primary transition"
                >
                  {label}
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Breadcrumb
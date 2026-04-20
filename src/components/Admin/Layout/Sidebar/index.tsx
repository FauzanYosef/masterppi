'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Image as ImageIcon,
  BookOpen,
  GraduationCap,
  Users,
  Folder,
} from 'lucide-react'

const menu = [
  {
    title: 'Main',
    items: [
      { name: 'Dashboard', href: ' /dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Content',
    items: [
      { name: 'Articles', href: '/articles', icon: FileText },
      { name: 'Events', href: ' /events', icon: Calendar },
      { name: 'Event Galleries', href: ' /event-galleries', icon: ImageIcon },
      { name: 'Publikasi', href: ' /publikasi', icon: BookOpen },
    ],
  },
  {
    title: 'Akademik',
    items: [
      { name: 'Kurikulum', href: ' /kurikulum', icon: GraduationCap },
      { name: 'Kurikulum Detail', href: ' /kurikulum-detail', icon: Folder },
      { name: 'Mata Kuliah', href: ' /mata-kuliah', icon: BookOpen },
      { name: 'Tipe Matkul', href: ' /tipe-matkul', icon: Folder },
      { name: 'Semester', href: ' /semester', icon: Calendar },
    ],
  },
  {
    title: 'SDM',
    items: [
      { name: 'Lecturers', href: ' /lecturers', icon: Users },
      { name: 'Organization', href: ' /organization', icon: Users },
    ],
  },
  {
    title: 'Informasi',
    items: [
      { name: 'Profile', href: ' /profile', icon: FileText },
      { name: 'Panduan', href: ' /panduan', icon: FileText },
      { name: 'Kontak', href: ' /kontak', icon: FileText },
    ],
  },
  {
    title: 'Penelitian',
    items: [
      { name: 'Thesis', href: ' /thesis', icon: BookOpen },
      { name: 'Jurnal', href: ' /jurnal', icon: BookOpen },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 h-screen sticky top-0 bg-white px-5 py-6 overflow-y-auto scrollbar-hide relative">

      {/* ===== LOGO ===== */}
      <div className="flex items-center gap-3 mb-8">
        <Image
          src="/images/logo/ppi_logo.png"
          alt="Logo"
          width={36}
          height={36}
          className="rounded-lg object-contain"
        />

        <div>
          <h1 className="text-sm font-semibold text-gray-800 leading-tight">
            Magister
          </h1>
          <p className="text-xs text-gray-400">
            Pemikiran Politik Islam
          </p>
        </div>
      </div>

      {/* ===== MENU ===== */}
      <div className="space-y-6">
        {menu.map((section, i) => (
          <div key={i}>
            <p className="text-xs text-gray-400 uppercase mb-2 px-2">
              {section.title}
            </p>

            <div className="space-y-1">
              {section.items.map((item, j) => {
                const Icon = item.icon

                // ✅ SUPPORT SUB ROUTE
                const active = pathname.startsWith(item.href)

                return (
                  <Link
                    key={j}
                    href={item.href}
                    className={`relative group flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-200
                    ${
                      active
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >

                    {/* 🔥 ACTIVE INDICATOR */}
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-white rounded-r-full" />
                    )}

                    {/* ICON */}
                    <Icon
                      size={18}
                      className={`${
                        active
                          ? 'text-white'
                          : 'text-gray-400 group-hover:text-gray-700'
                      }`}
                    />

                    {/* TEXT */}
                    <span>{item.name}</span>

                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* FADE BOTTOM */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white to-transparent" />

    </aside>
  )
}
'use client'

import { useEffect, useState, useMemo } from 'react'
import { ChevronDown, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'

const menuMap: Record<string, string> = {
  ' /dashboard': 'Dashboard',
  ' /articles': 'Articles',
  ' /events': 'Events',
  ' /event-galleries': 'Event Galleries',
  ' /publikasi': 'Publikasi',
  ' /kurikulum': 'Kurikulum',
  ' /kurikulum-detail': 'Kurikulum Detail',
  ' /mata-kuliah': 'Mata Kuliah',
  ' /tipe-matkul': 'Tipe Matkul',
  ' /semester': 'Semester',
  ' /lecturers': 'Lecturers',
  ' /organization': 'Organization',
  ' /profile': 'Profile',
  ' /panduan': 'Panduan',
  ' /kontak': 'Kontak',
  ' /thesis': 'Thesis',
  ' /jurnal': 'Jurnal',
}

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [open, setOpen] = useState(false)

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // 🔥 AUTO MATCH ACTIVE MENU (supports sub routes)
  const activeTitle = useMemo(() => {
    const match = Object.keys(menuMap)
      .sort((a, b) => b.length - a.length) // prioritaskan route paling spesifik
      .find((key) => pathname.startsWith(key))

    return match ? menuMap[match] : ''
  }, [pathname])

  return (
    <header className="flex items-center justify-between px-8 py-5 bg-white">

      {/* TITLE */}
      <h2 className="text-xl font-semibold text-gray-800">
        {activeTitle}
      </h2>

      {/* USER DROPDOWN */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full"
        >
          <div className="w-8 h-8 bg-purple-600 text-white flex items-center justify-center rounded-full text-sm">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>

          <span className="text-sm hidden sm:block">
            {user?.email}
          </span>

          <ChevronDown size={14} />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded-xl shadow p-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-red-500 px-3 py-2 hover:bg-red-50 rounded-lg w-full"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>

    </header>
  )
}
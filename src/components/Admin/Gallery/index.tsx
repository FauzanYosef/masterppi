'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Icon } from '@iconify/react'
import { Plus } from 'lucide-react'
import { motion } from "framer-motion"

// ===== TYPE =====
type Gallery = {
  id: string
  image_url: string
  caption: string | null
  event_id: string
}

type Event = {
  id: string
  title: string
}

type GroupedGallery = {
  event_id: string
  event_title: string
  photos: Gallery[]
}

export default function GalleryPage() {
  const [groups, setGroups] = useState<GroupedGallery[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // ===== FETCH =====
  const fetchGallery = async () => {
    setLoading(true)

    const { data: galleries } = await supabase
      .from('event_galleries')
      .select('*')
      .order('created_at', { ascending: false })

    const { data: events } = await supabase
      .from('events')
      .select('id, title')

    const eventMap: Record<string, string> = {}

    events?.forEach((e: Event) => {
      eventMap[e.id] = e.title
    })

    const grouped: Record<string, GroupedGallery> = {}

    galleries?.forEach((item: Gallery) => {
      const eventId = item.event_id
      const eventTitle = eventMap[eventId] || 'Tanpa Event'

      if (!grouped[eventId]) {
        grouped[eventId] = {
          event_id: eventId,
          event_title: eventTitle,
          photos: [],
        }
      }

      grouped[eventId].photos.push(item)
    })

    setGroups(Object.values(grouped))
    setLoading(false)
  }

  useEffect(() => {
    fetchGallery()
  }, [])

  // ===== ESC CLOSE MODAL =====
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDeleteId(null)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // ===== DELETE =====
  const handleDelete = async () => {
    if (!deleteId) return

    setDeletingId(deleteId)

    const { error } = await supabase
      .from('event_galleries')
      .delete()
      .eq('id', deleteId)

    if (error) {
      console.error(error)
      alert('Gagal menghapus')
    } else {
      await fetchGallery()
    }

    setDeletingId(null)
    setDeleteId(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-7">

      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Galeri Kegiatan
          </h1>
          <p className="text-gray-500 text-sm">
            Kelola dokumentasi kegiatan kelurahan
          </p>
        </div>

        <Link
          href="/gallery/create"
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-xl shadow hover:opacity-90"
        >
          <Plus size={16} />
          New Gallery
        </Link>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">
          Loading...
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          Belum ada data
        </div>
      ) : (
        <div className="space-y-10">

          {groups.map((group) => (
            <div
              key={group.event_id}
              className="bg-white rounded-3xl shadow-md p-6"
            >

              {/* EVENT HEADER */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  {group.event_title}
                </h2>

                <Link
                  href={`/admin/gallery/create?event_id=${group.event_id}`}
                  className="group inline-flex items-center gap-2 text-sm font-medium 
                            bg-primary text-white px-4 py-2 rounded-lg 
                            hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <span className="flex items-center justify-center w-5 h-5">
                    <Icon icon="mdi:plus" width="18" />
                  </span>
                  Tambah Foto
                </Link>
              </div>

              {/* GRID */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">

                {group.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="bg-gray-100 rounded-2xl overflow-hidden group relative hover:shadow-xl transition"
                  >

                    <Image
                      src={photo.image_url}
                      alt="gallery"
                      width={400}
                      height={300}
                      className="w-full h-[150px] object-cover group-hover:scale-105 transition"
                    />

                    {/* OVERLAY */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition">

                      {/* EDIT */}
                      {/* <Link
                        href={`/admin/gallery/edit/${photo.id}`}
                        className="group/edit relative w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white hover:scale-110 transition"
                      >
                        <Icon icon="mdi:pencil" width="18" />
                        <span className="absolute -top-8 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover/edit:opacity-100">
                          Edit
                        </span>
                      </Link> */}

                      {/* DELETE */}
                      <button
                        onClick={() => setDeleteId(photo.id)}
                        className="group/delete relative w-10 h-10 flex items-center justify-center rounded-full bg-red-500 text-white hover:scale-110 transition"
                      >
                        <Icon icon="mdi:trash-can-outline" width="18" />
                        {/* <span className="absolute -top-8 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover/delete:opacity-100">
                          Hapus
                        </span> */}
                      </button>

                    </div>

                    {photo.caption && (
                      <div className="p-2 text-xs text-gray-600">
                        {photo.caption}
                      </div>
                    )}

                  </div>
                ))}

              </div>

            </div>
          ))}

        </div>
      )}

      {/* MODAL DELETE */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteId(null)}
          />

          {/* MODAL */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 z-10"
          >
            <div className="text-center">

              <div className="w-14 h-14 mx-auto flex items-center justify-center bg-red-100 text-red-500 rounded-full mb-4">
                <Icon icon="mdi:alert-outline" width="28" />
              </div>

              <h3 className="text-lg font-semibold">
                Hapus Foto?
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Data yang dihapus tidak bisa dikembalikan
              </p>

              <div className="flex justify-center gap-4 mt-6">

                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                >
                  Batal
                </button>

                <button
                  onClick={handleDelete}
                  disabled={deletingId === deleteId}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white flex items-center gap-2"
                >
                  {deletingId === deleteId && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  )}
                  Hapus
                </button>

              </div>

            </div>
          </motion.div>
        </div>
      )}

    </div>
  )
}
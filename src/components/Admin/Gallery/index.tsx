'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Icon } from '@iconify/react'

// ===== TYPE =====
type Gallery = {
  id: number
  image_url: string
  caption: string | null
  event_id: string
  events: {
    title: string
  }[] | null
}

type GroupedGallery = {
  event_id: string
  event_title: string
  photos: Gallery[]
}

export default function GalleryPage() {
  const [groups, setGroups] = useState<GroupedGallery[]>([])
  const [loading, setLoading] = useState(true)

  // ===== FETCH + GROUP =====
  const fetchGallery = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('event_galleries')
      .select(`
        id,
        image_url,
        caption,
        event_id,
        events:event_id (
          title
        )
      `)
      .order('id', { ascending: false })

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    const grouped: Record<string, GroupedGallery> = {}

    data?.forEach((item: Gallery) => {
      const eventId = item.event_id
      const eventTitle = item.events?.[0]?.title || 'No Event'

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

  return (
    <div className="min-h-screen bg-gray-50 p-7">

      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Event Galleries
          </h1>
          <p className="text-gray-500 text-sm">
            Manage event photos
          </p>
        </div>

        {/* GLOBAL ADD BUTTON */}
        <Link
          href="/admin/gallery/create"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
        >
          <Icon icon="mdi:plus" width="20" />
          Tambah Foto
        </Link>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="p-6 text-gray-500">Loading...</div>
      ) : groups.length === 0 ? (
        <div className="p-6 text-gray-500">No gallery data</div>
      ) : (
        <div className="space-y-8">

          {groups.map((group) => (
            <div
              key={group.event_id}
              className="bg-white rounded-2xl shadow p-6"
            >

              {/* EVENT HEADER */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {group.event_title}
                </h2>

                {/* ADD PER EVENT */}
                <Link
                  href={`/admin/gallery/create?event_id=${group.event_id}`}
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <Icon icon="mdi:plus" width="16" />
                  Tambah
                </Link>
              </div>

              {/* GRID FOTO */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

                {group.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="bg-gray-100 rounded-xl overflow-hidden group relative"
                  >

                    <Image
                      src={photo.image_url}
                      alt="gallery"
                      width={400}
                      height={300}
                      className="w-full h-[140px] object-cover group-hover:scale-105 transition"
                    />

                    {/* HOVER ACTION */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition">
                      <button className="bg-white p-2 rounded-full">
                        <Icon icon="mdi:pencil-outline" width="18" />
                      </button>
                      <button className="bg-white p-2 rounded-full">
                        <Icon icon="mdi:delete-outline" width="18" />
                      </button>
                    </div>

                    {photo.caption && (
                      <div className="p-2 text-xs text-gray-600 line-clamp-2">
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

    </div>
  )
}
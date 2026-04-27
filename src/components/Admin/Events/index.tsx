'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Event = {
  id: number
  title: string
  slug: string
  description: string | null
  content: string | null
  category: string | null
  location: string | null
  start_date: string | null
  end_date: string | null
  cover_img: string | null
  organizer: string | null
  status: string | null
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [deleting, setDeleting] = useState(false)

  // FETCH DATA
  const fetchEvents = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: false })

    if (!error) setEvents(data || [])

    setLoading(false)
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  // DELETE MODAL
  const openDeleteModal = (event: Event) => {
    setSelectedId(event.id)
    setSelectedEvent(event)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedId(null)
    setSelectedEvent(null)
  }

  // DELETE DATA
  const handleDelete = async () => {
    if (!selectedId) return

    setDeleting(true)

    try {
      const { data: event } = await supabase
        .from('events')
        .select('cover_img')
        .eq('id', selectedId)
        .single()

      if (event?.cover_img) {
        const path = event.cover_img.split('/storage/v1/object/public/news/')[1]

        if (path) {
          await supabase.storage.from('news').remove([path])
        }
      }

      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', selectedId)

      if (!error) {
        fetchEvents()
        closeModal()
      }
    } catch (err) {
      console.error(err)
    }

    setDeleting(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-7">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-500 text-sm">Manage event content</p>
        </div>

        <Link
          href="/events/create"
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-xl shadow hover:opacity-90"
        >
          <Plus size={16} />
          New Event
        </Link>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

        {loading ? (
          <div className="p-6 text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-500">
                <tr>
                  <th className="px-6 py-4 text-left">Event</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Organizer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="text-right px-6">Actions</th>
                </tr>
              </thead>

              <tbody>
                {events.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50 align-center">

                    {/* EVENT */}
                    <td className="px-6 py-4 flex gap-3">
                      {e.cover_img ? (
                        <Image
                          src={e.cover_img}
                          alt={e.title}
                          width={70}
                          height={50}
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-[70px] h-[50px] bg-gray-200 rounded-lg" />
                      )}

                      <div>
                        <p className="font-semibold line-clamp-1">{e.title}</p>
                        <p className="text-xs text-gray-400 line-clamp-2">
                          {e.description}
                        </p>
                      </div>
                    </td>


                    {/* CATEGORY */}
                    <td>
                      {e.category ? (
                        <span className="px-3 py-1 text-xs bg-purple-50 text-purple-600 rounded-full">
                          {e.category}
                        </span>
                      ) : '-'}
                    </td>

                    {/* LOCATION */}
                    <td className="text-gray-500 text-sm">
                      {e.location || '-'}
                    </td>

                    {/* ORGANIZER */}
                    <td className="text-gray-500 text-sm">
                      {e.organizer || '-'}
                    </td>

                    {/* DATE RANGE */}
                    <td className="text-gray-500 text-sm">
                      {e.start_date ? (
                        <>
                          {new Date(e.start_date).toLocaleDateString()}
                          {e.end_date && (
                            <>
                              <br />
                              <span className="text-xs text-gray-400">
                                s/d {new Date(e.end_date).toLocaleDateString()}
                              </span>
                            </>
                          )}
                        </>
                      ) : '-'}
                    </td>

                    {/* STATUS */}
                    <td>
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          e.status === 'published'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-yellow-100 text-yellow-600'
                        }`}
                      >
                        {e.status || 'draft'}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="px-6">
                      <div className="flex justify-end gap-2">

                        <Link
                          href={`/events/edit/${e.id}`}
                          className="p-2 hover:bg-blue-50 rounded-lg"
                        >
                          <Pencil size={16} className="text-blue-500" />
                        </Link>

                        <button
                          onClick={() => openDeleteModal(e)}
                          className="p-2 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        )}
      </div>

      {/* MODAL DELETE */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-[420px] rounded-2xl p-6 shadow-xl">

            <h2 className="text-lg font-semibold">Delete Event</h2>

            <p className="text-sm text-gray-500 mt-2">
              This action cannot be undone.
            </p>

            {selectedEvent && (
              <div className="mt-4 flex gap-3 items-center">
                {selectedEvent.cover_img && (
                  <Image
                    src={selectedEvent.cover_img}
                    alt="cover"
                    width={60}
                    height={40}
                    className="rounded-md object-cover"
                  />
                )}
                <p className="text-sm font-medium">
                  {selectedEvent.title}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  )
}
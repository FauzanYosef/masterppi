'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, UploadCloud, X } from 'lucide-react'

type Event = {
  id: string
  title: string
}

export default function CreateGalleryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [events, setEvents] = useState<Event[]>([])
  const [eventId, setEventId] = useState(searchParams.get('event_id') || '')

  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // ===== FETCH EVENTS =====
  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from('events')
        .select('id, title')
        .order('created_at', { ascending: false })

      setEvents(data || [])
    }

    fetchEvents()
  }, [])

  // ===== HANDLE FILE =====
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])

    setFiles(selected)
    setPreviews(selected.map((f) => URL.createObjectURL(f)))
  }

  const removeImage = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
    setPreviews(previews.filter((_, i) => i !== index))
  }

  // ===== UPLOAD =====
  const uploadImages = async () => {
    const urls: string[] = []

    for (const file of files) {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random()}.${ext}`
      const filePath = `galleries/${fileName}`

      const { error } = await supabase.storage
        .from('gallery')
        .upload(filePath, file)

      if (error) {
        console.error(error)
        continue
      }

      const { data } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath)

      urls.push(data.publicUrl)
    }

    return urls
  }

  // ===== SUBMIT =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!eventId) return alert('Pilih event dulu')
    if (files.length === 0) return alert('Upload minimal 1 foto')

    setLoading(true)

    const imageUrls = await uploadImages()

    const payload = imageUrls.map((url) => ({
      event_id: eventId,
      image_url: url,
    }))

    const { error } = await supabase
      .from('event_galleries')
      .insert(payload)

    setLoading(false)

    if (error) {
      console.error(error)
      alert('Gagal upload gallery')
    } else {
      router.push('/gallery')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 py-6">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/admin/gallery')}
              className="p-2 rounded-lg hover:bg-gray-200 transition"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Create Gallery
              </h1>
              <p className="text-gray-500 mt-1">
                Upload foto kegiatan berdasarkan event
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* LEFT */}
            <div className="lg:col-span-8 space-y-6">

              {/* EVENT SELECT */}
              <div className="bg-white rounded-2xl p-6 shadow space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-gray-800">
                    Pilih Event
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Pilih kegiatan untuk galeri foto
                  </p>
                </div>

                <div className="relative">
                  <select
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Pilih event...</option>
                    {events.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.title}
                      </option>
                    ))}
                  </select>

                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                    ▼
                  </div>
                </div>

                {eventId && (
                  <div className="bg-primary/5 border border-primary/20 text-primary text-xs rounded-lg px-3 py-2">
                    Event dipilih:{' '}
                    <span className="font-medium">
                      {events.find((e) => e.id === eventId)?.title}
                    </span>
                  </div>
                )}
              </div>

              {/* UPLOAD */}
              <div className="bg-white rounded-2xl p-6 shadow">
                <h2 className="text-sm font-semibold text-gray-700 mb-4">
                  Upload Gallery
                </h2>

                {/* DROP AREA */}
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-primary transition">
                  <UploadCloud className="w-10 h-10 text-gray-400 mb-3" />
                  <p className="text-sm font-medium text-gray-700">
                    Click to upload or drag images
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG max 5MB
                  </p>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {/* PREVIEW */}
                {previews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    {previews.map((src, i) => (
                      <div
                        key={i}
                        className="relative rounded-xl overflow-hidden group border"
                      >
                        <Image
                          src={src}
                          alt="preview"
                          width={300}
                          height={200}
                          className="w-full h-36 object-cover group-hover:scale-105 transition"
                        />

                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-red-500 hover:text-white transition"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT */}
            <div className="lg:col-span-4">
              <div className="sticky top-6 space-y-6">

                <div className="bg-white rounded-2xl p-6 shadow space-y-5">

                  <h2 className="text-base font-semibold text-gray-800">
                    Gallery Settings
                  </h2>

                  <div>
                    <p className="text-sm text-gray-500">Total Foto</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {files.length}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !eventId || files.length === 0}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50"
                  >
                    {loading ? 'Uploading...' : 'Publish Gallery'}
                  </button>

                </div>

              </div>
            </div>

          </div>
        </form>

      </div>
    </div>
  )
}
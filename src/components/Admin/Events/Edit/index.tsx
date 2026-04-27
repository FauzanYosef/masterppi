'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function EditEventForm() {
  const router = useRouter()
  const params = useParams()

  const id =
    typeof params?.id === 'string'
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : null

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [organizer, setOrganizer] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState('draft')

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const slug = useMemo(() => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }, [title])

  useEffect(() => {
    if (!id) return

    const fetchEvent = async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (data) {
        setTitle(data.title || '')
        setDescription(data.description || '')
        setContent(data.content || '')
        setCategory(data.category || '')
        setLocation(data.location || '')
        setOrganizer(data.organizer || '')
        setStartDate(data.start_date || '')
        setEndDate(data.end_date || '')
        setStatus(data.status || 'draft')
        setPreview(data.cover_img || null)
      }

      setFetching(false)
    }

    fetchEvent()
  }, [id])

  const uploadImage = async () => {
    if (!imageFile) return preview

    const fileName = `${Date.now()}.${imageFile.name.split('.').pop()}`
    const filePath = `covers/${fileName}`

    await supabase.storage.from('news').upload(filePath, imageFile)

    const { data } = supabase.storage.from('news').getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)

    const imageUrl = await uploadImage()

    await supabase
      .from('events')
      .update({
        title,
        description,
        content,
        category,
        location,
        organizer,
        start_date: startDate || null,
        end_date: endDate || null,
        status,
        cover_img: imageUrl,
        slug,
      })
      .eq('id', id)

    setLoading(false)
    router.push('/events')
  }

  if (fetching) return <div className="p-6">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push('/events')}>
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">Edit Event</h1>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow p-6">

        <form onSubmit={handleUpdate} className="grid lg:grid-cols-12 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-8 space-y-5">

            <div>
              <label className="text-sm font-medium">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 p-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Short Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mt-1 p-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full mt-1 p-3 border rounded-lg h-60"
              />
            </div>

          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4 space-y-5">

            {/* IMAGE */}
            <div>
              <label className="text-sm font-medium">Cover Image</label>

              {preview && (
                <div className="relative w-full h-40 mt-2">
                  <Image
                    src={preview}
                    alt="preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}

              <input
                type="file"
                onChange={(e) =>
                  setImageFile(e.target.files?.[0] || null)
                }
                className="mt-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Organizer</label>
              <input
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-medium">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <button
              className="w-full bg-primary text-white py-3 rounded-lg mt-4 hover:opacity-90 transition"
            >
              {loading ? 'Updating...' : 'Update Event'}
            </button>

          </div>

        </form>
      </div>
    </div>
  )
}
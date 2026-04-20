'use client'

import { useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

export default function CreateArticlePage() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')

  const [publishedDate, setPublishedDate] = useState('')

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)

  // ===== SLUG =====
  const slug = useMemo(() => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }, [title])

  // ===== UPLOAD IMAGE (bucket: news) =====
  const uploadImage = async () => {
    if (!imageFile) return null

    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `covers/${fileName}`

    const { error } = await supabase.storage
      .from('news')
      .upload(filePath, imageFile, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error(error)
      alert('Upload gagal')
      return null
    }

    const { data } = supabase.storage
      .from('news')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  // ===== SUBMIT =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const imageUrl = await uploadImage()

    const finalDate =
      publishedDate || new Date().toISOString()

    const { error } = await supabase.from('articles').insert([
      {
        title,
        author,
        content,
        category,
        cover_img: imageUrl,
        slug,
        published_date: finalDate,
      },
    ])

    setLoading(false)

    if (error) {
      console.error(error)
      alert('Gagal simpan artikel')
    } else {
      router.push('/articles')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 py-6">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            
            <button
              onClick={() => router.push('/articles')}
              className="p-2 rounded-lg hover:bg-gray-200 transition"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
               Create Article
              </h1>
              <p className="text-gray-500 mt-1">
                Write and publish content quickly and efficiently
              </p>
            </div>

          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* LEFT SIDE */}
            <div className="lg:col-span-8 space-y-6">

              {/* TITLE */}
              <div className="bg-white rounded-2xl p-6 shadow">
                <h2 className="text-sm font-semibold text-gray-700 mb-2">
                  Article Title
                </h2>

                <input
                  type="text"
                  placeholder="Enter article title..."
                  className="w-full text-3xl font-semibold outline-none placeholder-gray-300"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <p className="mt-3 text-sm text-gray-500">
                  URL: <span className="text-purple-600">/articles/{slug || 'slug'}</span>
                </p>
              </div>

              {/* CONTENT */}
              <div className="bg-white rounded-2xl p-6 shadow">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">
                  Content
                </h2>

                <textarea
                  placeholder="Write your article content..."
                  className="w-full h-[420px] resize-none outline-none text-gray-700"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="lg:col-span-4 space-y-6">

              <div className="sticky top-6 space-y-6">

                {/* SETTINGS */}
                <div className="bg-white rounded-2xl p-6 shadow space-y-5">

                  <h2 className="text-base font-semibold text-gray-800">
                    Publish Settings
                  </h2>

                  {/* AUTHOR */}
                  <div>
                    <label className="text-sm">Author</label>
                    <input
                      className="w-full border rounded-lg p-2 mt-1"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                    />
                  </div>

                  {/* CATEGORY */}
                  <div>
                    <label className="text-sm">Category</label>
                    <input
                      className="w-full border rounded-lg p-2 mt-1"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </div>

                  {/* PUBLISHED DATE (NEW) */}
                  <div>
                    <label className="text-sm">Published Date</label>
                    <input
                      type="date"
                      className="w-full border rounded-lg p-2 mt-1"
                      value={publishedDate}
                      onChange={(e) => setPublishedDate(e.target.value)}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Leave empty for today
                    </p>
                  </div>

                  {/* IMAGE */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Cover Image
                    </label>

                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center bg-gray-50 hover:border-purple-400 transition cursor-pointer">

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="edit-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          setImageFile(file)

                          if (file) {
                            setPreview(URL.createObjectURL(file))
                          }
                        }}
                      />

                      <label htmlFor="edit-upload" className="cursor-pointer block">
                        <p className="text-sm font-medium text-gray-700">
                          Click to upload image
                        </p>
                        <p className="text-xs text-gray-400">
                          PNG, JPG up to 5MB
                        </p>
                      </label>
                    </div>

                    {preview && (
                      <div className="mt-4 rounded-2xl overflow-hidden border bg-white shadow-sm">
                        <Image
                          src={preview}
                          alt="preview"
                          width={800}
                          height={400}
                          className="w-full h-[220px] object-cover"
                        />

                        <div className="p-3 flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            Preview image
                          </span>

                          <button
                            type="button"
                            onClick={() => {
                              setPreview(null)
                              setImageFile(null)
                            }}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-medium"
                  >
                    {loading ? 'Saving...' : 'Publish Article'}
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
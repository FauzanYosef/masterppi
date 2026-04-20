'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function EditArticleForm() {
  const router = useRouter()
  const params = useParams()

  const id = Number(params?.id)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  // ===== SLUG =====
  const slug = useMemo(() => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }, [title])

  // ===== FETCH DATA =====
  useEffect(() => {
    const fetchArticle = async () => {
      setFetching(true)

      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single()

      if (!error && data) {
        setTitle(data.title || '')
        setAuthor(data.author || '')
        setContent(data.content || '')
        setCategory(data.category || '')
        setPreview(data.cover_img || null)
      }

      setFetching(false)
    }

    if (id) fetchArticle()
  }, [id])

  // ===== UPLOAD IMAGE (SAMA CREATE) =====
  const uploadImage = async () => {
    if (!imageFile) return preview

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
      return preview
    }

    const { data } = supabase.storage
      .from('news')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  // ===== UPDATE =====
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const imageUrl = await uploadImage()

    const { error } = await supabase
      .from('articles')
      .update({
        title,
        author,
        content,
        category,
        cover_img: imageUrl,
        slug,
      })
      .eq('id', id)

    setLoading(false)

    if (error) {
      console.error(error)
      alert('Gagal update artikel')
    } else {
      router.push('/articles')
    }
  }

  if (fetching) {
    return (
      <div className="p-6 text-gray-500">
        Loading article...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 py-6">

        {/* HEADER + BACK BUTTON */}
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
                Edit Article
              </h1>
              <p className="text-gray-500 mt-1">
                Update your article content
              </p>
            </div>

          </div>
        </div>

        <form onSubmit={handleUpdate}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* LEFT */}
            <div className="lg:col-span-8 space-y-6">

              {/* TITLE */}
              <div className="bg-white rounded-2xl p-6 shadow">
                <h2 className="text-sm font-semibold text-gray-700 mb-2">
                  Article Title
                </h2>

                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-3xl font-semibold outline-none"
                />

                <p className="text-sm text-gray-500 mt-2">
                  /articles/{slug || 'slug'}
                </p>
              </div>

              {/* CONTENT */}
              <div className="bg-white rounded-2xl p-6 shadow">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">
                  Content
                </h2>

                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-[420px] resize-none outline-none"
                />
              </div>

            </div>

            {/* RIGHT */}
            <div className="lg:col-span-4 space-y-6">

              <div className="sticky top-6 space-y-6">

                <div className="bg-white rounded-2xl p-6 shadow space-y-5">

                  {/* AUTHOR */}
                  <div>
                    <label className="text-sm">Author</label>
                    <input
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full border rounded-lg p-2 mt-1"
                    />
                  </div>

                  {/* CATEGORY */}
                  <div>
                    <label className="text-sm">Category</label>
                    <input
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full border rounded-lg p-2 mt-1"
                    />
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

                  {/* BUTTON */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl"
                  >
                    {loading ? 'Updating...' : 'Update Article'}
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
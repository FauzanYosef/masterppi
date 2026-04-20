'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Article = {
  id: number
  title: string
  author: string
  cover_img: string | null
  category: string | null
  published_date: string | null
  slug: string
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  // ===== MODAL STATE =====
  const [showModal, setShowModal] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [deleting, setDeleting] = useState(false)

  // ===== FETCH =====
  const fetchArticles = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('published_date', { ascending: false })

    if (!error) setArticles(data || [])

    setLoading(false)
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  // ===== OPEN MODAL =====
  const openDeleteModal = (article: Article) => {
    setSelectedId(article.id)
    setSelectedArticle(article)
    setShowModal(true)
  }

  // ===== CLOSE MODAL =====
  const closeModal = () => {
    setShowModal(false)
    setSelectedId(null)
    setSelectedArticle(null)
  }

  // ===== DELETE (SUPABASE + STORAGE) =====
  const handleDelete = async () => {
    if (!selectedId) return

    setDeleting(true)

    try {
      // ambil cover image dulu
      const { data: article } = await supabase
        .from('articles')
        .select('cover_img')
        .eq('id', selectedId)
        .single()

      // hapus image dari storage
      if (article?.cover_img) {
        const path = article.cover_img.split('/storage/v1/object/public/news/')[1]

        if (path) {
          await supabase.storage
            .from('news')
            .remove([path])
        }
      }

      // hapus article
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', selectedId)

      if (error) {
        alert('Failed to delete article')
      } else {
        fetchArticles()
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
          <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
          <p className="text-gray-500 text-sm">Manage news & blog content</p>
        </div>

        <Link
          href="/articles/create"
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-xl shadow hover:opacity-90"
        >
          <Plus size={16} />
          New Article
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
                  <th className="text-left px-6 py-6">Article</th>
                  <th className="text-left">Category</th>
                  <th className="text-left">Date</th>
                  <th className="text-right px-8">Actions</th>
                </tr>
              </thead>

              <tbody>
                {articles.map((a) => (
                  <tr key={a.id} className="shadow-sm hover:bg-gray-50">

                    <td className="px-6 py-4 flex items-center gap-3">
                      {a.cover_img ? (
                        <Image
                          src={a.cover_img}
                          alt={a.title}
                          width={70}
                          height={50}
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-[70px] h-[50px] bg-gray-200 rounded-lg" />
                      )}

                      <div>
                        <p className="font-semibold line-clamp-1">{a.title}</p>
                        <p className="text-xs text-gray-400">{a.author}</p>
                      </div>
                    </td>

                    <td>
                      {a.category ? (
                        <span className="px-3 py-1 text-xs bg-purple-50 text-purple-600 rounded-full">
                          {a.category}
                        </span>
                      ) : '-'}
                    </td>

                    <td className="text-gray-500 text-sm">
                      {a.published_date
                        ? new Date(a.published_date).toLocaleDateString()
                        : '-'}
                    </td>

                    <td className="px-6">
                      <div className="flex justify-end gap-2">

                        <Link
                          href={`/articles/edit/${a.id}`}
                          className="p-2 hover:bg-blue-50 rounded-lg"
                        >
                          <Pencil size={16} className="text-blue-500" />
                        </Link>

                        {/* DELETE BUTTON */}
                        <button
                          onClick={() => openDeleteModal(a)}
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

      {/* ===== MODERN DELETE MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-[420px] rounded-2xl p-6 shadow-xl">

            <h2 className="text-lg font-semibold text-gray-900">
              Delete Article
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to delete this article? This action cannot be undone.
            </p>

            {selectedArticle && (
              <div className="mt-4 p-3 border rounded-xl flex gap-3 items-center">
                {selectedArticle.cover_img && (
                  <Image
                    src={selectedArticle.cover_img}
                    alt="cover"
                    width={60}
                    height={40}
                    className="rounded-md object-cover"
                  />
                )}

                <div>
                  <p className="text-sm font-semibold line-clamp-1">
                    {selectedArticle.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedArticle.author}
                  </p>
                </div>
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200"
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700"
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
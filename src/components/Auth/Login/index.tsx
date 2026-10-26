'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { apiFetch } from '../../../lib/api'

interface LoginResponse {
  success: boolean
  message: string
  token: string
  user: {
    id: number
    name: string
    username: string
    email: string
    avatar: string | null
    is_active: number
    last_login_at: string | null
    role: {
      id: number
      name: string
      description: string | null
    }
    scope: {
      faculty_id: number | null
      study_program_id: number | null
    }
  }
}

export default function LoginPage() {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError('')

    try {
      const response = await apiFetch<LoginResponse>(
        '/api/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({
            username,
            password,
          }),
        }
      )

      if (!response.success) {
        throw new Error(
          response.message || 'Login gagal'
        )
      }

      // ============================================================
      // SIMPAN TOKEN
      // ============================================================

      localStorage.setItem(
        'fisip_token',
        response.token
      )

      // ============================================================
      // SIMPAN USER
      // ============================================================

      localStorage.setItem(
        'fisip_user',
        JSON.stringify(response.user)
      )

      // ============================================================
      // REDIRECT
      // ============================================================

      router.push('/admin/dashboard')

    } catch (err) {

      console.error('Login error:', err)

      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Terjadi kesalahan saat login')
      }

    } finally {

      setLoading(false)

    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ============================================================
          LEFT IMAGE
      ============================================================ */}

      <div className="hidden md:flex w-[60%] relative">

        <img
          src="/images/banner/uin.jpg"
          alt="login"
          className="w-full h-full object-cover"
        />

        {/* Landing Page */}

        <Link
          href="/"
          className="fixed top-6 left-6 z-50 bg-white/80 backdrop-blur-md px-5 py-2 rounded-full text-sm font-semibold shadow-lg hover:bg-white hover:scale-105 active:scale-95 transition"
        >
          Landing Page
        </Link>

      </div>

      {/* ============================================================
          RIGHT FORM
      ============================================================ */}

      <div className="flex w-full md:w-[40%] items-center justify-center bg-gray-50 px-6 md:px-12 lg:px-16">

        <div className="w-full max-w-md">

          {/* ========================================================
              TITLE
          ======================================================== */}

          <div className="mb-6">

            <h1 className="text-3xl font-bold text-gray-800">
              Login Admin
            </h1>

            <p className="text-gray-500 text-sm">
              Masuk ke dashboard pengelolaan website
            </p>

          </div>

          {/* ========================================================
              ERROR
          ======================================================== */}

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* ========================================================
              FORM
          ======================================================== */}

          <form
            onSubmit={handleLogin}
            className="space-y-4"
          >

            {/* Username */}

            <div>

              <label className="text-sm text-gray-600">
                Username
              </label>

              <input
                type="text"
                autoComplete="username"
                className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                required
              />

            </div>

            {/* Password */}

            <div>

              <label className="text-sm text-gray-600">
                Password
              </label>

              <input
                type="password"
                autoComplete="current-password"
                className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

            </div>

            {/* Submit */}

            <button
              type="submit"
              className="px-12 py-3 font-medium text-white border rounded-lg border-primary bg-primary hover:bg-transparent hover:text-primary transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >

              <span className="flex items-center justify-center gap-2">

                {loading && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}

                {loading
                  ? 'Memproses...'
                  : 'Masuk'}

              </span>

            </button>

          </form>

        </div>

      </div>

    </div>
  )
}
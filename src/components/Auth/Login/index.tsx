'use client'

import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/')
  }
return (
  <div className="min-h-screen flex">
    
    {/* LEFT IMAGE */}
    <div className="hidden md:flex w-[60%] relative">
      <img
        src="/images/banner/uin.jpg" // taruh gambar di public/images
        alt="login"
        className="w-full h-full object-cover"
      />

      {/* Label */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 bg-white/80 backdrop-blur-md px-5 py-2 rounded-full text-sm font-semibold shadow-lg hover:bg-white hover:scale-105 active:scale-95 transition"
      >
        Dashboard
      </Link>
    </div>

    {/* RIGHT FORM */}
    <div className="flex w-full md:w-[40%] items-center justify-center bg-gray-50 px-6 md:px-12 lg:px-16">
      <div className="w-full max-w-md">
        
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Login Admin
          </h1>
          <p className="text-gray-500 text-sm">
            Masuk ke dashboard pengelolaan artikel
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

         <button
            type="submit"
            className="px-12 py-3 font-medium text-white border rounded-lg border-primary bg-primary hover:bg-transparent hover:text-primary transition-all duration-300 active:scale-95"
            disabled={loading}
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        {/* Footer */}
        {/* <p className="text-center text-sm text-gray-500 mt-6">
          Belum punya akun?{' '}
          <span className="text-primary-600 cursor-pointer hover:underline">
            Daftar sekarang
          </span>
        </p> */}
      </div>
    </div>
  </div>
)
}
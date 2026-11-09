import { apiFetch } from '@/lib/api'

export type HomeSection = {
  id?: number
  title: string | null
  subtitle: string | null
  description: string | null
  image: string | null
  video_url?: string | null
  button_1_text?: string | null
  button_1_url?: string | null
  button_2_text?: string | null
  button_2_url?: string | null
}

type HomeResponse = {
  success: boolean
  data?: Record<string, HomeSection | undefined>
}

let pending: Promise<HomeResponse['data'] | null> | null = null

/**
 * Data beranda (/api/home) dipakai beberapa section sekaligus (Hero, Sambutan, Sejarah).
 * Satu permintaan dibagi bersama; bila gagal, permintaan berikutnya mencoba lagi.
 */
export function getHomeData() {
  if (!pending) {
    pending = apiFetch<HomeResponse>('/api/home')
      .then((res) => {
        if (!res.success) throw new Error('API gagal mengambil data halaman utama')
        return res.data ?? null
      })
      .catch((error) => {
        pending = null
        console.error('Error fetching home:', error)
        return null
      })
  }
  return pending
}

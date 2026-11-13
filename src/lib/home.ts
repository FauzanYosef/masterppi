import { apiFetch } from '@/lib/api'
import { DEFAULT_LOCALE, type Locale } from '@/i18n/config'

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

const pending = new Map<Locale, Promise<HomeResponse['data'] | null>>()

/**
 * Data beranda (/api/home) dipakai beberapa section sekaligus (Hero, Sambutan, Sejarah).
 * Satu permintaan per bahasa dibagi bersama; bila gagal, permintaan berikutnya mencoba lagi.
 */
export function getHomeData(lang: Locale = DEFAULT_LOCALE) {
  let request = pending.get(lang)
  if (!request) {
    request = apiFetch<HomeResponse>('/api/home', { lang })
      .then((res) => {
        if (!res.success) throw new Error('API gagal mengambil data halaman utama')
        return res.data ?? null
      })
      .catch((error) => {
        pending.delete(lang)
        console.error('Error fetching home:', error)
        return null
      })
    pending.set(lang, request)
  }
  return request
}

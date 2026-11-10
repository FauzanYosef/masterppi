import { apiFetch } from '@/lib/api'

type SiteSettingsResponse = {
  success: boolean
  data?: Record<string, string | null | undefined>
}

export type SiteIdentity = { logo: string | null; favicon: string | null }

let pending: Promise<SiteIdentity> | null = null

/** Path media dari API (mis. /storage/media/...) → URL absolut; URL penuh dibiarkan. */
export function mediaUrl(path?: string | null): string | null {
  const value = (path ?? '').trim()
  if (!value) return null
  if (/^(https?:|data:)/i.test(value)) return value
  const base = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/api\/?$/, '').replace(/\/+$/, '')
  if (!base) return null
  return `${base}${value.startsWith('/') ? value : `/${value}`}`
}

/**
 * Logo & favicon program dari CMS (Pengaturan Website), satu permintaan dibagi bersama.
 * Gagal/kosong → null; pemanggil memakai gambar bawaan.
 */
export function getSiteIdentity(): Promise<SiteIdentity> {
  if (!pending) {
    pending = apiFetch<SiteSettingsResponse>('/api/site-settings')
      .then((res) => ({
        logo: mediaUrl(res.data?.['site.logo']),
        favicon: mediaUrl(res.data?.['site.favicon']),
      }))
      .catch(() => {
        pending = null
        return { logo: null, favicon: null }
      })
  }
  return pending
}

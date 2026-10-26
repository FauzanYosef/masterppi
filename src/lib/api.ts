const API_URL = process.env.NEXT_PUBLIC_API_URL
const SITE_DOMAIN = process.env.NEXT_PUBLIC_SITE_DOMAIN

interface ApiOptions extends RequestInit {
  headers?: HeadersInit
  /** Dipertahankan agar pemanggil lama tetap valid; website publik tidak mengirim token. */
  auth?: boolean
}

export async function apiFetch<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured')
  }

  if (!SITE_DOMAIN) {
    throw new Error('NEXT_PUBLIC_SITE_DOMAIN is not configured')
  }

  // `auth` hanya penanda lama; website publik tidak pernah mengirim token.
  const {
    auth,
    headers: customHeaders,
    ...fetchOptions
  } = options
  void auth

  // ============================================================
  // HEADERS
  // ============================================================

  const headers = new Headers(customHeaders)

  headers.set('X-Site-Domain', SITE_DOMAIN)

  // Website publik hanya memakai endpoint publik: tidak pernah mengirim token.
  headers.delete('Authorization')

  // ============================================================
  // CONTENT TYPE
  // ============================================================

  const isFormData =
    typeof FormData !== 'undefined' &&
    fetchOptions.body instanceof FormData

  const isURLSearchParams =
    typeof URLSearchParams !== 'undefined' &&
    fetchOptions.body instanceof URLSearchParams

  if (
    fetchOptions.body !== undefined &&
    fetchOptions.body !== null &&
    !isFormData &&
    !isURLSearchParams &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json')
  }

  // ============================================================
  // REQUEST URL
  // ============================================================

  const baseUrl = API_URL.replace(/\/+$/, '')

  const normalizedEndpoint = endpoint.startsWith('/')
    ? endpoint
    : `/${endpoint}`

  // ============================================================
  // FETCH
  // ============================================================

  let response: Response

  try {
    response = await fetch(`${baseUrl}${normalizedEndpoint}`, {
      ...fetchOptions,
      headers,
    })
  } catch (error) {
    console.error('API network error:', error)

    throw new Error(
      'Tidak dapat terhubung ke server API. Periksa URL API dan koneksi jaringan.',
    )
  }

  // ============================================================
  // PARSE RESPONSE
  // ============================================================

  const contentType = response.headers.get('content-type') || ''

  let data: unknown

  if (contentType.includes('application/json')) {
    data = await response.json()
  } else {
    data = await response.text()
  }

  // ============================================================
  // ERROR HANDLING
  // ============================================================

  if (!response.ok) {
    console.error('API request failed:', {
      endpoint: normalizedEndpoint,
      status: response.status,
      response: data,
    })

    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof data.message === 'string'
        ? data.message
        : null

    throw new Error(message || `API Error ${response.status}`)
  }

  return data as T
}

// ============================================================
// IMAGE URL
// ============================================================

export function getImageUrl(
  imagePath: string | null | undefined,
): string {
  const fallback = '/images/dosen/kaprodi.png'

  if (!imagePath?.trim()) {
    return fallback
  }

  const path = imagePath.trim()

  // URL lengkap, misalnya CDN atau domain penyimpanan.
  if (/^https?:\/\//i.test(path)) {
    return path
  }

  if (!API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured')
  }

  const baseUrl = API_URL.replace(/\/+$/, '')
  const normalizedPath = path.startsWith('/')
    ? path
    : `/${path}`

  return `${baseUrl}${normalizedPath}`
}
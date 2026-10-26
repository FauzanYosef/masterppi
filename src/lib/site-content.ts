/**
 * Konten website yang dikelola dari CMS (fisip-admin) lewat fisip-api.
 * Setiap fungsi punya cadangan bawaan agar website tetap tampil bila API gagal
 * atau data belum diisi.
 */
import { apiFetch } from '@/lib/api'
import type { NavLinkType } from '@/app/(main)/types/navlink'
import type { FooterLinkType } from '@/app/(main)/types/footerlinks'

/* -------------------------------------------------------------------------- */
/*                                    Teks                                    */
/* -------------------------------------------------------------------------- */

/**
 * Teks dari database bisa berupa HTML (editor CMS) atau teks biasa (data lama).
 * Teks biasa diubah menjadi paragraf: baris kosong = paragraf baru, baris baru = <br>.
 */
export function toHtml(value: string | null | undefined): string {
  if (!value) return ''
  if (/<\/?(p|br|div|h[1-6]|ul|ol|li|strong|em|b|i|u|a|span|blockquote|img|table)\b/i.test(value)) return value
  const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escape(paragraph).replace(/\n/g, '<br>')}</p>`)
    .join('')
}

/* -------------------------------------------------------------------------- */
/*                                  Navigasi                                  */
/* -------------------------------------------------------------------------- */

/** Menu bawaan (dipakai bila menu di CMS kosong atau API tidak terjangkau). */
export const DEFAULT_NAVIGATION: NavLinkType[] = [
  { label: 'Beranda', href: '/' },
  {
    label: 'Tentang Program',
    href: '/profil',
    submenu: [
      { label: 'Sejarah Program', href: '/profil/sejarah' },
      { label: 'Apa Itu Magister PPI', href: '/profil/program' },
      { label: 'Profil Lulusan', href: '/profil/lulusan' },
      { label: 'Dosen', href: '/profil/dosen' },
      { label: 'Struktur Organisasi', href: '/profil/organisasi' },
      { label: 'Fasilitas', href: '/profil/fasilitas' },
      { label: 'Kontak Kami', href: '/profil/kontak' },
    ],
  },
  {
    label: 'Akademik dan Admisi',
    href: '/akademik',
    submenu: [
      { label: 'Kurikulum', href: '/akademik/kurikulum' },
      { label: 'Kalender Akademik', href: '/akademik/kalender' },
      { label: 'Mata Kuliah', href: '/akademik/matkul' },
      { label: 'Panduan Akademik', href: '/akademik/panduan' },
      { label: 'Kegiatan Akademik', href: '/akademik/kegiatan' },
      { label: 'Admisi Pendidikan', href: '/akademik/admisi' },
    ],
  },
  { label: 'Berita', href: '/berita' },
]

interface NavigationRow {
  id: number
  parent_id: number | null
  location: string
  label: string
  url: string | null
  sort_order: number | null
}

/** Menu header dari CMS (Website → Navigasi). */
export async function getNavigation(): Promise<NavLinkType[]> {
  try {
    const res = await apiFetch<{ data?: NavigationRow[] }>('/api/navigation?limit=200', { auth: false })
    const rows = (res.data ?? [])
      .filter((row) => row.location === 'header')
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    if (rows.length === 0) return DEFAULT_NAVIGATION

    return rows
      .filter((row) => row.parent_id === null)
      .map((parent) => {
        const children = rows.filter((row) => row.parent_id === parent.id)
        return {
          label: parent.label,
          href: parent.url || '#',
          ...(children.length > 0
            ? { submenu: children.map((child) => ({ label: child.label, href: child.url || '#' })) }
            : {}),
        }
      })
  } catch {
    return DEFAULT_NAVIGATION
  }
}

/** Kolom link footer: setiap menu yang punya submenu menjadi satu kolom. */
export function toFooterLinks(navigation: NavLinkType[]): FooterLinkType[] {
  return navigation
    .filter((item) => item.submenu && item.submenu.length > 0)
    .map((item) => ({ section: item.label, links: item.submenu ?? [] }))
}

/* -------------------------------------------------------------------------- */
/*                                   Halaman                                  */
/* -------------------------------------------------------------------------- */

export interface PageContent {
  title: string
  content: string
}

interface PageRow {
  slug: string
  title: string
  content: string | null
  template: string | null
}

export interface PageLookup {
  /** Template halaman profil yang dibuat CMS (Profil → Sejarah, dll.), mis. "profile:history". */
  template?: string
  /** Slug yang dicari. Slug unik di semua website, jadi bisa berakhiran "-2", "-3", dst. */
  slugs: readonly string[]
}

/**
 * Halaman milik website ini dari CMS (daftar /api/pages sudah dibatasi per website).
 * null = halaman belum dibuat/dipublikasikan.
 */
export async function getPage(lookup: PageLookup): Promise<PageContent | null> {
  try {
    const res = await apiFetch<{ data?: PageRow[] }>('/api/pages?limit=200', { auth: false })
    const pages = res.data ?? []
    const slugPattern = new RegExp(`^(${lookup.slugs.map((s) => s.replace(/[^a-z0-9-]/g, '')).join('|')})(-\\d+)?$`)
    const page =
      (lookup.template && pages.find((p) => p.template === lookup.template)) ||
      pages.find((p) => slugPattern.test(p.slug))
    return page ? { title: page.title, content: page.content ?? '' } : null
  } catch {
    return null
  }
}

/** Halaman profil Magister PPI: Sejarah & Visi Misi lewat CMS Profil, Program & Lulusan lewat CMS Halaman. */
export const PROFILE_PAGES = {
  sejarah: { template: 'profile:history', slugs: ['sejarah', 'sejarah-program'] },
  visi: { template: 'profile:vision_mission', slugs: ['visi-misi', 'visi-dan-misi'] },
  program: { slugs: ['program', 'apa-itu-magister-ppi', 'profil-program'] },
  fasilitas: { slugs: ['fasilitas'] },
  lulusan: { slugs: ['profil-lulusan', 'lulusan'] },
} as const satisfies Record<string, PageLookup>

/** Section beranda prodi (CMS: Settings → Homepage), mis. "sejarah". */
export async function getHomeSection(key: string): Promise<PageContent | null> {
  try {
    const res = await apiFetch<{ data?: Record<string, { title?: string | null; description?: string | null } | null> }>(
      '/api/home',
      { auth: false },
    )
    const section = res.data?.[key]
    return section?.description ? { title: section.title ?? '', content: toHtml(section.description) } : null
  } catch {
    return null
  }
}

/**
 * Sejarah prodi: halaman Profil → Sejarah di CMS bila ada, selain itu teks section
 * "Sejarah" di beranda (yang sudah tersimpan untuk prodi ini).
 */
export async function getHistory(): Promise<PageContent | null> {
  return (await getPage(PROFILE_PAGES.sejarah)) ?? getHomeSection('sejarah')
}

/* -------------------------------------------------------------------------- */
/*                          Kontak & media sosial                             */
/* -------------------------------------------------------------------------- */

export interface ContactInfo {
  email: string | null
  phone: string | null
  whatsapp: string | null
  address: string | null
  mapUrl: string | null
}

/** Kontak website ini (CMS: Pengaturan Website → Kontak & Lokasi). */
export async function getContactInfo(): Promise<ContactInfo | null> {
  try {
    const res = await apiFetch<{
      data?: { email?: string | null; phone?: string | null; whatsapp?: string | null; address?: string | null; map_url?: string | null }
    }>('/api/contact-info', { auth: false })
    const d = res.data
    if (!d) return null
    return {
      email: d.email ?? null,
      phone: d.phone ?? null,
      whatsapp: d.whatsapp ?? null,
      address: d.address ?? null,
      mapUrl: d.map_url ?? null,
    }
  } catch {
    return null
  }
}

export interface SocialLink {
  platform: string
  url: string
}

/** Media sosial website ini (CMS: Pengaturan Website → Social Media). */
export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const res = await apiFetch<{ data?: { platform: string; url: string }[] }>('/api/social-links', { auth: false })
    return (res.data ?? []).filter((link) => link.url).map((link) => ({ platform: link.platform.toLowerCase(), url: link.url }))
  } catch {
    return []
  }
}

/* -------------------------------------------------------------------------- */
/*                                 Penerimaan                                 */
/* -------------------------------------------------------------------------- */

export interface AdmissionFile {
  title: string
  url: string
  isImage: boolean
}

export interface Admission {
  title: string
  academicYear: string | null
  registrationUrl: string | null
  registrationStart: string | null
  registrationEnd: string | null
  description: string | null
  files: AdmissionFile[]
}

interface AdmissionRow {
  id: number
  title: string
  academic_year: string | null
  registration_url: string | null
  registration_start: string | null
  registration_end: string | null
  description: string | null
  is_active: boolean
}

interface AdmissionFileRow {
  admission_id: number
  title: string
  file_path: string
  file_type: string | null
  sort_order: number | null
  is_active: boolean
}

/** true bila file bisa diakses (dokumen yang hilang di storage tidak ditampilkan sebagai tautan rusak). */
async function isReachable(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(4000) })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Gelombang penerimaan yang sedang/berikutnya dibuka (CMS: Akademik → Penerimaan).
 * null = belum ada data aktif.
 */
export async function getCurrentAdmission(
  toUrl: (path: string) => string,
  options: { withFiles?: boolean } = {},
): Promise<Admission | null> {
  const withFiles = options.withFiles ?? true
  try {
    const [admissions, files] = await Promise.all([
      apiFetch<{ data?: AdmissionRow[] }>('/api/admissions?limit=50', { auth: false }),
      withFiles
        ? apiFetch<{ data?: AdmissionFileRow[] }>('/api/admission-files?limit=100', { auth: false }).catch(() => ({
            data: [] as AdmissionFileRow[],
          }))
        : Promise.resolve({ data: [] as AdmissionFileRow[] }),
    ])

    const today = new Date().toISOString().slice(0, 10)
    const active = (admissions.data ?? []).filter((a) => a.is_active)
    // Utamakan gelombang yang belum ditutup, yang paling awal dibuka.
    const upcoming = active
      .filter((a) => !a.registration_end || a.registration_end.slice(0, 10) >= today)
      .sort((a, b) => (a.registration_start ?? '').localeCompare(b.registration_start ?? ''))
    const latest = [...active].sort((a, b) => (b.registration_start ?? '').localeCompare(a.registration_start ?? ''))
    const admission = upcoming[0] ?? latest[0]
    if (!admission) return null

    const candidates = (files.data ?? [])
      .filter((f) => f.admission_id === admission.id && f.is_active)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((f) => ({
        title: f.title,
        url: toUrl(f.file_path),
        isImage: (f.file_type ?? '').startsWith('image/'),
      }))
    const reachable = await Promise.all(candidates.map((file) => isReachable(file.url)))

    return {
      title: admission.title,
      academicYear: admission.academic_year,
      registrationUrl: admission.registration_url,
      registrationStart: admission.registration_start,
      registrationEnd: admission.registration_end,
      description: admission.description,
      files: candidates.filter((_, index) => reachable[index]),
    }
  } catch {
    return null
  }
}

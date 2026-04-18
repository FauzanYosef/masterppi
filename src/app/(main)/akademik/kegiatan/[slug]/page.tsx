import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

type Props = {
  params: { slug: string }
}

// ===== TYPE DETAIL =====
type Event = {
  id: number
  title: string
  slug: string
  description?: string
  content?: string
  category?: string
  start_date?: string
  end_date?: string
  cover_img?: string
  location?: string
  status?: string
}

// ===== TYPE CARD =====
type EventCard = {
  id: number
  title: string
  slug: string
  cover_img?: string
  category?: string
}

// ===== GALLERY =====
type Gallery = {
  id: number
  event_id: number
  image_url: string
  caption?: string
}

// ================= STATIC PARAMS =================
export async function generateStaticParams() {
  try {
    const { data } = await supabase.from('events').select('slug')
    return data?.map((item) => ({ slug: item.slug })) || []
  } catch {
    return []
  }
}

// ================= SEO =================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await supabase
    .from('events')
    .select('title, description')
    .eq('slug', params.slug)
    .maybeSingle()

  return {
    title: data?.title || 'Detail Kegiatan',
    description: data?.description?.slice(0, 150) || '',
  }
}

// ================= FORMAT =================
const formatTanggal = (date?: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// ================= PAGE =================
const DetailEvent = async ({ params }: Props) => {
  // ===== DETAIL =====
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', params.slug)
    .maybeSingle()

  if (error || !data) return notFound()

  // ===== RELATED =====
  const { data: relatedData } = await supabase
    .from('events')
    .select('id, title, slug, cover_img')
    .eq('category', data.category)
    .neq('slug', params.slug)
    .limit(3)

  const related: EventCard[] = relatedData ?? []

  // ===== LATEST =====
  const { data: latestData } = await supabase
    .from('events')
    .select('id, title, slug, cover_img, category')
    .order('start_date', { ascending: false })
    .limit(5)

  const latest: EventCard[] = latestData ?? []

  // ===== GALLERY =====
  const { data: galleryData } = await supabase
    .from('event_galleries')
    .select('id, event_id, image_url, caption')
    .eq('event_id', data.id)

  const gallery: Gallery[] = galleryData ?? []

  return (
    <>
      {/* HERO */}
      <div className="container mb-16 pt-[140px]">
        <div className="relative overflow-hidden rounded-2xl shadow-lg">
          <Image
            src="/images/banner/uin.jpg"
            alt="Banner"
            width={1400}
            height={500}
            className="h-[320px] w-full object-cover md:h-[420px]"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 px-4 text-center text-white">
            <h1 className="text-3xl font-bold md:text-4xl">
              Detail Kegiatan
            </h1>

            <div className="mt-3 flex gap-2 text-sm">
              <Link href="/">Home</Link>
              <span>›</span>
              <Link href="/akademik/kegiatan">Kegiatan</Link>
              <span>›</span>
              <span className="font-medium">{data.title}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="pb-[100px] dark:bg-darklight">
        <div className="container grid gap-10 lg:grid-cols-3">

          {/* MAIN */}
          <div className="space-y-6 lg:col-span-2">

            {/* META */}
            <div className="flex flex-wrap justify-between gap-2 text-sm">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">
                {data.category || 'Umum'}
              </span>

              <span className="text-gray-500">
                📅 {formatTanggal(data.start_date)}
              </span>
            </div>

            {/* TITLE */}
            <h1 className="text-3xl font-bold leading-snug md:text-4xl">
              {data.title}
            </h1>

            {/* INFO */}
            <p className="text-sm text-gray-500">
              📍 {data.location || '-'} • Status: {data.status || 'upcoming'}
            </p>

            {/* COVER */}
            <div className="relative h-[420px] w-full overflow-hidden rounded-xl">
              <Image
                src={data.cover_img || '/images/default-news.jpg'}
                alt={data.title}
                fill
                className="object-cover"
              />
            </div>

            {/* CONTENT */}
            <div
              className="prose max-w-none text-[17px] leading-relaxed text-justify dark:prose-invert"
              dangerouslySetInnerHTML={{
                __html: data.content || '',
              }}
            />

            {/* ===== GALLERY MASONRY + OPEN TAB ===== */}
            {gallery.length > 0 && (
              <div className="pt-10 space-y-6">
                <div className="space-y-3">
                    <div className="h-1 w-12 rounded bg-primary"></div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Galeri Kegiatan
                    </h3>

                    <p className="text-sm text-gray-500">
                        Dokumentasi visual kegiatan yang telah dilaksanakan
                    </p>
                </div>

                <div className="columns-1 sm:columns-2 md:columns-3 gap-5 space-y-5">
                  {gallery.map((img) => (
                    <a
                      key={img.id}
                      href={img.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block cursor-zoom-in break-inside-avoid overflow-hidden rounded-2xl hover:shadow-xl transition"
                    >
                      <Image
                        src={img.image_url}
                        alt={img.caption || 'gallery'}
                        width={600}
                        height={400}
                        className="h-auto w-full object-cover transition duration-500 group-hover:scale-110"
                      />

                      {img.caption && (
                        <div className="absolute inset-0 flex items-end bg-black/40 opacity-0 transition duration-300 group-hover:opacity-100">
                          <p className="p-4 text-sm text-white line-clamp-3">
                            {img.caption}
                          </p>
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* RELATED */}
            {related.length > 0 && (
              <div className="pt-10 space-y-4">
                <h3 className="text-xl font-bold">Kegiatan Terkait</h3>

                <div className="grid gap-6 md:grid-cols-3">
                  {related.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/akademik/kegiatan/${item.slug}`}
                    >
                      <div className="group cursor-pointer">
                        <div className="relative h-40 overflow-hidden rounded-lg">
                          <Image
                            src={item.cover_img || '/images/default-news.jpg'}
                            alt={item.title}
                            fill
                            className="object-cover transition group-hover:scale-110"
                          />
                        </div>

                        <p className="mt-2 text-sm font-medium group-hover:text-primary">
                          {item.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <div className="rounded-xl bg-white p-5 shadow dark:bg-dark">
              <h3 className="mb-4 font-bold text-primary">
                🔥 Kegiatan Terbaru
              </h3>

              <div className="space-y-4">
                {latest.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/akademik/kegiatan/${item.slug}`}
                  >
                    <div className="group flex gap-4 rounded-lg p-2 transition hover:bg-gray-50 dark:hover:bg-dark">

                      <div className="relative h-16 w-20 overflow-hidden rounded-lg">
                        <Image
                          src={item.cover_img || '/images/default-news.jpg'}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div>
                        <span className="text-xs text-primary">
                          {item.category}
                        </span>

                        <p className="text-sm font-medium group-hover:text-primary">
                          {item.title}
                        </p>
                      </div>

                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default DetailEvent
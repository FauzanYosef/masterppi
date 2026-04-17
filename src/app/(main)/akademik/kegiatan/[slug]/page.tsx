import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

type Props = {
  params: { slug: string }
}

type Event = {
  title: string
  slug: string
  description?: string
  category?: string
  start_date?: string
  end_date?: string
  cover_img?: string
  location?: string
  status?: string
}

type Gallery = {
  image_url: string
}

// ================= STATIC PARAMS =================
export async function generateStaticParams() {
  try {
    const { data } = await supabase.from('events').select('slug')
    if (!data) return []
    return data.map((item) => ({ slug: item.slug }))
  } catch {
    return []
  }
}

// ================= SEO =================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await supabase
    .from('events')
    .select('title, description, cover_img')
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
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', params.slug)
    .maybeSingle()

  if (error || !data) return notFound()

  const { data: relatedData } = await supabase
    .from('events')
    .select('title, slug, cover_img')
    .eq('category', data.category)
    .neq('slug', params.slug)
    .limit(3)

  const related: Event[] = relatedData ?? []

  const { data: latestData } = await supabase
    .from('events')
    .select('title, slug, cover_img, category')
    .order('start_date', { ascending: false })
    .limit(5)

  const latest: Event[] = latestData ?? []

  const { data: galleryData } = await supabase
    .from('event_galleries')
    .select('image_url')
    .eq('event_slug', params.slug)

  const gallery: Gallery[] = galleryData ?? []

  return (
    <>
      {/* HERO */}
      <div className="container mb-16 pt-[140px]">
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="/images/banner/uin.jpg"
            alt="Banner"
            width={1400}
            height={500}
            className="w-full h-[320px] md:h-[420px] object-cover"
          />

          <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-white text-center px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Detail Kegiatan
            </h1>

            <div className="flex gap-2 mt-3 text-sm">
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
        <div className="container grid lg:grid-cols-3 gap-10">

          {/* MAIN */}
          <div className="lg:col-span-2 space-y-6">

            {/* META (STYLE BERITA) */}
            <div className="flex justify-between text-sm flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {data.category || 'Umum'}
              </span>

              <span className="text-gray-500">
                📅 {formatTanggal(data.start_date)}
              </span>
            </div>

            {/* TITLE */}
            <h1 className="text-3xl md:text-4xl font-bold leading-snug">
              {data.title}
            </h1>

            {/* INFO TAMBAHAN */}
            <p className="text-sm text-gray-500">
              📍 {data.location || '-'} • Status: {data.status || 'upcoming'}
            </p>

            {/* COVER */}
            <div className="relative w-full h-[420px] rounded-xl overflow-hidden">
              <Image
                src={data.cover_img || '/images/default-news.jpg'}
                alt={data.title}
                fill
                className="object-cover"
              />
            </div>

            {/* CONTENT */}
            <div
              className="prose max-w-none dark:prose-invert text-justify leading-relaxed text-[17px]"
              dangerouslySetInnerHTML={{
                __html: data.content || '',
              }}
            />

            {/* GALLERY */}
            {gallery.length > 0 && (
              <div className="pt-10 space-y-4">
                <h3 className="text-xl font-bold">Galeri Kegiatan</h3>

                <div className="grid md:grid-cols-3 gap-4">
                  {gallery.map((img, i) => (
                    <div
                      key={i}
                      className="relative h-40 rounded-lg overflow-hidden"
                    >
                      <Image
                        src={img.image_url}
                        alt="gallery"
                        fill
                        className="object-cover hover:scale-110 transition"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RELATED */}
            {related.length > 0 && (
              <div className="pt-10 space-y-4">
                <h3 className="text-xl font-bold">Kegiatan Terkait</h3>

                <div className="grid md:grid-cols-3 gap-6">
                  {related.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/akademik/kegiatan/${item.slug}`}
                    >
                      <div className="group cursor-pointer">
                        <div className="relative h-40 rounded-lg overflow-hidden">
                          <Image
                            src={item.cover_img || '/images/default-news.jpg'}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-110 transition"
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

          {/* SIDEBAR (STYLE BERITA) */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-dark rounded-xl shadow p-5">
              <h3 className="font-bold mb-4 text-primary">
                🔥 Kegiatan Terbaru
              </h3>

              <div className="space-y-4">
                {latest.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/akademik/kegiatan/${item.slug}`}
                  >
                    <div className="flex gap-4 group hover:bg-gray-50 dark:hover:bg-dark p-2 rounded-lg transition">

                      <div className="relative w-20 h-16 rounded-lg overflow-hidden">
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
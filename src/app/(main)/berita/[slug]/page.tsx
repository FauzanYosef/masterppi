import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// ✅ WAJIB: supaya tidak dipaksa static saat build
export const dynamic = 'force-dynamic'

// ✅ FIX: params = Promise
type Props = {
  params: Promise<{ slug: string }>
}

type Article = {
  title: string
  slug: string
  author?: string | null
  content?: string | null
  category?: string | null
  published_date?: string | null
  cover_img?: string | null
}

// ================= REVALIDATE =================
export const revalidate = 60

// ================= FORMAT =================
const formatTanggal = (dateString?: string | null) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const formatJam = (dateString?: string | null) => {
  if (!dateString) return ''
  return (
    new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB'
  )
}

// ================= STATIC PARAMS =================
export async function generateStaticParams() {
  try {
    const { data } = await supabase
      .from('articles')
      .select('slug')

    if (!data) return []

    return data
      .filter((item) => item.slug)
      .map((item) => ({
        slug: item.slug,
      }))
  } catch (err) {
    console.error('STATIC PARAM ERROR:', err)
    return []
  }
}

// ================= SEO =================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  try {
    const { data } = await supabase
      .from('articles')
      .select('title, content, cover_img')
      .eq('slug', slug)
      .maybeSingle()

    return {
      title: data?.title || 'Detail Berita',
      description: data?.content
        ? data.content.replace(/<[^>]+>/g, '').slice(0, 150)
        : 'Detail berita',
      openGraph: {
        images: data?.cover_img ? [data.cover_img] : [],
      },
    }
  } catch {
    return {
      title: 'Detail Berita',
    }
  }
}

// ================= PAGE =================
const DetailBerita = async ({ params }: Props) => {
  // ✅ ambil slug dari Promise
  const { slug } = await params

  // ================= MAIN =================
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error || !data) return notFound()

  // ================= RELATED =================
  const { data: relatedData } = await supabase
    .from('articles')
    .select('title, slug, cover_img')
    .eq('category', data.category)
    .neq('slug', slug)
    .limit(3)

  const related: Article[] = relatedData ?? []

  // ================= LATEST =================
  const { data: latestData } = await supabase
    .from('articles')
    .select('title, slug, cover_img, category')
    .order('published_date', { ascending: false })
    .limit(5)

  const latest: Article[] = latestData ?? []

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
            className="w-full h-[300px] md:h-[400px] object-cover"
          />

          <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Detail Berita
            </h1>

            <div className="flex gap-2 text-sm text-white/80 mt-3">
              <Link href="/">Home</Link>
              <span>›</span>
              <Link href="/berita">Berita</Link>
              <span>›</span>
              <span className="text-white font-medium">
                {data.title}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="pb-[100px] dark:bg-darklight">
        <div className="container grid lg:grid-cols-3 gap-10">

          {/* MAIN */}
          <div className="lg:col-span-2 space-y-6">

            <div className="flex justify-between text-sm flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {data.category || 'Umum'}
              </span>

              <span className="text-gray-500">
                📅 {formatTanggal(data.published_date)}
                {data.published_date && (
                  <> • {formatJam(data.published_date)}</>
                )}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold">
              {data.title}
            </h1>

            <p className="text-sm text-gray-500">
              ✍️ Oleh {data.author || 'Admin'}
            </p>

            <div className="relative w-full h-[420px] rounded-xl overflow-hidden">
              <Image
                src={data.cover_img || '/images/default-news.jpg'}
                alt={data.title}
                fill
                className="object-cover"
              />
            </div>

            <div
              className="prose max-w-none dark:prose-invert text-justify leading-relaxed text-[17px]"
              dangerouslySetInnerHTML={{
                __html: data.content || '',
              }}
            />

            {/* RELATED */}
            {related.length > 0 && (
              <div className="pt-10 space-y-4">
                <h3 className="text-xl font-bold">Berita Terkait</h3>

                <div className="grid md:grid-cols-3 gap-6">
                  {related.map((item) => (
                    <Link key={item.slug} href={`/berita/${item.slug}`}>
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

          {/* SIDEBAR */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-dark rounded-xl shadow p-5">
              <h3 className="font-bold mb-4 text-primary">
                🔥 Berita Terbaru
              </h3>

              <div className="space-y-4">
                {latest.map((item) => (
                  <Link key={item.slug} href={`/berita/${item.slug}`}>
                    <div className="flex gap-4 group hover:bg-gray-50 dark:hover:bg-dark p-2 rounded-lg transition">

                      <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.cover_img || '/images/default-news.jpg'}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div>
                        <span className="text-xs text-primary font-medium">
                          {item.category || 'Umum'}
                        </span>

                        <p className="text-sm font-medium leading-snug group-hover:text-primary">
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

export default DetailBerita
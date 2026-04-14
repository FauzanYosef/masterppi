'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getImgPath } from '@/app/(main)/utils/paths'
import { supabase } from '@/lib/supabase'

import Ontologi from './ontologi'
import Epistemologi from './epistemologi'
import Aksiologi from './aksiologi'

type MenuType = 'ontologi' | 'epistemologi' | 'aksiologi'

const menuItems: { key: MenuType; label: string }[] = [
  { key: 'ontologi', label: 'Perspektif Ontologis' },
  { key: 'epistemologi', label: 'Perspektif Epistemologis' },
  { key: 'aksiologi', label: 'Perspektif Aksiologis' },
]

const contentMap: Record<MenuType, React.ReactNode> = {
  ontologi: <Ontologi />,
  epistemologi: <Epistemologi />,
  aksiologi: <Aksiologi />,
}

const SejarahPage = () => {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)

  const [activeMenu, setActiveMenu] = useState<MenuType>('ontologi')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from('profile') // ✅ ganti ke profile
        .select('content')
        .eq('key', 'sejarah_content') // bebas, sesuai isi DB kamu
        .single()

      if (error) {
        console.error('Supabase error:', error)
      }

      if (data) {
        setContent(data.content)
      }

      setLoading(false)
    }

    fetchContent()
  }, [])

  return (
    <div className="pt-[160px] pb-[120px] dark:bg-darklight">

      {/* HERO */}
      <div className="container mb-16">
        <div className="relative rounded-2xl overflow-hidden">
          <Image
            src={getImgPath('/images/banner/uin.jpg')}
            alt="Profile Banner"
            width={1400}
            height={500}
            className="w-full h-[300px] md:h-[400px] object-cover"
          />

          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
              Sejarah Pemikiran Politik Islam
            </h1>

            {/* Breadcrumb */}
            <div className="text-sm md:text-base text-white/90 flex items-center gap-2 flex-wrap">
              <Link href="/">Home</Link>

              {pathSegments.map((segment, index) => {
                const href =
                  '/' + pathSegments.slice(0, index + 1).join('/')
                const isLast = index === pathSegments.length - 1

                const label = segment
                  .replace(/-/g, ' ')
                  .replace(/\b\w/g, (l) => l.toUpperCase())

                return (
                  <span key={href} className="flex items-center gap-2">
                    <span>›</span>
                    {isLast ? (
                      <span className="font-medium">{label}</span>
                    ) : (
                      <Link href={href}>{label}</Link>
                    )}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container">
        <div className="pb-10">
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 text-center pb-8">
            Sejarah <br />
            <span className="text-primary">
              Pemikiran Politik Islam
            </span>
          </h2>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="relative group">
              <div className="overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src={getImgPath('/images/banner/uin.jpg')}
                  alt="Sejarah"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            <div className="absolute inset-0 rounded-2xl ring-1 ring-black/10"></div>
          </div>

         {/* RIGHT: CONTENT */}
          <div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div
                className="prose prose-lg max-w-none dark:prose-invert text-justify"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
              </div>

          </div>
        </div>

        
      </div>
    </div>
  )
}

export default SejarahPage
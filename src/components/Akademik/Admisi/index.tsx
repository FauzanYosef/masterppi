'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { getImgPath } from '@/app/(main)/utils/paths'
import { getImageUrl } from '@/lib/api'
import { getCurrentAdmission, type Admission } from '@/lib/site-content'

const DEFAULT_REGISTRATION_URL = 'https://pmb.uinsgd.ac.id/program-pascasarjana/'
const DEFAULT_BROCHURES = ['/images/brosur/1.png', '/images/brosur/2.png'].map(getImgPath)

const formatDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : null

const AdmisiPage = () => {
  const [admission, setAdmission] = useState<Admission | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Gelombang penerimaan aktif dari CMS (Akademik → Penerimaan).
  useEffect(() => {
    let active = true
    getCurrentAdmission(getImageUrl).then((data) => {
      if (active) setAdmission(data)
    })
    return () => {
      active = false
    }
  }, [])

  const brochures = admission?.files.filter((f) => f.isImage).map((f) => f.url) ?? []
  const images = brochures.length > 0 ? brochures : DEFAULT_BROCHURES
  const documents = admission?.files.filter((f) => !f.isImage) ?? []
  const opens = formatDate(admission?.registrationStart ?? null)
  const closes = formatDate(admission?.registrationEnd ?? null)

  return (
    <div className="pt-[140px] pb-[100px] dark:bg-darklight">

      {/* HEADER */}
      <div className="text-center space-y-4 mb-12 px-4">
        <h2 className="text-3xl md:text-4xl font-bold leading-tight">
          <span className="text-primary">Pendaftaran</span> Mahasiswa Baru
        </h2>

        <p className="max-w-2xl mx-auto text-gray-500 dark:text-gray-400">
          Calon mahasiswa dapat mengajukan pendaftaran melalui sistem resmi 
          PMB UIN Sunan Gunung Djati Bandung.
        </p>
      </div>

      {/* CONTENT */}
      <div className="container">

        {/* GRID IMAGE */}
        <div className="grid md:grid-cols-2 gap-6">

          {images.map((img, i) => (
            <div
              key={i}
              onClick={() => setSelectedImage(img)}
              className="relative w-full h-[420px] rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
            >
              <Image
                src={img}
                alt={`Brosur PMB ${i + 1}`}
                unoptimized={img.startsWith('http')}
                fill
                className="object-cover group-hover:scale-105 transition duration-500"
              />

              {/* overlay hover */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <span className="text-white text-sm bg-black/60 px-4 py-2 rounded-full">
                  Klik untuk memperbesar
                </span>
              </div>
            </div>
          ))}

        </div>

        {/* INFO */}
        {/* <div className="mt-12 max-w-3xl mx-auto bg-white dark:bg-dark rounded-2xl shadow-md p-6 md:p-8">

          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Seluruh proses pendaftaran dilaksanakan sesuai dengan ketentuan dan jadwal yang ditetapkan oleh universitas.
          </p>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Untuk <span className="font-semibold">Tahun Akademik 2026–2027</span>, 
            pendaftaran dibuka dari{' '}
            <span className="text-primary font-medium">27 Maret 2026</span> sampai{' '}
            <span className="text-primary font-medium">20 Juni 2026</span>. 
            Perkuliahan dimulai pada <span className="font-medium">September 2026</span>.
          </p>

          <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-3">
            Tahapan Pendaftaran:
          </h3>

          <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
            <li>• Pendaftaran secara daring</li>
            <li>• Unggah dokumen persyaratan</li>
            <li>• Tes potensi akademik & kebahasaan</li>
            <li>• Wawancara</li>
          </ul>

        </div> */}

        {/* GELOMBANG & DOKUMEN (dari CMS) */}
        {admission && (opens || documents.length > 0) && (
          <div className="mt-12 max-w-3xl mx-auto bg-white dark:bg-dark rounded-2xl shadow-md p-6 md:p-8 space-y-4">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
              {admission.title}
              {admission.academicYear ? ` — Tahun Akademik ${admission.academicYear}` : ''}
            </h3>
            {opens && (
              <p className="text-gray-600 dark:text-gray-300">
                Pendaftaran dibuka <span className="text-primary font-medium">{opens}</span>
                {closes && (
                  <>
                    {' '}sampai <span className="text-primary font-medium">{closes}</span>
                  </>
                )}
                .
              </p>
            )}
            {documents.length > 0 && (
              <ul className="space-y-2 text-sm">
                {documents.map((doc) => (
                  <li key={doc.url}>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                      {doc.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-10 space-y-3">

          <a
            href={admission?.registrationUrl || DEFAULT_REGISTRATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-primary text-white rounded-full text-sm md:text-base font-medium shadow-lg hover:bg-primary/90 transition"
          >
            Daftar Sekarang
          </a>



        </div>

      </div>

      {/* MODAL ZOOM IMAGE */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative w-full max-w-4xl h-[80vh]">
            <Image
              src={selectedImage}
              alt="Preview Brosur"
              unoptimized={selectedImage.startsWith('http')}
              fill
              className="object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default AdmisiPage
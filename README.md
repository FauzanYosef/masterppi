# Website Magister Pemikiran Politik Islam (MPPI)

Website resmi Program Magister Pemikiran Politik Islam, FISIP UIN Sunan Gunung Djati Bandung.
Dibangun dengan Next.js 16 (App Router), React 19, dan Tailwind CSS 4.

Seluruh konten diambil dari **fisip-api** untuk website **Magister PPI (prodi id 3)** dan dikelola
lewat CMS **fisip-admin** — tidak ada konten yang disimpan di repo ini.

## Menjalankan

```bash
cp .env.example .env.local    # sesuaikan nilainya
npm install
npm run dev                   # http://localhost:3000  (atau: npm run dev -- -p 3002)
```

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Server development |
| `npm run build` / `npm start` | Build dan jalankan production |
| `npm run lint` | ESLint |
| `npm run typecheck` | Pemeriksaan tipe TypeScript |

## Environment

| Variabel | Keterangan |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | URL fisip-api yang diakses browser (tanpa `/api`) |
| `NEXT_PUBLIC_SITE_DOMAIN` | `magisterppi.uinsgd.ac.id` — dikirim sebagai `X-Site-Domain` untuk memilih data prodi |
| `NEXT_PUBLIC_SITE_URL` | URL publik (canonical, sitemap, Open Graph) |
| `INTERNAL_API_URL` | URL API yang diakses server Next.js (opsional) |
| `API_REVALIDATE_SECONDS` | Lama cache data API di server (default 300) |

`NEXT_PUBLIC_*` ditanam saat build; mengubahnya berarti build ulang.

## Sumber konten (CMS: fisip-admin, website "Magister Pemikiran Politik Islam")

| Bagian website | Dikelola di CMS |
| --- | --- |
| Menu header & link footer | Website → Navigasi |
| Hero, Sambutan, Sejarah singkat (beranda) | Settings → Homepage |
| Profil → Sejarah, Visi Misi | Website → Profil |
| Profil → Program, Lulusan, Fasilitas | Website → Halaman (judul "Program", "Profil Lulusan", "Fasilitas") |
| Dosen, Struktur Organisasi | SDM → Dosen, Website → Pimpinan |
| Kontak, media sosial (footer) | Settings → Pengaturan Website |
| Berita, Kegiatan, Galeri, Mitra | Konten, Akademik, Kerjasama |
| Kurikulum, Mata kuliah, Kalender, Panduan | Akademik |
| Admisi & tombol "Daftar Sekarang" | Akademik → Penerimaan |

Bagian yang belum diisi menampilkan teks "Konten sedang disiapkan" atau tampilan bawaan.

## Docker

```bash
docker compose up -d --build                              # lokal: http://localhost:3002 (jaringan fisip-net)
docker compose -f docker-compose.prod.yml up -d --build   # server produksi
```

File `.env*` tidak ikut ke dalam image; nilai dikirim lewat build args (lihat compose).

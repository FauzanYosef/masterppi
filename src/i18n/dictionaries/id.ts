/**
 * Teks antarmuka bahasa Indonesia (bahasa bawaan).
 * en.ts wajib punya kunci yang sama persis — TypeScript menolak bila ada yang terlewat.
 * Konten dari CMS (berita, sambutan, halaman profil) TIDAK ada di sini.
 */
const id = {
  site: {
    name: 'Program Magister Pemikiran Politik Islam',
    shortName: 'Magister Pemikiran Politik Islam',
    institution: 'UIN Sunan Gunung Djati Bandung',
    faculty: 'FISIP · UIN Sunan Gunung Djati Bandung',
    description:
      'Website resmi Program Magister Pemikiran Politik Islam, Fakultas Ilmu Sosial dan Ilmu Politik UIN Sunan Gunung Djati Bandung.',
    about:
      'Program Magister Pemikiran Politik Islam, Fakultas Ilmu Sosial dan Ilmu Politik, UIN Sunan Gunung Djati Bandung.',
    logoHomeLabel: 'Beranda Magister Pemikiran Politik Islam',
    logoUin: 'Logo UIN Sunan Gunung Djati',
    logoProgram: 'Logo Magister PPI',
    campusAlt: 'Gedung UIN Sunan Gunung Djati Bandung',
  },

  /** Label menu berdasarkan href; dipakai juga untuk breadcrumb. */
  nav: {
    '/': 'Beranda',
    '/profil': 'Tentang Program',
    '/profil/sejarah': 'Sejarah Program',
    '/profil/program': 'Apa Itu Magister PPI',
    '/profil/lulusan': 'Profil Lulusan',
    '/profil/visi': 'Visi & Misi',
    '/profil/dosen': 'Dosen',
    '/profil/organisasi': 'Struktur Organisasi',
    '/profil/fasilitas': 'Fasilitas',
    '/profil/kontak': 'Kontak Kami',
    '/akademik': 'Akademik dan Admisi',
    '/akademik/kurikulum': 'Kurikulum',
    '/akademik/kalender': 'Kalender Akademik',
    '/akademik/matkul': 'Mata Kuliah',
    '/akademik/panduan': 'Panduan Akademik',
    '/akademik/kegiatan': 'Kegiatan Akademik',
    '/akademik/admisi': 'Admisi Pendidikan',
    '/berita': 'Berita',
  } as Record<string, string>,

  header: {
    contact: 'Hubungi Kami',
    openMenu: 'Buka menu',
    closeMenu: 'Tutup menu',
    mainNav: 'Navigasi utama',
    mobileNav: 'Navigasi mobile',
    language: 'Bahasa',
    switchTo: 'Lihat dalam Bahasa Inggris',
    contentNotice: '',
  },

  footer: {
    contact: 'Kontak',
    contactPage: 'Lihat halaman kontak →',
    rights: 'Program Magister Pemikiran Politik Islam — FISIP UIN Sunan Gunung Djati Bandung',
  },

  common: {
    breadcrumb: 'Breadcrumb',
    readMore: 'Baca Selengkapnya',
    read: 'Baca',
    close: 'Tutup',
    retry: 'Coba Lagi',
    loading: 'Memuat…',
    contentPreparing: 'Konten sedang disiapkan',
    noDescription: 'Belum ada deskripsi.',
    locationUnavailable: 'Lokasi belum tersedia',
    general: 'Umum',
    reloadHint: 'Silakan muat ulang halaman beberapa saat lagi.',
    openPdf: 'Buka PDF',
    fileUnavailable: 'File belum tersedia',
    photoUnavailable: 'Foto tidak tersedia',
    imageUnavailable: 'Gambar tidak tersedia',
    backToTop: 'Kembali ke atas',
    previousPage: 'Halaman sebelumnya',
    nextPage: 'Halaman berikutnya',
    pagination: 'Halaman',
    show: 'Tampilkan',
    by: 'Oleh',
  },

  status: {
    upcoming: 'Akan Datang',
    ongoing: 'Berlangsung',
    finished: 'Selesai',
    cancelled: 'Dibatalkan',
    draft: 'Draft',
  },

  courseType: {
    wajib: 'Wajib',
    pilihan: 'Pilihan',
    konsentrasi: 'Konsentrasi',
    tesis: 'Tesis',
    disertasi: 'Disertasi',
    praktikum: 'Praktikum',
    lainnya: 'Lainnya',
  } as Record<string, string>,

  /** Judul & deskripsi banner halaman (PageHeader) serta <title>. */
  pages: {
    home: { title: 'Beranda', description: '' },
    berita: {
      title: 'Berita & Informasi',
      description:
        'Informasi terbaru seputar kegiatan, akademik, prestasi, dan berbagai aktivitas Program Magister Pemikiran Politik Islam.',
    },
    sejarah: {
      title: 'Sejarah Program',
      description: 'Perjalanan Program Magister Pemikiran Politik Islam di FISIP UIN Sunan Gunung Djati Bandung.',
    },
    program: {
      title: 'Apa Itu Magister PPI?',
      description: 'Mengenal Program Magister Pemikiran Politik Islam: fokus kajian, pendekatan, dan arah pengembangannya.',
    },
    lulusan: {
      title: 'Profil Lulusan',
      description: 'Kompetensi dan peran yang disiapkan bagi lulusan Magister Pemikiran Politik Islam.',
    },
    visi: { title: 'Visi & Misi', description: 'Arah dan komitmen Program Magister Pemikiran Politik Islam.' },
    dosen: {
      title: 'Dosen',
      description:
        'Para akademisi dengan latar kepakaran yang saling melengkapi dalam politik Islam, pemikiran Islam, dan studi agama.',
    },
    organisasi: {
      title: 'Struktur Organisasi',
      description: 'Susunan pimpinan dan pengelola Program Magister Pemikiran Politik Islam.',
    },
    fasilitas: {
      title: 'Fasilitas',
      description: 'Program Magister PPI didukung oleh berbagai fasilitas akademik untuk menunjang studi dan riset.',
    },
    kontak: {
      title: 'Kontak Kami',
      description: 'Ada pertanyaan seputar program, admisi, atau kegiatan akademik? Kami siap membantu.',
    },
    kurikulum: {
      title: 'Kurikulum',
      description:
        'Struktur kurikulum yang menyeimbangkan teori dan praktik untuk mengembangkan kompetensi akademik dan profesional.',
    },
    kalender: {
      title: 'Kalender Akademik',
      description: 'Jadwal kegiatan akademik Program Studi setiap tahun akademik.',
    },
    matkul: {
      title: 'Mata Kuliah',
      description: 'Daftar mata kuliah beserta bobot SKS, semester, dan deskripsinya.',
    },
    panduan: {
      title: 'Panduan Akademik',
      description: 'Dokumen panduan dan pedoman akademik bagi mahasiswa Program Magister Pemikiran Politik Islam.',
    },
    kegiatan: {
      title: 'Kegiatan Akademik',
      description:
        'Agenda dan kegiatan akademik yang mendorong pertukaran gagasan, penguatan riset, dan keterlibatan publik.',
    },
    admisi: {
      title: 'Pendaftaran Mahasiswa Baru',
      description:
        'Calon mahasiswa dapat mengajukan pendaftaran melalui sistem resmi PMB UIN Sunan Gunung Djati Bandung.',
    },
  },

  home: {
    hero: {
      quickLinks: { kurikulum: 'Kurikulum', admisi: 'Admisi', dosen: 'Dosen' },
      videoTitle: 'Video profil',
      videoUnavailable: 'Video tidak tersedia',
    },
    sambutan: {
      eyebrow: 'Sambutan',
      titleLead: 'Ketua Program Magister',
      titleAccent: 'Pemikiran Politik Islam',
      photoAlt: 'Ketua Program Studi Magister Pemikiran Politik Islam',
      quote: '“Membangun pemikiran politik Islam yang kritis, inklusif, dan relevan dengan tantangan global.”',
      empty: 'Sambutan belum tersedia.',
    },
    sejarah: {
      eyebrow: 'Sejarah Singkat',
      defaultTitle: 'Program Magister Pemikiran Politik Islam',
      readFull: 'Baca Sejarah Lengkap',
      empty: 'Sejarah belum tersedia.',
      campus: 'UIN Sunan Gunung Djati',
      city: 'Bandung, Jawa Barat',
    },
    news: {
      eyebrow: 'Kabar Terkini',
      title: 'Berita Terbaru',
      description:
        'Informasi terkini seputar publikasi, kegiatan ilmiah, kolaborasi institusi, serta perkembangan kajian pemikiran politik Islam.',
      all: 'Semua Berita',
      error: 'Gagal memuat berita.',
      empty: 'Belum ada berita',
      emptyHint: 'Berita terbaru akan tampil di sini.',
      fallbackExcerpt: 'Baca selengkapnya mengenai berita ini.',
    },
    agenda: {
      eyebrow: 'Agenda',
      title: 'Agenda dan Kegiatan',
      description:
        'Agenda dan kegiatan akademik yang mendorong pertukaran gagasan, penguatan riset, dan keterlibatan publik di tingkat nasional hingga global.',
      all: 'Semua Kegiatan',
      empty: 'Belum ada agenda',
      emptyHint: 'Agenda dan kegiatan terbaru akan tampil di sini.',
    },
    registration: {
      eyebrow: 'Penerimaan Mahasiswa Baru',
      titleLead: 'Bergabung bersama Program Magister',
      titleAccent: 'Pemikiran Politik Islam',
      description:
        'Kembangkan kapasitas riset dan analisis Anda dalam kajian politik Islam bersama dosen dan jejaring akademik kami.',
      register: 'Daftar Sekarang',
      info: 'Info Admisi',
    },
    gallery: {
      eyebrow: 'Galeri',
      title: 'Dokumentasi Kegiatan',
      description: 'Dokumentasi berbagai kegiatan, agenda akademik, serta aktivitas Magister Pemikiran Politik Islam.',
      viewEvent: 'Lihat kegiatan',
    },
    partners: {
      eyebrow: 'Mitra Strategis',
      title: 'Kerja Sama',
      description:
        'Membangun kemitraan strategis dengan berbagai institusi akademik dan riset untuk memperluas kontribusi ilmiah dalam kajian pemikiran politik Islam.',
      empty: 'Belum ada data kerja sama.',
      count: 'institusi mitra',
      website: 'Website',
    },
  },

  profil: {
    sejarahEyebrow: 'Sejarah Singkat',
    programEyebrow: 'Profil Program',
    titleLead: 'Program Magister',
    titleLeadShort: 'Magister',
    titleAccent: 'Pemikiran Politik Islam',
    visiEyebrow: 'Visi',
    visiQuote:
      'Menjadi Program Magister Pemikiran Politik Islam rujukan di Asia Tenggara pada tahun 2030 yang unggul dalam riset, publikasi, dan kontribusi kebijakan, berlandaskan nilai',
    visiValue: 'Rahmatan lil Alamin',
    fasilitas: [
      { title: 'Ruang Kuliah Modern', desc: 'Fasilitas ruang belajar yang nyaman dan dilengkapi teknologi pembelajaran terbaru.' },
      { title: 'Akses Jurnal Internasional', desc: 'Akses ke berbagai jurnal ilmiah internasional dari database universitas.' },
      { title: 'Research Laboratory', desc: 'Islamic Governance, Policy and Digital Politics Lab sebagai pusat riset.' },
      { title: 'Perpustakaan', desc: 'Koleksi buku dan referensi akademik lengkap untuk menunjang studi.' },
      { title: 'Ruang Diskusi', desc: 'Area kolaboratif untuk diskusi akademik dan pengembangan ide.' },
      { title: 'Repository Riset', desc: 'Sistem penyimpanan dan akses hasil penelitian mahasiswa dan dosen.' },
    ],
    kontak: {
      address: 'Alamat',
      email: 'Email',
      phone: 'Telepon',
      whatsapp: 'WhatsApp',
      whatsappCta: 'Hubungi via WhatsApp',
      website: 'Website',
      mapTitle: 'Lokasi Program Magister Pemikiran Politik Islam',
      error: 'Gagal memuat informasi kontak',
      empty: 'Informasi kontak belum tersedia',
    },
    dosen: {
      loading: 'Memuat data dosen...',
      error: 'Gagal memuat data dosen',
      empty: 'Belum ada data dosen.',
      position: 'Jabatan:',
      expertise: 'Keahlian:',
      email: 'Email:',
      viewProfile: 'Lihat Profil',
    },
    organisasi: {
      loading: 'Memuat struktur organisasi...',
      empty: 'Data struktur organisasi belum tersedia.',
      error: 'Gagal mengambil data struktur organisasi.',
    },
  },

  akademik: {
    loadError: 'Gagal Memuat Data',
    kurikulum: {
      loading: 'Memuat kurikulum...',
      empty: 'Data kurikulum belum tersedia.',
      code: 'Kode',
      course: 'Mata Kuliah',
      credits: 'SKS',
      type: 'Tipe',
      semester: 'Semester',
      totalCredits: 'Total SKS',
    },
    kalender: {
      loading: 'Memuat kalender akademik...',
      empty: 'Data kalender akademik belum tersedia.',
      pdfFallback: 'Browser tidak dapat menampilkan PDF secara langsung.',
      fileEmpty: 'File kalender belum tersedia.',
      archiveTitle: 'Arsip Kalender Akademik',
      archiveDescription: 'Kalender akademik tahun-tahun sebelumnya.',
      archive: 'Arsip',
      openPdfExternal: 'Buka PDF ↗',
      fileMissing: 'File tidak tersedia',
    },
    matkul: {
      loading: 'Memuat mata kuliah...',
      empty: 'Data mata kuliah belum tersedia.',
      noDescription: 'Belum ada deskripsi mata kuliah.',
    },
    panduan: {
      loading: 'Memuat panduan akademik...',
      error: 'Gagal memuat panduan akademik',
      empty: 'Data panduan belum tersedia.',
      view: 'Lihat Panduan →',
    },
    kegiatan: {
      found: 'kegiatan ditemukan',
      error: 'Gagal memuat kegiatan',
      empty: 'Belum ada kegiatan',
      emptyHint: 'Belum tersedia kegiatan untuk ditampilkan.',
    },
    admisi: {
      zoomHint: 'Klik untuk memperbesar',
      brochure: 'Brosur PMB',
      academicYear: 'Tahun Akademik',
      opens: 'Pendaftaran dibuka',
      until: 'sampai',
      register: 'Daftar Sekarang',
      preview: 'Preview Brosur',
    },
  },

  berita: {
    showing: 'Menampilkan',
    of: 'dari',
    items: 'berita',
    loadError: 'Gagal memuat berita',
    empty: 'Belum ada berita',
    emptyHint: 'Belum tersedia berita atau informasi untuk ditampilkan.',
    fallbackExcerpt: 'Baca informasi selengkapnya mengenai berita ini.',
  },

  detail: {
    indonesianOnly: 'Konten ini hanya tersedia dalam bahasa Indonesia.',
    newsNotFound: 'Berita Tidak Ditemukan',
    eventNotFound: 'Kegiatan Tidak Ditemukan',
    backToNews: 'Kembali ke Berita',
    backToEvents: 'Kembali ke Kegiatan',
    backToAgenda: 'Kembali ke Agenda',
    allNews: 'Lihat semua berita',
    allEvents: 'Lihat semua agenda dan kegiatan',
    detail: 'Detail',
    news: 'Berita',
    event: 'Kegiatan',
    newsLabel: 'Informasi & Publikasi',
    newsInfo: 'Informasi Berita',
    eventInfo: 'Informasi Kegiatan',
    aboutEvent: 'Tentang Kegiatan',
    aboutEventHint: 'Informasi dan deskripsi kegiatan',
    published: 'Dipublikasikan',
    date: 'Tanggal',
    time: 'Waktu',
    location: 'Lokasi',
    category: 'Kategori',
    status: 'Status',
    views: 'Dibaca',
    times: 'kali',
    noContent: 'Isi berita belum tersedia.',
    noEventDescription: 'Belum ada deskripsi kegiatan.',
    ongoing: 'Sedang Berlangsung',
    notFoundMeta: 'Berita tidak ditemukan',
  },

  notice: {
    /** Catatan di versi bahasa Inggris selama konten CMS belum diterjemahkan. */
    contentLanguage: '',
  },
}

export default id
export type Dictionary = typeof id

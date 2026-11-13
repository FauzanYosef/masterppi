import type { Dictionary } from './id'

/** English interface text. Must mirror id.ts exactly. CMS content is not translated here. */
const en: Dictionary = {
  site: {
    name: 'Master Program in Islamic Political Thought',
    shortName: 'Master in Islamic Political Thought',
    institution: 'UIN Sunan Gunung Djati Bandung',
    faculty: 'FISIP · UIN Sunan Gunung Djati Bandung',
    description:
      'Official website of the Master Program in Islamic Political Thought, Faculty of Social and Political Sciences, UIN Sunan Gunung Djati Bandung.',
    about:
      'Master Program in Islamic Political Thought, Faculty of Social and Political Sciences, UIN Sunan Gunung Djati Bandung.',
    logoHomeLabel: 'Home — Master in Islamic Political Thought',
    logoUin: 'UIN Sunan Gunung Djati logo',
    logoProgram: 'Master in Islamic Political Thought logo',
    campusAlt: 'UIN Sunan Gunung Djati Bandung campus building',
  },

  nav: {
    '/': 'Home',
    '/profil': 'About the Program',
    '/profil/sejarah': 'History',
    '/profil/program': 'About the Master Program',
    '/profil/lulusan': 'Graduate Profile',
    '/profil/visi': 'Vision & Mission',
    '/profil/dosen': 'Faculty Members',
    '/profil/organisasi': 'Organizational Structure',
    '/profil/fasilitas': 'Facilities',
    '/profil/kontak': 'Contact Us',
    '/akademik': 'Academics & Admissions',
    '/akademik/kurikulum': 'Curriculum',
    '/akademik/kalender': 'Academic Calendar',
    '/akademik/matkul': 'Courses',
    '/akademik/panduan': 'Academic Guidelines',
    '/akademik/kegiatan': 'Academic Events',
    '/akademik/admisi': 'Admissions',
    '/berita': 'News',
  },

  header: {
    contact: 'Contact Us',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    mainNav: 'Main navigation',
    mobileNav: 'Mobile navigation',
    language: 'Language',
    switchTo: 'View in Indonesian',
    contentNotice: 'Some content is currently available in Indonesian only.',
  },

  footer: {
    contact: 'Contact',
    contactPage: 'View contact page →',
    rights: 'Master Program in Islamic Political Thought — FISIP UIN Sunan Gunung Djati Bandung',
  },

  common: {
    breadcrumb: 'Breadcrumb',
    readMore: 'Read More',
    read: 'Read',
    close: 'Close',
    retry: 'Try Again',
    loading: 'Loading…',
    contentPreparing: 'Content is being prepared',
    noDescription: 'No description yet.',
    locationUnavailable: 'Location to be announced',
    general: 'General',
    reloadHint: 'Please reload the page in a moment.',
    openPdf: 'Open PDF',
    fileUnavailable: 'File not available yet',
    photoUnavailable: 'Photo not available',
    imageUnavailable: 'Image not available',
    backToTop: 'Back to top',
    previousPage: 'Previous page',
    nextPage: 'Next page',
    pagination: 'Pagination',
    show: 'Show',
    by: 'By',
  },

  status: {
    upcoming: 'Upcoming',
    ongoing: 'Ongoing',
    finished: 'Completed',
    cancelled: 'Cancelled',
    draft: 'Draft',
  },

  courseType: {
    wajib: 'Compulsory',
    pilihan: 'Elective',
    konsentrasi: 'Concentration',
    tesis: 'Thesis',
    disertasi: 'Dissertation',
    praktikum: 'Practicum',
    lainnya: 'Other',
  },

  pages: {
    home: { title: 'Home', description: '' },
    berita: {
      title: 'News & Updates',
      description:
        'The latest on events, academics, achievements, and activities of the Master Program in Islamic Political Thought.',
    },
    sejarah: {
      title: 'Program History',
      description:
        'The story of the Master Program in Islamic Political Thought at FISIP, UIN Sunan Gunung Djati Bandung.',
    },
    program: {
      title: 'About the Master Program',
      description:
        'Get to know the Master Program in Islamic Political Thought: its focus of study, approach, and direction.',
    },
    lulusan: {
      title: 'Graduate Profile',
      description: 'The competencies and roles our Master in Islamic Political Thought graduates are prepared for.',
    },
    visi: {
      title: 'Vision & Mission',
      description: 'The direction and commitments of the Master Program in Islamic Political Thought.',
    },
    dosen: {
      title: 'Faculty Members',
      description:
        'Scholars with complementary expertise in Islamic politics, Islamic thought, and religious studies.',
    },
    organisasi: {
      title: 'Organizational Structure',
      description: 'The leadership and management of the Master Program in Islamic Political Thought.',
    },
    fasilitas: {
      title: 'Facilities',
      description: 'Academic facilities that support study and research in the program.',
    },
    kontak: {
      title: 'Contact Us',
      description: 'Questions about the program, admissions, or academic events? We are happy to help.',
    },
    kurikulum: {
      title: 'Curriculum',
      description:
        'A curriculum that balances theory and practice to build academic and professional competencies.',
    },
    kalender: {
      title: 'Academic Calendar',
      description: 'The schedule of academic activities for each academic year.',
    },
    matkul: {
      title: 'Courses',
      description: 'The list of courses with their credits, semester, and description.',
    },
    panduan: {
      title: 'Academic Guidelines',
      description: 'Academic guidelines and regulations for students of the program.',
    },
    kegiatan: {
      title: 'Academic Events',
      description: 'Academic events that foster the exchange of ideas, stronger research, and public engagement.',
    },
    admisi: {
      title: 'New Student Admissions',
      description:
        'Prospective students apply through the official admissions system (PMB) of UIN Sunan Gunung Djati Bandung.',
    },
  },

  home: {
    hero: {
      quickLinks: { kurikulum: 'Curriculum', admisi: 'Admissions', dosen: 'Faculty' },
      videoTitle: 'Program video',
      videoUnavailable: 'Video not available',
    },
    sambutan: {
      eyebrow: 'Welcome',
      titleLead: 'Message from the Head of the',
      titleAccent: 'Islamic Political Thought Program',
      photoAlt: 'Head of the Master Program in Islamic Political Thought',
      quote: '“Building Islamic political thought that is critical, inclusive, and relevant to global challenges.”',
      empty: 'The welcome message is not available yet.',
    },
    sejarah: {
      eyebrow: 'Brief History',
      defaultTitle: 'Master Program in Islamic Political Thought',
      readFull: 'Read the Full History',
      empty: 'The history is not available yet.',
      campus: 'UIN Sunan Gunung Djati',
      city: 'Bandung, West Java',
    },
    news: {
      eyebrow: 'Latest Updates',
      title: 'Latest News',
      description:
        'Updates on publications, scholarly events, institutional collaborations, and developments in Islamic political thought.',
      all: 'All News',
      error: 'Failed to load news.',
      empty: 'No news yet',
      emptyHint: 'The latest news will appear here.',
      fallbackExcerpt: 'Read more about this story.',
    },
    agenda: {
      eyebrow: 'Agenda',
      title: 'Events & Activities',
      description:
        'Academic events that foster the exchange of ideas, stronger research, and public engagement from the national to the global level.',
      all: 'All Events',
      empty: 'No events yet',
      emptyHint: 'Upcoming events and activities will appear here.',
    },
    registration: {
      eyebrow: 'New Student Admissions',
      titleLead: 'Join the Master Program in',
      titleAccent: 'Islamic Political Thought',
      description:
        'Develop your research and analytical capacity in Islamic political studies with our faculty and academic network.',
      register: 'Apply Now',
      info: 'Admissions Info',
    },
    gallery: {
      eyebrow: 'Gallery',
      title: 'Event Highlights',
      description: 'Photos from events, academic activities, and life in the Master Program in Islamic Political Thought.',
      viewEvent: 'View event',
    },
    partners: {
      eyebrow: 'Strategic Partners',
      title: 'Partnerships',
      description:
        'Strategic partnerships with academic and research institutions that broaden our scholarly contribution to Islamic political thought.',
      empty: 'No partnerships listed yet.',
      count: 'partner institutions',
      website: 'Website of',
    },
  },

  profil: {
    sejarahEyebrow: 'Brief History',
    programEyebrow: 'Program Profile',
    titleLead: 'Master Program in',
    titleLeadShort: 'Master in',
    titleAccent: 'Islamic Political Thought',
    visiEyebrow: 'Vision',
    visiQuote:
      'To become a leading Master Program in Islamic Political Thought in Southeast Asia by 2030, excelling in research, publication, and policy contribution, grounded in the value of',
    visiValue: 'Rahmatan lil Alamin',
    fasilitas: [
      { title: 'Modern Classrooms', desc: 'Comfortable learning spaces equipped with up-to-date teaching technology.' },
      { title: 'International Journal Access', desc: 'Access to international scholarly journals through university databases.' },
      { title: 'Research Laboratory', desc: 'The Islamic Governance, Policy and Digital Politics Lab as a research hub.' },
      { title: 'Library', desc: 'A comprehensive collection of books and academic references to support your studies.' },
      { title: 'Discussion Rooms', desc: 'Collaborative spaces for academic discussion and developing ideas.' },
      { title: 'Research Repository', desc: 'A system for storing and accessing student and faculty research.' },
    ],
    kontak: {
      address: 'Address',
      email: 'Email',
      phone: 'Phone',
      whatsapp: 'WhatsApp',
      whatsappCta: 'Chat on WhatsApp',
      website: 'Website',
      mapTitle: 'Location of the Master Program in Islamic Political Thought',
      error: 'Failed to load contact information',
      empty: 'Contact information is not available yet',
    },
    dosen: {
      loading: 'Loading faculty members...',
      error: 'Failed to load faculty members',
      empty: 'No faculty members listed yet.',
      position: 'Position:',
      expertise: 'Expertise:',
      email: 'Email:',
      viewProfile: 'View Profile',
    },
    organisasi: {
      loading: 'Loading organizational structure...',
      empty: 'The organizational structure is not available yet.',
      error: 'Failed to load the organizational structure.',
    },
  },

  akademik: {
    loadError: 'Failed to Load Data',
    kurikulum: {
      loading: 'Loading curriculum...',
      empty: 'Curriculum data is not available yet.',
      code: 'Code',
      course: 'Course',
      credits: 'Credits',
      type: 'Type',
      semester: 'Semester',
      totalCredits: 'Total Credits',
    },
    kalender: {
      loading: 'Loading academic calendar...',
      empty: 'Academic calendar data is not available yet.',
      pdfFallback: 'Your browser cannot display the PDF directly.',
      fileEmpty: 'The calendar file is not available yet.',
      archiveTitle: 'Academic Calendar Archive',
      archiveDescription: 'Academic calendars from previous years.',
      archive: 'Archive',
      openPdfExternal: 'Open PDF ↗',
      fileMissing: 'File not available',
    },
    matkul: {
      loading: 'Loading courses...',
      empty: 'Course data is not available yet.',
      noDescription: 'No course description yet.',
    },
    panduan: {
      loading: 'Loading academic guidelines...',
      error: 'Failed to load academic guidelines',
      empty: 'No guidelines available yet.',
      view: 'View Guideline →',
    },
    kegiatan: {
      found: 'events found',
      error: 'Failed to load events',
      empty: 'No events yet',
      emptyHint: 'There are no events to show yet.',
    },
    admisi: {
      zoomHint: 'Click to enlarge',
      brochure: 'Admissions brochure',
      academicYear: 'Academic Year',
      opens: 'Registration opens',
      until: 'until',
      register: 'Apply Now',
      preview: 'Brochure preview',
    },
  },

  berita: {
    showing: 'Showing',
    of: 'of',
    items: 'articles',
    loadError: 'Failed to load news',
    empty: 'No news yet',
    emptyHint: 'There are no news or updates to show yet.',
    fallbackExcerpt: 'Read the full story.',
  },

  detail: {
    newsNotFound: 'Article Not Found',
    eventNotFound: 'Event Not Found',
    backToNews: 'Back to News',
    backToEvents: 'Back to Events',
    backToAgenda: 'Back to Agenda',
    allNews: 'See all news',
    allEvents: 'See all events and activities',
    detail: 'Detail',
    news: 'News',
    event: 'Event',
    newsLabel: 'News & Publications',
    newsInfo: 'Article Information',
    eventInfo: 'Event Information',
    aboutEvent: 'About the Event',
    aboutEventHint: 'Event information and description',
    published: 'Published',
    date: 'Date',
    time: 'Time',
    location: 'Location',
    category: 'Category',
    status: 'Status',
    views: 'Views',
    times: 'times',
    noContent: 'The article content is not available yet.',
    noEventDescription: 'No event description yet.',
    ongoing: 'Ongoing',
    notFoundMeta: 'Article not found',
  },

  notice: {
    contentLanguage:
      'Some content on this page — such as news, events, and program pages — is currently available in Indonesian only.',
  },
}

export default en

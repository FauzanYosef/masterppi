import { pageMetadata } from '@/i18n/metadata'

import Event from '@/components/Akademik/Kegiatan'

export const generateMetadata = pageMetadata('kegiatan', '/akademik/kegiatan')

export default function Page() {
  return <Event />
}
import { pageMetadata } from '@/i18n/metadata'

import Berita from '@/components/Berita'

export const generateMetadata = pageMetadata('berita', '/berita')

export default function Page() {
  return <Berita />
}
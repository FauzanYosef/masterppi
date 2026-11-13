import { pageMetadata } from '@/i18n/metadata'

import Panduan from '@/components/Akademik/Panduan'

export const generateMetadata = pageMetadata('panduan', '/akademik/panduan')

export default function Page() {
  return <Panduan />
}
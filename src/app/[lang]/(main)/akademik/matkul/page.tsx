import { pageMetadata } from '@/i18n/metadata'

import Matkul from '@/components/Akademik/Matkul'

export const generateMetadata = pageMetadata('matkul', '/akademik/matkul')

export default function Page() {
  return <Matkul />
}
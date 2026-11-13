import { pageMetadata } from '@/i18n/metadata'

import Dosen from '@/components/Profil/Dosen'

export const generateMetadata = pageMetadata('dosen', '/profil/dosen')

export default function Page() {
  return <Dosen />
}
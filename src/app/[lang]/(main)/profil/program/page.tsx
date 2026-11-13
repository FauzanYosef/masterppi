import { pageMetadata } from '@/i18n/metadata'

import Program from '@/components/Profil/Program'

export const generateMetadata = pageMetadata('program', '/profil/program')

export default function Page() {
  return <Program />
}
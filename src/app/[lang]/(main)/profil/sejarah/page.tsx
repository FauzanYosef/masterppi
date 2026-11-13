import { pageMetadata } from '@/i18n/metadata'
import Sejarah from '@/components/Profil/Sejarah'

export const generateMetadata = pageMetadata('sejarah', '/profil/sejarah')

export default function Page() {
  return <Sejarah />
}
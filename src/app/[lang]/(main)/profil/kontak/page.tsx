import { pageMetadata } from '@/i18n/metadata'
import Kontak from '@/components/Profil/Kontak'

export const generateMetadata = pageMetadata('kontak', '/profil/kontak')

export default function Page() {
  return <Kontak />
}
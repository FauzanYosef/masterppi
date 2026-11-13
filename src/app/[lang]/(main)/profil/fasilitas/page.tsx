import { pageMetadata } from '@/i18n/metadata'
import Fasilitas from '@/components/Profil/Fasilitas'

export const generateMetadata = pageMetadata('fasilitas', '/profil/fasilitas')

export default function Page() {
  return <Fasilitas />
}
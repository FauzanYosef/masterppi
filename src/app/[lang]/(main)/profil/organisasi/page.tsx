import { pageMetadata } from '@/i18n/metadata'
import Organisasi from '@/components/Profil/Organisasi'

export const generateMetadata = pageMetadata('organisasi', '/profil/organisasi')

export default function Page() {
  return <Organisasi />
}
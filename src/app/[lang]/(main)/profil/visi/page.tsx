import { pageMetadata } from '@/i18n/metadata'
import VisiPage from '@/components/Profil/Visi'

export const generateMetadata = pageMetadata('visi', '/profil/visi')

export default function Page() {
  return <VisiPage />
}
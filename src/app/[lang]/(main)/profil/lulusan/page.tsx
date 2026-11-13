import { pageMetadata } from '@/i18n/metadata'
import LulusanPage from '@/components/Profil/Lulusan'

export const generateMetadata = pageMetadata('lulusan', '/profil/lulusan')

export default function Page() {
  return <LulusanPage />
}
import { pageMetadata } from '@/i18n/metadata'

import Admisi from '@/components/Akademik/Admisi'

export const generateMetadata = pageMetadata('admisi', '/akademik/admisi')

export default function Page() {
  return <Admisi />
}
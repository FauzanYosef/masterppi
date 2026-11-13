import { pageMetadata } from '@/i18n/metadata'

import Kalender from '@/components/Akademik/Kalender'

export const generateMetadata = pageMetadata('kalender', '/akademik/kalender')

export default function Page() {
  return <Kalender />
}
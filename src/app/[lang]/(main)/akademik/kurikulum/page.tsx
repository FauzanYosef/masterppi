import { pageMetadata } from '@/i18n/metadata'

import Kurikulum from '@/components/Akademik/Kurikulum'

export const generateMetadata = pageMetadata('kurikulum', '/akademik/kurikulum')

export default function Page() {
  return <Kurikulum />
}
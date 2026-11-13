'use client'

import { useI18n } from '@/i18n/I18nProvider'

const STYLE: Record<string, string> = {
  upcoming: 'bg-primary text-white',
  ongoing: 'bg-sec-yellow text-darkblue',
  finished: 'bg-darkblue/80 text-white',
}

/** Label status agenda dengan warna yang seragam di seluruh website. */
const EventStatusBadge = ({ status }: { status?: string | null }) => {
  const { t } = useI18n()
  const key = status ?? 'upcoming'
  const label = (t.status as Record<string, string>)[key] ?? status
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-soft backdrop-blur ${
        STYLE[key] ?? 'bg-primary text-white'
      }`}>
      <span className='h-1.5 w-1.5 rounded-full bg-current opacity-80' />
      {label}
    </span>
  )
}

export default EventStatusBadge

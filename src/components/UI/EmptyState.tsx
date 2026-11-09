import { Icon } from '@iconify/react'
import type { ReactNode } from 'react'

type EmptyStateProps = {
  icon?: string
  title: string
  description?: ReactNode
  action?: ReactNode
  tone?: 'default' | 'error'
}

/** Tampilan saat data kosong / gagal dimuat, seragam di seluruh halaman. */
const EmptyState = ({ icon = 'tabler:inbox', title, description, action, tone = 'default' }: EmptyStateProps) => (
  <div className='card mx-auto flex max-w-lg flex-col items-center px-6 py-12 text-center'>
    <span
      className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${
        tone === 'error' ? 'bg-red-50 text-red-500 dark:bg-red-500/10' : 'bg-primary/[0.08] text-primary dark:bg-white/10 dark:text-white'
      }`}>
      <Icon icon={tone === 'error' ? 'tabler:alert-triangle' : icon} width={28} aria-hidden />
    </span>
    <p className='font-semibold !text-darkblue dark:!text-white'>{title}</p>
    {description && <p className='mt-1 text-sm'>{description}</p>}
    {action && <div className='mt-6'>{action}</div>}
  </div>
)

export default EmptyState

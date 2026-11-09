import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavLinkType } from '@/app/(main)/types/navlink'

const MobileHeaderLink: React.FC<{ item: NavLinkType; onNavigate?: () => void }> = ({ item, onNavigate }) => {
  const path = usePathname()
  const hasActiveChild = item.submenu?.some((sub) => sub.href === path) ?? false
  const [submenuOpen, setSubmenuOpen] = useState(hasActiveChild)

  const baseClass =
    'flex w-full items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors'

  if (!item.submenu) {
    const active = item.href === path
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className={`${baseClass} ${
          active ? 'bg-primary/[0.07] text-primary dark:bg-white/10 dark:text-white' : 'text-darkblue hover:bg-secondary dark:text-white dark:hover:bg-white/5'
        }`}>
        {item.label}
      </Link>
    )
  }

  return (
    <div className='w-full'>
      <button
        type='button'
        onClick={() => setSubmenuOpen((open) => !open)}
        aria-expanded={submenuOpen}
        className={`${baseClass} ${hasActiveChild ? 'text-primary dark:text-white' : 'text-darkblue dark:text-white'} hover:bg-secondary dark:hover:bg-white/5`}>
        {item.label}
        <svg
          className={`h-5 w-5 transition-transform duration-200 ${submenuOpen ? 'rotate-180' : ''}`}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          aria-hidden>
          <path fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m7 10l5 5l5-5' />
        </svg>
      </button>
      <div className={`grid transition-all duration-300 ${submenuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className='overflow-hidden'>
          <div className='ml-4 mt-1 flex flex-col border-l border-darkblue/10 pl-3 dark:border-white/10'>
            {item.submenu.map((subItem) => {
              const active = subItem.href === path
              return (
                <Link
                  key={subItem.href}
                  href={subItem.href}
                  onClick={onNavigate}
                  className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? 'font-medium text-primary dark:text-white'
                      : 'text-lightgrey hover:text-primary dark:text-white/70 dark:hover:text-white'
                  }`}>
                  {subItem.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileHeaderLink

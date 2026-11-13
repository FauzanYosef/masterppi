'use client'
import { useState } from 'react'
import Link from '@/components/UI/LocaleLink'
import { useCurrentPath } from '@/i18n/I18nProvider'
import { NavLinkType } from '@/types/navlink'

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    aria-hidden>
    <path fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m7 10l5 5l5-5' />
  </svg>
)

const HeaderLink: React.FC<{ item: NavLinkType }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false)
  const path = useCurrentPath()

  const isActive = item.submenu ? item.submenu.some((sub) => sub.href === path) : path === item.href

  const linkClass = `relative flex items-center gap-1 rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
    isActive
      ? 'text-primary bg-primary/[0.07] dark:text-white dark:bg-white/10'
      : 'text-darkblue/80 hover:text-primary hover:bg-primary/[0.05] dark:text-white/80 dark:hover:text-white dark:hover:bg-white/10'
  }`

  return (
    <li
      className='relative'
      onMouseEnter={() => item.submenu && setSubmenuOpen(true)}
      onMouseLeave={() => item.submenu && setSubmenuOpen(false)}>
      {item.submenu ? (
        <button
          type='button'
          className={linkClass}
          aria-expanded={submenuOpen}
          aria-haspopup='true'
          onClick={() => setSubmenuOpen((open) => !open)}>
          {item.label}
          <Chevron open={submenuOpen} />
        </button>
      ) : (
        <Link href={item.href} className={linkClass}>
          {item.label}
        </Link>
      )}

      {item.submenu && (
        <div
          className={`absolute left-1/2 top-full -translate-x-1/2 pt-3 transition-all duration-200 ${
            submenuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
          }`}>
          <ul className='w-72 rounded-2xl border border-darkblue/[0.06] bg-white p-2 shadow-lift dark:border-white/10 dark:bg-lightdarkblue'>
            {item.submenu.map((subItem) => {
              const active = path === subItem.href
              return (
                <li key={subItem.href}>
                  <Link
                    href={subItem.href}
                    onClick={() => setSubmenuOpen(false)}
                    className={`group flex items-center justify-between rounded-xl px-4 py-2.5 text-sm transition ${
                      active
                        ? 'bg-primary/[0.07] font-medium text-primary dark:bg-white/10 dark:text-white'
                        : 'text-darkblue/80 hover:bg-secondary hover:text-primary dark:text-white/80 dark:hover:bg-white/5 dark:hover:text-white'
                    }`}>
                    {subItem.label}
                    <span
                      aria-hidden
                      className={`text-primary transition-all ${active ? 'opacity-100' : 'opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'}`}>
                      →
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </li>
  )
}

export default HeaderLink

'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavLinkType } from '@/app/(main)/types/navlink'

const HeaderLink: React.FC<{ item: NavLinkType }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false)
  const path = usePathname()

  const isSubActive = item.submenu?.some(
    (subItem) => subItem.href === path
  )

  return (
    <li
      className="relative group"
      onMouseEnter={() => item.submenu && setSubmenuOpen(true)}
      onMouseLeave={() => item.submenu && setSubmenuOpen(false)}
    >
      {/* MAIN LINK */}
      <div className="flex items-center py-2">
        {item.submenu ? (
          <button
            type="button"
            className={`text-base flex items-center gap-1 font-medium
              ${isSubActive ? 'text-primary' : 'text-darkblue dark:text-white'}
              hover:text-primary transition-colors`}
          >
            {item.label}

            <svg
              className={`transition-transform duration-200 ${
                submenuOpen ? 'rotate-180' : ''
              }`}
              xmlns="http://www.w3.org/2000/svg"
              width="1.2em"
              height="1.2em"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="m7 10l5 5l5-5"
              />
            </svg>
          </button>
        ) : (
          <Link
            href={item.href}
            className={`text-base font-medium
              ${path === item.href
                ? 'text-primary'
                : 'text-darkblue dark:text-white'}
              hover:text-primary transition-colors`}
          >
            {item.label}
          </Link>
        )}
      </div>

      {/* SUBMENU */}
      {item.submenu && (
        <div
          className={`absolute left-0 top-full pt-3 transition-all duration-200
          ${submenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        >
          <ul
            className="
            w-64
            bg-white dark:bg-neutral-900
            border border-gray-100 dark:border-neutral-800
            shadow-xl
            rounded-xl
            py-2
            "
          >
            {item.submenu.map((subItem, index) => (
              <li key={index}>
                <Link
                  href={subItem.href}
                  className={`block px-5 py-2.5 text-sm transition
                    ${
                      path === subItem.href
                        ? 'text-primary bg-neutral-50 dark:bg-neutral-800'
                        : 'text-darkblue dark:text-white'
                    }
                    hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-primary`}
                >
                  {subItem.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  )
}

export default HeaderLink
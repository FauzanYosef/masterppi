'use client'
import Link from '@/components/UI/LocaleLink'
import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Logo from './Logo'
import HeaderLink from './Navigation/HeaderLink'
import MobileHeaderLink from './Navigation/MobileHeaderLink'
import { NavLinkType } from '@/types/navlink'
import { DEFAULT_NAVIGATION, getNavigation } from '@/lib/site-content'
import { useI18n } from '@/i18n/I18nProvider'
import { localizeNav } from '@/i18n/nav'
import LanguageSwitcher from '@/components/UI/LanguageSwitcher'

const CONTACT_HREF = '/profil/kontak'

const Header: React.FC = () => {
  const { lang, t } = useI18n()
  const [cmsNav, setNavlink] = useState<NavLinkType[]>(DEFAULT_NAVIGATION)
  const navlink = localizeNav(cmsNav, lang, t)
  // Menu mobile hanya terbuka di halaman tempat ia dibuka, jadi pindah halaman otomatis menutupnya.
  const [openPath, setOpenPath] = useState<string | null>(null)
  const [sticky, setSticky] = useState(false)
  const pathname = usePathname()
  const navbarOpen = openPath === pathname
  const setNavbarOpen = useCallback((open: boolean) => setOpenPath(open ? pathname : null), [pathname])

  // Menu dari CMS (Website → Navigasi); menu bawaan tampil lebih dulu.
  useEffect(() => {
    let active = true
    getNavigation().then((items) => {
      if (active) setNavlink(items)
    })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY >= 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Halaman tidak bisa di-scroll saat menu mobile terbuka; Escape menutupnya.
  useEffect(() => {
    document.body.style.overflow = navbarOpen ? 'hidden' : ''
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setNavbarOpen(false)
    if (navbarOpen) window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [navbarOpen, setNavbarOpen])

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        sticky
          ? 'border-b border-darkblue/[0.06] bg-white/85 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-darklight/85'
          : 'border-b border-transparent bg-white/70 backdrop-blur-md dark:bg-darklight/60'
      }`}>
      <div className={`container flex items-center justify-between gap-6 transition-all duration-300 ${sticky ? 'h-[72px]' : 'h-[88px]'}`}>
        <Logo compact={sticky} />

        <nav aria-label={t.header.mainNav} className='hidden xl:block'>
          <ul className='flex items-center gap-1'>
            {navlink.map((item) => (
              <HeaderLink key={item.href + item.label} item={item} />
            ))}
          </ul>
        </nav>

        <div className='flex items-center gap-3'>
          <LanguageSwitcher />
          <Link href={CONTACT_HREF} className='btn-primary hidden xl:inline-flex !py-2.5'>
            {t.header.contact}
          </Link>
          <button
            onClick={() => setNavbarOpen(true)}
            className='flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-darkblue/10 transition hover:border-primary/40 hover:bg-secondary xl:hidden dark:border-white/20'
            aria-label={t.header.openMenu}
            aria-expanded={navbarOpen}>
            <span className='block h-0.5 w-5 rounded-full bg-darkblue dark:bg-white' />
            <span className='block h-0.5 w-5 rounded-full bg-darkblue dark:bg-white' />
            <span className='block h-0.5 w-3.5 self-center translate-x-[3px] rounded-full bg-darkblue dark:bg-white' />
          </button>
        </div>
      </div>
      {t.header.contentNotice && (
        <div className='border-t border-sec-yellow/30 bg-sec-yellow/15 dark:bg-sec-yellow/10'>
          <p className='container flex items-center justify-center gap-2 py-1.5 text-center text-xs !text-darkblue dark:!text-white/80'>
            <span aria-hidden className='h-1.5 w-1.5 shrink-0 rounded-full bg-sec-yellow' />
            {t.header.contentNotice}
          </p>
        </div>
      )}
    </header>

      {/* Menu mobile (di luar <header>: backdrop-filter membuat elemen fixed ikut terkurung) */}
      <div
        onClick={() => setNavbarOpen(false)}
        className={`fixed inset-0 z-[60] h-screen bg-darkblue/40 backdrop-blur-sm transition-opacity duration-300 xl:hidden ${
          navbarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden
      />
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-screen w-full max-w-sm flex-col bg-white shadow-lift transition-transform duration-300 xl:hidden dark:bg-darklight ${
          navbarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!navbarOpen}>
        <div className='flex items-center justify-between border-b border-darkblue/[0.06] px-5 py-4 dark:border-white/10'>
          <Logo withText={false} compact />
          <button
            onClick={() => setNavbarOpen(false)}
            aria-label={t.header.closeMenu}
            className='flex h-10 w-10 items-center justify-center rounded-full text-darkblue transition hover:bg-secondary hover:text-primary dark:text-white dark:hover:bg-white/10'>
            <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24' aria-hidden>
              <path fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>
        <nav aria-label={t.header.mobileNav} className='flex flex-1 flex-col gap-1 overflow-y-auto p-4'>
          {navlink.map((item) => (
            <MobileHeaderLink key={item.href + item.label} item={item} onNavigate={() => setNavbarOpen(false)} />
          ))}
        </nav>
        <div className='border-t border-darkblue/[0.06] p-4 dark:border-white/10'>
          <Link href={CONTACT_HREF} className='btn-primary w-full' onClick={() => setNavbarOpen(false)}>
            {t.header.contact}
          </Link>
        </div>
      </aside>
    </>
  )
}

export default Header

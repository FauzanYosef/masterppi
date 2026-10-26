'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import Logo from './Logo'
import HeaderLink from './Navigation/HeaderLink'
import MobileHeaderLink from './Navigation/MobileHeaderLink'
import { NavLinkType } from '@/app/(main)/types/navlink'
import { DEFAULT_NAVIGATION, getNavigation } from '@/lib/site-content'

const CONTACT_HREF = '/profil/kontak'

const Header: React.FC = () => {
  const [navlink, setNavlink] = useState<NavLinkType[]>(DEFAULT_NAVIGATION)
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [sticky, setSticky] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

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
    const handleScroll = () => setSticky(window.scrollY >= 80)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Klik di luar panel menu mobile menutupnya.
  useEffect(() => {
    if (!navbarOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setNavbarOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [navbarOpen])

  // Halaman tidak bisa di-scroll saat menu mobile terbuka.
  useEffect(() => {
    document.body.style.overflow = navbarOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [navbarOpen])

  return (
    <header
      className={`fixed top-0 py-1 z-50 w-full bg-transparent transition-all ${
        sticky ? 'shadow-lg dark:shadow-neutral-50/5 bg-white dark:bg-darklight' : 'shadow-none'
      }`}>
      <div
        className={`container flex items-center justify-between gap-10 duration-300  ${
          sticky ? 'py-3' : 'py-4'
        }`}>
        <Logo />
        <nav>
          <ul className='hidden xl:flex flex-grow items-center justify-start gap-10 '>
            {navlink.map((item, index) => (
              <HeaderLink key={index} item={item} />
            ))}
          </ul>
        </nav>
        <div className='flex items-center gap-4'>
          <Link
            href={CONTACT_HREF}
            className='hidden xl:block px-4 py-2 bg-primary text-white rounded-lg outline-none hover:bg-transparent hover:text-primary border border-primary duration-500 text-base font-semibold'>
            Kontak
          </Link>
          <button
            onClick={() => setNavbarOpen(!navbarOpen)}
            className='block xl:hidden p-2 rounded-lg hover:cursor-pointer'
            aria-label='Buka menu'
            aria-expanded={navbarOpen}>
            <span className='block w-6 h-0.5 bg-darkblue dark:bg-white'></span>
            <span className='block w-6 h-0.5 bg-darkblue dark:bg-white mt-1.5'></span>
            <span className='block w-6 h-0.5 bg-darkblue dark:bg-white mt-1.5'></span>
          </button>
        </div>
      </div>
      {navbarOpen && (
        <div className='fixed top-0 left-0 w-full h-full bg-black/50 z-40' />
      )}
      <div
        ref={mobileMenuRef}
        className={`xl:hidden fixed top-0 right-0 h-full w-full bg-white dark:bg-darklight shadow-lg transform transition-transform duration-300 max-w-xs ${
          navbarOpen ? 'translate-x-0' : 'translate-x-full'
        } z-50`}>
        <div className='flex items-center justify-between p-4'>
          <Logo />
          <button
            onClick={() => setNavbarOpen(false)}
            aria-label='Tutup menu'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              className='dark:text-white dark:hover:text-primary hover:text-primary hover:cursor-pointer'>
              <path
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>
        <nav className='flex flex-col items-start p-4'>
          {navlink.map((item, index) => (
            <MobileHeaderLink key={index} item={item} />
          ))}
          <div className='mt-4 flex flex-col gap-4 w-full'>
            <Link
              href={CONTACT_HREF}
              className='px-4 py-2 bg-primary text-white rounded-lg outline-none hover:bg-transparent hover:text-primary border border-primary duration-500 text-base font-semibold text-center'
              onClick={() => setNavbarOpen(false)}>
              Kontak
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header

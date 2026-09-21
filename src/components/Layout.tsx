import { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import wordmarkPreto from '@/assets/brand/wordmark-preto.png'
import wordmarkMarmore from '@/assets/brand/wordmark-marmore.png'

export function Layout() {
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const scrollRef = useRef<HTMLDivElement>(null)
  const isHome = pathname === '/'
  const headerOverHero = isHome && !scrolled

  useEffect(() => {
    const el = scrollRef.current
    if (!isHome || !el) return
    const onScroll = () => setScrolled(el.scrollTop > el.clientHeight * 0.7)
    onScroll()
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [isHome])

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0)
  }, [pathname])

  return (
    <div
      ref={scrollRef}
      data-scroll-container
      className="relative mx-auto h-svh max-w-md overflow-x-hidden overflow-y-auto overscroll-contain bg-papel pb-24"
    >
      <header
        className={`sticky top-0 z-20 flex h-14 items-center justify-between border-b px-4 transition-[background-color,border-color,backdrop-filter] duration-300 ease-out relative ${
          headerOverHero
            ? 'border-transparent text-papel-inv'
            : 'border-linha bg-papel/90 text-tinta backdrop-blur'
        }`}
      >
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 transition-opacity duration-300 ease-out ${
            headerOverHero ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.08) 75%, rgba(0,0,0,0) 100%)',
          }}
        />
        <div className="w-5" aria-hidden />
        <Link to="/" className="relative block h-11 w-28">
          <img
            src={wordmarkMarmore}
            alt="Arquetypus"
            className={`absolute inset-0 h-full w-full object-contain object-center transition-opacity duration-300 ease-out ${
              headerOverHero ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <img
            src={wordmarkPreto}
            alt="Arquetypus"
            className={`absolute inset-0 h-full w-full object-contain object-center transition-opacity duration-300 ease-out ${
              headerOverHero ? 'opacity-0' : 'opacity-100'
            }`}
          />
        </Link>
        <div className="w-5" aria-hidden />
      </header>

      <main key={pathname} className="page-fade">
        <Outlet />
      </main>
    </div>
  )
}

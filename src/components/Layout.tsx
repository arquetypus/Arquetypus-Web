import { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { REWARD_FREIGHT } from '@/data/home'
import { Drawer } from '@/components/Drawer'
import { CaptureModal } from '@/components/CaptureModal'

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export function Layout() {
  const { items, count, subtotal, removeItem, clear } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const scrollRef = useRef<HTMLDivElement>(null)
  const isHome = pathname === '/'
  const remaining = Math.max(0, REWARD_FREIGHT - subtotal)
  const progress = Math.min(100, (subtotal / REWARD_FREIGHT) * 100)
  const headerOverHero = isHome && !scrolled
  const hideBottomBar = ['/loja/', '/resultado'].some((p) => pathname.startsWith(p))

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

  useEffect(() => setCartOpen(false), [pathname])

  return (
    <div
      ref={scrollRef}
      data-scroll-container
      className="relative mx-auto h-svh max-w-md overflow-y-auto overscroll-contain bg-papel pb-24"
    >
      <header
        className={`sticky top-0 z-20 flex h-12 items-center justify-between border-b px-4 transition-colors ${
          headerOverHero
            ? 'border-transparent text-papel-inv'
            : 'border-linha bg-papel/90 text-tinta backdrop-blur'
        }`}
      >
        <button aria-label="Abrir menu" onClick={() => setMenuOpen(true)} className="text-lg">
          ☰
        </button>
        <Link to="/" className="font-mono text-xs tracking-[0.22em] uppercase">
          Arquetypus
        </Link>
        <button
          onClick={() => count > 0 && setCartOpen((v) => !v)}
          className="font-mono text-xs"
          aria-label={`Sacola: ${count} itens`}
        >
          ◎ {count}
        </button>
      </header>

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      <CaptureModal />

      <main key={pathname} className="page-fade">
        <Outlet />
      </main>

      <button
        aria-label="Falar no WhatsApp"
        className="fixed right-4 bottom-24 z-20 flex size-12 items-center justify-center rounded-full bg-zap text-white shadow-lg"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 fill-current">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.13c-.24.68-1.4 1.3-1.94 1.38-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-3s.75-2.13 1.02-2.42c.27-.29.58-.36.78-.36h.56c.18 0 .42-.07.66.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.14-.3.3-.13.59.17.29.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.35 1.46.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.39-.24.65-.14.27.1 1.68.79 1.97.94.29.14.48.22.55.34.07.12.07.7-.17 1.38z" />
        </svg>
      </button>

      {cartOpen && count > 0 && (
        <div
          className={`fixed inset-x-0 z-20 mx-auto max-w-md rounded-t-2xl border border-b-0 border-linha bg-papel shadow-xl ${
            hideBottomBar ? 'bottom-6' : 'bottom-[108px]'
          }`}
        >
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <span className="font-mono text-[10px] tracking-widest text-tinta-3 uppercase">
              Sua sacola
            </span>
            <button
              onClick={() => {
                clear()
                setCartOpen(false)
              }}
              className="font-mono text-[10px] tracking-wide text-alerta uppercase"
            >
              Limpar tudo
            </button>
          </div>
          <div className="max-h-52 overflow-y-auto px-4 pb-3">
            {items.map((item) => (
              <div
                key={item.key}
                className="flex items-center gap-3 border-b border-linha py-2.5 last:border-b-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{item.label}</p>
                  <p className="font-mono text-[9px] text-tinta-3">
                    {item.qty}× {brl(item.unitPrice)}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-medium">
                  {brl(item.unitPrice * item.qty)}
                </span>
                <button
                  onClick={() => removeItem(item.key)}
                  aria-label={`Remover ${item.label}`}
                  className="shrink-0 text-base text-tinta-3"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!hideBottomBar && (
        <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md border-t border-linha bg-papel">
          <button
            onClick={() => count > 0 && setCartOpen((v) => !v)}
            className="flex w-full items-center justify-between px-4 pt-2 font-mono text-[9px] tracking-wide text-tinta-3 uppercase"
          >
            <span>
              {count === 0 ? 'Sacola vazia' : `${count} ${count === 1 ? 'item' : 'itens'} · ${brl(subtotal)}`}
            </span>
            <span>{remaining === 0 ? 'Frete grátis desbloqueado' : `Faltam ${brl(remaining)}`}</span>
          </button>
          <div className="mx-4 mt-1.5 h-1 rounded-full bg-linha">
            <div className="h-1 rounded-full bg-latao transition-[width]" style={{ width: `${progress}%` }} />
          </div>
          <div className="px-4 py-3">
            <Link
              to="/teste"
              className="block w-full rounded-lg bg-tinta py-3.5 text-center text-sm font-medium tracking-wide text-papel uppercase"
            >
              Fazer o teste
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

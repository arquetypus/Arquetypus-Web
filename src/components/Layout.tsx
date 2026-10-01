import { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { scrollToId } from '@/lib/scrollToId'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { isBoutiqueLayout, useThemeState } from '@/lib/theme'
import { AnnouncementBar } from '@/components/boutique/BoutiqueMore'
import wordmarkPreto from '@/assets/brand/wordmark-preto.png'
import wordmarkMarmore from '@/assets/brand/wordmark-marmore.png'

// Navegação do header no desktop (lg+) — mesmos rótulos do rodapé/Drawer. Âncoras (/#id) rolam até a
// seção da home; no celular o header segue só com o logo (Drawer desconectado de propósito)
const NAV_LEFT = [
  { label: 'Os 9 arquétipos', to: '/#catalogo' },
  { label: 'Coleções', to: '/#segmentos' },
]
const NAV_RIGHT = [
  { label: 'Diário olfativo', to: '/#diario' },
  { label: 'Seja criador', to: '/criadores' },
]

export function Layout() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  // com pop-up aberto (state.backgroundLocation), o Layout continua refletindo a página de fundo —
  // senão a home remontaria e voltaria ao topo ao abrir o pop-up de compra
  const { pathname } =
    (location.state as { backgroundLocation?: typeof location } | null)?.backgroundLocation ?? location
  const scrollRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const isHome = pathname === '/'
  // header transparente só sobre hero de foto/vídeo em tela cheia; os outros heros têm fundo próprio
  const { theme, hero } = useThemeState()
  const isBoutique = isBoutiqueLayout(theme)
  const headerOverHero = isHome && !scrolled && (hero === 'padrao' || hero === 'cinema')

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

  // chegou na home com âncora (link do header/rodapé vindo de outra página): rola até a seção depois de montar
  useEffect(() => {
    if (pathname !== '/' || !location.hash) return
    const target = location.hash.slice(1)
    const id = requestAnimationFrame(() => scrollToId(target))
    // 2ª passada: em visita fria as imagens acima ainda carregam e mudam a altura da página durante a rolagem
    const fix = setTimeout(() => scrollToId(target), 1200)
    return () => {
      cancelAnimationFrame(id)
      clearTimeout(fix)
    }
  }, [pathname, location.hash])

  function onNavClick(e: React.MouseEvent, to: string) {
    const [path, hash] = to.split('#')
    if (!hash) return
    e.preventDefault()
    // na home: só rola (o Link não rolaria no container próprio); fora dela: vai pra home com a âncora
    if (location.pathname === '/') scrollToId(hash)
    else navigate({ pathname: path || '/', hash })
  }

  const navLink = (l: { label: string; to: string }) => (
    <Link
      key={l.to}
      to={l.to}
      onClick={(e) => onNavClick(e, l.to)}
      className="group/nav relative py-2 font-label text-[10.5px] tracking-[0.2em] uppercase opacity-80 transition-opacity hover:opacity-100"
    >
      {l.label}
      {/* filete dourado que cresce do centro no hover */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0.5 h-px origin-center scale-x-0 bg-latao transition-transform duration-300 ease-out group-hover/nav:scale-x-100"
      />
    </Link>
  )

  return (
    <div
      ref={scrollRef}
      data-scroll-container
      className="relative mx-auto h-svh max-w-md md:max-w-none overflow-x-hidden overflow-y-auto overscroll-contain bg-papel pb-24"
    >
      {/* Boutique: faixa de avisos (frete, selos) acima do header — rola junto, o header continua grudado */}
      {isBoutique && <AnnouncementBar />}
      <header
        className={`site-header sticky top-0 z-20 flex h-14 items-center justify-between border-b lg:grid lg:grid-cols-[1fr_auto_1fr] px-4 md:px-10 lg:h-16 transition-[background-color,border-color,backdrop-filter] lg:transition-[background-color,border-color,backdrop-filter,margin,top,border-radius] duration-300 ease-out relative ${
          headerOverHero
            ? // desktop: header flutuante — card arredondado com respiro, que gruda no topo ao rolar
              'border-transparent text-papel-inv lg:top-6 lg:mx-10 lg:rounded-2xl lg:border lg:border-papel-inv/15 lg:bg-noite/35 lg:backdrop-blur-md'
            : 'border-linha bg-papel/90 text-tinta backdrop-blur'
        }`}
      >
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 transition-opacity duration-300 ease-out lg:hidden ${
            headerOverHero ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.08) 75%, rgba(0,0,0,0) 100%)',
          }}
        />
        <div className="w-5 lg:hidden" aria-hidden />
        <nav aria-label="Principal" className="hidden items-center gap-8 lg:flex xl:gap-10">
          {NAV_LEFT.map(navLink)}
        </nav>
        <Link
          to="/"
          aria-label="Arquétypus — voltar ao início"
          onClick={(e) => {
            // já na home (sem pop-up aberto): o Link não faria nada — sobe suavemente ao topo
            if (location.pathname === '/') {
              e.preventDefault()
              scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }}
          className="relative block h-11 w-28 lg:h-12 lg:w-32"
        >
          <img
            src={wordmarkMarmore}
            alt="Arquétypus"
            className={`absolute inset-0 h-full w-full object-contain object-center transition-opacity duration-300 ease-out ${
              headerOverHero ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <img
            src={wordmarkPreto}
            alt="Arquétypus"
            // logo-tinta: na direção "Noite Imperial" (fundo escuro) o CSS inverte pra claro
            className={`logo-tinta absolute inset-0 h-full w-full object-contain object-center transition-opacity duration-300 ease-out ${
              headerOverHero ? 'opacity-0' : 'opacity-100'
            }`}
          />
        </Link>
        <div className="w-5 lg:hidden" aria-hidden />
        <nav aria-label="Secundária" className="hidden items-center justify-end gap-8 lg:flex xl:gap-10">
          {NAV_RIGHT.map(navLink)}
        </nav>
      </header>

      <main key={pathname} className="page-fade">
        <Outlet />
      </main>
      <ThemeSwitcher />
    </div>
  )
}

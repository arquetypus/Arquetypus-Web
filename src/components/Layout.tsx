import { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { hasPreservedHydrationScroll, scrollToId } from '@/lib/scrollToId'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { Drawer } from '@/components/Drawer'
import { BuscaDesktop, BuscaMobile } from '@/components/Busca'
import { FooterBoutique } from '@/components/boutique/BoutiqueMore'
import { useThemeState } from '@/lib/theme'
import wordmarkPreto from '@/assets/brand/wordmark-preto.png'
import wordmarkMarmore from '@/assets/brand/wordmark-marmore.png'

// Navegação do header no desktop (lg+) — mesmos rótulos do rodapé/Drawer. Âncoras (/#id) rolam até a
// seção da home. Busca e sacola à direita (celular: ícones; desktop: campo + sacola); no celular o menu (Drawer)
// fica à esquerda
const NAV_LEFT = [
  { label: 'Os 9 arquétipos', to: '/#catalogo' },
  { label: 'Coleções', to: '/#segmentos' },
]

export function Layout() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  // com pop-up aberto (state.backgroundLocation), o Layout continua refletindo a página de fundo —
  // senão a home remontaria e voltaria ao topo ao abrir o pop-up de compra
  const { pathname } =
    (location.state as { backgroundLocation?: typeof location } | null)?.backgroundLocation ?? location
  const scrollRef = useRef<HTMLDivElement>(null)
  const previousPath = useRef(pathname)
  const initialAnchor = useRef(true)
  const navigate = useNavigate()
  const isHome = pathname === '/'
  // header transparente só sobre hero de foto/vídeo em tela cheia; os outros heros têm fundo próprio
  const { hero } = useThemeState()
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
    // A hidratação não é navegação: preserva scroll já iniciado no HTML estático.
    if (previousPath.current === pathname) return
    previousPath.current = pathname
    scrollRef.current?.scrollTo(0, 0)
  }, [pathname])

  // chegou na home com âncora (link do header/rodapé vindo de outra página): rola até a seção depois de montar
  useEffect(() => {
    const first = initialAnchor.current
    initialAnchor.current = false
    if (pathname !== '/' || !location.hash) return
    // O navegador já pode ter seguido a âncora, e o visitante continuado a rolar.
    if (first && hasPreservedHydrationScroll()) return
    const target = location.hash.slice(1)
    const el = scrollRef.current
    let interrupted = false
    const interrupt = () => { interrupted = true }
    for (const event of ['wheel', 'touchstart', 'pointerdown', 'keydown']) el?.addEventListener(event, interrupt, { passive: true })
    const id = requestAnimationFrame(() => { if (!interrupted) scrollToId(target) })
    // 2ª passada: em visita fria as imagens acima ainda carregam e mudam a altura da página durante a rolagem
    const fix = setTimeout(() => { if (!interrupted) scrollToId(target) }, 1200)
    return () => {
      cancelAnimationFrame(id)
      clearTimeout(fix)
      for (const event of ['wheel', 'touchstart', 'pointerdown', 'keydown']) el?.removeEventListener(event, interrupt)
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
      <header
        className={`site-header sticky top-0 z-20 grid h-14 grid-cols-[1fr_auto_1fr] items-center px-4 md:px-10 lg:h-20 transition-[background-color,border-color,backdrop-filter] lg:transition-[background-color,border-color,backdrop-filter,margin,top,border-radius] duration-300 ease-out relative ${
          !headerOverHero
            ? 'border-linha bg-papel/90 text-tinta backdrop-blur'
            : hero === 'cinema'
              ? // sobre o hero do Cinema: no celular o header É a faixa preta de cima (mesma altura, h-14);
                // no desktop, barra transparente de ponta a ponta. Nos dois, o filete dourado embaixo
                'text-papel-inv'
              : // desktop: header flutuante — card arredondado com respiro, que gruda no topo ao rolar
                'border-transparent text-papel-inv lg:top-6 lg:mx-10 lg:rounded-2xl lg:border lg:border-papel-inv/15 lg:bg-noite/35 lg:backdrop-blur-md'
        }`}
      >
        <div
          aria-hidden
          // véu escuro atrás do header transparente. Cinema: só no desktop (no celular a faixa preta já faz o fundo);
          // carrossel padrão: só no celular (no desktop o card flutuante tem fundo próprio)
          className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 transition-opacity duration-300 ease-out lg:h-40 ${hero === 'cinema' ? 'hidden lg:block' : 'lg:hidden'} ${
            headerOverHero ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.08) 75%, rgba(0,0,0,0) 100%)',
          }}
        />
        {/* filete dourado na base do header — some nas pontas. Fica fora só no card flutuante do carrossel padrão */}
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-px ${headerOverHero && hero !== 'cinema' ? 'lg:hidden' : ''}`}
          style={{ background: 'linear-gradient(to right, color-mix(in srgb, var(--color-latao) 15%, transparent), var(--color-latao) 50%, color-mix(in srgb, var(--color-latao) 15%, transparent))' }}
        />

        <div className="flex items-center justify-self-start">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            className="-ml-2 grid size-10 cursor-pointer place-items-center lg:hidden"
          >
            {/* duas linhas de comprimentos diferentes — mais leve que o "hambúrguer" de três */}
            <span aria-hidden className="flex w-[22px] flex-col items-start gap-[7px]">
              <span className="block h-px w-full bg-current" />
              <span className="block h-px w-3/5 bg-current" />
            </span>
          </button>
          <nav aria-label="Principal" className="hidden items-center gap-8 lg:flex xl:gap-10">
            {NAV_LEFT.map(navLink)}
          </nav>
        </div>

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
          className="relative block h-10 w-28 lg:h-12 lg:w-32"
        >
          <img
            src={wordmarkMarmore}
            alt="Arquétypus"
            // o logo à vista é o LCP da home (o Chrome descarta a foto do hero, de pouca informação por pixel): alta
            // prioridade — o React copia pro <link rel="preload"> do HTML pré-renderizado (out/2026)
            fetchPriority={headerOverHero ? 'high' : 'low'}
            className={`absolute inset-0 h-full w-full object-contain object-center transition-opacity duration-300 ease-out ${
              headerOverHero ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <img
            src={wordmarkPreto}
            alt="Arquétypus"
            fetchPriority={headerOverHero ? 'low' : 'high'}
            // logo-tinta: na direção "Noite Imperial" (fundo escuro) o CSS inverte pra claro
            className={`logo-tinta absolute inset-0 h-full w-full object-contain object-center transition-opacity duration-300 ease-out ${
              headerOverHero ? 'opacity-0' : 'opacity-100'
            }`}
          />
        </Link>

        <div className="flex items-center justify-self-end">
          {/* busca (out/2026, components/Busca.tsx: campo com painel no desktop, lupa com tela cheia no celular) e
              sacola (só visual — sem checkout ainda) */}
          <div className="-mr-2 flex items-center lg:mr-0 lg:gap-6">
            <BuscaMobile />
            <BuscaDesktop />
            <button type="button" aria-label="Sacola (em breve)" className="grid size-10 place-items-center">
              <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" className="size-[19px] lg:size-5">
                <path d="M5.5 8h13l-1 12.5h-11L5.5 8Z" />
                <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} onNavClick={onNavClick} />

      <main key={pathname} className="page-fade">
        <Outlet />
      </main>
      {/* mesmo rodapé da home em todas as outras páginas (a home monta o dela, por direção visual) */}
      {!isHome && <FooterBoutique />}
      <ThemeSwitcher />
    </div>
  )
}

import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HERO_SLIDES, QUIZ_CTA } from '@/data/home'
import { scrollToId } from '@/lib/scrollToId'
import { brl, FilterTabs, parcela, pix, type CatalogProps } from './shared'
import { productPath } from '@/data/archetypes'

/**
 * Direção "Cinema" (ThemeSwitcher) — campanha de perfume como filme noir. Referências da Behance: "Voléa —
 * Niche Perfume Brand Identity" (vermelho profundo), "NOCTRA", "NOIRÉA — The Art of Scent" e "Trémoille".
 * Preto, burgundy da paleta de arquétipos da marca, serifa em itálico; hero em tela cheia (carrossel) com
 * faixas de cinema e o catálogo como "elenco": fotos das pessoas com o frasco, uma por arquétipo.
 */

// foto da pessoa com o frasco (a mesma da 2ª foto da galeria da PDP); arquivo = id do arquétipo
const LIFESTYLE: Record<string, string> = Object.fromEntries(
  Object.entries(import.meta.glob<string>('@/assets/fotos/pdp-lifestyle/*.jpg', { eager: true, import: 'default' })).map(
    ([path, src]) => [path.split('/').pop()!.replace('.jpg', ''), src],
  ),
)

const AUTOPLAY_MS = 4000
// arrasto mínimo (px) pra trocar de slide no gesto de deslizar
const SWIPE_PX = 50

/** Hero em tela cheia como carrossel (mesmos slides do HeroCarousel: vídeo + Afrodite + Guerreiro), com as
 *  faixas de cinema, vinheta e véu na cor de cada banner. Troca em fade; barras de progresso no rodapé. */
export function HeroCinema() {
  const location = useLocation()
  const [current, setCurrent] = useState(0)
  const [startup, setStartup] = useState({ started: false, animate: false })
  const videoRef = useRef<HTMLVideoElement>(null)
  const [advanced, setAdvanced] = useState(false)
  const total = HERO_SLIDES.length
  const slide = HERO_SLIDES[current]
  const duration = 'durationMs' in slide ? slide.durationMs : AUTOPLAY_MS

  const next = useCallback(() => {
    setAdvanced(true)
    setCurrent((c) => (c + 1) % total)
  }, [total])
  const prev = useCallback(() => {
    setAdvanced(true)
    setCurrent((c) => (c - 1 + total) % total)
  }, [total])

  useLayoutEffect(() => {
    const state = document.documentElement.dataset.reveal
    setStartup({ started: true, animate: state === 'pending' || state === 'ready' })
  }, [])

  useLayoutEffect(() => {
    if (!startup.started) return
    // Mesmo commit: CSS é habilitado, playback é solicitado e o relógio começa.
    // Falha de autoplay mantém o poster, sem interromper a navegação do carrossel.
    const video = videoRef.current
    void video?.play().catch(() => {})
    const timer = setTimeout(next, duration)
    return () => {
      clearTimeout(timer)
      video?.pause()
    }
  }, [current, next, duration, startup.started])

  // deslizar com o dedo (só toque/caneta; touch-pan-y deixa o scroll vertical com o navegador)
  const dragStart = useRef<number | null>(null)
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') dragStart.current = e.clientX
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStart.current === null) return
    const dx = e.clientX - dragStart.current
    dragStart.current = null
    if (dx <= -SWIPE_PX) next()
    else if (dx >= SWIPE_PX) prev()
  }

  const barras = (
    <div className="flex w-48 items-center gap-1.5 lg:w-72">
      {HERO_SLIDES.map((s, i) => (
        <button
          key={s.id}
          type="button"
          onClick={() => {
            setAdvanced(true)
            setCurrent(i)
          }}
          aria-label={`Ir para o slide ${i + 1}`}
          aria-current={i === current}
          className="flex h-4 flex-1 cursor-pointer items-center"
        >
          <span className="block h-px w-full overflow-hidden bg-papel-inv/25">
            {i < current ? (
              <span className="block h-full w-full bg-latao" />
            ) : i === current ? (
              <span key={`bar-${current}`} className="hero-timer-bar block h-full bg-latao" style={{ animationDuration: `${duration}ms` }} />
            ) : null}
          </span>
        </button>
      ))}
    </div>
  )

  const botao =
    'hero-fade-up mt-5 inline-block cursor-pointer border border-papel-inv/50 px-6 py-3 font-label text-[10px] tracking-[0.3em] uppercase lg:mt-6 lg:px-8 lg:py-3.5 lg:text-[11px] transition-colors hover:border-latao hover:bg-latao hover:text-black'

  return (
    <section
      id="inicio"
      data-hero-started={startup.started}
      data-hero-animate={startup.started && (startup.animate || advanced)}
      className="hero-tint sticky top-0 h-svh min-h-[680px] touch-pan-y overflow-hidden bg-black text-papel-inv"
      // sticky: o banner fica parado e as seções sobem por cima dele (como o carrossel do Editorial).
      // Tela cheia; quem sinaliza que a página continua é o "Role" no rodapé do banner
      // cor do degradê atrás do texto acompanha o banner (`tint` em HERO_SLIDES); transição em index.css
      style={{ '--hero-tint': slide.tint } as React.CSSProperties}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (dragStart.current = null)}
    >
      {HERO_SLIDES.map((s, i) => (
        <div
          key={s.id}
          aria-hidden={i !== current}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out motion-reduce:transition-none ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <picture>
            <source media="(min-width: 1024px)" srcSet={s.imgDesktop} />
            <img
              src={s.img}
              alt={s.alt}
              className={`absolute inset-0 h-full w-full object-cover transition-transform ease-out motion-reduce:scale-100 motion-reduce:transition-none ${
                i === current ? 'scale-100 duration-[6000ms]' : 'scale-[1.08] delay-[1200ms] duration-0'
              }`}
            />
          </picture>
          {'video' in s && i === current && (
            // monta só no slide ativo: ao voltar pro slide, o vídeo recomeça junto com a barra
            <video
              ref={videoRef}
              src={s.video}
              poster={s.img}
              muted
              playsInline
              preload="auto"
              aria-hidden
              // desktop mostra o still 16:9 (imgDesktop) até existir o vídeo 16:9
              className="absolute inset-0 h-full w-full object-cover lg:hidden"
            />
          )}
        </div>
      ))}
      {/* vinheta suave nas bordas */}
      <div aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)' }} />
      {/* véu na cor do banner (`tint` em HERO_SLIDES), como no carrossel do Editorial. Celular: cobre a foto toda,
          cheio até onde a seção de baixo começa (--hero-sobe) e cada vez mais leve pra cima. Desktop: só na base */}
      <div
        aria-hidden
        className="absolute inset-0 lg:hidden"
        style={{
          background:
            'linear-gradient(to top, var(--hero-tint) 0, var(--hero-tint) var(--hero-sobe), color-mix(in srgb, var(--hero-tint) 45%, transparent) 55%, color-mix(in srgb, var(--hero-tint) 20%, transparent) 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 hidden lg:block"
        style={{ background: 'linear-gradient(to top, color-mix(in srgb, var(--hero-tint) 75%, transparent), transparent 55%)' }}
      />
      {/* desktop: a foto dos frascos ocupa a direita — escurece a esquerda, onde fica o texto */}
      <div aria-hidden className="absolute inset-0 hidden bg-gradient-to-r from-(--hero-tint)/85 via-(--hero-tint)/40 to-transparent lg:block" />
      {/* faixa de cinema só em cima e só no celular, com a altura do header (h-14), que fica sobre ela e funciona
          como a própria faixa. Embaixo a foto vai até a seção que sobe por cima (out/2026) */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-14 bg-black lg:hidden" />

      {/* parte visível do banner: a 1ª seção sobe por cima dele (--hero-sobe em index.css), então texto, barras e "Role" ficam presos a esta área, acima da ponta da seção */}
      <div className="absolute inset-x-0 top-0 bottom-(--hero-sobe)">

      {/* key remonta a cada slide pra reiniciar o fade-up */}
      <div
        key={slide.id}
        // celular: texto encostado embaixo, logo acima das barras (que ficam nos últimos 56px)
        className="absolute inset-x-0 bottom-14 px-5 text-center lg:right-auto lg:bottom-[6svh] lg:left-16 lg:max-w-2xl lg:px-0 lg:text-left"
      >
        <p className="hero-fade-up font-label text-[9px] tracking-[0.45em] uppercase lg:text-[10px] lg:tracking-[0.5em]" style={{ color: slide.eyebrowColor, animationDelay: '100ms' }}>
          {slide.eyebrow}
        </p>
        <h1
          className="hero-fade-up mx-auto mt-2.5 max-w-[15ch] font-display text-[34px] leading-[1.02] lg:mt-3 lg:leading-[1] text-balance italic md:text-6xl lg:mx-0 lg:text-[min(4.5rem,7.5svh)]"
          style={{ animationDelay: '200ms' }}
        >
          {slide.heading.replace(/\n/g, ' ')}
        </h1>
        {/* subtítulo do 1º banner só no desktop: no celular o título + CTA do quiz já bastam (out/2026) */}
        <p
          className={`hero-fade-up mx-auto mt-2.5 max-w-[40ch] text-[13px] text-papel-inv/75 lg:mx-0 lg:mt-3 lg:text-base ${slide.id === 'video' ? 'hidden lg:block' : ''}`}
          style={{ animationDelay: '250ms' }}
        >
          {slide.sub}
        </p>
        {'cta' in slide && slide.cta ? (
          // PDP (/body-splash/…) abre o pop-up de compra por cima da home (ver App.tsx)
          <Link to={slide.cta.to} state={{ backgroundLocation: location }} className={botao} style={{ animationDelay: '300ms' }}>
            {slide.cta.label}
          </Link>
        ) : (
          // 1º banner: CTA do quiz, desligado até o quiz existir (ver QUIZ_CTA)
          <span className="hero-fade-up flex flex-col items-center lg:items-start" style={{ animationDelay: '300ms' }}>
            <button type="button" disabled aria-describedby="quiz-aviso" className={`${botao} cursor-default! opacity-80 hover:border-papel-inv/50! hover:bg-transparent! hover:text-papel-inv!`}>
              {QUIZ_CTA.label}
            </button>
            <span id="quiz-aviso" className="mt-2 font-label text-[8.5px] lg:mt-2.5 lg:text-[9px] tracking-[0.35em] text-papel-inv/60 uppercase">
              {QUIZ_CTA.aviso}
            </span>
          </span>
        )}
        {/* desktop: barras de progresso logo abaixo do CTA, no fluxo do texto (não sobrepõem em tela baixa) */}
        <div className="mt-7 hidden items-center gap-4 lg:flex">
          <button type="button" onClick={prev} aria-label="Slide anterior" className="cursor-pointer text-sm text-papel-inv/60 hover:text-latao">
            ←
          </button>
          {barras}
          <button type="button" onClick={next} aria-label="Próximo slide" className="cursor-pointer text-sm text-papel-inv/60 hover:text-latao">
            →
          </button>
        </div>
      </div>

      {/* celular: barras de progresso (clicáveis) centradas no rodapé da parte visível */}
      <div className="absolute inset-x-0 bottom-0 flex h-14 items-center justify-center px-5 lg:hidden">
        {barras}
      </div>

      {/* indicação de scroll: flechinha discreta que sobe e se apaga em loop (animação em index.css, .scroll-cue).
          Celular: canto inferior direito, na altura das barras; desktop: centro do rodapé da parte visível.
          Leva pra primeira seção */}
      <button
        type="button"
        onClick={() => scrollToId('comunidade')}
        aria-label="Rolar para a próxima seção"
        className="group absolute right-5 bottom-0 flex h-14 cursor-pointer items-center lg:right-auto lg:left-1/2 lg:h-16 lg:-translate-x-1/2"
      >
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="scroll-cue size-4 text-papel-inv/45 transition-colors group-hover:text-papel-inv/80 lg:size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 13V3M4 7l4-4 4 4" />
        </svg>
      </button>
      </div>
    </section>
  )
}

export function CatalogCinema({ items, filtro, setFiltro, filtros }: CatalogProps) {
  const location = useLocation()
  const trilho = useRef<HTMLUListElement>(null)
  const passo = (dir: 1 | -1) => {
    const el = trilho.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }
  return (
    <section id="catalogo" className="bg-papel py-14 lg:py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 md:px-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-label text-[10px] tracking-[0.5em] text-latao uppercase">O elenco</p>
          <h2 className="mt-4 font-display text-[34px] leading-[1.05] text-tinta italic lg:text-6xl">
            Nove fragrâncias. <span className="text-latao">Diferentes versões de você.</span>
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <FilterTabs
            filtro={filtro}
            setFiltro={setFiltro}
            filtros={filtros}
            base="border-b pb-1 font-label text-[10px] tracking-[0.25em] uppercase"
            on="border-latao text-latao"
            off="border-transparent text-tinta-3 hover:text-tinta"
          />
          <div className="hidden gap-2 lg:flex">
            {([-1, 1] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => passo(d)}
                aria-label={d < 0 ? 'Anterior' : 'Próximo'}
                className="grid size-11 cursor-pointer place-items-center rounded-full border border-linha-2 text-tinta transition-colors hover:border-latao hover:text-latao"
              >
                {d < 0 ? '←' : '→'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ul ref={trilho} className="no-scrollbar scroll-pad mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden px-4 md:px-10 lg:mt-14 lg:gap-5">
        {items.map((a) => (
          <li key={a.id} className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[30%] xl:w-[23%]">
            <Link to={productPath(a)} state={{ backgroundLocation: location }} className="no-press group relative block aspect-[3/4] overflow-hidden bg-black">
              <img
                src={LIFESTYLE[a.id]}
                alt={`Pessoa segurando o ${a.tipo.toLowerCase()} ${a.nome}`}
                loading="lazy"
                className="h-full w-full object-cover opacity-90 grayscale-[35%] transition-[transform,filter,opacity] duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-100 group-hover:grayscale-0"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <span className="absolute top-4 left-4 font-label text-[9px] tracking-[0.3em] text-papel-inv/70 uppercase">
                {a.energia}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-5 text-papel-inv">
                <b className="block font-display text-4xl leading-none font-normal italic lg:text-5xl">{a.nome}</b>
                <span className="mt-2 block text-sm text-papel-inv/75">{a.ep}</span>
              </div>
            </Link>
            {/* regra 7: preço, Pix e parcelas logo abaixo da foto */}
            <div className="flex items-end justify-between gap-3 border-b border-linha py-4">
              <span>
                <b className="block text-base font-semibold text-tinta">{brl(a.preco)}</b>
                <span className="text-[11px] text-tinta-3">
                  {brl(pix(a.preco))} no Pix · 6x de {brl(parcela(a.preco))}
                </span>
              </span>
              <Link
                to={productPath(a)}
                state={{ backgroundLocation: location }}
                className="shrink-0 font-label text-[10px] tracking-[0.3em] text-latao uppercase hover:opacity-70"
              >
                Comprar →
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

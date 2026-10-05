import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PRODUCT_BASE } from '@/data/archetypes'
import { HERO_SLIDES } from '@/data/home'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { MediaSlot } from '@/components/ui/MediaSlot'
import { scrollToId } from '@/lib/scrollToId'

const AUTOPLAY_MS = 5000
// arrasto mínimo (px) pra trocar de slide no gesto de deslizar
const SWIPE_PX = 50

export function HeroCarousel() {
  const location = useLocation()
  const [current, setCurrent] = useState(0)
  const total = HERO_SLIDES.length
  const slide = HERO_SLIDES[current]

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total])

  const duration = 'durationMs' in slide ? slide.durationMs : AUTOPLAY_MS

  useEffect(() => {
    const timer = setTimeout(next, duration)
    return () => clearTimeout(timer)
  }, [current, next, duration])

  // deslizar com o dedo: o trilho acompanha o arrasto e, ao soltar, troca se passou de SWIPE_PX.
  // Só toque/caneta — no mouse o clique no CTA e nas setas continua como está.
  // touch-pan-y no container deixa o scroll vertical com o navegador (ele dispara pointercancel)
  // liga o zoom do slide ativo só depois do primeiro frame, pra ele também animar ao abrir a página
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const dragStart = useRef<number | null>(null)
  const dragDelta = useRef(0) // valor atual do arrasto — o state pode estar defasado no pointerup
  const [dragX, setDragX] = useState<number | null>(null)

  function onPointerDown(e: React.PointerEvent) {
    if (e.pointerType === 'mouse') return
    dragStart.current = e.clientX
    dragDelta.current = 0
  }
  function onPointerMove(e: React.PointerEvent) {
    if (dragStart.current === null) return
    dragDelta.current = e.clientX - dragStart.current
    setDragX(dragDelta.current)
  }
  function onPointerUp() {
    if (dragStart.current === null) return
    const dx = dragDelta.current
    dragStart.current = null
    setDragX(null)
    if (dx <= -SWIPE_PX) next()
    else if (dx >= SWIPE_PX) prev()
  }
  function onPointerCancel() {
    dragStart.current = null
    setDragX(null)
  }

  return (
    <div
      className="hero-tint sticky top-0 flex h-svh touch-pan-y flex-col overflow-hidden bg-noite"
      // tom do escurecimento atrás do texto acompanha o slide (ver `tint` em HERO_SLIDES); transição em index.css
      style={{ '--hero-tint': slide.tint } as React.CSSProperties}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      {/* Background — MediaSlot como placeholder. Trilho com todos os slides, desliza na horizontal */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="flex h-full transition-transform duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
          style={
            dragX === null
              ? { transform: `translateX(-${current * 100}%)` }
              : { transform: `translateX(calc(-${current * 100}% + ${dragX}px))`, transition: 'none' }
          }
        >
          {HERO_SLIDES.map((s, i) => (
            <div key={s.id} className="relative h-full w-full shrink-0 overflow-hidden" aria-hidden={i !== current}>
              {/* zoom-out: inativos esperam em 1.15 (inclusive o vizinho que aparece no arrasto) e o ativo
                  desce pra 1. Quem sai só volta pra 1.15 depois de 900ms, já fora da tela */}
              <div
                className={`h-full w-full transition-transform motion-reduce:scale-100 motion-reduce:transition-none ${
                  ready && i === current
                    ? 'scale-100 duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)]'
                    : 'scale-[1.15] delay-[900ms] duration-0'
                }`}
              >
                <MediaSlot
                  aspect="auto"
                  bg="transparent"
                  src={s.img}
                  srcDesktop={s.imgDesktop}
                  requisito={s.requisito}
                  dark
                  className="h-full w-full rounded-none border-0"
                  tagClassName="top-16 right-3 lg:top-28 lg:right-10"
                  tagLabel="9:16 · 1080×1920 · tela cheia"
                />
                {'video' in s && i === current && (
                  // monta só no slide ativo: ao voltar pro slide, o vídeo recomeça do início junto com a barra
                  <video
                    src={s.video}
                    poster={s.img}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    aria-hidden
                    // desktop mostra o still 16:9 (imgDesktop) até existir o vídeo 16:9
                    className="absolute inset-0 h-full w-full object-cover lg:hidden"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gradient overlay */}
      {/* desktop: texto fica à esquerda, então o escurecimento vem da esquerda */}
      <div className="absolute inset-0 bg-gradient-to-t from-(--hero-tint) via-(--hero-tint)/40 to-(--hero-tint)/20 lg:bg-gradient-to-r lg:from-(--hero-tint)/85 lg:from-10% lg:via-(--hero-tint)/45 lg:via-35% lg:to-transparent lg:to-65%" />
      {/* desktop: base levemente escurecida pra separar contador/setas da imagem */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-1/3 bg-gradient-to-t from-(--hero-tint)/50 to-transparent lg:block" />

      {/* Conteúdo centralizado — key remonta a cada slide pra reiniciar o fade-up */}
      <div key={slide.id} className="relative z-10 mt-auto px-10 text-center text-papel-inv lg:mx-auto lg:my-auto lg:w-full lg:max-w-7xl lg:pt-24 lg:text-left">
        <Eyebrow className="hero-fade-up" style={{ color: slide.eyebrowColor, animationDelay: '100ms' }}>
          {slide.eyebrow}
        </Eyebrow>

        <h1 className="hero-fade-up mt-3 font-display text-4xl leading-[1.05] lg:text-5xl xl:text-6xl" style={{ animationDelay: '200ms' }}>
          {slide.heading.split('\n').map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </h1>

        <p className="hero-fade-up mt-3 text-sm text-papel-inv/70 lg:mt-4 lg:text-base" style={{ animationDelay: '250ms' }}>
          {slide.sub}
        </p>

        {slide.cta &&
          (slide.cta.to.startsWith('#') ? (
            <button
              onClick={() => scrollToId(slide.cta!.to.slice(1))}
              className="hero-fade-up mx-auto mt-5 block w-full max-w-xs rounded-lg lg:mt-8 lg:inline-block lg:w-auto lg:rounded-full lg:px-10 border border-papel-inv/30 bg-papel-inv/10 py-4 text-sm font-medium tracking-wide text-papel-inv uppercase backdrop-blur-sm"
              style={{ animationDelay: '300ms' }}
            >
              {slide.cta.label}
            </button>
          ) : (
            <Link
              to={slide.cta.to}
              // PDP (/body-splash/…) e /kit-descoberta abrem o pop-up de compra por cima da home (ver App.tsx)
              state={
                slide.cta.to.startsWith(PRODUCT_BASE + '/') || slide.cta.to === '/kit-descoberta'
                  ? { backgroundLocation: location }
                  : undefined
              }
              className="hero-fade-up mx-auto mt-5 block w-full max-w-xs rounded-lg lg:mt-8 lg:inline-block lg:w-auto lg:rounded-full lg:px-10 border border-papel-inv/30 bg-papel-inv/10 py-4 text-sm font-medium tracking-wide text-papel-inv uppercase backdrop-blur-sm"
              style={{ animationDelay: '300ms' }}
            >
              {slide.cta.label}
            </Link>
          ))}
      </div>

      {/* Navegação — setas com barras */}
      {/* telas baixas (iPhone 11 e afins): conteúdo desce junto com o card das seções — ver -mt em HomePage */}
      <div className="relative z-10 px-6 pt-4 pb-36 [@media(max-height:820px)]:pb-24 lg:mx-auto lg:flex lg:w-full lg:max-w-7xl lg:items-center lg:justify-center lg:gap-4 lg:px-10">
        <div className="mt-2 flex items-center gap-3 lg:mt-0 lg:w-72">
          <button
            onClick={prev}
            aria-label="Slide anterior"
            className="flex size-7 shrink-0 items-center justify-center rounded-full border border-papel-inv/20 text-sm text-papel-inv/60"
          >
            ‹
          </button>

          <div className="flex flex-1 items-center gap-1">
            {HERO_SLIDES.map((_, i) => (
              <div key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-papel-inv/20">
                {i < current ? (
                  <div className="h-full w-full rounded-full bg-papel-inv" />
                ) : i === current ? (
                  <div
                    key={`bar-${current}-${i}`}
                    className="hero-timer-bar h-full rounded-full bg-papel-inv"
                    style={{ animationDuration: `${duration}ms` }}
                  />
                ) : null}
              </div>
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Próximo slide"
            className="flex size-7 shrink-0 items-center justify-center rounded-full border border-papel-inv/20 text-sm text-papel-inv/60"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  )
}

import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HERO_SLIDES } from '@/data/home'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { MediaSlot } from '@/components/ui/MediaSlot'
import { scrollToId } from '@/lib/scrollToId'

const AUTOPLAY_MS = 5000

export function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const total = HERO_SLIDES.length
  const slide = HERO_SLIDES[current]

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total])

  useEffect(() => {
    const timer = setInterval(next, AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [current, next])

  return (
    <div className="sticky top-0 flex h-svh flex-col overflow-hidden bg-noite">
      {/* Background — MediaSlot como placeholder */}
      <div className="absolute inset-0">
        <MediaSlot
          aspect="auto"
          bg="transparent"
          requisito={slide.requisito}
          dark
          className="h-full w-full rounded-none border-0"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-noite via-noite/40 to-noite/20" />

      {/* Conteúdo centralizado */}
      <div className="relative z-10 mt-auto px-10 text-center text-papel-inv">
        <Eyebrow className="text-latao">{slide.eyebrow}</Eyebrow>

        <h1 className="mt-3 font-display text-4xl leading-[1.05]">
          {slide.heading.split('\n').map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </h1>

        <p className="mt-3 text-sm text-papel-inv/70">{slide.sub}</p>

        {slide.cta.to.startsWith('#') ? (
          <button
            onClick={() => scrollToId(slide.cta.to.slice(1))}
            className="mx-auto mt-5 block w-full max-w-xs rounded-lg border border-papel-inv/30 bg-papel-inv/10 py-4 text-sm font-medium tracking-wide text-papel-inv uppercase backdrop-blur-sm"
          >
            {slide.cta.label}
          </button>
        ) : (
          <Link
            to={slide.cta.to}
            className="mx-auto mt-5 block w-full max-w-xs rounded-lg border border-papel-inv/30 bg-papel-inv/10 py-4 text-sm font-medium tracking-wide text-papel-inv uppercase backdrop-blur-sm"
          >
            {slide.cta.label}
          </Link>
        )}
      </div>

      {/* Navegação — contador + setas com barras */}
      <div className="relative z-10 px-6 pt-4 pb-36">
        <p className="text-center font-mono text-xs tabular-nums text-papel-inv/50">
          {current + 1}
          <span className="text-papel-inv/25">/</span>
          {total}
        </p>

        <div className="mt-2 flex items-center gap-3">
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

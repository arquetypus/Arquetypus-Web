import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HERO_SLIDES } from '@/data/home'
import { scrollToId } from '@/lib/scrollToId'

const AUTOPLAY_MS = 5000

/**
 * Hero da direção "Ateliê" — capa de revista em vez de foto em tela cheia: fundo claro, título grande à
 * esquerda, a foto (vertical, a mesma do celular) numa moldura à direita com legenda, e navegação em
 * texto ("01 / 03"). Mesmos slides e textos de HERO_SLIDES; o vídeo roda dentro da moldura.
 */
export function HeroAtelie() {
  const location = useLocation()
  const [current, setCurrent] = useState(0)
  const total = HERO_SLIDES.length
  const slide = HERO_SLIDES[current]

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total])
  const duration = 'durationMs' in slide ? slide.durationMs : AUTOPLAY_MS

  useEffect(() => {
    const t = setTimeout(next, duration)
    return () => clearTimeout(t)
  }, [current, next, duration])

  const cta = 'cta' in slide ? slide.cta : undefined
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <section className="relative overflow-hidden bg-papel pt-20 pb-12 lg:min-h-svh lg:pt-28 lg:pb-16">
      {/* legenda vertical na margem, como lombada de revista */}
      <p
        aria-hidden
        className="absolute top-1/2 left-5 hidden font-label text-[9px] tracking-[0.4em] whitespace-nowrap text-tinta-3 uppercase xl:block"
        style={{ transform: 'translate(-50%, -50%) rotate(-90deg) translateY(50%)', transformOrigin: 'center' }}
      >
        Arquétypus Parfum — Edição nº 1 — Nove fragrâncias
      </p>

      <div className="mx-auto max-w-7xl px-5 md:px-10 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-12 xl:pl-20">
        {/* moldura da foto — celular em cima, desktop à direita */}
        <figure className="lg:order-last lg:col-span-5 lg:col-start-8">
          <div className="relative aspect-[4/5] overflow-hidden bg-papel-3 ring-1 ring-linha-2 lg:aspect-[3/4]">
            {HERO_SLIDES.map((s, i) => (
              <div
                key={s.id}
                aria-hidden={i !== current}
                className="absolute inset-0 transition-opacity duration-[900ms] ease-out motion-reduce:transition-none"
                style={{ opacity: i === current ? 1 : 0 }}
              >
                <img src={s.img} alt="" className="h-full w-full object-cover" />
                {'video' in s && i === current && (
                  <video
                    src={s.video}
                    poster={s.img}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    aria-hidden
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
          <figcaption className="mt-3 flex items-baseline justify-between gap-4 font-label text-[9px] tracking-[0.2em] text-tinta-3 uppercase">
            <span>{slide.eyebrow}</span>
            <span className="tabular-nums">
              {pad(current + 1)} / {pad(total)}
            </span>
          </figcaption>
        </figure>

        <div className="mt-10 lg:col-span-6 lg:mt-0">
          <div key={slide.id} className="hero-fade-up">
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-px w-10 bg-tinta" />
              <span className="font-label text-[10px] tracking-[0.3em] text-tinta-2 uppercase">Perfumaria & expressão</span>
            </div>
            {/* as quebras do texto (\n) foram pensadas pro hero em tela cheia; aqui o título corre livre */}
            <h1 className="mt-6 max-w-[14ch] font-display text-[42px] leading-[1] text-balance text-tinta md:text-6xl lg:text-7xl xl:text-[84px]">
              {slide.heading.replace(/\n/g, ' ')}
            </h1>
            <p className="mt-6 max-w-[36ch] text-base leading-relaxed text-tinta-2 lg:text-lg">{slide.sub}</p>
            {cta &&
              (cta.to.startsWith('#') ? (
                <button
                  type="button"
                  onClick={() => scrollToId(cta.to.slice(1))}
                  className="group mt-8 inline-flex items-center gap-3 font-label text-[11px] tracking-[0.2em] text-tinta uppercase"
                >
                  <span className="border-b border-tinta pb-1">{cta.label}</span>
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              ) : (
                <Link
                  to={cta.to}
                  state={cta.to.startsWith('/loja/') ? { backgroundLocation: location } : undefined}
                  className="group mt-8 inline-flex items-center gap-3 font-label text-[11px] tracking-[0.2em] text-tinta uppercase"
                >
                  <span className="border-b border-tinta pb-1">{cta.label}</span>
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              ))}
          </div>

          {/* navegação em texto + barra de progresso do slide atual */}
          <div className="mt-12 flex items-center gap-6 lg:mt-20">
            <button type="button" onClick={prev} aria-label="Slide anterior" className="font-label text-[10px] tracking-[0.2em] text-tinta-3 uppercase hover:text-tinta">
              ← Ant.
            </button>
            <div className="relative h-px flex-1 bg-linha-2">
              <span
                key={slide.id}
                className="hero-timer-bar absolute inset-y-0 left-0 bg-tinta"
                style={{ animationDuration: `${duration}ms` }}
              />
            </div>
            <button type="button" onClick={next} aria-label="Próximo slide" className="font-label text-[10px] tracking-[0.2em] text-tinta-3 uppercase hover:text-tinta">
              Próx. →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

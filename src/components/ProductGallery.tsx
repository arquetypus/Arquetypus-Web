import { useEffect, useRef, useState } from 'react'
import { MediaSlot } from '@/components/ui/MediaSlot'
import { GOLD_SHEEN } from '@/lib/goldSheen'
import type { Foto } from '@/lib/foto'

type Slide = { src: Foto; requisito: string; alt: string }

/**
 * Galeria de fotos do produto (P-02). Trilho com scroll-snap: no celular
 * desliza com o dedo; no desktop, setas aparecem no hover. Pontos embaixo
 * indicam a foto atual e também navegam. Sem fotos, cai no placeholder do MediaSlot.
 */
export function ProductGallery({ nome, bg, slides }: { nome: string; bg: string; slides: Slide[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  // dica de arrasto: as fotos avançam um pouco (mostra a borda da próxima) e voltam, toda vez que a galeria abre.
  // Desliga ao primeiro toque pra não brigar com o gesto
  const [hint, setHint] = useState(false)

  // O listener de animationend já existe quando a animação começa.
  useEffect(() => {
    const el = trackRef.current
    const moved = !!el && el.scrollLeft > 0
    // O scroll-snap funciona antes de JS; hidratação acompanha a foto escolhida.
    if (el && el.clientWidth > 0) setCurrent(Math.round(el.scrollLeft / el.clientWidth))
    setHint(slides.length > 1 && !moved)
  }, [slides.length])

  if (slides.length === 0) {
    return <MediaSlot aspect="1/1" bg={bg} alt="" requisito={`FOTO · 1:1 · 1200×1200 · FRASCO · ${nome.toUpperCase()}`} />
  }

  function goTo(i: number) {
    const el = trackRef.current
    if (!el) return
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }

  function onScroll() {
    const el = trackRef.current
    if (!el) return
    setCurrent(Math.round(el.scrollLeft / el.clientWidth))
  }

  const multi = slides.length > 1

  return (
    // lg+: miniaturas numa coluna vertical à esquerda da foto principal
    <div className="lg:flex lg:gap-3">
      {multi && (
        <div className="hidden w-[4.5rem] shrink-0 flex-col gap-3 lg:flex" aria-label="Miniaturas">
          {slides.map((s, i) => (
            <button
              key={s.src.src}
              type="button"
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === current}
              onClick={() => goTo(i)}
              className={`overflow-hidden rounded-md ring-1 transition-[opacity,box-shadow] duration-200 ${
                i === current ? 'opacity-100 ring-tinta' : 'opacity-60 ring-linha hover:opacity-100'
              }`}
            >
              <img loading="lazy" src={s.src.src} srcSet={s.src.srcSet || undefined} sizes="72px" alt="" decoding="async" className="aspect-square w-full object-cover" />
            </button>
          ))}
        </div>
      )}

    <div className="group/gallery relative min-w-0 lg:flex-1">
      {/* moldura de 1px em dourado com reflexo (degradê claro/escuro do latão) + brilho quente bem leve em volta */}
      <div
        className="rounded-[calc(var(--radius-lg)+1px)] p-px"
        style={{
          background: GOLD_SHEEN,
          boxShadow: '0 0 0 1px rgba(198,164,108,0.12), 0 6px 22px -10px rgba(198,164,108,0.55)',
        }}
      >
      <div
        ref={trackRef}
        onScroll={onScroll}
        onPointerDown={() => setHint(false)}
        role="region"
        aria-roledescription="carrossel"
        aria-label={`Fotos de ${nome}`}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-lg"
      >
        {slides.map((s, i) => (
          <div
            key={s.src.src}
            onAnimationEnd={() => setHint(false)}
            className={`w-full shrink-0 snap-center ${hint ? 'gallery-hint' : ''}`}
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${slides.length}`}
          >
            {/* 1ª foto é o topo da PDP: baixa de cara; as outras só quando a galeria chega nelas */}
            <MediaSlot aspect="1/1" bg={bg} src={s.src} alt={s.alt} prioridade={i === 0} sizes="(min-width: 1024px) 36rem, 100vw" requisito={s.requisito} className="rounded-none" />
          </div>
        ))}
      </div>
      </div>

      {multi && (
        <>
          {/* setas só com mouse (lg+), aparecem no hover da galeria */}
          {[
            { dir: -1, label: 'Foto anterior', pos: 'left-3', glyph: '‹' },
            { dir: 1, label: 'Próxima foto', pos: 'right-3', glyph: '›' },
          ].map((b) => {
            const target = current + b.dir
            const disabled = target < 0 || target >= slides.length
            return (
              <button
                key={b.dir}
                type="button"
                aria-label={b.label}
                disabled={disabled}
                onClick={() => goTo(target)}
                className={`absolute top-1/2 ${b.pos} hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-papel/85 text-xl leading-none text-tinta shadow-sm backdrop-blur-sm transition-opacity lg:flex lg:opacity-0 lg:group-hover/gallery:opacity-100 disabled:!opacity-0`}
              >
                {b.glyph}
              </button>
            )
          })}

          {/* pontos só no celular — no desktop as miniaturas fazem esse papel */}
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5 lg:hidden">
            {slides.map((s, i) => (
              <button
                key={s.src.src}
                type="button"
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === current}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full shadow-sm transition-all ${
                  i === current ? 'w-5 bg-papel' : 'w-1.5 bg-papel/55'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
    </div>
  )
}

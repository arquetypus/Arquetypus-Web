import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ARCHETYPES, getArchetype } from '@/data/archetypes'
import {
  BODEGON_IMG,
  COMPARISON,
  DIAGNOSIS,
  ENERGIES,
  FAMILIES,
  FRASCO_IMG,
  JOURNAL,
  QUALIFICATION,
  SEALS,
  SEGMENTS,
  STATS,
  UGC_CLEOPATRA_IMG,
  UGC_VIDEOS,
} from '@/data/home'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { MediaSlot } from '@/components/ui/MediaSlot'
import { KitBuilder } from '@/components/KitBuilder'
import { HeroCarousel } from '@/components/HeroCarousel'
import { Reveal } from '@/components/ui/Reveal'
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar'
import { scrollToId } from '@/lib/scrollToId'
import { useScrollProgress } from '@/lib/useScrollProgress'
import { useInfiniteCarousel } from '@/lib/useInfiniteCarousel'
import florArquetypus from '@/assets/brand/flor-arquetypus.png'
import ribbonArquetypus from '@/assets/brand/ribbon-arquetypus.png'

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const SEGMENT_TINT: Record<'F' | 'M' | 'U', string> = {
  F: 'var(--color-afrodite)',
  M: 'var(--color-guerreiro)',
  U: 'var(--color-zeus)',
}

const CATALOGO_FILTROS: { key: 'ALL' | 'F' | 'M' | 'U'; label: string }[] = [
  { key: 'ALL', label: 'Todos' },
  { key: 'F', label: 'Feminino' },
  { key: 'M', label: 'Masculino' },
  { key: 'U', label: 'Compartilhável' },
]

/** Faixa curta que suaviza a transição de bg-papel para bg-noite. */
function DarkTransition() {
  return (
    <div className="relative h-28 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, var(--color-papel-2) 0%, color-mix(in srgb, var(--color-papel-2) 90%, var(--color-noite) 10%) 15%, color-mix(in srgb, var(--color-papel-2) 68%, var(--color-noite) 32%) 32%, color-mix(in srgb, var(--color-papel-2) 42%, var(--color-noite) 58%) 50%, color-mix(in srgb, var(--color-papel-2) 20%, var(--color-noite) 80%) 68%, color-mix(in srgb, var(--color-papel-2) 6%, var(--color-noite) 94%) 85%, var(--color-noite) 100%)',
        }}
      />
      <div
        className="absolute inset-x-0 top-1/2 h-20 -translate-y-1/2"
        style={{
          background:
            'radial-gradient(ellipse at center, color-mix(in srgb, var(--color-latao) 30%, transparent) 0%, transparent 70%)',
          filter: 'blur(32px)',
        }}
      />
    </div>
  )
}

const SEAL_ICON_PATHS: Record<string, string> = {
  'Entrega garantida': 'M3 7h11v8H3V7Zm11 3h3.5L20 13v2h-3M6 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  'Rápido e seguro': 'M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Zm-3 8.5 2 2 4-4.5',
  Vegano: 'M12 21c-4-1-7-4.5-7-10 5 0 8 2 9 6 1-4 4-6 9-6 0 5.5-3 9-7 10a4 4 0 0 1-4 0Z',
  'Cruelty free': 'M12 20s-7-4.35-7-9.5A4 4 0 0 1 12 8a4 4 0 0 1 7 2.5C19 15.65 12 20 12 20Z',
}

function SealIcon({ seal, className }: { seal: string; className?: string }) {
  const d = SEAL_ICON_PATHS[seal]
  if (!d) return null
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={d} />
    </svg>
  )
}

export function HomePage() {
  const { hash } = useLocation()
  const familiesScroll = useScrollProgress<HTMLDivElement>()
  const energiesScroll = useScrollProgress<HTMLDivElement>()
  const [catalogoFiltro, setCatalogoFiltro] = useState<'ALL' | 'F' | 'M' | 'U'>('ALL')
  const catalogoFiltrado = useMemo(
    () => (catalogoFiltro === 'ALL' ? ARCHETYPES : ARCHETYPES.filter((a) => a.seg === catalogoFiltro)),
    [catalogoFiltro],
  )
  const catalogoLoop = [...catalogoFiltrado, ...catalogoFiltrado, ...catalogoFiltrado]
  const catalogoCarrossel = useInfiniteCarousel(catalogoFiltrado.length)
  const catalogoAtivo = catalogoFiltrado.length > 0 ? catalogoCarrossel.activeIndex % catalogoFiltrado.length : 0

  useEffect(() => {
    if (!hash) return
    scrollToId(hash.slice(1))
  }, [hash])

  return (
    <div className="relative -mt-14">
      {/* H-03 Hero — carrossel sticky, card sobe por cima */}
      <HeroCarousel />

      <div className="relative z-10 -mt-28 rounded-t-3xl bg-papel">
        {/* H-05 Selos — grid 2x2 com ícone, estilo trust badges */}
        <section className="grid grid-cols-2 divide-x divide-y divide-linha overflow-hidden rounded-t-3xl border-b border-linha">
          {SEALS.map((s) => (
            <div key={s} className="flex flex-col items-center gap-2 px-3 py-5">
              <SealIcon seal={s} className="size-5 text-latao" />
              <span className="text-center font-mono text-[9px] tracking-widest text-tinta-3 uppercase">{s}</span>
            </div>
          ))}
        </section>

        {/* H-08 Segmentação */}
        <Reveal as="section" id="segmentos" className="flex flex-col items-center gap-5 px-4 py-6">
          {SEGMENTS.map((seg) => (
            <button
              key={seg.name}
              onClick={() => scrollToId('catalogo')}
              className="group relative block w-[80%] overflow-hidden rounded-2xl text-left shadow-[0_2px_6px_rgba(0,0,0,0.08)] ring-1 ring-latao/50"
            >
              <MediaSlot
                aspect="4/3"
                bg="transparent"
                src={seg.img}
                requisito={`FOTO · 4:3 · 1600×1200 · LIFESTYLE · ${seg.label.toUpperCase()}`}
                className="rounded-2xl border-0 [&_img]:will-change-transform [&_img]:transition-transform [&_img]:duration-700 [&_img]:ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:[&_img]:scale-[1.06]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
                style={{
                  background: `linear-gradient(to top, color-mix(in srgb, ${SEGMENT_TINT[seg.seg]} 65%, transparent) 0%, color-mix(in srgb, ${SEGMENT_TINT[seg.seg]} 30%, transparent) 55%, transparent 100%)`,
                }}
              />
              <div className="absolute inset-x-0 bottom-0 z-10 p-4">
                <span className="block font-mono text-[9px] tracking-widest text-papel-inv/80 uppercase">
                  {seg.label}
                </span>
                <span className="mt-1 block font-display text-2xl text-papel-inv">{seg.name}</span>
                <span className="mt-1 block font-mono text-[9px] text-papel-inv/70">{seg.meta}</span>
                <span className="mt-3 block w-full rounded-full border border-papel-inv/40 bg-papel-inv/10 py-2.5 text-center text-xs font-medium text-papel-inv backdrop-blur-sm transition-colors duration-300 ease-out group-hover:border-papel-inv/60 group-hover:bg-papel-inv/20">
                  Ver coleção
                </span>
              </div>
            </button>
          ))}
        </Reveal>

        {/* H-06 Diagnóstico */}
        <Reveal
          as="section"
          className="relative z-10 px-5 pt-16 pb-16"
          style={{
            background:
              'linear-gradient(to bottom, var(--color-papel) 0%, var(--color-papel-2) 10%, var(--color-papel-2) 90%, var(--color-papel) 100%)',
          }}
        >
          <img
            src={florArquetypus}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute select-none"
            style={{
              top: '-25px',
              right: '-45px',
              width: '290px',
              height: 'auto',
              opacity: 0.38,
              maskImage: 'radial-gradient(closest-side, black 55%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(closest-side, black 55%, transparent 100%)',
            }}
          />
          <img
            src={florArquetypus}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute select-none"
            style={{
              bottom: '-40px',
              left: '-60px',
              width: '220px',
              height: 'auto',
              opacity: 0.3,
              transform: 'rotate(135deg)',
              maskImage: 'radial-gradient(closest-side, black 55%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(closest-side, black 55%, transparent 100%)',
            }}
          />

          <div className="relative z-10">
            <Eyebrow>O perfume errado</Eyebrow>
            <h2 className="mt-3 max-w-[19ch] font-display text-[28px] leading-[1.2] text-tinta">
              Você já comprou uma fragrância que não parecia sua?
            </h2>
            <p className="mt-3 text-sm text-tinta-2">
              Às vezes, o problema não está no perfume. Está na escolha.
            </p>

            <div className="mt-7 flex flex-col">
              {DIAGNOSIS.map((d, i) => (
                <div key={d.n}>
                  {i > 0 && <div className="border-t border-linha" />}
                  <div className="flex gap-4 py-4">
                    <span
                      className="font-display text-5xl leading-none font-light"
                      style={{
                        color: 'color-mix(in srgb, var(--color-latao) 32%, var(--color-papel-2) 68%)',
                      }}
                    >
                      {d.n}
                    </span>
                    <div className="pt-1.5">
                      <b className="text-base font-medium text-tinta">{d.title}</b>
                      <p className="mt-1.5 text-sm leading-relaxed text-tinta-2">{d.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-7 text-center font-display text-xl leading-snug text-tinta">
              Não comece pela marca.
              <br />
              <span className="text-latao">Comece por você.</span>
            </p>
          </div>
        </Reveal>

        {/* H-09 Por família */}
        <Reveal as="section" className="pt-9 pb-6">
          <div className="px-4">
            <Eyebrow>Entrada racional</Eyebrow>
            <h2 className="mt-2.5 font-display text-2xl">Descubra por família</h2>
            <p className="mt-1.5 text-sm text-tinta-2">Encontre a atmosfera que mais combina com você.</p>
          </div>
          <div
            ref={familiesScroll.ref}
            className="scroll-pad no-scrollbar mt-2 flex snap-x gap-4 overflow-x-auto px-4 pb-2"
          >
            {FAMILIES.map((f) => (
              <div
                key={f.nome}
                className="group w-60 shrink-0 snap-start hover:-translate-y-1"
                style={{ transition: 'transform 500ms cubic-bezier(0.16,1,0.3,1)', willChange: 'transform' }}
              >
                <button
                  onClick={() => scrollToId('catalogo')}
                  className="relative block w-full overflow-hidden rounded-3xl border border-linha-2 text-left"
                  style={{ aspectRatio: '4/5', boxShadow: '0 10px 24px -12px rgba(44,44,41,0.28)' }}
                >
                  <img
                    src={f.img}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                    style={{ willChange: 'transform' }}
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5"
                    style={{ background: 'linear-gradient(180deg, rgba(20,18,15,0) 0%, rgba(20,18,15,0.55) 55%, rgba(20,18,15,0.8) 100%)' }}
                  />
                  <div className="absolute inset-x-0 bottom-0 z-10 p-5">
                    <b className="block font-display text-xl text-papel-inv">{f.nome}</b>
                    <p className="mt-1.5 text-xs text-papel-inv/85">{f.desc}</p>
                    <p className="mt-2 text-[9.5px] tracking-wide text-papel-inv/55">{f.attrs.join(' · ')}</p>
                    <span
                      className="mt-3.5 inline-block rounded-full border border-papel-inv/40 px-4 py-1.5 text-[10px] font-medium tracking-wide text-papel-inv uppercase"
                      style={{ background: 'rgba(255,255,255,0.08)' }}
                    >
                      Ver coleção
                    </span>
                  </div>
                </button>
              </div>
            ))}
          </div>
          <ScrollProgressBar fillPct={familiesScroll.fillPct} />
        </Reveal>

        {/* H-10 Por energia */}
        <Reveal
          as="section"
          className="relative z-20 py-8"
          style={{ background: 'color-mix(in srgb, var(--color-papel-2) 100%, var(--color-latao) 6%)' }}
        >
          <div className="px-4">
            <Eyebrow>Entrada emocional</Eyebrow>
            <h2 className="mt-2.5 font-display text-2xl">
              Que energia você
              <br />
              quer despertar?
            </h2>
            <p className="mt-1.5 text-sm text-tinta-2">Escolha pelo que você quer sentir.</p>
          </div>
          <div
            ref={energiesScroll.ref}
            className="scroll-pad no-scrollbar mt-5 flex snap-x gap-3.5 overflow-x-auto px-4 pt-2 pb-6"
          >
            {ENERGIES.map((e) => (
              <button
                key={e.nome}
                onClick={() => scrollToId('catalogo')}
                className="group relative w-[80vw] max-w-[320px] shrink-0 snap-start overflow-hidden rounded-3xl text-left"
                style={{ aspectRatio: '4/5', boxShadow: '0 16px 32px -16px rgba(20,18,15,0.4)' }}
              >
                <img
                  src={e.img}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                  style={{ willChange: 'transform' }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
                  style={{ background: 'linear-gradient(180deg, rgba(10,9,8,0) 0%, rgba(10,9,8,0.55) 55%, rgba(10,9,8,0.85) 100%)' }}
                />
                <div className="absolute inset-x-0 bottom-0 z-10 p-5">
                  <b className="block font-display text-2xl text-papel-inv">{e.nome}</b>
                  <span className="mt-1 block text-xs tracking-wide text-papel-inv/70">
                    {e.arquetipos.map((id) => getArchetype(id)?.nome).join(' · ')}
                  </span>
                </div>
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-4 bottom-4 z-10 flex size-8 items-center justify-center rounded-full text-papel-inv/80"
                  style={{ border: '1px solid rgba(247,246,243,0.4)' }}
                >
                  →
                </span>
              </button>
            ))}
          </div>
          <ScrollProgressBar fillPct={energiesScroll.fillPct} />
          <p className="mt-3 px-4 text-center font-mono text-[9.5px] tracking-widest text-tinta-3 uppercase">
            Deslize para explorar
          </p>
        </Reveal>

        {/* H-11 Reconhecimento */}
        <Reveal
          as="section"
          className="relative z-10 px-5 pt-16 pb-20"
          style={{
            background:
              'linear-gradient(to bottom, color-mix(in srgb, var(--color-papel-2) 100%, var(--color-latao) 6%) 0%, var(--color-papel) 18%, var(--color-papel) 85%, var(--color-papel-2) 100%)',
          }}
        >
          <img
            src={ribbonArquetypus}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute select-none"
            style={{
              top: '10px',
              left: '-140px',
              width: '260px',
              height: 'auto',
              opacity: 0.24,
              transform: 'rotate(80deg)',
              maskImage: 'radial-gradient(closest-side, black 55%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(closest-side, black 55%, transparent 100%)',
            }}
          />
          <img
            src={ribbonArquetypus}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -bottom-6 select-none"
            style={{
              width: '260px',
              height: 'auto',
              opacity: 0.24,
              transform: 'rotate(262deg)',
              maskImage: 'radial-gradient(closest-side, black 55%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(closest-side, black 55%, transparent 100%)',
            }}
          />

          <div className="relative z-10">
            <Eyebrow>Reconhecimento</Eyebrow>
            <h2 className="mt-3 max-w-[22ch] font-display text-[26px] leading-[1.25] text-tinta">
              Talvez você não esteja procurando só um perfume.
            </h2>
            <p className="mt-3 max-w-[30ch] text-sm text-tinta-2">
              Talvez esteja procurando algo que realmente pareça seu.
            </p>

            <div className="mt-10 flex flex-col">
              {QUALIFICATION.map((q, i) => (
                <div key={q.title}>
                  {i > 0 && <div className="border-t border-linha" />}
                  <div className="flex gap-4 py-6">
                    <span
                      className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full"
                      style={{ border: '1px solid var(--color-latao)' }}
                    >
                      <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="var(--color-latao)" strokeWidth="1.5">
                        <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <div>
                      <b className="block text-base font-medium text-tinta">{q.title}</b>
                      <p className="mt-1.5 text-sm leading-relaxed text-tinta-2">{q.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-10 max-w-[26ch] font-display text-xl leading-snug text-tinta">
              Se você se reconheceu,
              <br />
              a Arquétypus foi pensada <span className="text-latao">para você.</span>
            </p>
          </div>
        </Reveal>

        <DarkTransition />

        {/* H-13 O catálogo (fundido com H-07 bodegón) */}
        <Reveal as="section" id="catalogo" className="relative bg-noite pt-10 pb-8" animateContent>
          <div className="relative">
            <img src={BODEGON_IMG} alt="" className="h-64 w-full object-cover" />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
              style={{ background: 'linear-gradient(to bottom, rgba(26,25,23,0) 0%, var(--color-noite) 100%)' }}
            />
          </div>

          <div className="px-5 pt-3 pb-3">
            <Eyebrow className="text-latao">O catálogo</Eyebrow>
            <h2 className="mt-3 font-display text-4xl leading-[1.1] text-papel-inv">
              Nove arquétipos.
              <br />
              Um sistema.
            </h2>
            <p className="mt-3 max-w-[34ch] text-sm text-papel-inv/60">
              Cada fragrância revela uma forma diferente de estar no mundo.
            </p>
          </div>

          <div className="no-scrollbar flex gap-5 overflow-x-auto px-5 pb-1" role="tablist" aria-label="Filtrar catálogo">
            {CATALOGO_FILTROS.map((f) => (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={catalogoFiltro === f.key}
                onClick={() => setCatalogoFiltro(f.key)}
                className={`shrink-0 whitespace-nowrap border-b pb-2 font-mono text-[10.5px] tracking-[0.12em] uppercase transition-colors duration-300 ${
                  catalogoFiltro === f.key
                    ? 'border-latao text-latao'
                    : 'border-transparent text-papel-inv/45'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div
            ref={catalogoCarrossel.containerRef}
            className="scroll-pad no-scrollbar mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[8vw] pb-2"
          >
            {catalogoLoop.map((a, i) => {
              const dist = Math.abs(i - catalogoCarrossel.activeIndex)
              const isActive = dist === 0
              return (
              <div
                key={`${a.id}-${i}`}
                ref={catalogoCarrossel.registerItem(i)}
                className="group relative aspect-[3/4] w-[84vw] max-w-[320px] shrink-0 snap-center overflow-hidden rounded-3xl text-left"
                style={{
                  boxShadow: isActive ? '0 20px 40px -16px rgba(0,0,0,0.55)' : '0 10px 22px -14px rgba(0,0,0,0.4)',
                  transform: `scale(${isActive ? 1 : 0.87})`,
                  opacity: isActive ? 1 : 0.55,
                  filter: isActive ? 'blur(0px)' : 'blur(2.5px)',
                  transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease, filter 0.5s ease',
                  scrollSnapStop: 'always',
                }}
              >
                <div className="absolute inset-0" style={{ background: a.bg }} />

                {FRASCO_IMG[a.id] && (
                  <img
                    src={FRASCO_IMG[a.id]}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    style={{ willChange: 'transform' }}
                  />
                )}

                <span
                  aria-hidden
                  className="pointer-events-none absolute top-4 left-4 z-10 font-display text-[2.75rem] leading-none font-light"
                  style={{ color: a.cor, opacity: 0.55, textShadow: '0 1px 12px rgba(0,0,0,0.25)' }}
                >
                  {a.cod.split('-')[1]}
                </span>
                {a.status === 'wait' && (
                  <span className="absolute top-3 right-3 z-20 rounded-full bg-papel/85 px-2.5 py-1 font-mono text-[8px] tracking-wide text-alerta uppercase">
                    Em breve
                  </span>
                )}

                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] backdrop-blur-md"
                  style={{
                    background: `linear-gradient(to top, color-mix(in srgb, ${a.cor} 78%, var(--color-noite) 22%) 0%, color-mix(in srgb, ${a.cor} 45%, transparent) 60%, transparent 100%)`,
                    maskImage: 'linear-gradient(to top, black 45%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to top, black 45%, transparent 100%)',
                  }}
                />

                <div className="absolute inset-x-0 bottom-0 z-10 px-5 pt-5 pb-5">
                  <span className="block font-mono text-[9px] tracking-widest text-papel-inv/70 uppercase">
                    {a.cod}
                  </span>
                  <b className="mt-1.5 block font-display text-2xl text-papel-inv">{a.nome}</b>
                  <span className="mt-1 block text-sm text-papel-inv/80">{a.fam}</span>
                  <span className="mt-3 block font-mono text-[9px] tracking-wide text-papel-inv/60 uppercase">
                    {a.tipo} · {a.vol}
                  </span>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="text-sm text-papel-inv/90">
                      {a.status === 'wait' ? 'Avise-me' : brl(a.preco)}
                    </span>
                    <Link
                      to={`/arquetipos/${a.id}`}
                      className="relative z-20 inline-flex shrink-0 items-center justify-center rounded-full border border-papel-inv/40 bg-papel-inv/10 px-4 py-2.5 font-mono text-[10px] tracking-[0.12em] text-papel-inv uppercase backdrop-blur-sm transition-colors duration-300 ease-out hover:border-papel-inv/60 hover:bg-papel-inv/20"
                    >
                      {a.status === 'wait' ? 'Entrar na lista' : 'Descobrir'}
                    </Link>
                  </div>
                </div>
              </div>
              )
            })}
          </div>
          <div className="mt-5 flex items-center justify-center gap-2" aria-hidden>
            {catalogoFiltrado.map((a, i) => (
              <span
                key={a.id}
                className="h-[3px] w-5 rounded-full transition-colors duration-300"
                style={{
                  background:
                    i === catalogoAtivo ? 'var(--color-latao)' : 'color-mix(in srgb, var(--color-papel-inv) 25%, transparent)',
                }}
              />
            ))}
          </div>
          <p className="mt-3 px-5 text-center font-mono text-[9.5px] tracking-widest text-papel-inv/40 uppercase">
            Deslize para explorar
          </p>
        </Reveal>

        {/* H-15 Kit Descoberta */}
        <Reveal as="section" id="kit">
          <MediaSlot aspect="16/10" bg="#EFEDE8" requisito="FOTO · 16:10 · 1600×1000 · 9 MINIS NA MÃO · ESCALA REAL" className="rounded-none border-x-0" />
          <div className="px-4 py-6">
            <Eyebrow>Antes de escolher</Eyebrow>
            <h2 className="mt-2.5 font-display text-2xl">Kit Descoberta</h2>
            <p className="mt-2 text-sm text-tinta-2">
              Nove miniaturas de 8 ml. <em className="font-display italic">O valor volta</em> como crédito na compra do tamanho cheio.
            </p>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-display text-2xl">R$ 79,90</span>
              <span className="font-mono text-[10px] text-latao uppercase">Crédito integral</span>
            </div>
            <Link
              to="/kit-descoberta"
              className="mt-4 block w-full rounded-lg bg-tinta py-4 text-center text-sm font-medium tracking-wide text-papel uppercase"
            >
              Quero experimentar
            </Link>
          </div>
        </Reveal>

        {/* H-16 Escada de preço / kit builder */}
        <Reveal as="section" className="bg-papel-2 px-4 py-8">
          <Eyebrow>Monte o seu</Eyebrow>
          <h2 className="mt-2.5 font-display text-2xl">
            Quanto mais arquétipos,
            <br />
            menos você paga por um
          </h2>
          <div className="mt-5">
            <KitBuilder />
          </div>
        </Reveal>

        {/* H-17 Números de percepção */}
        <Reveal as="section" className="px-4 py-8">
          <Eyebrow>Teste com 120 pessoas · 21 dias</Eyebrow>
          <h2 className="mt-2.5 font-display text-2xl">
            O que elas
            <br />
            perceberam
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-6">
            {STATS.map((st) => (
              <div key={st.label}>
                <span className="block font-display text-5xl tracking-tight text-latao">{st.pct}</span>
                <span className="mt-2 block text-sm leading-snug text-tinta-2">{st.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 font-mono text-[8.5px] text-tinta-3">
            AUTOAVALIAÇÃO · N=120 · JUL/2026 · DADO ILUSTRATIVO NO PROTÓTIPO
          </p>
        </Reveal>

        <DarkTransition />

        {/* H-18 Comparativo */}
        <Reveal as="section" className="bg-noite px-4 py-8" animateContent>
          <Eyebrow>A diferença</Eyebrow>
          <h2 className="mt-2.5 font-display text-3xl text-papel-inv">
            Nem todo splash
            <br />
            entrega a mesma coisa
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div>
              <h4 className="font-display text-base text-papel-inv">Arquetypus</h4>
              <ul className="mt-3 flex flex-col gap-2.5">
                {COMPARISON.arquetypus.map((c) => (
                  <li key={c} className="flex gap-2 text-[11px] text-papel-inv/80">
                    <span className="mt-0.5 text-ok">✓</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display text-base text-papel-inv/50">Splash comum</h4>
              <ul className="mt-3 flex flex-col gap-2.5">
                {COMPARISON.comum.map((c) => (
                  <li key={c} className="flex gap-2 text-[11px] text-papel-inv/40">
                    <span className="mt-0.5 text-alerta/60">✗</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-6 text-center font-display text-lg text-papel-inv italic">
            Não é apenas um body splash.
            <br />É Arquetypus.
          </p>
        </Reveal>

        {/* H-19 Comunidade */}
        <Reveal as="section" className="py-8">
          <div className="px-4">
            <Eyebrow>A comunidade</Eyebrow>
            <h2 className="mt-2.5 font-display text-2xl">Quem já despertou</h2>
          </div>
          <div className="scroll-pad mt-5 flex snap-x gap-3 overflow-x-auto px-4 pb-2">
            {UGC_VIDEOS.map((v) => {
              const arq = getArchetype(v.archetypeId)
              if (!arq) return null
              return (
                <div key={v.creator} className="w-[70%] shrink-0 snap-start">
                  <MediaSlot
                    aspect="9/16"
                    src={v.creator === '@marianac_' ? UGC_CLEOPATRA_IMG : undefined}
                    requisito={`VÍDEO · 9:16 · 1080×1920 · ${v.creator}`}
                    className="rounded-b-none"
                  />
                  <Link
                    to={`/loja/${arq.id}`}
                    className="flex items-center gap-2.5 rounded-b-lg border border-t-0 border-linha-2 bg-papel p-2.5 transition-transform hover:scale-[1.02]"
                  >
                    <span className="size-8 shrink-0 rounded-full" style={{ background: arq.bg }} />
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5 font-display text-sm">
                        <span className="size-2 rounded-full" style={{ background: arq.cor }} />
                        {arq.nome}
                      </span>
                      <span className="block text-xs text-tinta-3">{brl(arq.preco)}</span>
                    </span>
                  </Link>
                  <p className="mt-2 text-xs italic text-tinta-2">“{v.testimonial}”</p>
                </div>
              )
            })}
          </div>
          <div className="mt-3 flex items-center gap-2 px-4">
            <span className="text-latao">★★★★★</span>
            <span className="text-xs text-tinta-2">4,8 · 2.147 avaliações</span>
          </div>
        </Reveal>

        <DarkTransition />

        {/* H-20 Garantia */}
        <Reveal as="section" className="bg-noite px-4 py-12 text-center" animateContent>
          <div className="font-display text-7xl text-papel-inv/15">30</div>
          <p className="mt-1 font-mono text-[10px] tracking-[0.3em] text-latao uppercase">
            Dias de garantia
          </p>
          <h2 className="mt-4 font-display text-2xl text-papel-inv">
            Se não for o seu cheiro,
            <br />
            <em>é por nossa conta</em>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-papel-inv/60">
            Use, cheire, teste na sua pele. Se não for você, devolvemos o valor.
            <br />Sem perguntas, sem julgamento. Mesmo com o frasco aberto.
          </p>
        </Reveal>

        {/* H-21 Seja criador */}
        <Reveal as="section" className="px-4 py-8">
          <Eyebrow>Para criadores</Eyebrow>
          <h2 className="mt-2.5 font-display text-2xl">
            Ganhe vendendo
            <br />
            o seu arquétipo
          </h2>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <div>
              <b className="block font-display text-xl">20%</b>
              <span className="font-mono text-[8px] text-tinta-3 uppercase">
                de comissão
                <br />
                por venda
              </span>
            </div>
            <div>
              <b className="block font-display text-xl">Grátis</b>
              <span className="font-mono text-[8px] text-tinta-3 uppercase">
                amostra para
                <br />
                aprovados
              </span>
            </div>
            <div>
              <b className="block font-display text-xl">D+30</b>
              <span className="font-mono text-[8px] text-tinta-3 uppercase">
                pagamento
                <br />
                via Pix
              </span>
            </div>
          </div>
          <p className="mt-5 text-sm text-tinta-2">
            Você recebe o kit, grava do seu jeito e ganha em cada venda pelo seu link. Materiais,
            ângulos que funcionam e ranking de criadores no painel.
          </p>
          <Link
            to="/criadores"
            className="mt-4 inline-block rounded-full border border-linha-2 px-6 py-2.5 text-xs font-medium"
          >
            Quero ser criador
          </Link>
        </Reveal>

        <DarkTransition />

        {/* H-22 Diário olfativo */}
        <Reveal as="section" id="diario" className="bg-noite px-4 py-8" animateContent>
          <Eyebrow>Entenda</Eyebrow>
          <h2 className="mt-2.5 font-display text-3xl text-papel-inv">Diário olfativo</h2>
          <div className="mt-5 flex flex-col gap-4">
            {JOURNAL.map((j) => (
              <div key={j.title} className="flex gap-3">
                <span className="text-latao">→</span>
                <div>
                  <b className="text-sm text-papel-inv">{j.title}</b>
                  <p className="mt-0.5 text-sm text-papel-inv/70">{j.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* H-23 Captura com cupom */}
        <Reveal as="section" className="px-4 py-8">
          <Eyebrow>Primeira compra</Eyebrow>
          <h2 className="mt-2.5 font-display text-2xl">
            15% no seu
            <br />
            primeiro arquétipo
          </h2>
          <p className="mt-2 text-sm text-tinta-2">Cupom no e-mail, lançamentos antes de todo mundo.</p>
          <form className="mt-4 flex flex-col gap-2.5" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="seu@email.com"
              aria-label="E-mail"
              className="rounded-md border border-linha-2 bg-papel px-3 py-2.5 text-sm"
            />
            <input
              type="tel"
              placeholder="WhatsApp (DDD + número)"
              aria-label="WhatsApp"
              className="rounded-md border border-linha-2 bg-papel px-3 py-2.5 text-sm"
            />
            <button className="rounded-lg bg-tinta py-3.5 text-sm font-medium tracking-wide text-papel uppercase">
              Quero meu cupom
            </button>
          </form>
        </Reveal>

        {/* H-24 Rodapé */}
        <footer className="bg-noite px-4 py-10">
          <p className="text-center font-display text-2xl tracking-wide text-papel-inv">
            ARQUETYPUS
          </p>
          <p className="mt-1 text-center font-display text-xs text-papel-inv/40 italic">
            Perfumaria de arquétipos
          </p>

          <nav className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-papel-inv/60">
            <Link to="/#catalogo" className="hover:text-papel-inv">Os 9 arquétipos</Link>
            <Link to="/kit-descoberta" className="hover:text-papel-inv">Kit Descoberta</Link>
            <Link to="/criadores" className="hover:text-papel-inv">Seja criador</Link>
            <Link to="/#diario" className="hover:text-papel-inv">Diário olfativo</Link>
            <span className="text-papel-inv/30">Trocas e devoluções</span>
            <span className="text-papel-inv/30">Privacidade</span>
            <span className="text-papel-inv/30">Termos</span>
          </nav>

          <div className="mt-8 flex justify-center gap-5 text-xs text-papel-inv/40">
            <span>Instagram</span>
            <span>TikTok</span>
            <span>Pinterest</span>
          </div>

          <div className="mt-6 border-t border-papel-inv/10 pt-4 text-center font-mono text-[8px] tracking-wider text-papel-inv/30 uppercase">
            <p>Pix · Visa · Master · Elo · Boleto</p>
            <p className="mt-2">
              sac@arquetypus.com.br · Saniella Ltda · CNPJ 58.267.823/0001-68 · Caraguatatuba SP
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ARCHETYPES, getArchetype } from '@/data/archetypes'
import {
  BODEGON_IMG,
  COMPARISON,
  DIAGNOSIS,
  ENERGIES,
  FAMILIES,
  FRASCO_CUT_IMG,
  FRASCO_IMG,
  JOURNAL,
  QUALIFICATION,
  SEALS,
  SEGMENTS,
  SEGMENTS_HEADING,
  STATS,
  UGC_IMG,
  UGC_VIDEOS,
} from '@/data/home'
import { ECON } from '@/data/economics'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { MediaSlot } from '@/components/ui/MediaSlot'
import { RatioTag } from '@/components/ui/RatioTag'
// import { KitBuilder } from '@/components/KitBuilder' // seção "Monte o seu" desativada
import { HeroCarousel } from '@/components/HeroCarousel'
import { Reveal } from '@/components/ui/Reveal'
import { CarouselDots } from '@/components/ui/CarouselDots'
import { CutFrame } from '@/components/ui/CutFrame'
import { SweepCta } from '@/components/ui/SweepCta'
import { scrollToId } from '@/lib/scrollToId'
import { openCookiePreferences } from '@/lib/consent'
import { useCarouselIndex } from '@/lib/useCarouselIndex'
import { useTapGuard } from '@/lib/useTapGuard'
import { useInfiniteCarousel } from '@/lib/useInfiniteCarousel'
import { useCoverflow } from '@/lib/useCoverflow'
import featuredFenix from '@/assets/fotos/destaque-fenix.jpg'
import florArquetypus from '@/assets/brand/flor-arquetypus.png'
import ribbonArquetypus from '@/assets/brand/ribbon-arquetypus.png'
import logoBranco from '@/assets/brand/logo-branco.png'

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

/** Dourado sobre fundo escuro/bronze. Hoje é o próprio --color-latao (dourado do logo), que já é claro o bastante. */
const LATAO_CLARO = 'var(--color-latao)'

// Copy revisada (set/2026): percentuais de percepção, depoimentos e nota média saem do ar
// até existir dado real. Ficam no código pra religar trocando pra true com fonte de verdade.
const SHOW_PROOF_STATS = false
const SHOW_REVIEWS = false

// Arquétipo em destaque (card editorial da home). Foto escolhida pela designer (set/2026).
const FEATURED_ID = 'fenix'
const FEATURED_IMG = featuredFenix
// Fundo do card: burgundy da paleta da marca, que conversa com o frasco da Fênix. Ao trocar FEATURED_ID, rever a cor
const FEATURED_BG = 'var(--color-burgundy)'
const featured = getArchetype(FEATURED_ID)!

/** Largura do card de UGC — o carrossel centraliza a partir dela. Vem da variável
 * --ugc-card-w, definida no container (320px no celular, 360px no lg+). */
const UGC_CARD_W = 'var(--ugc-card-w)'

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

/**
 * H-19 Comunidade. Componente próprio de propósito: o índice ativo do carrossel
 * muda a cada card que passa, e como estado da HomePage re-renderizava a página
 * inteira no meio do gesto (travadinha ao trocar de card).
 */
function CommunitySection() {
  const location = useLocation()
  // infinito, como o catálogo: 3 cópias e o hook reposiciona o scroll ao cruzar as bordas
  const ugcCount = UGC_VIDEOS.length
  const ugcLoop = [...UGC_VIDEOS, ...UGC_VIDEOS, ...UGC_VIDEOS]
  const ugcScroll = useInfiniteCarousel(ugcCount)
  const ugcAtivo = ugcScroll.activeIndex % ugcCount
  useCoverflow(ugcScroll.containerRef)

  // UGC em moldura recortada + product tag sobreposto
  return (
    <Reveal
      as="section"
      className="relative overflow-hidden bg-papel pt-14 pb-16 lg:pt-20 lg:pb-24"
      style={{
        // degrau: sai da "A diferença" (por cima) para uma seção que fica abaixo
        boxShadow:
          'inset 0 1px 0 color-mix(in srgb, var(--color-latao) 60%, transparent), inset 0 26px 28px -20px rgba(40,46,41,0.4), inset 0 8px 10px -7px rgba(40,46,41,0.28)',
      }}
    >
      <img
        src={florArquetypus}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute select-none"
        style={{
          top: '-20px',
          right: '-80px',
          width: '240px',
          height: 'auto',
          opacity: 0.14,
          transform: 'rotate(20deg)',
          maskImage: 'radial-gradient(closest-side, black 55%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(closest-side, black 55%, transparent 100%)',
        }}
      />

      <div className="relative px-5 md:px-10 lg:mx-auto lg:max-w-7xl">
        <div className="flex items-center gap-3">
          <span aria-hidden className="h-px w-6 bg-latao" />
          <Eyebrow>A comunidade</Eyebrow>
        </div>
        <h2 className="mt-4 font-display text-[32px] leading-[1.1] text-tinta lg:text-5xl">Experiências Arquétypus</h2>
        <p className="mt-3 text-sm leading-relaxed text-tinta-2 lg:mt-4 lg:text-base">
          Pessoas reais.
          <br />
          Diferentes fragrâncias, momentos e formas de expressão.
        </p>
      </div>

      <div
        ref={ugcScroll.containerRef}
        className="no-scrollbar relative mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [--ugc-card-w:min(76vw,320px)] lg:mt-10 lg:[--ugc-card-w:360px]"
        // padding lateral = metade da sobra, pra o primeiro e o último card também pararem no centro
        style={{ paddingInline: `calc((100% - ${UGC_CARD_W}) / 2)` }}
      >
        {ugcLoop.map((v, i) => {
          const arq = getArchetype(v.archetypeId)
          if (!arq) return null
          return (
            <article
              key={`${v.creator}-${i}`}
              ref={ugcScroll.registerItem(i)}
              className="shrink-0 snap-center"
              aria-current={i === ugcScroll.activeIndex ? 'true' : undefined}
              // escala/opacidade/blur vêm do useCoverflow, contínuos conforme o scroll
              style={{ width: UGC_CARD_W, willChange: 'transform, opacity' }}
            >
              <CutFrame cut={14} innerClassName="relative aspect-[9/16] bg-papel-2">
                <img
                  src={UGC_IMG[v.archetypeId]}
                  alt={`${v.creator} segurando o body splash ${arq.nome}`}
                  loading={i === ugcCount ? 'eager' : 'lazy'}
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <RatioTag className="top-4 right-4" />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-24"
                  style={{ background: 'linear-gradient(to bottom, rgba(20,18,15,0.45), transparent)' }}
                />
                {/* legenda editorial discreta */}
                <div className="absolute top-4 left-4 font-label text-[9px] tracking-widest text-papel-inv/90 uppercase">
                  <span className="block">
                    {String((i % ugcCount) + 1).padStart(2, '0')} / {String(ugcCount).padStart(2, '0')}
                  </span>
                  <span className="mt-1 block normal-case tracking-wide text-papel-inv/75">
                    {v.creator} · <span className="uppercase tracking-widest">{arq.nome}</span>
                  </span>
                </div>
              </CutFrame>

              {/* product tag — sobe sobre a base do vídeo; miniatura do frasco à esquerda */}
              <div className="relative z-10 -mt-12 px-3">
                <CutFrame cut={10} innerClassName="bg-papel p-3">
                  <div className="flex gap-3">
                    {FRASCO_CUT_IMG[arq.id] && (
                      // miniatura é recorte da foto de produto (com fundo), não frasco recortado — vai como thumb
                      <img
                        aria-hidden
                        src={FRASCO_CUT_IMG[arq.id]}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-[76px] w-[52px] shrink-0 rounded-md object-cover"
                      />
                    )}
                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                      <b className="block truncate font-display text-lg leading-tight font-normal text-tinta">{arq.nome}</b>
                      <span className="block truncate text-xs text-tinta-2">{arq.fam}</span>
                      <span className="mt-1 block truncate font-label text-[8.5px] tracking-widest text-tinta-3 uppercase">
                        {arq.tipo} · {arq.vol}
                      </span>
                      <span className="mt-1 block text-sm leading-none text-tinta">{brl(arq.preco)}</span>
                    </div>
                  </div>
                  <Link
                    to={`/loja/${arq.id}`}
                    state={{ backgroundLocation: location }}
                    className="mt-3 block w-full rounded-full border border-latao/50 bg-papel/40 py-2.5 text-center text-xs font-medium tracking-wide text-tinta uppercase transition-colors duration-300 ease-out hover:border-latao hover:bg-papel-2/70"
                  >
                    Descobrir
                  </Link>
                </CutFrame>
              </div>

              {SHOW_REVIEWS && (
                <p className="mt-3 px-3 text-[13px] leading-relaxed text-tinta-2 italic">“{v.testimonial}”</p>
              )}
            </article>
          )
        })}
      </div>

      <div className="lg:mt-6 lg:flex lg:items-center lg:justify-center lg:gap-5">
        <button
          type="button"
          onClick={() => ugcScroll.step(-1)}
          aria-label="Experiência anterior"
          className="hidden size-9 cursor-pointer items-center justify-center rounded-full border border-linha-2 text-tinta-2 transition-colors duration-300 hover:border-latao hover:text-tinta lg:flex"
        >
          ‹
        </button>
        <CarouselDots count={ugcCount} active={ugcAtivo} className="mt-6 lg:mt-0" />
        <button
          type="button"
          onClick={() => ugcScroll.step(1)}
          aria-label="Próxima experiência"
          className="hidden size-9 cursor-pointer items-center justify-center rounded-full border border-linha-2 text-tinta-2 transition-colors duration-300 hover:border-latao hover:text-tinta lg:flex"
        >
          ›
        </button>
      </div>

      {SHOW_REVIEWS && (
        <p className="mt-6 text-center text-xs text-tinta-3">
          <span className="text-latao-texto">★</span> 4,8 · 2.147 avaliações
        </p>
      )}
    </Reveal>
  )
}

export function HomePage() {
  const location = useLocation()
  const { hash } = location
  const familiesScroll = useCarouselIndex<HTMLDivElement>(FAMILIES.length)
  const energiesScroll = useCarouselIndex<HTMLDivElement>(ENERGIES.length)
  const tapGuard = useTapGuard()
  const [catalogoFiltro, setCatalogoFiltro] = useState<'ALL' | 'F' | 'M' | 'U'>('ALL')
  const catalogoFiltrado = useMemo(
    () => (catalogoFiltro === 'ALL' ? ARCHETYPES : ARCHETYPES.filter((a) => a.seg === catalogoFiltro)),
    [catalogoFiltro],
  )
  const catalogoLoop = [...catalogoFiltrado, ...catalogoFiltrado, ...catalogoFiltrado]
  const catalogoCarrossel = useInfiniteCarousel(catalogoFiltrado.length)
  const [difModo, setDifModo] = useState<'arquetypus' | 'comum'>('arquetypus')
  const catalogoAtivo = catalogoFiltrado.length > 0 ? catalogoCarrossel.activeIndex % catalogoFiltrado.length : 0

  useEffect(() => {
    if (!hash) return
    scrollToId(hash.slice(1))
  }, [hash])

  return (
    <div className="relative -mt-14 lg:-mt-16">
      {/* H-03 Hero — carrossel sticky, card sobe por cima */}
      <HeroCarousel />

      {/* card das seções sobe por cima do hero; em telas baixas sobe menos pra mostrar mais imagem (par do pb do HeroCarousel) */}
      <div className="relative z-10 -mt-28 rounded-t-3xl bg-papel [@media(max-height:820px)]:-mt-16">
        {/* H-05 Selos — grid 2x2 com ícone, estilo trust badges */}
        <section className="grid grid-cols-2 divide-x divide-y divide-linha overflow-hidden rounded-t-3xl border-b border-linha">
          {SEALS.map((s) => (
            <div key={s} className="flex flex-col items-center gap-2 px-3 py-5">
              <SealIcon seal={s} className="size-5 text-latao-texto" />
              <span className="text-center font-label text-[9px] tracking-widest text-tinta-3 uppercase">{s}</span>
            </div>
          ))}
        </section>

        {/* H-08 Segmentação — pilha no celular, 3 lado a lado a partir do md */}
        <Reveal as="section" id="segmentos" className="px-4 pt-8 pb-6 md:mx-auto md:max-w-7xl md:px-10 md:pt-14 md:pb-12">
          <div className="text-center">
            <Eyebrow>{SEGMENTS_HEADING.eyebrow}</Eyebrow>
            <h2 className="mt-3 font-display text-[28px] leading-[1.2] text-tinta md:text-4xl">{SEGMENTS_HEADING.title}</h2>
          </div>
          <div className="mt-6 flex flex-col items-center gap-5 md:mt-10 md:grid md:grid-cols-3 md:gap-6">
            {SEGMENTS.map((seg) => (
              <button
                key={seg.name}
                onClick={() => scrollToId('catalogo')}
                className="group relative block w-[80%] md:w-full overflow-hidden rounded-2xl text-left shadow-[0_2px_6px_rgba(0,0,0,0.08)] ring-1 ring-latao/50"
              >
                <MediaSlot
                  aspect="4/3"
                  bg="transparent"
                  src={seg.img}
                  requisito={`FOTO · 4:3 · 1600×1200 · LIFESTYLE · ${seg.label.toUpperCase()}`}
                  // 3 colunas (md+): card vertical pro texto não cobrir o frasco — ! vence o aspect inline
                  className="rounded-2xl border-0 md:aspect-[4/5]! [&_img]:will-change-transform [&_img]:transition-transform [&_img]:duration-700 [&_img]:ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:[&_img]:scale-[1.06]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
                  style={{
                    background: `linear-gradient(to top, color-mix(in srgb, ${SEGMENT_TINT[seg.seg]} 65%, transparent) 0%, color-mix(in srgb, ${SEGMENT_TINT[seg.seg]} 30%, transparent) 55%, transparent 100%)`,
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 z-10 p-4 lg:p-5">
                  <span className="block font-label text-[9px] tracking-widest text-papel-inv/80 uppercase">
                    {seg.label}
                  </span>
                  <span className="mt-1 block font-display text-2xl text-papel-inv lg:text-3xl">{seg.name}</span>
                  <span className="mt-1 block font-label text-[9px] text-papel-inv/70">{seg.meta}</span>
                  <span className="mt-3 block w-full rounded-full border border-papel-inv/40 bg-papel-inv/10 py-2.5 text-center text-xs font-medium text-papel-inv backdrop-blur-sm transition-colors duration-300 ease-out group-hover:border-papel-inv/60 group-hover:bg-papel-inv/20">
                    Ver coleção
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Reveal>

        {/* H-06 Diagnóstico — celular empilhado; lg: intro + fechamento à esquerda, lista à direita */}
        <Reveal
          as="section"
          className="relative z-10 px-5 pt-16 pb-16 md:px-10 lg:py-24"
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

          <div className="relative z-10 md:mx-auto md:max-w-3xl lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-16">
            <div className="lg:col-span-5 lg:row-start-1">
              <Eyebrow>O perfume errado</Eyebrow>
              <h2 className="mt-3 max-w-[19ch] font-display text-[28px] leading-[1.2] text-tinta lg:text-4xl lg:leading-[1.15]">
                Você já escolheu uma fragrância que não combinava com você?
              </h2>
              <p className="mt-3 text-sm text-tinta-2 lg:mt-5 lg:max-w-[40ch] lg:text-base">
                Às vezes, encontrar o cheiro certo começa por entender o que você procura.
              </p>
            </div>

            <div className="mt-7 flex flex-col lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:mt-0">
              {DIAGNOSIS.map((d, i) => (
                <div key={d.n}>
                  {i > 0 && <div className="border-t border-linha" />}
                  <div className="flex gap-4 py-4 lg:gap-6 lg:py-7">
                    <span
                      className="font-display text-5xl leading-none font-light lg:text-6xl"
                      style={{
                        color: 'color-mix(in srgb, var(--color-latao) 32%, var(--color-papel-2) 68%)',
                      }}
                    >
                      {d.n}
                    </span>
                    <div className="pt-1.5">
                      <b className="text-base font-semibold text-tinta lg:text-lg">{d.title}</b>
                      <p className="mt-1.5 text-sm leading-relaxed text-tinta-2 lg:text-base">{d.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-7 text-center font-display text-xl leading-snug text-tinta lg:col-span-5 lg:row-start-2 lg:mt-10 lg:self-start lg:text-left lg:text-2xl">
              Não comece pelo nome.
              <br />
              <span className="text-latao-texto">Comece por você.</span>
            </p>
          </div>
        </Reveal>

        {/* H-09 Por família */}
        {/* celular/tablet: carrossel; lg: grade de 4 colunas, sem scroll nem pontinhos */}
        <Reveal as="section" className="pt-9 pb-12 lg:pt-20 lg:pb-24">
          <div className="px-4 md:px-10 lg:mx-auto lg:max-w-7xl">
            <Eyebrow>Entrada racional</Eyebrow>
            <h2 className="mt-2.5 font-display text-2xl lg:text-4xl">Descubra pelo cheiro</h2>
            <p className="mt-1.5 text-sm text-tinta-2 lg:mt-3 lg:text-base">Explore as famílias olfativas e encontre os cheiros que mais combinam com você.</p>
          </div>
          <div
            ref={familiesScroll.ref}
            {...tapGuard}
            className="scroll-pad no-scrollbar mt-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:px-10 lg:mx-auto lg:mt-8 lg:grid lg:max-w-7xl lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pt-2 lg:after:hidden"
          >
            {FAMILIES.map((f) => (
              <div
                key={f.nome}
                className="group w-60 shrink-0 snap-start hover:-translate-y-1 lg:w-auto"
                style={{ transition: 'transform 500ms cubic-bezier(0.16,1,0.3,1)' }}
              >
                {/* no-press + isolate: sem scale no toque — transform em card com overflow/raio fazia o texto sumir no celular */}
                <button
                  onClick={() => scrollToId('catalogo')}
                  className="no-press relative isolate block w-full overflow-hidden rounded-3xl border border-linha-2 text-left"
                  style={{ aspectRatio: '4/5', boxShadow: '0 10px 24px -12px rgba(40,46,41,0.28)' }}
                >
                  <img
                    src={f.img}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                  />
                  <RatioTag className="top-3 right-3" />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5"
                    style={{ background: 'linear-gradient(180deg, rgba(20,18,15,0) 0%, rgba(20,18,15,0.55) 55%, rgba(20,18,15,0.8) 100%)' }}
                  />
                  <div className="absolute inset-x-0 bottom-0 z-10 p-5">
                    <b className="block font-display text-xl text-papel-inv lg:text-2xl">{f.nome}</b>
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
          <CarouselDots count={FAMILIES.length} active={familiesScroll.activeIndex} className="mt-5 lg:hidden" />
        </Reveal>

        {/* H-10 Por energia — celular/tablet: carrossel; lg: grade de 4 colunas, sem scroll nem pontinhos */}
        <Reveal
          as="section"
          className="relative z-20 py-8 lg:pt-20 lg:pb-24"
          style={{
            background: 'color-mix(in srgb, var(--color-papel-2) 100%, var(--color-latao) 6%)',
            // sombra interna no topo + filete: a seção parece um degrau abaixo da "Entrada racional"
            boxShadow:
              'inset 0 1px 0 color-mix(in srgb, var(--color-linha-2) 80%, transparent), inset 0 18px 22px -16px rgba(40,46,41,0.28), inset 0 6px 8px -6px rgba(40,46,41,0.18)',
          }}
        >
          <div className="px-4 md:px-10 lg:mx-auto lg:max-w-7xl">
            <Eyebrow>Entrada emocional</Eyebrow>
            <h2 className="mt-2.5 font-display text-2xl lg:text-4xl">
              Como você quer
              <br />
              se sentir hoje?
            </h2>
            <p className="mt-1.5 text-sm text-tinta-2 lg:mt-3 lg:text-base">Escolha pela presença que você quer expressar.</p>
          </div>
          <div
            ref={energiesScroll.ref}
            {...tapGuard}
            className="scroll-pad no-scrollbar mt-5 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-4 pt-2 pb-6 md:px-10 lg:mx-auto lg:mt-8 lg:grid lg:max-w-7xl lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0 lg:after:hidden"
          >
            {ENERGIES.map((e) => (
              <button
                key={e.nome}
                onClick={() => scrollToId('catalogo')}
                className="no-press group relative isolate w-[80vw] max-w-[320px] shrink-0 snap-start overflow-hidden rounded-3xl text-left lg:w-auto lg:max-w-none"
                style={{ aspectRatio: '4/5', boxShadow: '0 16px 32px -16px rgba(20,18,15,0.4)' }}
              >
                <img
                  src={e.img}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                />
                <RatioTag className="top-3 right-3" />
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
                  style={{ border: '1px solid rgba(242,234,219,0.4)' }}
                >
                  →
                </span>
              </button>
            ))}
          </div>
          <CarouselDots count={ENERGIES.length} active={energiesScroll.activeIndex} className="mt-5 lg:hidden" />
          <p className="mt-3 px-4 text-center font-label text-[9.5px] tracking-widest text-tinta-3 uppercase lg:hidden">
            Deslize para explorar
          </p>
        </Reveal>

        {/* H-11 Reconhecimento — celular empilhado; lg: intro centralizada, 3 itens em colunas, fechamento centralizado */}
        <Reveal
          as="section"
          className="relative z-10 px-5 pt-16 pb-20 md:px-10 lg:pt-24 lg:pb-28"
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

          <div className="relative z-10 md:mx-auto md:max-w-3xl lg:max-w-7xl">
            <div className="lg:text-center">
              <Eyebrow>Reconhecimento</Eyebrow>
              <h2 className="mt-3 max-w-[22ch] font-display text-[26px] leading-[1.25] text-tinta lg:mx-auto lg:max-w-[26ch] lg:text-4xl lg:leading-[1.2]">
                Talvez você esteja procurando mais do que um cheiro.
              </h2>
              <p className="mt-3 max-w-[30ch] text-sm text-tinta-2 lg:mx-auto lg:mt-5 lg:max-w-[40ch] lg:text-base">
                Talvez esteja procurando uma fragrância que acompanhe o seu momento.
              </p>
            </div>

            <div className="mt-10 flex flex-col lg:mt-16 lg:grid lg:grid-cols-3">
              {QUALIFICATION.map((q, i) => (
                <div key={q.title} className={i > 0 ? 'lg:border-l lg:border-linha lg:pl-10' : ''}>
                  {i > 0 && <div className="border-t border-linha lg:hidden" />}
                  <div className="flex gap-4 py-6 lg:flex-col lg:gap-5 lg:py-2 lg:pr-10">
                    <span
                      className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full"
                      style={{ border: '1px solid var(--color-latao)' }}
                    >
                      <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="var(--color-latao)" strokeWidth="1.5">
                        <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <div>
                      <b className="block text-base font-semibold text-tinta lg:text-lg">{q.title}</b>
                      <p className="mt-1.5 text-sm leading-relaxed text-tinta-2 lg:mt-2.5 lg:text-base">{q.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-10 max-w-[26ch] font-display text-xl leading-snug text-tinta lg:mx-auto lg:mt-16 lg:max-w-none lg:text-center lg:text-2xl">
              Se você se reconheceu,
              <br />
              existe uma Arquétypus <span className="text-latao-texto">para o seu momento.</span>
            </p>
          </div>
        </Reveal>

        {/* H-13 O catálogo (fundido com H-07 bodegón) — celular empilhado; lg: bodegón à esquerda, catálogo à direita */}
        <Reveal
          as="section"
          id="catalogo"
          className="relative z-20 bg-noite pb-12 lg:pb-0"
          animateContent
          contentClassName="lg:grid lg:grid-cols-2"
          style={{
            // Degrau invertido: o catálogo fica POR CIMA e projeta sombra na seção de cima (Reconhecimento)
            boxShadow: '0 -14px 26px -10px rgba(37,46,40,0.5), 0 -4px 8px -3px rgba(37,46,40,0.35)',
          }}
        >
          <div className="relative lg:min-h-full lg:overflow-hidden">
            <img
              src={BODEGON_IMG}
              alt="Os nove frascos Arquétypus sobre uma bandeja de mármore, à luz dourada do fim de tarde"
              className="aspect-[4/5] w-full object-cover lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
            />
            <RatioTag className="top-3 right-3" />
            {/* Filete dourado na borda do degrau */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{ background: 'color-mix(in srgb, var(--color-latao) 70%, transparent)' }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[24%] lg:hidden"
              style={{ background: 'linear-gradient(to bottom, rgba(37,46,40,0) 0%, var(--color-noite) 100%)' }}
            />
            {/* desktop: a imagem dissolve pra direita, no fundo noite do catálogo */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 lg:block"
              style={{ background: 'linear-gradient(to right, rgba(37,46,40,0) 0%, var(--color-noite) 100%)' }}
            />
          </div>

          <div className="lg:flex lg:min-w-0 lg:flex-col lg:justify-center lg:py-20">
            <div className="relative -mt-8 px-5 pt-3 pb-3 md:px-10 lg:mt-0 xl:px-14">
              <Eyebrow className="text-latao">O catálogo</Eyebrow>
              <h2 className="mt-3 font-display text-4xl leading-[1.1] text-papel-inv">
                Nove fragrâncias.
                <br />
                Diferentes versões de você.
              </h2>
              <p className="mt-3 max-w-[34ch] text-sm text-papel-inv/60">
                Cada fragrância traduz uma sensação, uma intenção, uma forma diferente de estar no mundo.
              </p>
            </div>

            <div className="no-scrollbar flex gap-5 overflow-x-auto px-5 pb-1 md:px-10 lg:mt-4 xl:px-14" role="tablist" aria-label="Filtrar catálogo">
              {CATALOGO_FILTROS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  role="tab"
                  aria-selected={catalogoFiltro === f.key}
                  onClick={() => setCatalogoFiltro(f.key)}
                  className={`shrink-0 whitespace-nowrap border-b pb-2 font-label text-[10.5px] tracking-[0.12em] uppercase transition-colors duration-300 ${
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
              className="no-scrollbar mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[8vw] pb-2 lg:mt-8 lg:px-[calc(50%-10rem)]"
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
                  <RatioTag className={a.status === 'wait' ? 'top-11 right-3' : 'top-3 right-3'} />

                  <span
                    aria-hidden
                    className="pointer-events-none absolute top-4 left-4 z-10 font-display text-[2.75rem] leading-none font-light"
                    style={{ color: a.cor, opacity: 0.55, textShadow: '0 1px 12px rgba(0,0,0,0.25)' }}
                  >
                    {a.cod.split('-')[1]}
                  </span>
                  {a.status === 'wait' && (
                    <span className="absolute top-3 right-3 z-20 rounded-full bg-papel/85 px-2.5 py-1 font-label text-[8px] tracking-wide text-alerta uppercase">
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
                    <span className="block font-label text-[9px] tracking-widest text-papel-inv/70 uppercase">
                      {a.cod}
                    </span>
                    <b className="mt-1.5 block font-display text-2xl text-papel-inv">{a.nome}</b>
                    <span className="mt-1 block text-sm text-papel-inv/80">{a.fam}</span>
                    <span className="mt-3 block font-label text-[9px] tracking-wide text-papel-inv/60 uppercase">
                      {a.tipo} · {a.vol}
                    </span>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <span className="text-sm text-papel-inv/90">
                        {a.status === 'wait' ? 'Avise-me' : brl(a.preco)}
                      </span>
                      <Link
                        // mesmo destino do UGC: pop-up de compra (/loja/:id por cima da home)
                        to={`/loja/${a.id}`}
                        state={{ backgroundLocation: location }}
                        className="relative z-20 inline-flex shrink-0 items-center justify-center rounded-full border border-papel-inv/40 bg-papel-inv/10 px-4 py-2.5 font-label text-[10px] tracking-[0.12em] text-papel-inv uppercase backdrop-blur-sm transition-colors duration-300 ease-out hover:border-papel-inv/60 hover:bg-papel-inv/20"
                      >
                        {a.status === 'wait' ? 'Entrar na lista' : 'Descobrir'}
                      </Link>
                    </div>
                  </div>
                </div>
                )
              })}
            </div>
            {/* desktop: setas em volta dos pontinhos — no mouse não dá pra deslizar */}
            <div className="lg:mt-5 lg:flex lg:items-center lg:justify-center lg:gap-5">
              <button
                type="button"
                onClick={() => catalogoCarrossel.step(-1)}
                aria-label="Fragrância anterior"
                className="hidden size-9 cursor-pointer items-center justify-center rounded-full border border-papel-inv/20 text-papel-inv/70 transition-colors duration-300 hover:border-papel-inv/50 hover:text-papel-inv lg:flex"
              >
                ‹
              </button>
              <CarouselDots count={catalogoFiltrado.length} active={catalogoAtivo} tone="dark" className="mt-5 lg:mt-0" />
              <button
                type="button"
                onClick={() => catalogoCarrossel.step(1)}
                aria-label="Próxima fragrância"
                className="hidden size-9 cursor-pointer items-center justify-center rounded-full border border-papel-inv/20 text-papel-inv/70 transition-colors duration-300 hover:border-papel-inv/50 hover:text-papel-inv lg:flex"
              >
                ›
              </button>
            </div>
            <p className="mt-3 px-5 text-center font-label text-[9.5px] tracking-widest text-papel-inv/40 uppercase lg:hidden">
              Deslize para explorar
            </p>
          </div>
        </Reveal>

        {/* H-15 Arquétipo em destaque — ocupa o card editorial que era do Kit Descoberta (kit saiu do ar).
            Trocar o destaque = trocar FEATURED_ID; todo o texto vem de data/archetypes.ts.
            Celular: card vertical com texto sobre a foto; md+: foto à esquerda, texto à direita no fundo burgundy (FEATURED_BG) */}
        <Reveal
          as="section"
          id="destaque"
          className="bg-papel px-4 pt-14 pb-12 md:px-10 lg:pt-20 lg:pb-24"
          style={{
            // "degrau" como o da Entrada emocional, mais marcado: sombra interna no topo, a seção parece abaixo do catálogo
            boxShadow:
              'inset 0 1px 0 color-mix(in srgb, var(--color-latao) 60%, transparent), inset 0 26px 28px -20px rgba(40,46,41,0.4), inset 0 8px 10px -7px rgba(40,46,41,0.28)',
          }}
        >
          <div
            className="group relative grid overflow-hidden rounded-3xl ring-1 ring-latao/60 md:min-h-[32rem] md:grid-cols-2 lg:mx-auto lg:min-h-[36rem] lg:max-w-7xl"
            style={{ boxShadow: '0 20px 40px -18px rgba(40,46,41,0.45)', background: FEATURED_BG }}
          >
            <img
              src={FEATURED_IMG}
              alt={`Mão segurando o ${featured.tipo.toLowerCase()} ${featured.nome}`}
              // md+: altura vem do card (h-0 + min-h-full), não da proporção da foto — ! vence o aspectRatio inline;
              // recorte centrado no frasco
              className="col-start-1 row-start-1 h-full w-full object-cover object-top md:aspect-auto! md:h-0 md:min-h-full md:object-[50%_30%]"
              style={{ aspectRatio: '752 / 1344' }}
            />
            <RatioTag className="top-4 right-4 md:right-[calc(50%+1rem)]" />
            {/* md+: a foto dissolve pra direita, no painel de texto */}
            <div
              aria-hidden
              className="pointer-events-none col-start-1 row-start-1 hidden md:block"
              style={{ background: `linear-gradient(to right, transparent 55%, ${FEATURED_BG} 100%)` }}
            />
            <div
              aria-hidden
              className="pointer-events-none col-start-1 row-start-1 self-end h-[70%] backdrop-blur-md md:hidden"
              style={{
                background:
                  // degradê na cor do card (FEATURED_BG), sem tinta dourada
                  `linear-gradient(to top, ${FEATURED_BG} 0%, color-mix(in srgb, ${FEATURED_BG} 94%, transparent) 45%, color-mix(in srgb, ${FEATURED_BG} 70%, transparent) 78%, transparent 100%)`,
                maskImage: 'linear-gradient(to top, black 60%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to top, black 60%, transparent 100%)',
              }}
            />
            {/* Moldura interna dourada — filete fino, afastado da borda */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-2.5 rounded-[18px] border"
              style={{ borderColor: `color-mix(in srgb, ${LATAO_CLARO} 45%, transparent)` }}
            />

            <div className="relative col-start-1 row-start-1 self-end px-6 pt-[88%] pb-6 md:col-start-2 md:self-center md:px-8 md:pt-10 md:pb-10 lg:px-14 lg:pt-14 lg:pb-14 xl:px-20">
              <div className="flex items-center gap-3">
                <span aria-hidden className="h-px w-6" style={{ background: LATAO_CLARO }} />
                <Eyebrow className="" style={{ color: LATAO_CLARO, textShadow: '0 1px 8px rgba(40,0,8,0.45)' }}>
                  Arquétipo em destaque
                </Eyebrow>
              </div>
              <h2 className="mt-3 font-display text-4xl leading-[1.1] text-papel-inv lg:text-5xl">{featured.nome}</h2>
              <p className="mt-2 font-display text-lg leading-snug text-papel-inv/85 italic lg:mt-3 lg:text-xl">{featured.ep}</p>

              <div aria-hidden className="mt-4 flex items-center gap-2">
                <span className="h-px flex-1" style={{ background: `linear-gradient(to right, ${LATAO_CLARO}, transparent)` }} />
                <span className="size-1 rotate-45" style={{ background: LATAO_CLARO }} />
              </div>
              <div className="mt-3.5 flex items-end justify-between gap-4">
                <div>
                  <span className="block font-label text-[9px] tracking-widest text-papel-inv/60 uppercase">
                    {featured.tipo} · {featured.vol}
                  </span>
                  <span className="mt-1.5 block font-display text-3xl leading-none text-papel-inv">{brl(featured.preco)}</span>
                </div>
                <span
                  className="max-w-[12ch] pb-0.5 text-right font-label text-[9px] tracking-widest uppercase"
                  style={{ color: LATAO_CLARO }}
                >
                  {featured.fam}
                </span>
              </div>
              {/* regra 7: Pix e parcelamento junto do preço — mesma conta do ProductPurchase */}
              <p className="mt-1.5 text-[12px] text-papel-inv/60">
                {brl(featured.preco * 0.95)} no Pix · ou 6x de {brl(featured.preco / 6)} sem juros
              </p>
              <p className="mt-2.5 max-w-[32ch] text-[13px] leading-relaxed text-papel-inv/75 lg:mt-4 lg:max-w-[42ch] lg:text-[15px]">{featured.cheiro[1]}</p>

              <Link
                to={`/loja/${featured.id}`}
                state={{ backgroundLocation: location }}
                className="mt-4 block w-full rounded-full border border-papel-inv/40 lg:mt-8 lg:inline-block lg:w-auto lg:px-10 bg-papel-inv/10 py-3 text-center text-xs font-medium tracking-wide text-papel-inv uppercase backdrop-blur-sm transition-colors duration-300 ease-out hover:border-papel-inv/60 hover:bg-papel-inv/20"
              >
                Conhecer {featured.nome}
              </Link>
            </div>
          </div>
        </Reveal>

        {/* H-16 Escada de preço / kit builder — desativado a pedido, mantido no código pra reconectar depois
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
        */}

        {/* H-17 Números de percepção — percentuais escondidos até existir dado real (SHOW_PROOF_STATS);
            o fechamento "Talvez você não seja apenas um." fica */}
        <Reveal
          as="section"
          className={`relative overflow-hidden px-5 md:px-10 ${SHOW_PROOF_STATS ? 'pt-12 lg:pt-20' : ''}`}
          style={{ background: 'linear-gradient(to bottom, var(--color-papel) 0%, var(--color-papel-2) 100%)' }}
        >
          {SHOW_PROOF_STATS && (
          <>
          <img
            src={florArquetypus}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute select-none"
            style={{
              top: '-30px',
              right: '-70px',
              width: '240px',
              height: 'auto',
              opacity: 0.18,
              transform: 'rotate(40deg)',
              maskImage: 'radial-gradient(closest-side, black 55%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(closest-side, black 55%, transparent 100%)',
            }}
          />

          <div className="relative z-10 lg:mx-auto lg:max-w-7xl">
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-px w-6 bg-latao-texto" />
              <Eyebrow>Teste com 120 pessoas · 21 dias</Eyebrow>
            </div>
            <h2 className="mt-4 font-display text-[28px] leading-[1.15] text-tinta">
              Depois de
              <br />
              experimentar,
              <br />
              <span className="text-latao-texto">algo mudou.</span>
            </h2>

            {/* lg: os 4 números numa linha só */}
            <div className="relative mt-12 grid grid-cols-2 gap-y-14 lg:grid-cols-4">
              <span aria-hidden className="pointer-events-none absolute inset-y-2 left-1/2 w-px bg-linha lg:hidden" />
              {STATS.map((st, i) => (
                <div key={st.label} className={i % 2 === 0 ? 'pr-5' : 'pl-5'}>
                  <span className="block font-display text-[56px] leading-none tracking-tight text-latao-texto">
                    {st.pct}
                  </span>
                  <span aria-hidden className="mt-5 block h-px w-8 bg-latao-texto/60" />
                  <span className="mt-4 block text-[13px] leading-relaxed text-tinta-2">{st.label}</span>
                </div>
              ))}
            </div>
            <p className="mt-12 font-label text-[8.5px] tracking-wide text-tinta-3">
              AUTOAVALIAÇÃO · N=120 · JUL/2026 · DADO ILUSTRATIVO NO PROTÓTIPO
            </p>
          </div>
          </>
          )}

          {/* Fechamento — ponte pro que vem depois */}
          <div
            className={`relative -mx-5 overflow-hidden bg-papel-2 px-5 pt-14 pb-12 text-center md:-mx-10 lg:pt-24 lg:pb-24 ${
              SHOW_PROOF_STATS ? 'mt-14 border-t border-linha' : ''
            }`}
          >
            <img
              src={florArquetypus}
              alt=""
              aria-hidden="true"
              // lg: flor maior pra acompanhar o texto — ! vence o width inline
              className="pointer-events-none absolute left-1/2 select-none lg:w-[440px]!"
              style={{
                top: '50%',
                width: '300px',
                height: 'auto',
                opacity: 0.12,
                transform: 'translate(-50%, -50%) rotate(180deg)',
                maskImage: 'radial-gradient(closest-side, black 45%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(closest-side, black 45%, transparent 100%)',
              }}
            />
            <div className="relative z-10">
              <p className="mx-auto max-w-[16ch] font-display text-[26px] leading-[1.25] text-tinta italic lg:text-4xl lg:leading-[1.2]">
                Talvez você não seja apenas um.
              </p>
              <SweepCta onClick={() => scrollToId('catalogo')} className="mt-6 lg:mt-8">
                Descubra seus arquétipos
              </SweepCta>
            </div>
          </div>
        </Reveal>

        {/* H-18 Comparativo — lista editorial numerada (mesmo padrão do Diagnóstico), sobre noite.
            Celular/tablet: chave Arquétypus × Splash comum; lg: título à esquerda e as duas colunas lado a lado */}
        <Reveal
          as="section"
          className="relative z-20 overflow-hidden bg-noite px-5 pt-14 pb-14 md:px-10 lg:pt-24 lg:pb-24"
          animateContent
          style={{
            // Degrau invertido, como o do catálogo: a seção fica por cima e projeta sombra na de cima
            boxShadow: '0 -14px 26px -10px rgba(37,46,40,0.5), 0 -4px 8px -3px rgba(37,46,40,0.35)',
            // filete dourado como borda: um `absolute` aqui dentro ancoraria no wrapper animado do Reveal (transform)
            borderTop: '1px solid color-mix(in srgb, var(--color-latao) 70%, transparent)',
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full"
            style={{
              background: 'radial-gradient(closest-side, color-mix(in srgb, var(--color-latao) 22%, transparent), transparent)',
              filter: 'blur(20px)',
            }}
          />

          <div className="relative md:mx-auto md:max-w-3xl lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-16">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3">
                <span aria-hidden className="h-px w-6" style={{ background: LATAO_CLARO }} />
                <Eyebrow className="" style={{ color: LATAO_CLARO }}>
                  A diferença
                </Eyebrow>
              </div>
              <h2 className="mt-4 font-display text-[32px] leading-[1.12] text-papel-inv lg:text-5xl lg:leading-[1.1]">
                Uma experiência
                <br />
                que vai <span style={{ color: LATAO_CLARO }}>além do cheiro.</span>
              </h2>
            </div>
            {/* Chave em vez de duas colunas: uma frase por linha no mobile, o leitor alterna o lado */}
            <div
              role="tablist"
              aria-label="Comparar"
              className="relative mt-8 grid grid-cols-2 overflow-hidden rounded-full border border-papel-inv/20 bg-papel-inv/5 p-1 backdrop-blur-sm lg:hidden"
            >
              {/* Pílula que desliza entre as opções — overshoot de ~1% (~2px, menor que o p-1) dá o bounce sem passar do contorno */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-papel-inv/15 transition-transform duration-[550ms] ease-[cubic-bezier(0.34,1.2,0.64,1)] motion-reduce:transition-none"
                style={{
                  transform: difModo === 'arquetypus' ? 'translateX(0)' : 'translateX(100%)',
                  boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${LATAO_CLARO} 55%, transparent), 0 4px 14px -6px rgba(0,0,0,0.5)`,
                }}
              />
              {(
                [
                  { key: 'arquetypus', label: 'Arquétypus' },
                  { key: 'comum', label: 'Splash comum' },
                ] as const
              ).map((t) => {
                const ativo = difModo === t.key
                return (
                  <button
                    key={t.key}
                    type="button"
                    role="tab"
                    aria-selected={ativo}
                    onClick={() => setDifModo(t.key)}
                    className={`relative z-10 rounded-full py-2.5 text-xs font-medium tracking-wide uppercase ${
                      ativo ? 'text-papel-inv' : 'text-papel-inv/45'
                    }`}
                    // inline: a regra global `a, button { transition }` de index.css venceria a utility
                    style={{ transition: 'color 0.35s ease-out, transform 0.2s ease' }}
                  >
                    {t.label}
                  </button>
                )
              })}
            </div>

            <ol key={difModo} role="tabpanel" className="page-fade mt-3 lg:hidden">
              {COMPARISON.map((c, i) => (
                <li key={c.tema} className="flex items-baseline gap-4 border-b border-papel-inv/10 py-3.5">
                  <span
                    aria-hidden
                    className="w-5 shrink-0 font-label text-[10px] tracking-widest"
                    style={{ color: difModo === 'arquetypus' ? LATAO_CLARO : 'rgba(242,234,219,0.3)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p
                    className={`font-display text-[17px] leading-snug ${
                      difModo === 'arquetypus' ? 'text-papel-inv' : 'text-papel-inv/40'
                    }`}
                  >
                    {difModo === 'arquetypus' ? c.arquetypus : c.comum}
                  </p>
                </li>
              ))}
            </ol>

            {/* lg: as duas colunas lado a lado, sem chave — cabe na tela, o leitor compara direto */}
            <div className="hidden lg:col-span-8 lg:block">
              <div className="grid grid-cols-[3rem_1fr_1fr] gap-x-8 border-b border-papel-inv/20 pb-4 font-label text-[10px] tracking-widest uppercase">
                <span aria-hidden />
                <span style={{ color: LATAO_CLARO }}>Arquétypus</span>
                <span className="text-papel-inv/45">Splash comum</span>
              </div>
              <ol>
                {COMPARISON.map((c, i) => (
                  <li key={c.tema} className="grid grid-cols-[3rem_1fr_1fr] items-baseline gap-x-8 border-b border-papel-inv/10 py-4">
                    <span aria-hidden className="font-label text-[10px] tracking-widest" style={{ color: LATAO_CLARO }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="font-display text-lg leading-snug text-papel-inv">{c.arquetypus}</p>
                    <p className="text-[15px] leading-snug text-papel-inv/40">{c.comum}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="pt-10 text-center lg:col-span-12 lg:pt-20">
              <p className="font-display text-[26px] leading-[1.25] text-papel-inv italic lg:text-4xl lg:leading-[1.2]">
                Não é apenas sobre cheirar bem.
                <br />
                <span style={{ color: LATAO_CLARO }}>É sobre como você quer se sentir.</span>
              </p>
            </div>
          </div>
        </Reveal>

        {/* H-19 Comunidade */}
        <CommunitySection />

        {/* H-20 Garantia — bloco escuro como pontuação: fica por cima da comunidade (degrau invertido) */}
        <Reveal
          as="section"
          className="relative z-20 overflow-hidden bg-noite px-6 pt-16 pb-16 text-center md:px-10 lg:pt-24 lg:pb-24"
          animateContent
          style={{
            boxShadow: '0 -14px 26px -10px rgba(37,46,40,0.5), 0 -4px 8px -3px rgba(37,46,40,0.35)',
            borderTop: '1px solid color-mix(in srgb, var(--color-latao) 70%, transparent)',
          }}
        >
          {/* textura mínima: um halo quente quase imperceptível atrás do número (lg: vai junto com o número, ver abaixo) */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-6 left-1/2 size-72 -translate-x-1/2 rounded-full lg:hidden"
            style={{
              background: 'radial-gradient(closest-side, color-mix(in srgb, var(--color-latao) 16%, transparent), transparent)',
              filter: 'blur(24px)',
            }}
          />

          {/* lg: número à esquerda, promessa à direita, separados por um filete — lê como selo + texto */}
          <div className="relative lg:mx-auto lg:grid lg:max-w-6xl lg:grid-cols-12 lg:items-center lg:gap-x-16">
            <div className="relative lg:col-span-5">
              <div
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-1/2 hidden size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full lg:block"
                style={{
                  background: 'radial-gradient(closest-side, color-mix(in srgb, var(--color-latao) 16%, transparent), transparent)',
                  filter: 'blur(32px)',
                }}
              />
              <div
                className="relative font-display text-[112px] leading-[0.9] font-light tracking-tight lg:text-[200px] xl:text-[232px]"
                style={{ color: LATAO_CLARO }}
              >
                07
              </div>
              <div className="relative mt-4 flex items-center justify-center gap-3 lg:mt-6">
                <span aria-hidden className="h-px w-6 bg-papel-inv/20 lg:w-10" />
                <p className="font-label text-[9.5px] tracking-[0.3em] text-papel-inv/60 uppercase lg:text-[11px]">Dias de garantia</p>
                <span aria-hidden className="h-px w-6 bg-papel-inv/20 lg:w-10" />
              </div>
            </div>

            <div className="lg:col-span-7 lg:border-l lg:border-papel-inv/15 lg:py-6 lg:pl-16 lg:text-left">
              <h2 className="mt-8 font-display text-[28px] leading-[1.2] text-papel-inv lg:mt-0 lg:text-[44px] lg:leading-[1.12]">
                Experimente na pele.
                <br />
                <em style={{ color: LATAO_CLARO }}>Descubra se essa fragrância combina com você.</em>
              </h2>

              <p className="mx-auto mt-6 max-w-[28ch] text-[15px] leading-relaxed text-papel-inv/70 lg:mx-0 lg:mt-8 lg:max-w-none lg:text-[17px]">
                Deixe a fragrância se revelar.
              </p>
              <p className="mx-auto mt-4 max-w-[28ch] text-[15px] leading-relaxed text-papel-inv/70 lg:mx-0 lg:mt-2 lg:max-w-none lg:text-[17px]">
                Se não for para você,
                <br className="lg:hidden" /> devolvemos o valor.
              </p>

              <p className="mt-8 font-label text-[9px] tracking-[0.2em] text-papel-inv/40 uppercase lg:mt-10 lg:text-[10px]">
                Sem perguntas · Mesmo com o frasco aberto
              </p>
            </div>
          </div>
        </Reveal>

        {/* H-21 Seja criador — volta ao claro, continuação da comunidade */}
        <Reveal
          as="section"
          className="relative overflow-hidden bg-papel px-5 pt-16 pb-16 md:px-10 lg:pt-24 lg:pb-24"
          style={{
            // degrau: sai do bloco escuro (por cima) para esta seção, abaixo
            boxShadow:
              'inset 0 26px 28px -20px rgba(40,46,41,0.4), inset 0 8px 10px -7px rgba(40,46,41,0.28)',
          }}
        >
          <img
            src={florArquetypus}
            alt=""
            aria-hidden="true"
            // lg: flor maior, proporcional à seção mais alta
            className="pointer-events-none absolute select-none lg:!-bottom-24 lg:!-left-28 lg:!w-[420px]"
            style={{
              bottom: '-50px',
              left: '-70px',
              width: '240px',
              height: 'auto',
              opacity: 0.14,
              transform: 'rotate(150deg)',
              maskImage: 'radial-gradient(closest-side, black 55%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(closest-side, black 55%, transparent 100%)',
            }}
          />

          {/* lg: texto + CTA à esquerda, indicadores à direita ocupando a altura toda da coluna */}
          <div className="relative md:mx-auto md:max-w-3xl lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-16">
            <div className="lg:col-span-6">
              <div className="flex items-center gap-3">
                <span aria-hidden className="h-px w-6 bg-latao" />
                <Eyebrow>Para criadores</Eyebrow>
              </div>
              <h2 className="mt-4 font-display text-[28px] leading-[1.15] text-tinta lg:text-5xl lg:leading-[1.1]">
                Sua experiência com Arquétypus
                <br />
                pode <span className="text-latao-texto">inspirar novas descobertas.</span>
              </h2>
            </div>

            <dl className="mt-10 grid grid-cols-3 border-y border-linha py-6 lg:col-span-5 lg:col-start-8 lg:row-span-3 lg:mt-0 lg:self-center lg:py-12">
              {[
                { valor: `${Math.round(ECON.comissaoPct * 100)}%`, label: ['de comissão', 'por venda'] },
                { valor: 'Grátis', label: ['amostra para', 'aprovados'] },
                { valor: 'D+30', label: ['pagamento', 'via Pix'] },
              ].map((ind, i) => (
                <div key={ind.valor} className={`flex flex-col items-center text-center ${i > 0 ? 'border-l border-linha' : ''}`}>
                  {/* dt antes de dd no DOM (semântica de <dl>); order-last põe o rótulo embaixo do número */}
                  <dt className="order-last mt-3 font-label text-[8.5px] leading-relaxed tracking-[0.16em] text-tinta-3 uppercase lg:mt-4 lg:text-[10px]">
                    {ind.label[0]}
                    <br />
                    {ind.label[1]}
                  </dt>
                  <dd className="font-display text-[28px] leading-none font-light text-tinta lg:text-5xl">{ind.valor}</dd>
                </div>
              ))}
            </dl>

            <div className="lg:col-span-6">
              <p className="mt-8 max-w-[34ch] text-[15px] leading-relaxed text-tinta-2 lg:mt-8 lg:max-w-[40ch] lg:text-[17px]">
                Compartilhe suas fragrâncias favoritas e ganhe com cada venda pelo seu link.
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-tinta-3 lg:max-w-[52ch] lg:text-[15px]">
                Você experimenta, escolhe suas favoritas e compartilha a experiência do seu jeito. Materiais, ângulos que funcionam e ranking de criadores no painel.
              </p>
            </div>

            <div className="mt-8 text-center lg:col-span-6 lg:mt-10 lg:text-left">
              <SweepCta to="/criadores" className="lg:w-auto lg:px-10">
                Quero ser criador
              </SweepCta>
            </div>
          </div>
        </Reveal>

        {/* H-22 Diário olfativo — escuro, por cima de Criadores (degrau invertido), lista editorial numerada */}
        <Reveal
          as="section"
          id="diario"
          className="relative z-20 overflow-hidden bg-noite px-5 pt-14 pb-14 md:px-10 lg:pt-24 lg:pb-24"
          animateContent
          style={{
            boxShadow: '0 -14px 26px -10px rgba(37,46,40,0.5), 0 -4px 8px -3px rgba(37,46,40,0.35)',
            borderTop: '1px solid color-mix(in srgb, var(--color-latao) 70%, transparent)',
          }}
        >
          <div className="md:mx-auto md:max-w-3xl lg:max-w-7xl">
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-px w-6" style={{ background: LATAO_CLARO }} />
              <Eyebrow className="" style={{ color: LATAO_CLARO }}>
                Descubra mais sobre perfumaria
              </Eyebrow>
            </div>
            <h2 className="mt-4 font-display text-[32px] leading-[1.1] text-papel-inv lg:text-5xl">Diário olfativo</h2>

            {/* artigos ainda não existem como página — por isso sem link/seta */}
            {/* lg: três colunas editoriais, cada uma aberta por um filete, número em cima */}
            <ol className="mt-8 lg:mt-14 lg:grid lg:grid-cols-3 lg:gap-x-12">
              {JOURNAL.map((j, i) => (
                <li
                  key={j.title}
                  className="flex gap-4 border-t border-papel-inv/10 py-5 last:border-b lg:flex-col lg:gap-6 lg:border-papel-inv/20 lg:pt-6 lg:pb-0 lg:last:border-b-0"
                >
                  <span
                    aria-hidden
                    className="w-5 shrink-0 pt-1 font-label text-[10px] tracking-widest lg:w-auto lg:pt-0 lg:text-[11px]"
                    style={{ color: LATAO_CLARO }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-[19px] leading-snug text-papel-inv lg:text-2xl lg:leading-[1.25]">{j.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-papel-inv/55 lg:mt-3 lg:text-[15px]">{j.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        {/* H-23 Captura com cupom — claro, abaixo do Diário (degrau), card na moldura recortada */}
        <Reveal
          as="section"
          className="relative overflow-hidden bg-papel px-5 pt-16 pb-16 md:px-10 lg:pt-24 lg:pb-24"
          style={{
            boxShadow:
              'inset 0 26px 28px -20px rgba(40,46,41,0.4), inset 0 8px 10px -7px rgba(40,46,41,0.28)',
          }}
        >
          <img
            src={florArquetypus}
            alt=""
            aria-hidden="true"
            // lg: flor maior, proporcional à seção mais alta
            className="pointer-events-none absolute select-none lg:!-top-16 lg:!-right-28 lg:!w-[420px]"
            style={{
              top: '-30px',
              right: '-80px',
              width: '240px',
              height: 'auto',
              opacity: 0.14,
              transform: 'rotate(30deg)',
              maskImage: 'radial-gradient(closest-side, black 55%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(closest-side, black 55%, transparent 100%)',
            }}
          />

          {/* lg: oferta à esquerda, formulário à direita, separados por filete — mesma leitura do bloco de garantia */}
          <CutFrame
            cut={14}
            className="relative md:mx-auto md:max-w-xl lg:max-w-5xl"
            innerClassName="bg-papel px-6 pt-9 pb-8 text-center lg:grid lg:grid-cols-2 lg:items-center lg:px-16 lg:py-16"
          >
            <div className="lg:border-r lg:border-linha lg:pr-16">
              <div className="flex items-center justify-center gap-3">
                <span aria-hidden className="h-px w-6 bg-latao/60" />
                <Eyebrow>Primeira compra</Eyebrow>
                <span aria-hidden className="h-px w-6 bg-latao/60" />
              </div>

              <div className="mt-5 font-display text-[88px] leading-[0.9] font-light tracking-tight text-latao-texto lg:mt-6 lg:text-[128px]">
                15%
              </div>
              <h2 className="mt-3 font-display text-[24px] leading-[1.2] text-tinta lg:mt-4 lg:text-[32px]">
                na sua primeira
                <br />
                Arquétypus.
              </h2>
              <p className="mx-auto mt-3 max-w-[30ch] text-[13px] leading-relaxed text-tinta-2 lg:mt-4 lg:text-[15px]">
                Receba seu benefício e descubra primeiro as novidades da Arquétypus.
              </p>
            </div>

            {/* sem backend ainda: o submit não envia nada (ver CLAUDE.md) */}
            <form className="mt-8 flex flex-col gap-5 text-left lg:mt-0 lg:gap-7 lg:pl-16" onSubmit={(e) => e.preventDefault()}>
              <label className="block">
                <span className="font-label text-[9px] tracking-[0.2em] text-tinta-3 uppercase">E-mail</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  className="mt-1.5 block w-full border-b border-linha-2 bg-transparent pb-2.5 text-[15px] text-tinta placeholder:text-tinta-3/70 focus:border-latao focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="font-label text-[9px] tracking-[0.2em] text-tinta-3 uppercase">WhatsApp</span>
                <input
                  type="tel"
                  name="whatsapp"
                  inputMode="tel"
                  autoComplete="tel-national"
                  placeholder="DDD + número"
                  className="mt-1.5 block w-full border-b border-linha-2 bg-transparent pb-2.5 text-[15px] text-tinta placeholder:text-tinta-3/70 focus:border-latao focus:outline-none"
                />
              </label>
              <div className="mt-3 text-center">
                <SweepCta type="submit">Quero meu cupom</SweepCta>
              </div>
            </form>
          </CutFrame>
        </Reveal>

        {/* H-24 Rodapé — escuro, por cima do cupom (degrau invertido); -mb-24 cobre o pb-24 do container do Layout */}
        <footer
          className="relative z-20 -mb-24 bg-noite px-5 pt-16 pb-[calc(2.5rem+6rem)] md:px-10 lg:pt-24"
          style={{
            boxShadow: '0 -14px 26px -10px rgba(37,46,40,0.5), 0 -4px 8px -3px rgba(37,46,40,0.35)',
            borderTop: '1px solid color-mix(in srgb, var(--color-latao) 70%, transparent)',
          }}
        >
          {/* lg: marca à esquerda, links à direita; faixa legal numa linha só embaixo */}
          <div className="md:mx-auto md:max-w-3xl lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-16">
            <div className="flex flex-col text-center lg:col-span-5 lg:text-left">
              <p className="font-display text-[22px] leading-[1.35] text-papel-inv/90 italic lg:mt-8 lg:text-[26px]">
                Você não escolhe um perfume.
                <br />
                <span style={{ color: LATAO_CLARO }}>Você reconhece o seu.</span>
              </p>
              {/* traços alinhados à linha do nome ARQUÉTYPUS (~72% da altura do logo a w-40 = 70px) */}
              {/* lg: logo sobe pra cima da frase e perde os traços (alinhado à esquerda, eles ficariam soltos) */}
              <div className="mt-10 flex items-start justify-center gap-4 lg:order-first lg:mt-0 lg:justify-start">
                <span aria-hidden className="mt-[70px] h-px w-10 bg-papel-inv/15 lg:hidden" />
                <img src={logoBranco} alt="Arquétypus Parfum" loading="lazy" className="h-auto w-40" />
                <span aria-hidden className="mt-[70px] h-px w-10 bg-papel-inv/15 lg:hidden" />
              </div>
            </div>
  
            <nav
              aria-label="Rodapé"
              className="mt-12 grid grid-cols-2 gap-x-6 border-t border-papel-inv/10 pt-8 lg:col-span-5 lg:col-start-8 lg:mt-0 lg:gap-x-12 lg:self-center lg:border-t-0 lg:pt-0"
            >
              <div>
                <p className="font-label text-[9px] tracking-[0.2em] text-papel-inv/35 uppercase">Explorar</p>
                <ul className="mt-4 flex flex-col gap-3 text-sm text-papel-inv/75">
                  <li><Link to="/#catalogo" className="transition-colors hover:text-papel-inv">Os 9 arquétipos</Link></li>
                  <li><Link to="/#diario" className="transition-colors hover:text-papel-inv">Diário olfativo</Link></li>
                  <li><Link to="/criadores" className="transition-colors hover:text-papel-inv">Seja criador</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-label text-[9px] tracking-[0.2em] text-papel-inv/35 uppercase">Ajuda</p>
                {/* Trocas e Termos sem página ainda — visíveis, mas não clicáveis (mesmo critério do Drawer) */}
                <ul className="mt-4 flex flex-col gap-3 text-sm text-papel-inv/35">
                  <li>
                    <Link to="/privacidade" className="text-papel-inv/75 transition-colors hover:text-papel-inv">
                      Privacidade
                    </Link>
                  </li>
                  {['Trocas e devoluções', 'Termos'].map((item) => (
                    <li key={item} aria-disabled="true">
                      {item}
                      <span className="mt-0.5 block font-label text-[8px] tracking-widest text-papel-inv/25 uppercase">em breve</span>
                    </li>
                  ))}
                  {/* LGPD: a pessoa precisa conseguir rever a escolha a qualquer momento */}
                  <li>
                    <button
                      type="button"
                      onClick={openCookiePreferences}
                      className="text-left text-papel-inv/75 transition-colors hover:text-papel-inv"
                    >
                      Gerenciar cookies
                    </button>
                  </li>
                </ul>
              </div>
            </nav>
  
            <div className="lg:col-span-12 lg:mt-20 lg:flex lg:items-center lg:justify-between lg:gap-8 lg:border-t lg:border-papel-inv/10 lg:pt-8">
              <p className="mt-10 text-center font-label text-[9px] tracking-[0.2em] text-papel-inv/45 uppercase lg:order-last lg:mt-0 lg:shrink-0">
                Instagram <span className="mx-2 text-papel-inv/20">·</span> TikTok <span className="mx-2 text-papel-inv/20">·</span> Pinterest
              </p>
  
              <div className="mt-8 border-t border-papel-inv/10 pt-6 text-center font-label text-[8.5px] leading-relaxed tracking-wider text-papel-inv/30 uppercase lg:mt-0 lg:flex lg:flex-wrap lg:items-center lg:gap-x-6 lg:border-t-0 lg:pt-0 lg:text-left lg:text-[9px]">
                <p>Pix · Visa · Master · Elo · Boleto</p>
                <p className="mt-3 normal-case tracking-wide lg:mt-0">sac@arquetypus.com.br</p>
                <p className="mt-1 lg:mt-0">Saniella Ltda · CNPJ 58.267.823/0001-68 · Caraguatatuba SP</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

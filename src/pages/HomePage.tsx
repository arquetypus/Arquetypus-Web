import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ARCHETYPES, getArchetype, productPath } from '@/data/archetypes'
import {
  BODEGON_IMG,
  DIAGNOSIS,
  FAMILIES,
  familyFoto,
  FRASCO_CUT_IMG,
  FRASCO_IMG,
  JOURNAL,
  QUALIFICATION,
  SEGMENTS,
  SEGMENTS_HEADING,
  STATS,
  UGC_IMG,
  UGC_VIDEOS,
} from '@/data/home'
import { comissaoTexto } from '@/data/economics'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { MediaSlot } from '@/components/ui/MediaSlot'
import { RatioTag } from '@/components/ui/RatioTag'
// import { KitBuilder } from '@/components/KitBuilder' // seção "Monte o seu" desativada
import { Reveal } from '@/components/ui/Reveal'
import { CarouselDots } from '@/components/ui/CarouselDots'
import { CutFrame } from '@/components/ui/CutFrame'
import { SweepCta } from '@/components/ui/SweepCta'
import { scrollToId } from '@/lib/scrollToId'
import { EMPRESA_LINHA } from '@/data/empresa'
import { GOLD_SHEEN } from '@/lib/goldSheen'
import { FeaturedCarousel } from '@/components/FeaturedCarousel'
import { DifferenceSection } from '@/components/DifferenceSection'
import { BenefitsMarquee } from '@/components/BenefitsMarquee'
import { isBoutiqueLayout, useThemeState } from '@/lib/theme'
// direção decidida: importada direto (entra no JS principal e no HTML pré-renderizado)
import { CatalogGrid, HeroBoutique } from '@/components/boutique/BoutiqueSections'
import { CommunityBoutique, DiaryBoutique, FooterBoutique } from '@/components/boutique/BoutiqueMore'
import { CatalogCinema, HeroCinema } from '@/components/directions/Cinema'
// demais direções: só baixadas se desenhadas (ThemeSwitcher ligado) — ver components/directions/lazy.tsx
import {
  CatalogGaleria, CatalogHerbario, CatalogIndex, CatalogLaboratorio, CatalogManifesto, CatalogOraculo, CatalogRiviera,
  CatalogZen, CinemaPage, CommunityAtelie, DiaryAtelie, FeaturedAtelie, FooterAtelie, GaleriaPage, HeroAtelie,
  HeroCarousel, HeroGaleria, HeroHerbario, HeroLaboratorio, HeroManifesto, HeroOraculo, HeroRiviera, HeroZen,
  HerbarioPage, LaboratorioPage, ManifestoPage, OraculoPage, RivieraPage, ZenPage,
} from '@/components/directions/lazy'
import type { DirectionPageProps } from '@/components/directions/shared'
import type { ThemeId } from '@/lib/theme'

/** Direções que desenham a home inteira (não só hero e catálogo) — ver components/directions/. */
const DIRECTION_PAGES: Partial<Record<ThemeId, (p: DirectionPageProps) => React.ReactNode>> = {
  oraculo: OraculoPage,
  galeria: GaleriaPage,
  manifesto: ManifestoPage,
  cinema: CinemaPage,
  herbario: HerbarioPage,
  laboratorio: LaboratorioPage,
  riviera: RivieraPage,
  zen: ZenPage,
}
import { openCookiePreferences } from '@/lib/consent'
import { useCarouselIndex } from '@/lib/useCarouselIndex'
import { useTapGuard } from '@/lib/useTapGuard'
import { useInfiniteCarousel } from '@/lib/useInfiniteCarousel'
import { useCoverflow } from '@/lib/useCoverflow'
import featuredFenix from '@/assets/fotos/destaque-fenix.jpg?responsiva'
import { foto } from '@/lib/foto'
import ribbonArquetypus from '@/assets/brand/ribbon-arquetypus.png'
import logoBranco from '@/assets/brand/logo-branco.png'
import { FLOR_IMG } from '@/components/ui/Editorial'
import { Sobrenome } from '@/components/ui/Sobrenome'
import { Preco } from '@/components/ui/Preco'

/**
 * Degradê foto → fundo noite do catálogo. Faixa larga com curva "smootherstep" (plana nas duas pontas):
 * entra quase imperceptível, escurece no meio e chega na cor cheia só rente à borda (96%) — assim não
 * sobra a linha marcada onde a foto encontra o fundo liso.
 */
const FOTO_FADE = (dir: string) =>
  `linear-gradient(${dir}, ${Array.from({ length: 11 }, (_, i) => {
    const t = i / 10
    const a = t * t * t * (t * (t * 6 - 15) + 10)
    // cor via var(--color-noite) pra acompanhar as direções visuais (ThemeSwitcher)
    return `color-mix(in srgb, var(--color-noite) ${(a * 100).toFixed(1)}%, transparent) ${(t * 96).toFixed(1)}%`
  }).join(', ')}, var(--color-noite) 100%)`

/** Halos dourados do fundo do catálogo: posição/tamanho (classes), intensidade (% do latão) e desfoque. */
const CATALOGO_GLOWS = [
  { className: 'top-[4%] -right-24 size-80 lg:size-[26rem]', forca: 18, blur: 30 },
  { className: 'bottom-[6%] left-[4%] size-56 lg:size-72', forca: 11, blur: 34 },
  { className: 'top-[42%] right-[18%] size-28 lg:size-40', forca: 14, blur: 22 },
]


/** Dourado sobre fundo escuro/bronze. Hoje é o próprio --color-latao (dourado do logo), que já é claro o bastante. */
const LATAO_CLARO = 'var(--color-latao)'

// Copy revisada (set/2026): percentuais de percepção, depoimentos e nota média saem do ar
// até existir dado real. Ficam no código pra religar trocando pra true com fonte de verdade.
const SHOW_PROOF_STATS = false
const SHOW_REVIEWS = false

// Seções desligadas a pedido (out/2026): "O perfume errado" (diagnóstico), "Reconhecimento", "Para criadores" e
// "Diário olfativo". Código fica pra religar trocando pra true. A página /criadores continua no ar.
const SHOW_DIAGNOSIS = false
const SHOW_RECOGNITION = false
const SHOW_CREATORS = false
const SHOW_DIARY = false
// fechamento "Talvez você não seja apenas um." (H-17) ficou fora da ordem nova de out/2026
const SHOW_CLOSING = false

// Arquétipo em destaque das estruturas que ainda usam um só (Ateliê e direções). A home Boutique/Editorial
// usa o banner rotativo (components/FeaturedCarousel). Foto escolhida pela designer (set/2026).
const FEATURED_ID = 'fenix'
const FEATURED_IMG = foto(featuredFenix).src
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
  useCoverflow(ugcScroll.container)

  // UGC em moldura recortada + product tag sobreposto
  return (
    <Reveal
      as="section"
      className="relative overflow-hidden rounded-t-2xl bg-papel pt-14 pb-16 lg:pt-20 lg:pb-24"
      style={{
        // degrau: sai da "A diferença" (por cima) para uma seção que fica abaixo
        boxShadow:
          'inset 0 1px 0 color-mix(in srgb, var(--color-latao) 60%, transparent), inset 0 26px 28px -20px rgba(40,46,41,0.4), inset 0 8px 10px -7px rgba(40,46,41,0.28)',
      }}
    >
      <img loading="lazy"
        {...FLOR_IMG}
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
                  alt={`${v.creator} segurando o Body Splash Premium ${arq.nome}`}
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
                      <b className="block truncate font-display text-lg leading-tight font-normal text-tinta">
                        {arq.nome}
                        <Sobrenome a={arq} />
                      </b>
                      <span className="block truncate text-xs text-tinta-2">{arq.fam}</span>
                      <span className="mt-1 block truncate font-label text-[8.5px] tracking-widest text-tinta-3 uppercase">
                        {arq.tipo} · {arq.vol}
                      </span>
                      <Preco a={arq} className="mt-1 text-sm leading-none" />
                    </div>
                  </div>
                  <Link
                    to={productPath(arq)}
                    state={{ backgroundLocation: location }}
                    className="mt-3 block w-full rounded-full border border-latao/50 bg-papel/40 py-2.5 text-center text-xs font-medium tracking-wide text-tinta uppercase transition-colors duration-300 ease-out hover:border-latao hover:bg-papel-2/70"
                  >
                    Descobrir
                  </Link>
                </CutFrame>
              </div>

              {SHOW_REVIEWS && v.testimonial && (
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
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  const location = useLocation()
  const { hash } = location
  const familiesScroll = useCarouselIndex<HTMLDivElement>(FAMILIES.length)
  const tapGuard = useTapGuard()
  const [catalogoFiltro, setCatalogoFiltroGenero] = useState<'ALL' | 'F' | 'M' | 'U'>('ALL')
  // família olfativa escolhida nos cards de "Descubra pelo cheiro" — sai ao trocar o gênero no catálogo
  const [catalogoFamilia, setCatalogoFamilia] = useState<string | null>(null)
  const setCatalogoFiltro = (f: 'ALL' | 'F' | 'M' | 'U') => {
    setCatalogoFiltroGenero(f)
    setCatalogoFamilia(null)
  }
  const catalogoFiltrado = useMemo(() => {
    const familia = FAMILIES.find((f) => f.nome === catalogoFamilia)
    return ARCHETYPES.filter(
      (a) => (catalogoFiltro === 'ALL' || a.seg === catalogoFiltro) && (!familia || familia.arquetipos.includes(a.id)),
    )
  }, [catalogoFiltro, catalogoFamilia])
  // um arquétipo só (ex.: Compartilhável): card único parado, sem cópias do loop infinito nem arraste
  const catalogoUnico = catalogoFiltrado.length === 1
  const catalogoLoop = catalogoUnico ? catalogoFiltrado : [...catalogoFiltrado, ...catalogoFiltrado, ...catalogoFiltrado]
  const catalogoCarrossel = useInfiniteCarousel(catalogoFiltrado.length)
  const catalogoAtivo = catalogoFiltrado.length > 0 ? catalogoCarrossel.activeIndex % catalogoFiltrado.length : 0
  // direções visuais (ThemeSwitcher): hero e catálogo são peças trocáveis (e misturáveis); Ateliê e Boutique
  // trocam também destaque, comunidade, diário e rodapé
  const { theme, hero, catalogo } = useThemeState()
  const isAtelie = theme === 'atelie'
  const isBoutique = isBoutiqueLayout(theme)
  // hero que fica por baixo do header transparente (foto/vídeo em tela cheia)
  const heroSobHeader = hero === 'padrao' || hero === 'cinema'
  const catalogoProps = { items: catalogoFiltrado, filtro: catalogoFiltro, setFiltro: setCatalogoFiltro, filtros: CATALOGO_FILTROS }
  const DirectionPage = DIRECTION_PAGES[theme]
  // card das seções: sobe arredondado por cima do hero (padrão e Cinema)
  const cardClass =
    hero === 'padrao'
      ? 'relative z-10 -mt-28 rounded-t-2xl bg-papel [@media(max-height:820px)]:-mt-16'
      : hero === 'cinema'
        ? // sobe por cima do hero pra mostrar a ponta da 1ª seção (--hero-sobe em index.css)
          'relative z-10 -mt-(--hero-sobe) rounded-t-2xl bg-papel'
        : 'relative z-10 bg-papel'

  useEffect(() => {
    if (!hash) return
    scrollToId(hash.slice(1))
  }, [hash])

  // catálogo como valor: entra na home padrão ou na página de uma direção (e pode vir misturado, ver "Misturar")
  const catalogNode =
        catalogo === 'atelie' ? (
          <CatalogIndex {...catalogoProps} />
        ) : catalogo === 'boutique' ? (
          <CatalogGrid {...catalogoProps} familia={catalogoFamilia} limparFamilia={() => setCatalogoFamilia(null)} />
        ) : catalogo === 'oraculo' ? (
          <CatalogOraculo {...catalogoProps} />
        ) : catalogo === 'galeria' ? (
          <CatalogGaleria {...catalogoProps} />
        ) : catalogo === 'manifesto' ? (
          <CatalogManifesto {...catalogoProps} />
        ) : catalogo === 'cinema' ? (
          <CatalogCinema {...catalogoProps} />
        ) : catalogo === 'herbario' ? (
          <CatalogHerbario {...catalogoProps} />
        ) : catalogo === 'laboratorio' ? (
          <CatalogLaboratorio {...catalogoProps} />
        ) : catalogo === 'riviera' ? (
          <CatalogRiviera {...catalogoProps} />
        ) : catalogo === 'zen' ? (
          <CatalogZen {...catalogoProps} />
        ) : (
        <>
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
            <img loading="lazy"
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
            {/* transição foto → fundo noite, bem esfumada (ver FOTO_FADE). Celular: embaixo; desktop: à direita */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[26%] lg:hidden"
              style={{ background: FOTO_FADE('to bottom') }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 hidden w-[28%] lg:block"
              style={{ background: FOTO_FADE('to right') }}
            />
          </div>

          {/* lg: -ml-0.5 + bg-noite cobre a última meia coluna de pixels da foto (a coluna tem largura
              fracionada e o anti-aliasing deixava um fio claro na junção com o fundo) */}
          <div className="relative isolate lg:-ml-0.5 lg:flex lg:min-w-0 lg:flex-col lg:justify-center lg:bg-noite lg:py-20">
            {/* pontos de luz dourados, desfocados e sutis no fundo verde — mesmo halo da seção "A diferença".
                isolate + -z-10: ficam atrás do conteúdo mas por cima do bg-noite do painel */}
            {CATALOGO_GLOWS.map((g) => (
              <div
                key={g.className}
                aria-hidden
                className={`pointer-events-none absolute -z-10 rounded-full ${g.className}`}
                style={{
                  background: `radial-gradient(closest-side, color-mix(in srgb, var(--color-latao) ${g.forca}%, transparent), transparent)`,
                  filter: `blur(${g.blur}px)`,
                }}
              />
            ))}
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
              className={`no-scrollbar mt-4 flex gap-4 px-[8vw] pb-2 lg:mt-8 lg:px-[calc(50%-10rem)] ${
                catalogoUnico ? 'justify-center overflow-hidden' : 'snap-x snap-mandatory overflow-x-auto'
              }`}
            >
              {catalogoLoop.map((a, i) => {
                const dist = Math.abs(i - catalogoCarrossel.activeIndex)
                const isActive = catalogoUnico || dist === 0
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
                  {/* moldura dourada com reflexo — 1px, recortada por máscara pra seguir o arredondado do card */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-30 rounded-3xl p-px"
                    style={{
                      background: GOLD_SHEEN,
                      WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                    }}
                  />

                  {FRASCO_IMG[a.id] && (
                    <img loading="lazy"
                      src={FRASCO_IMG[a.id]}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                      style={{ willChange: 'transform' }}
                    />
                  )}
                  <RatioTag className={a.status === 'wait' ? 'top-11 right-3' : 'top-3 right-3'} />

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
                    <b className="block font-display text-2xl text-papel-inv">
                      {a.nome}
                      <Sobrenome a={a} />
                    </b>
                    <span className="mt-1 block text-sm text-papel-inv/80">{a.fam}</span>
                    <span className="mt-3 block font-label text-[9px] tracking-wide text-papel-inv/60 uppercase">
                      {a.tipo} · {a.vol}
                    </span>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <span className="text-sm text-papel-inv/90">
                        {a.status === 'wait' ? 'Avise-me' : <Preco a={a} tom="escuro" />}
                      </span>
                      <Link
                        // mesmo destino do UGC: pop-up de compra (/body-splash/:slug por cima da home)
                        to={productPath(a)}
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
            <div className={`lg:mt-5 lg:flex lg:items-center lg:justify-center lg:gap-5 ${catalogoUnico ? 'invisible' : ''}`}>
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
            <p className={`mt-3 px-5 text-center font-label text-[9.5px] tracking-widest text-papel-inv/40 uppercase lg:hidden ${catalogoUnico ? 'invisible' : ''}`}>
              Deslize para explorar
            </p>
          </div>
        </Reveal>
        </>
        )

  return (
    <div className={heroSobHeader ? 'relative -mt-14 lg:-mt-20' : 'relative'}>
      {/* H-03 Hero — carrossel sticky, card sobe por cima (outras direções: hero próprio, sem sobreposição) */}
      {hero === 'atelie' ? (
        <HeroAtelie />
      ) : hero === 'boutique' ? (
        <HeroBoutique />
      ) : hero === 'oraculo' ? (
        <HeroOraculo />
      ) : hero === 'galeria' ? (
        <HeroGaleria />
      ) : hero === 'manifesto' ? (
        <HeroManifesto />
      ) : hero === 'cinema' ? (
        <HeroCinema />
      ) : hero === 'herbario' ? (
        <HeroHerbario />
      ) : hero === 'laboratorio' ? (
        <HeroLaboratorio />
      ) : hero === 'riviera' ? (
        <HeroRiviera />
      ) : hero === 'zen' ? (
        <HeroZen />
      ) : (
        <HeroCarousel />
      )}

      {DirectionPage ? (
        // Oráculo, Galeria, Manifesto, Cinema: a página inteira é da direção; hero e catálogo vêm como peças
        <div className={cardClass}>
          <DirectionPage
            catalog={catalogNode}
            onSegment={(seg) => {
              setCatalogoFiltro(seg)
              requestAnimationFrame(() => requestAnimationFrame(() => scrollToId('catalogo')))
            }}
            toCatalog={() => scrollToId('catalogo')}
            featured={featured}
            featuredImg={FEATURED_IMG}
          />
        </div>
      ) : (
      /* card das seções sobe por cima do hero; em telas baixas sobe menos pra mostrar mais imagem (par do pb do HeroCarousel) */
      <div className={cardClass}>
        {/* H-19 Comunidade — primeira seção depois do hero (out/2026): quem rola já vê gente de verdade usando */}
        {isAtelie ? <CommunityAtelie /> : isBoutique ? <CommunityBoutique /> : <CommunitySection />}

        {/* H-08 Segmentação — pôsteres na estética do Cinema: texto de apoio em cima, nome e CTA embaixo, tudo
            centrado. Celular: trilho horizontal (a seção não pode passar da altura da tela — decisão de out/2026);
            md+: 3 lado a lado, altura presa à tela pelo mesmo motivo (100svh menos cabeçalho e paddings da seção) */}
        <Reveal as="section" id="segmentos" className="pt-8 pb-10 md:mx-auto md:max-w-[88rem] md:px-10 md:pt-10 md:pb-12">
          <div className="px-4 text-center md:px-0">
            <Eyebrow>{SEGMENTS_HEADING.eyebrow}</Eyebrow>
            <h2 className="mt-3 font-display text-[28px] leading-[1.2] text-tinta md:text-4xl">{SEGMENTS_HEADING.title}</h2>
          </div>
          <div className="no-scrollbar scroll-pad mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 md:mt-10 md:grid md:after:hidden md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
            {SEGMENTS.map((seg) => (
              <button
                key={seg.name}
                // já chega no catálogo filtrado pelo gênero do card (mesmo estado das abas do catálogo)
                // rola só depois do carrossel se recentralizar com o filtro novo (2 frames): mexer no
                // scrollLeft dele no meio da rolagem suave da página cancelava a rolagem
                onClick={() => {
                  setCatalogoFiltro(seg.seg)
                  requestAnimationFrame(() => requestAnimationFrame(() => scrollToId('catalogo')))
                }}
                className="segmento group @container relative block h-[min(28rem,calc(100svh-17rem))] w-[80%] shrink-0 cursor-pointer snap-start overflow-hidden rounded-2xl bg-noite text-center ring-1 ring-latao/40 md:h-[min(38rem,calc(100svh-20rem))] md:w-full"
              >
                <MediaSlot
                  aspect="auto"
                  bg="transparent"
                  src={seg.foto}
                  sizes="(min-width: 768px) 33vw, 80vw"
                  // decorativa: o rótulo do gênero está escrito no card
                  alt=""
                  requisito={`FOTO · 4:3 · 1600×1200 · LIFESTYLE · ${seg.label.toUpperCase()}`}
                  className="segmento-foto absolute! inset-0 h-full w-full rounded-none border-0"
                />
                {/* topo escurecido pro texto de apoio + base na cor do gênero */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: `linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 22%), linear-gradient(to top, color-mix(in srgb, ${SEGMENT_TINT[seg.seg]} 85%, transparent) 0%, color-mix(in srgb, ${SEGMENT_TINT[seg.seg]} 35%, transparent) 40%, transparent 65%)`,
                  }}
                />
                {/* filete dourado interno — acende no hover (desktop); no celular fica sempre discreto */}
                <span aria-hidden className="segmento-moldura pointer-events-none absolute inset-2.5 rounded-[calc(var(--radius-2xl)-0.5rem)] border border-latao/35" />
                <span className="absolute inset-x-0 top-6 font-label text-[9px] tracking-[0.5em] text-papel-inv/80 uppercase lg:top-8">
                  {seg.label}
                </span>
                <span className="segmento-texto absolute inset-x-0 bottom-7 px-5 text-papel-inv lg:bottom-10">
                  {/* tamanho preso à largura do card (cqi): "Compartilhável" cabe numa linha em qualquer tela */}
                  <b className="block font-display text-[min(2.25rem,calc((100cqi-2.5rem)/6.6))] leading-none font-normal whitespace-nowrap lg:text-[min(3rem,calc((100cqi-2.5rem)/6.6))]">{seg.name}</b>
                  <span className="mt-3 block font-label text-[9px] tracking-[0.4em] text-papel-inv/70 uppercase">{seg.meta}</span>
                  <span className="mt-5 inline-flex flex-col items-center gap-1.5 font-label text-[10px] tracking-[0.35em] uppercase">
                    Ver coleção
                    <span aria-hidden className="segmento-linha block h-px w-full bg-latao" />
                  </span>
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* catálogo logo depois das coleções por gênero, antes das famílias (ordem de out/2026) */}
        {catalogNode}

        {/* H-06 Diagnóstico — celular empilhado; lg: intro + fechamento à esquerda, lista à direita */}
        {SHOW_DIAGNOSIS && (
        <Reveal
          as="section"
          className="relative z-10 px-5 pt-16 pb-16 md:px-10 lg:py-24"
          style={{
            background:
              'linear-gradient(to bottom, var(--color-papel) 0%, var(--color-papel-2) 10%, var(--color-papel-2) 90%, var(--color-papel) 100%)',
          }}
        >
          <img loading="lazy"
            {...FLOR_IMG}
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
          <img loading="lazy"
            {...FLOR_IMG}
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
        )}

        {/* H-09 Por família */}
        {/* celular/tablet: carrossel; lg: grade de 5 colunas, sem scroll nem pontinhos */}
        <Reveal
          as="section"
          id="familias"
          className="relative z-20 bg-papel pt-8 pb-8 lg:pt-14 lg:pb-16"
          style={{
            // degrau invertido (o mesmo do catálogo Boutique): a seção fica POR CIMA do catálogo e projeta sombra
            // nele, com filete latão na borda de cima
            boxShadow: '0 -14px 26px -12px rgba(40,46,41,0.3), 0 -4px 8px -4px rgba(40,46,41,0.2)',
            borderTop: '1px solid color-mix(in srgb, var(--color-latao) 60%, transparent)',
          }}
        >
          {/* cabeçalho centrado, como o das outras seções */}
          <div className="px-4 text-center md:px-10 lg:mx-auto lg:max-w-[88rem]">
            <Eyebrow>Famílias olfativas</Eyebrow>
            <h2 className="mt-2.5 font-display text-[28px] leading-[1.2] lg:text-4xl">Descubra pelo cheiro</h2>
            <p className="mx-auto mt-2 max-w-[36ch] text-sm text-tinta-2 lg:mt-3 lg:max-w-none lg:text-base">Explore as famílias olfativas e encontre os cheiros que mais combinam com você.</p>
          </div>
          <div
            ref={familiesScroll.ref}
            {...tapGuard}
            className="scroll-pad no-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:px-10 lg:mx-auto lg:mt-12 lg:grid lg:max-w-[88rem] lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:pt-2 lg:after:hidden"
          >
            {/* mesma linguagem dos pôsteres de Coleções (classes .segmento-*): fundo noite, aro latão, filete
                interno. Texto alinhado à esquerda: no topo as três palavras da família; embaixo nome,
                descrição e CTA (out/2026 — os nomes dos arquétipos saíram do card) */}
            {FAMILIES.map((f) => (
              <button
                key={f.nome}
                // já chega no catálogo filtrado pela família (como os cards de gênero); rola depois de o
                // carrossel se recentralizar com o filtro novo (2 frames)
                onClick={() => {
                  setCatalogoFiltro('ALL')
                  setCatalogoFamilia(f.nome)
                  requestAnimationFrame(() => requestAnimationFrame(() => scrollToId('catalogo')))
                }}
                className="segmento no-press relative isolate block aspect-[3/4] w-[74%] shrink-0 cursor-pointer snap-start overflow-hidden rounded-2xl bg-noite text-left ring-1 ring-latao/40 sm:w-[44%] lg:w-auto"
              >
                <div className="segmento-foto absolute inset-0">
                  <img loading="lazy" src={familyFoto(f.slug)?.src} srcSet={familyFoto(f.slug)?.srcSet} sizes="(min-width: 1024px) 20vw, 80vw" alt="" className="h-full w-full object-cover" />
                </div>
                <RatioTag className="top-3 right-3" />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 20%), linear-gradient(to top, color-mix(in srgb, var(--color-noite) 92%, transparent) 0%, color-mix(in srgb, var(--color-noite) 45%, transparent) 36%, transparent 58%)',
                  }}
                />
                <span aria-hidden className="segmento-moldura pointer-events-none absolute inset-2.5 rounded-[calc(var(--radius-2xl)-0.5rem)] border border-latao/35" />
                <span className="absolute inset-x-0 top-5 px-5 font-label text-[9px] tracking-[0.22em] text-balance text-papel-inv/75 uppercase">
                  {f.attrs.join(' · ')}
                </span>
                <span className="segmento-texto absolute inset-x-0 bottom-5 px-5 text-papel-inv lg:bottom-6">
                  <b className="block font-display text-[28px] leading-[1.05] font-normal text-balance lg:text-[26px] xl:text-[28px]">{f.nome}</b>
                  <span className="mt-2 block text-[13px] leading-snug text-papel-inv/80 lg:text-xs xl:text-[13px]">{f.desc}</span>
                  <span className="mt-4 inline-flex flex-col gap-1.5 font-label text-[10px] tracking-[0.3em] uppercase">
                    <span>
                      Ver coleção <span aria-hidden>→</span>
                    </span>
                    <span aria-hidden className="segmento-linha block h-px w-full origin-left bg-latao" />
                  </span>
                </span>
              </button>
            ))}
          </div>
          <CarouselDots count={FAMILIES.length} active={familiesScroll.activeIndex} className="mt-5 lg:hidden" />
        </Reveal>

        {/* H-11 Reconhecimento — celular empilhado; lg: intro centralizada, 3 itens em colunas, fechamento centralizado */}
        {SHOW_RECOGNITION && (
        <Reveal
          as="section"
          className="relative z-10 px-5 pt-16 pb-20 md:px-10 lg:pt-24 lg:pb-28"
          style={{
            // degrau: sombra interna no topo + filete, a seção parece um degrau abaixo da "Entrada racional"
            // (era o topo da "Entrada emocional", que saiu); o tom latão do topo se dissolve no papel
            background:
              'linear-gradient(to bottom, color-mix(in srgb, var(--color-papel-2) 100%, var(--color-latao) 6%) 0%, var(--color-papel) 18%, var(--color-papel) 85%, var(--color-papel-2) 100%)',
            boxShadow:
              'inset 0 1px 0 color-mix(in srgb, var(--color-linha-2) 80%, transparent), inset 0 18px 22px -16px rgba(40,46,41,0.28), inset 0 6px 8px -6px rgba(40,46,41,0.18)',
          }}
        >
          <img loading="lazy"
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
          <img loading="lazy"
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
        )}

        {isAtelie ? (
          <FeaturedAtelie a={featured} img={FEATURED_IMG} />
        ) : (
        <>
        {/* H-15 Arquétipo em destaque — card editorial também na Boutique (out/2026: voltou o da Editorial no
            lugar do FeaturedBoutique), agora banner rotativo Fênix → Sereia → Zeus (components/FeaturedCarousel).
            Ocupa o card editorial que era do Kit Descoberta (kit saiu do ar). */}
        <Reveal
          as="section"
          id="destaque"
          className="bg-papel px-4 pt-10 pb-10 md:px-10 md:pt-12 md:pb-12 lg:pt-14 lg:pb-16"
          style={{
            // "degrau" como o da Entrada emocional, mais marcado: sombra interna no topo, a seção parece abaixo do catálogo
            boxShadow:
              'inset 0 1px 0 color-mix(in srgb, var(--color-latao) 60%, transparent), inset 0 26px 28px -20px rgba(40,46,41,0.4), inset 0 8px 10px -7px rgba(40,46,41,0.28)',
          }}
        >
          <FeaturedCarousel />
        </Reveal>
        </>
        )}


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
            o fechamento "Talvez você não seja apenas um." fica (desligado por SHOW_CLOSING) */}
        {(SHOW_PROOF_STATS || SHOW_CLOSING) && (
        <Reveal
          as="section"
          className={`relative overflow-hidden px-5 md:px-10 ${SHOW_PROOF_STATS ? 'pt-12 lg:pt-20' : ''}`}
          style={{ background: 'linear-gradient(to bottom, var(--color-papel) 0%, var(--color-papel-2) 100%)' }}
        >
          {SHOW_PROOF_STATS && (
          <>
          <img loading="lazy"
            {...FLOR_IMG}
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
          {SHOW_CLOSING && (
          <div
            className={`relative -mx-5 overflow-hidden bg-papel-2 px-5 pt-14 pb-12 text-center md:-mx-10 lg:pt-24 lg:pb-24 ${
              SHOW_PROOF_STATS ? 'mt-14 border-t border-linha' : ''
            }`}
          >
            <img loading="lazy"
              {...FLOR_IMG}
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
          )}
        </Reveal>
        )}

        {/* H-18 A diferença — cards visuais por pilar (components/DifferenceSection) */}
        <DifferenceSection />

        {/* H-20 Benefícios — faixa corrida no lugar do bloco de garantia (out/2026; components/BenefitsMarquee) */}
        <BenefitsMarquee />

        {/* H-21 Seja criador — volta ao claro, continuação da comunidade */}
        {SHOW_CREATORS && (
        <Reveal
          as="section"
          className="relative overflow-hidden bg-papel px-5 pt-16 pb-16 md:px-10 lg:pt-24 lg:pb-24"
          style={{
            // degrau: sai do bloco escuro (por cima) para esta seção, abaixo
            boxShadow:
              'inset 0 26px 28px -20px rgba(40,46,41,0.4), inset 0 8px 10px -7px rgba(40,46,41,0.28)',
          }}
        >
          <img loading="lazy"
            {...FLOR_IMG}
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
                { valor: comissaoTexto, label: ['de comissão', 'por venda'] },
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
        )}

        {!SHOW_DIARY ? null : isAtelie ? (
          <DiaryAtelie />
        ) : isBoutique ? (
          <DiaryBoutique />
        ) : (
        <>
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
        </>
        )}


        {/* H-23 Captura com cupom — claro, abaixo do Diário (degrau), card na moldura recortada */}
        <Reveal
          as="section"
          id="cupom"
          className="relative overflow-hidden bg-papel px-5 pt-10 pb-10 md:px-10 lg:pt-16 lg:pb-16"
          style={{
            boxShadow:
              'inset 0 26px 28px -20px rgba(40,46,41,0.4), inset 0 8px 10px -7px rgba(40,46,41,0.28)',
          }}
        >
          <img loading="lazy"
            {...FLOR_IMG}
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
                  disabled={!hydrated}
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
                  disabled={!hydrated}
                  inputMode="tel"
                  autoComplete="tel-national"
                  placeholder="DDD + número"
                  className="mt-1.5 block w-full border-b border-linha-2 bg-transparent pb-2.5 text-[15px] text-tinta placeholder:text-tinta-3/70 focus:border-latao focus:outline-none"
                />
              </label>
              <div className="mt-3 text-center">
                <SweepCta type="submit" disabled={!hydrated}>Quero meu cupom</SweepCta>
              </div>
              {/* LGPD: o cadastro é a base do consentimento pra novidades (ver /privacidade, seção 3) */}
              <p className="text-center text-[11px] leading-relaxed text-tinta-3">
                Ao se cadastrar, você aceita receber o cupom e as novidades da Arquétypus. Cancele quando quiser.{' '}
                <Link to="/privacidade" className="border-b border-tinta-3/50 hover:text-tinta">
                  Política de Privacidade
                </Link>
              </p>
            </form>
          </CutFrame>
        </Reveal>

        {isAtelie ? (
          <FooterAtelie />
        ) : isBoutique ? (
          <FooterBoutique />
        ) : (
        <>
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
                Instagram <span className="mx-2 text-papel-inv/20">·</span> TikTok
              </p>
  
              <div className="mt-8 border-t border-papel-inv/10 pt-6 text-center font-label text-[8.5px] leading-relaxed tracking-wider text-papel-inv/30 uppercase lg:mt-0 lg:flex lg:flex-wrap lg:items-center lg:gap-x-6 lg:border-t-0 lg:pt-0 lg:text-left lg:text-[9px]">
                <p>Pix · Visa · Master · Elo · Amex · Hipercard</p>
                <p className="mt-3 normal-case tracking-wide lg:mt-0">contato@arquetypus.com.br</p>
                <p className="mt-1 lg:mt-0">{EMPRESA_LINHA}</p>
              </div>
            </div>
          </div>
        </footer>
        </>
        )}

      </div>
      )}
    </div>
  )
}

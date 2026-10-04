import { Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ARCHETYPES } from '@/data/archetypes'
import { FRASCO_IMG, HERO_SLIDES, UGC_IMG } from '@/data/home'
import { scrollToId } from '@/lib/scrollToId'
import { brl, FilterTabs, parcela, pix, type CatalogProps } from './shared'

/**
 * Direção "Manifesto" (ThemeSwitcher) — tipografia como imagem. Referências da Behance: "Fragra Elixirs |
 * Perfume Store" ("EMBRACE THE EXTRAORDINARY", fotos encaixadas no meio da manchete), "FWD Creative
 * Agency" e "House of Hours". Caixa alta condensada enorme, papel quase branco, preto e um ocre forte
 * (puxado do latão); catálogo como lista de nomes gigantes, sem cards.
 */

// fotos encaixadas na manchete, depois da palavra de índice N
const PILULAS: Record<number, string> = { 1: UGC_IMG.afrodite, 4: FRASCO_IMG.imperador }

export function HeroManifesto() {
  const slide = HERO_SLIDES[0]
  const palavras = slide.heading.replace(/\n/g, ' ').split(' ')
  const nomes = [...ARCHETYPES, ...ARCHETYPES]
  return (
    <section className="bg-papel pt-8 lg:pt-12">
      <div className="mx-auto max-w-[1600px] px-4 md:px-10">
        <div className="flex items-center justify-between border-b-2 border-tinta pb-3 font-label text-[10px] tracking-[0.2em] text-tinta uppercase">
          <span>{slide.eyebrow}</span>
          <span className="tabular-nums">Nº 01—09</span>
        </div>
        <h1
          className="mt-6 font-display leading-[1.02] text-tinta uppercase lg:mt-8"
          style={{ fontSize: 'clamp(48px, 10.5vw, 180px)' }}
        >
          {palavras.map((p, i) => (
            <Fragment key={i}>
              {p}{' '}
              {PILULAS[i] && (
                <span
                  aria-hidden
                  className="mx-[0.06em] inline-block h-[0.72em] w-[1.5em] overflow-hidden rounded-full align-[-0.02em] ring-2 ring-tinta"
                >
                  <img src={PILULAS[i]} alt="" className="h-full w-full object-cover" />
                </span>
              )}{' '}
            </Fragment>
          ))}
        </h1>
        <div className="mt-8 flex flex-col gap-5 border-t-2 border-tinta pt-5 pb-10 md:flex-row md:items-center md:justify-between lg:pb-14">
          <p className="max-w-[36ch] text-base text-tinta-2 lg:text-lg">{slide.sub}</p>
          <button
            type="button"
            onClick={() => scrollToId('catalogo')}
            className="cursor-pointer bg-tinta px-8 py-4 font-label text-[12px] tracking-[0.2em] text-papel uppercase transition-colors hover:bg-latao hover:text-tinta"
          >
            Ver os 9 arquétipos →
          </button>
        </div>
      </div>
      {/* faixa ocre com os 9 nomes passando */}
      <div className="overflow-hidden bg-latao py-3 text-tinta" aria-hidden>
        <div className="boutique-marquee flex w-max gap-8 font-display text-3xl whitespace-nowrap uppercase lg:text-5xl">
          {nomes.map((a, i) => (
            <span key={i} className="flex items-center gap-8">
              {a.nome}
              <span className="text-xl lg:text-3xl">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CatalogManifesto({ items, filtro, setFiltro, filtros }: CatalogProps) {
  const location = useLocation()
  return (
    <section id="catalogo" className="bg-papel px-4 py-14 md:px-10 lg:py-24">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="font-display text-5xl leading-[0.9] text-tinta uppercase lg:text-8xl">
            Nove fragrâncias.
            <br />
            <span className="text-latao-texto">Diferentes versões de você.</span>
          </h2>
          <FilterTabs
            filtro={filtro}
            setFiltro={setFiltro}
            filtros={filtros}
            base="border-2 border-tinta px-4 py-2 font-label text-[10px] tracking-[0.2em] uppercase"
            on="bg-tinta text-papel"
            off="text-tinta hover:bg-latao"
          />
        </div>

        <ul className="mt-10 border-t-2 border-tinta lg:mt-14">
          {items.map((a) => (
            <li key={a.id} className="border-b-2 border-tinta">
              <Link
                to={`/loja/${a.id}`}
                state={{ backgroundLocation: location }}
                className="no-press group grid grid-cols-[auto_1fr_auto] items-center gap-x-3 py-4 transition-colors duration-300 hover:bg-tinta hover:text-papel md:gap-x-6 lg:grid-cols-[4rem_auto_1fr_auto_auto] lg:px-4 lg:py-5"
              >
                {/* miniatura: sempre no celular; no desktop abre no hover */}
                <span className="row-span-2 block h-20 w-14 overflow-hidden lg:row-span-1 lg:h-28 lg:w-0 lg:transition-[width] lg:duration-500 lg:ease-out lg:group-hover:w-20">
                  <img src={FRASCO_IMG[a.id]} alt="" loading="lazy" className="h-full w-full object-cover" />
                </span>
                <span className="min-w-0">
                  <b className="block truncate pt-[0.08em] font-display text-[40px] leading-[1.05] font-normal uppercase md:text-6xl lg:text-8xl">{a.nome}</b>
                  <span className="mt-1 block truncate font-label text-[10px] tracking-[0.18em] uppercase opacity-60">
                    {a.energia} · {a.fam} · {a.vol}
                  </span>
                </span>
                {/* regra 7: preço, Pix e parcelas na própria linha */}
                <span className="col-start-2 text-left lg:col-start-auto lg:text-right">
                  <b className="block text-lg font-semibold lg:text-2xl">{brl(a.preco)}</b>
                  <span className="block text-[11px] opacity-70">
                    {brl(pix(a.preco))} no Pix · 6x de {brl(parcela(a.preco))}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="col-start-3 row-span-2 row-start-1 grid size-11 place-items-center rounded-full border-2 border-current text-xl transition-transform duration-300 group-hover:-rotate-45 lg:col-start-auto lg:row-span-1 lg:size-14"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

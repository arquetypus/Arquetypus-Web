import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ARCHETYPES, productPath } from '@/data/archetypes'
import { FRASCO_IMG, HERO_SLIDES } from '@/data/home'
import { scrollToId } from '@/lib/scrollToId'
import { brl, FilterTabs, parcela, pix, type CatalogProps } from './shared'

/**
 * Direção "Galeria" (ThemeSwitcher) — a coleção como exposição de museu. Referências da Behance: "ATELIER
 * MERIDIAN — Art Gallery Website", "Aether Alchemy", "Demeter by Matthew Fisher" e os heros com nome
 * gigante atrás do frasco ("LORÉN", "MUSE", "NOCTRA"). Branco de parede, preto, Didone de alto contraste,
 * cantos retos, muito respiro; cada frasco num passe-partout com plaqueta de museu.
 */

const TROCA_MS = 3200

export function HeroGaleria() {
  const slide = HERO_SLIDES[0]
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % ARCHETYPES.length), TROCA_MS)
    return () => clearInterval(t)
  }, [])
  const a = ARCHETYPES[i]

  return (
    <section className="relative overflow-hidden bg-papel pt-10 pb-14 lg:pt-14 lg:pb-20">
      <div className="relative mx-auto max-w-[1600px] px-4 md:px-10">
        {/* nome gigante atrás; o quadro do frasco cobre o miolo */}
        <p
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[38%] text-center font-display leading-none whitespace-nowrap text-tinta select-none"
          style={{ fontSize: 'clamp(48px, 13.5vw, 240px)', letterSpacing: '-0.03em' }}
        >
          ARQUÉTYPUS
        </p>
        <figure className="relative z-10 mx-auto w-[58%] max-w-[360px] sm:w-[40%] lg:w-[24%]">
          <div className="relative aspect-[9/14] overflow-hidden bg-papel-3">
            {ARCHETYPES.map((x, n) => (
              <img
                key={x.id}
                src={FRASCO_IMG[x.id]}
                alt={n === i ? `${x.tipo} ${x.nome}` : ''}
                aria-hidden={n !== i}
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-out motion-reduce:transition-none"
                style={{ opacity: n === i ? 1 : 0 }}
              />
            ))}
          </div>
          {/* legenda de obra */}
          <figcaption className="mt-3 flex items-baseline justify-between gap-3 font-label text-[9px] tracking-[0.2em] text-tinta-3 uppercase">
            <span>
              {a.nome}
            </span>
            <span>{a.fam}</span>
          </figcaption>
        </figure>
      </div>

      <div className="mx-auto mt-10 grid max-w-7xl gap-6 px-5 md:px-10 lg:mt-14 lg:grid-cols-3 lg:items-end">
        <p className="font-label text-[10px] tracking-[0.3em] text-tinta-2 uppercase">{slide.eyebrow}</p>
        <h1 className="font-display text-3xl leading-[1.1] text-balance text-tinta lg:text-center lg:text-4xl">
          {slide.heading.replace(/\n/g, ' ')}
        </h1>
        <div className="lg:text-right">
          <p className="text-sm text-tinta-2">{slide.sub}</p>
          <button
            type="button"
            onClick={() => scrollToId('catalogo')}
            className="group mt-4 inline-flex cursor-pointer items-center gap-3 font-label text-[11px] tracking-[0.25em] text-tinta uppercase"
          >
            <span className="border-b border-tinta pb-1">Ver os 9 arquétipos</span>
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
        </div>
      </div>
    </section>
  )
}

export function CatalogGaleria({ items, filtro, setFiltro, filtros }: CatalogProps) {
  const location = useLocation()
  return (
    <section id="catalogo" className="bg-papel px-4 py-16 md:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 border-b border-tinta pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-label text-[10px] tracking-[0.3em] text-tinta-3 uppercase">O catálogo · Nº 01—09</p>
            <h2 className="mt-3 max-w-[18ch] font-display text-4xl leading-[1.02] text-tinta lg:text-6xl">
              Nove fragrâncias. Diferentes versões de você.
            </h2>
          </div>
          <FilterTabs
            filtro={filtro}
            setFiltro={setFiltro}
            filtros={filtros}
            className="gap-5"
            base="border-b pb-1 font-label text-[10px] tracking-[0.25em] uppercase"
            on="border-tinta text-tinta"
            off="border-transparent text-tinta-3 hover:text-tinta"
          />
        </div>

        {/* parede da exposição: a coluna do meio desce, como quadros pendurados em alturas diferentes */}
        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-14 lg:mt-20 lg:grid-cols-3 lg:gap-x-14 lg:gap-y-24">
          {items.map((a, n) => (
            <li key={a.id} className={`${n % 2 === 1 ? 'translate-y-10' : ''} ${n % 3 === 1 ? 'lg:translate-y-24' : 'lg:translate-y-0'}`}>
              <Link to={productPath(a)} state={{ backgroundLocation: location }} className="no-press group block">
                {/* passe-partout */}
                <div className="bg-papel-2 p-3 ring-1 ring-linha transition-shadow duration-500 group-hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.35)] lg:p-6">
                  <div className="aspect-[4/5] overflow-hidden" style={{ background: a.bg }}>
                    <img
                      src={FRASCO_IMG[a.id]}
                      alt={`${a.tipo} ${a.nome}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                </div>
              </Link>
              {/* plaqueta de museu — regra 7: preço, Pix e parcelas à vista */}
              <div className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 border-l border-tinta pl-3 lg:mt-6 lg:pl-4">
                <span className="row-span-4 font-label text-[10px] tracking-[0.15em] text-tinta-3 tabular-nums" aria-hidden />
                <b className="font-display text-xl leading-tight font-normal text-tinta lg:text-3xl">{a.nome}</b>
                <span className="text-[11px] text-tinta-3 italic">
                  {a.fam}, {a.vol}
                </span>
                <span className="mt-2 text-sm font-semibold text-tinta">{brl(a.preco)}</span>
                <span className="text-[11px] text-tinta-2">
                  {brl(pix(a.preco))} no Pix · 6x de {brl(parcela(a.preco))}
                </span>
              </div>
              <Link
                to={productPath(a)}
                state={{ backgroundLocation: location }}
                className="mt-3 ml-3 inline-flex items-center gap-2 font-label text-[10px] tracking-[0.25em] text-tinta uppercase hover:opacity-70 lg:ml-4"
              >
                Comprar <span aria-hidden>→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

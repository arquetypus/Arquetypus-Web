import { Link, useLocation } from 'react-router-dom'
import type { Archetype } from '@/types/archetype'
import { ARCHETYPES } from '@/data/archetypes'
import { FRASCO_IMG, HERO_SLIDES, SEALS } from '@/data/home'
import { scrollToId } from '@/lib/scrollToId'
import heroColecao from '@/assets/fotos/hero/colecao-desktop.jpg'

/**
 * Direção "Boutique" (ThemeSwitcher) — pegada de loja: tudo a um clique da compra. Hero compacto com os
 * frascos e dois CTAs, selos logo embaixo, catálogo em grade de produtos com preço/Pix/parcelas à vista
 * em cada card (regra 7) e botão "Comprar" que abre o pop-up. Texto de produto vem todo de data/.
 */

type Filtro = 'ALL' | 'F' | 'M' | 'U'
const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const PRECO_MIN = Math.min(...ARCHETYPES.map((a) => a.preco))

export function HeroBoutique() {
  const slide = HERO_SLIDES[0]
  return (
    <section className="bg-papel px-5 pt-20 pb-10 md:px-10 lg:pt-28 lg:pb-16">
      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-12">
        <div className="lg:col-span-5">
          <p className="inline-flex items-center gap-2 rounded-full bg-papel-2 px-3 py-1.5 font-label text-[10px] tracking-[0.16em] text-tinta-2 uppercase">
            <span aria-hidden className="size-1.5 rounded-full bg-latao" />
            {slide.eyebrow}
          </p>
          <h1 className="mt-5 font-display text-[38px] leading-[1.05] text-balance text-tinta lg:text-6xl">
            {slide.heading.replace(/\n/g, ' ')}
          </h1>
          <p className="mt-4 text-base text-tinta-2 lg:text-lg">{slide.sub}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => scrollToId('catalogo')}
              className="rounded-full bg-tinta px-7 py-4 text-sm font-medium text-papel transition-opacity hover:opacity-90"
            >
              Ver os 9 arquétipos
            </button>
            <button
              type="button"
              onClick={() => scrollToId('segmentos')}
              className="rounded-full border border-linha-2 px-7 py-4 text-sm font-medium text-tinta transition-colors hover:border-tinta"
            >
              Escolha por onde começar
            </button>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-tinta-2">
            {SEALS.map((s) => (
              <li key={s} className="flex items-center gap-2">
                <span aria-hidden className="text-latao-texto">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative mt-10 lg:col-span-7 lg:mt-0">
          <img src={heroColecao} alt="Frascos Arquétypus sobre pedra escura" className="aspect-[4/3] w-full rounded-3xl object-cover object-right" />
          {/* etiqueta de preço sobre a foto */}
          <div className="absolute bottom-4 left-4 rounded-2xl bg-papel/95 px-4 py-3 shadow-lg backdrop-blur">
            <span className="block font-label text-[9px] tracking-[0.16em] text-tinta-3 uppercase">A partir de</span>
            <span className="block font-display text-2xl leading-tight text-tinta">{brl(PRECO_MIN)}</span>
            <span className="block text-[11px] text-tinta-2">ou {brl(PRECO_MIN * 0.95)} no Pix</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export function CatalogGrid({
  items,
  filtro,
  setFiltro,
  filtros,
}: {
  items: Archetype[]
  filtro: Filtro
  setFiltro: (f: Filtro) => void
  filtros: { key: Filtro; label: string }[]
}) {
  const location = useLocation()
  return (
    <section
      id="catalogo"
      className="relative z-20 bg-papel-2 px-4 py-14 md:px-10 lg:py-24"
      style={{
        // degrau invertido: o catálogo fica POR CIMA da seção anterior e projeta sombra nela, com filete latão
        boxShadow: '0 -14px 26px -12px rgba(40,46,41,0.3), 0 -4px 8px -4px rgba(40,46,41,0.2)',
        borderTop: '1px solid color-mix(in srgb, var(--color-latao) 60%, transparent)',
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="font-label text-[10px] tracking-[0.2em] text-tinta-2 uppercase">O catálogo</p>
          <h2 className="mt-3 font-display text-[30px] leading-[1.1] text-tinta lg:text-5xl">
            Nove fragrâncias. <span className="text-latao-texto">Diferentes versões de você.</span>
          </h2>
          <div className="no-scrollbar mt-6 flex justify-start gap-2 overflow-x-auto sm:justify-center" role="tablist" aria-label="Filtrar catálogo">
            {filtros.map((f) => (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={filtro === f.key}
                onClick={() => setFiltro(f.key)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                  filtro === f.key ? 'bg-tinta text-papel' : 'bg-papel text-tinta-2 hover:text-tinta'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:mt-12 lg:gap-6">
          {items.map((a) => (
            <li key={a.id} className="flex flex-col overflow-hidden rounded-2xl bg-papel ring-1 ring-linha">
              <Link to={`/loja/${a.id}`} state={{ backgroundLocation: location }} className="group relative block">
                <div className="aspect-[4/5] overflow-hidden" style={{ background: a.bg }}>
                  <img
                    src={FRASCO_IMG[a.id]}
                    alt={`${a.tipo} ${a.nome}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <span className="absolute top-3 left-3 rounded-full bg-papel/90 px-2.5 py-1 font-label text-[8.5px] tracking-[0.14em] text-tinta-2 uppercase backdrop-blur">
                  {a.energia}
                </span>
              </Link>
              <div className="flex flex-1 flex-col p-3 lg:p-5">
                <div className="flex items-center gap-2">
                  <span aria-hidden className="size-2.5 shrink-0 rounded-full" style={{ background: a.cor }} />
                  <b className="font-display text-lg leading-tight font-semibold text-tinta lg:text-xl">{a.nome}</b>
                </div>
                <span className="mt-1 text-xs text-tinta-3">
                  {a.fam} · {a.vol}
                </span>
                {/* regra 7: preço, Pix e parcelas sempre à vista no card */}
                <span className="mt-3 text-base font-semibold text-tinta lg:text-lg">{brl(a.preco)}</span>
                <span className="text-[11px] text-tinta-2">
                  {brl(a.preco * 0.95)} no Pix · 6x de {brl(a.preco / 6)}
                </span>
                <div className="mt-auto pt-3.5">
                  <Link
                    to={`/loja/${a.id}`}
                    state={{ backgroundLocation: location }}
                    className="block rounded-full bg-tinta py-2.5 text-center text-xs font-medium text-papel transition-opacity hover:opacity-90 lg:py-3"
                  >
                    Comprar
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

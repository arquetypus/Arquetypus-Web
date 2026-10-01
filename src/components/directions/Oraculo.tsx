import { Link, useLocation } from 'react-router-dom'
import type { Archetype } from '@/types/archetype'
import { getArchetype } from '@/data/archetypes'
import { FRASCO_IMG, HERO_SLIDES } from '@/data/home'
import { scrollToId } from '@/lib/scrollToId'
import { brl, FilterTabs, parcela, pix, romano, type CatalogProps } from './shared'

/**
 * Direção "Oráculo" (ThemeSwitcher) — os 9 arquétipos como arcanos de tarô. Referências: identidades de
 * tarô na Behance ("Archetype Tarot Cards", "Louis Vuitton: Gemstone Tarot", "ÂM HÌNH TAROT") — moldura
 * dupla em ouro fino, numeral romano, janela em arco, nome em caixa alta espaçada. O site inteiro fica
 * na noite azul (tokens em index.css). Puxa o conceito de "reconhecer" o seu: você não escolhe, tira a carta.
 */

/** Carta de tarô de um arquétipo: numeral, janela em arco com o frasco, nome e energia. */
export function TarotCard({ a, className = '' }: { a: Archetype; className?: string }) {
  return (
    <div className={`relative aspect-[9/15] rounded-xl bg-papel-2 p-2 ring-1 ring-latao/50 ${className}`}>
      {/* moldura interna, filete duplo como nas cartas impressas */}
      <div className="flex h-full flex-col rounded-lg border border-latao/40 px-2.5 pt-2.5 pb-3">
        <div className="flex items-center justify-center gap-2 font-display text-sm tracking-[0.2em] text-latao">
          <span aria-hidden className="h-px w-4 bg-latao/50" />
          {romano(a.cod)}
          <span aria-hidden className="h-px w-4 bg-latao/50" />
        </div>
        <div className="relative mt-2 flex-1 overflow-hidden rounded-t-full border border-latao/40" style={{ background: a.bg }}>
          <img src={FRASCO_IMG[a.id]} alt={`${a.tipo} ${a.nome}`} loading="lazy" className="h-full w-full object-cover" />
          {/* véu na cor do arquétipo, de baixo pra cima */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: `linear-gradient(to top, color-mix(in srgb, ${a.cor} 55%, transparent), transparent 45%)` }}
          />
        </div>
        <p className="mt-3 text-center font-display text-[15px] leading-none tracking-[0.22em] text-tinta uppercase lg:text-lg">{a.nome}</p>
        <p className="mt-1.5 text-center font-label text-[8px] tracking-[0.3em] text-tinta-3 uppercase">{a.energia}</p>
      </div>
    </div>
  )
}

const TIRAGEM = ['afrodite', 'imperador', 'sereia']

export function HeroOraculo() {
  const slide = HERO_SLIDES[0]
  const cartas = TIRAGEM.map((id) => getArchetype(id)).filter((a): a is Archetype => !!a)
  return (
    <section className="relative overflow-hidden bg-papel px-5 pt-16 pb-16 md:px-10 lg:pt-24 lg:pb-24">
      {/* céu: pontos de luz fixos, bem discretos */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 12% 18%, var(--color-latao) 50%, transparent 51%), radial-gradient(1px 1px at 78% 12%, var(--color-latao) 50%, transparent 51%), radial-gradient(1.5px 1.5px at 88% 46%, var(--color-latao) 50%, transparent 51%), radial-gradient(1px 1px at 6% 64%, var(--color-latao) 50%, transparent 51%), radial-gradient(1px 1px at 40% 8%, var(--color-latao) 50%, transparent 51%), radial-gradient(1.5px 1.5px at 62% 88%, var(--color-latao) 50%, transparent 51%)',
        }}
      />
      <div className="relative mx-auto max-w-6xl text-center">
        <p className="font-label text-[10px] tracking-[0.4em] text-latao uppercase">✦ {slide.eyebrow} ✦</p>
        <h1 className="mx-auto mt-5 max-w-[16ch] font-display text-[40px] leading-[1.02] text-balance text-tinta md:text-6xl lg:text-7xl">
          {slide.heading.replace(/\n/g, ' ')}
        </h1>
        <p className="mx-auto mt-5 max-w-[40ch] text-base text-tinta-2 lg:text-lg">{slide.sub}</p>

        {/* a tiragem: três cartas em leque */}
        <div className="relative mx-auto mt-12 flex h-[300px] max-w-md items-end justify-center sm:h-[360px] lg:mt-16 lg:h-[440px] lg:max-w-xl">
          {cartas.map((a, i) => {
            const rot = (i - 1) * 12
            const x = (i - 1) * 62
            return (
              <div
                key={a.id}
                className="absolute bottom-0 w-[150px] origin-bottom transition-transform duration-500 ease-out hover:-translate-y-3 sm:w-[180px] lg:w-[220px]"
                style={{ transform: `translateX(${x}%) rotate(${rot}deg)`, zIndex: i === 1 ? 2 : 1 }}
              >
                <TarotCard a={a} className="shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)]" />
              </div>
            )
          })}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => scrollToId('catalogo')}
            className="w-full cursor-pointer rounded-full bg-latao px-8 py-4 text-sm font-medium text-papel transition-opacity hover:opacity-90 sm:w-auto"
          >
            Ver os 9 arquétipos
          </button>
          <button
            type="button"
            onClick={() => scrollToId('segmentos')}
            className="w-full cursor-pointer rounded-full border border-latao/50 px-8 py-4 text-sm font-medium text-tinta transition-colors hover:border-latao sm:w-auto"
          >
            Escolha por onde começar
          </button>
        </div>
      </div>
    </section>
  )
}

export function CatalogOraculo({ items, filtro, setFiltro, filtros }: CatalogProps) {
  const location = useLocation()
  return (
    <section id="catalogo" className="bg-papel px-4 py-14 md:px-10 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="font-label text-[10px] tracking-[0.4em] text-latao uppercase">✦ O catálogo ✦</p>
          <h2 className="mt-4 font-display text-[32px] leading-[1.1] text-tinta lg:text-5xl">
            Nove fragrâncias. <span className="text-latao">Diferentes versões de você.</span>
          </h2>
          <FilterTabs
            filtro={filtro}
            setFiltro={setFiltro}
            filtros={filtros}
            className="mt-7 justify-start sm:justify-center"
            base="rounded-full border px-4 py-2 font-label text-[10px] tracking-[0.2em] uppercase"
            on="border-latao bg-latao text-papel"
            off="border-latao/30 text-tinta-2 hover:border-latao/70"
          />
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 lg:mt-14 lg:gap-x-10 lg:gap-y-14">
          {items.map((a) => (
            <li key={a.id}>
              <Link
                to={`/loja/${a.id}`}
                state={{ backgroundLocation: location }}
                className="no-press group block transition-transform duration-500 ease-out hover:-translate-y-2"
              >
                <TarotCard a={a} className="transition-shadow duration-500 group-hover:shadow-[0_0_40px_-8px_var(--color-latao)]" />
              </Link>
              {/* regra 7: preço, Pix e parcelas logo abaixo da carta */}
              <div className="mt-4 text-center">
                <p className="text-sm text-tinta-2 italic">{a.ep}</p>
                <p className="mt-2 text-base font-semibold text-tinta lg:text-lg">{brl(a.preco)}</p>
                <p className="text-[11px] text-tinta-3">
                  {brl(pix(a.preco))} no Pix · 6x de {brl(parcela(a.preco))}
                </p>
                <Link
                  to={`/loja/${a.id}`}
                  state={{ backgroundLocation: location }}
                  className="mt-3 inline-block border-b border-latao/60 pb-0.5 font-label text-[10px] tracking-[0.25em] text-latao uppercase hover:border-latao"
                >
                  Comprar
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

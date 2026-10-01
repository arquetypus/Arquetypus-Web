import { useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HERO_SLIDES } from '@/data/home'
import { scrollToId } from '@/lib/scrollToId'
import { brl, FilterTabs, numero, parcela, pix, type CatalogProps } from './shared'

/**
 * Direção "Cinema" (ThemeSwitcher) — campanha de perfume como filme noir. Referências da Behance: "Voléa —
 * Niche Perfume Brand Identity" (vermelho profundo), "NOCTRA", "NOIRÉA — The Art of Scent" e "Trémoille".
 * Preto, burgundy da paleta de arquétipos da marca, serifa em itálico; hero em tela cheia com faixas de
 * cinema e o catálogo como "elenco": fotos das pessoas com o frasco, uma por arquétipo.
 */

// foto da pessoa com o frasco (a mesma da 2ª foto da galeria da PDP); arquivo = id do arquétipo
const LIFESTYLE: Record<string, string> = Object.fromEntries(
  Object.entries(import.meta.glob<string>('@/assets/fotos/pdp-lifestyle/*.jpg', { eager: true, import: 'default' })).map(
    ([path, src]) => [path.split('/').pop()!.replace('.jpg', ''), src],
  ),
)

export function HeroCinema() {
  const slide = HERO_SLIDES[0]
  const video = 'video' in slide ? slide.video : undefined
  return (
    <section className="relative h-svh min-h-[560px] overflow-hidden bg-black text-papel-inv">
      <picture>
        <source media="(min-width: 1024px)" srcSet={slide.imgDesktop} />
        <img src={slide.img} alt="" className="absolute inset-0 h-full w-full object-cover" />
      </picture>
      {video && (
        <video
          src={video}
          poster={slide.img}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover lg:hidden"
        />
      )}
      {/* vinheta + véu burgundy */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.75) 100%), linear-gradient(to top, color-mix(in srgb, var(--color-burgundy) 70%, transparent), transparent 55%)',
        }}
      />
      {/* desktop: a foto dos frascos ocupa a direita — escurece a esquerda, onde fica o texto */}
      <div aria-hidden className="absolute inset-0 hidden bg-gradient-to-r from-black/85 via-black/40 to-transparent lg:block" />
      {/* faixas de cinema (letterbox) */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-[7svh] bg-black" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[7svh] bg-black" />

      <div className="absolute inset-x-0 bottom-[11svh] px-5 text-center lg:right-auto lg:bottom-[16svh] lg:left-16 lg:max-w-2xl lg:px-0 lg:text-left">
        <p className="font-label text-[10px] tracking-[0.5em] text-latao uppercase">{slide.eyebrow}</p>
        <h1 className="mx-auto mt-5 max-w-[15ch] font-display text-[42px] lg:mx-0 leading-[1] text-balance italic md:text-6xl lg:text-7xl">
          {slide.heading.replace(/\n/g, ' ')}
        </h1>
        <p className="mx-auto mt-5 max-w-[40ch] text-sm text-papel-inv/75 lg:mx-0 lg:text-base">{slide.sub}</p>
        <button
          type="button"
          onClick={() => scrollToId('catalogo')}
          className="mt-8 cursor-pointer border border-papel-inv/50 px-8 py-3.5 font-label text-[11px] tracking-[0.3em] uppercase transition-colors hover:border-latao hover:bg-latao hover:text-black"
        >
          Ver os 9 arquétipos
        </button>
      </div>
      {/* "legenda" de filme na faixa de baixo */}
      <p className="absolute inset-x-0 bottom-0 flex h-[7svh] items-center justify-center font-label text-[9px] tracking-[0.4em] text-papel-inv/50 uppercase">
        Arquétypus — Nove fragrâncias
      </p>
    </section>
  )
}

export function CatalogCinema({ items, filtro, setFiltro, filtros }: CatalogProps) {
  const location = useLocation()
  const trilho = useRef<HTMLUListElement>(null)
  const passo = (dir: 1 | -1) => {
    const el = trilho.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }
  return (
    <section id="catalogo" className="bg-papel py-14 lg:py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 md:px-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-label text-[10px] tracking-[0.5em] text-latao uppercase">O elenco</p>
          <h2 className="mt-4 font-display text-[34px] leading-[1.05] text-tinta italic lg:text-6xl">
            Nove fragrâncias. <span className="text-latao">Diferentes versões de você.</span>
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <FilterTabs
            filtro={filtro}
            setFiltro={setFiltro}
            filtros={filtros}
            base="border-b pb-1 font-label text-[10px] tracking-[0.25em] uppercase"
            on="border-latao text-latao"
            off="border-transparent text-tinta-3 hover:text-tinta"
          />
          <div className="hidden gap-2 lg:flex">
            {([-1, 1] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => passo(d)}
                aria-label={d < 0 ? 'Anterior' : 'Próximo'}
                className="grid size-11 cursor-pointer place-items-center rounded-full border border-linha-2 text-tinta transition-colors hover:border-latao hover:text-latao"
              >
                {d < 0 ? '←' : '→'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ul ref={trilho} className="no-scrollbar scroll-pad mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden px-4 md:px-10 lg:mt-14 lg:gap-5">
        {items.map((a) => (
          <li key={a.id} className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[30%] xl:w-[23%]">
            <Link to={`/loja/${a.id}`} state={{ backgroundLocation: location }} className="no-press group relative block aspect-[3/4] overflow-hidden bg-black">
              <img
                src={LIFESTYLE[a.id]}
                alt={`Pessoa segurando o ${a.tipo.toLowerCase()} ${a.nome}`}
                loading="lazy"
                className="h-full w-full object-cover opacity-90 grayscale-[35%] transition-[transform,filter,opacity] duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-100 group-hover:grayscale-0"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <span className="absolute top-4 left-4 font-label text-[9px] tracking-[0.3em] text-papel-inv/70 uppercase">
                Nº {numero(a.cod)} · {a.energia}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-5 text-papel-inv">
                <b className="block font-display text-4xl leading-none font-normal italic lg:text-5xl">{a.nome}</b>
                <span className="mt-2 block text-sm text-papel-inv/75">{a.ep}</span>
              </div>
            </Link>
            {/* regra 7: preço, Pix e parcelas logo abaixo da foto */}
            <div className="flex items-end justify-between gap-3 border-b border-linha py-4">
              <span>
                <b className="block text-base font-semibold text-tinta">{brl(a.preco)}</b>
                <span className="text-[11px] text-tinta-3">
                  {brl(pix(a.preco))} no Pix · 6x de {brl(parcela(a.preco))}
                </span>
              </span>
              <Link
                to={`/loja/${a.id}`}
                state={{ backgroundLocation: location }}
                className="shrink-0 font-label text-[10px] tracking-[0.3em] text-latao uppercase hover:opacity-70"
              >
                Comprar →
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

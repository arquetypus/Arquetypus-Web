import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Archetype } from '@/types/archetype'
import { ARCHETYPES, productPath } from '@/data/archetypes'
import { FRASCO_FOTO, HERO_SLIDES, SEALS } from '@/data/home'
import { scrollToId } from '@/lib/scrollToId'
// mesma foto do 1º banner do hero (HERO_SLIDES), já em várias larguras — não importar o arquivo de novo (lib/foto.ts)
const heroColecao = HERO_SLIDES[0].fotoDesktop
import { Sobrenome } from '@/components/ui/Sobrenome'
import { Preco } from '@/components/ui/Preco'
import { Avaliacao } from '@/components/ui/Avaliacao'
import { EspiarProduto } from '@/components/ui/EspiarProduto'
import { CONDICOES, parcela, precoPix } from '@/data/empresa'
import { FiltroCatalogo } from '@/components/boutique/FiltroCatalogo'
import { contarFiltros, FILTROS_VAZIOS, nomeDaOpcao, type FiltrosCatalogo } from '@/lib/filtroCatalogo'
import { useCupom } from '@/context/CupomContext'

/**
 * Direção "Boutique" (ThemeSwitcher) — pegada de loja: tudo a um clique da compra. Hero compacto com os
 * frascos e dois CTAs, selos logo embaixo, catálogo em grade de produtos com preço/Pix/parcelas à vista
 * em cada card (regra 7) e botão "Comprar" que abre o pop-up. Texto de produto vem todo de data/.
 */

type Filtro = 'ALL' | 'F' | 'M' | 'U'
const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const MAIS_BARATO = ARCHETYPES.reduce((m, a) => (a.preco < m.preco ? a : m))
const PRECO_MIN = MAIS_BARATO.preco

export function HeroBoutique() {
  const { precoFinal } = useCupom()
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
          <img src={heroColecao.src} srcSet={heroColecao.srcSet || undefined} sizes="(min-width: 1024px) 50vw, 100vw" alt="Frascos Arquétypus sobre pedra escura" className="aspect-[4/3] w-full rounded-3xl object-cover object-right" />
          {/* etiqueta de preço sobre a foto */}
          <div className="absolute bottom-4 left-4 rounded-2xl bg-papel/95 px-4 py-3 shadow-lg backdrop-blur">
            <span className="block font-label text-[9px] tracking-[0.16em] text-tinta-3 uppercase">A partir de</span>
            <Preco a={MAIS_BARATO} className="font-display text-2xl leading-tight" />
            <span className="block text-[11px] text-tinta-2">ou {brl(precoPix(precoFinal(PRECO_MIN)))} no Pix</span>
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
  base,
  filtrosPainel,
  setFiltrosPainel,
}: {
  items: Archetype[]
  filtro: Filtro
  setFiltro: (f: Filtro) => void
  filtros: { key: Filtro; label: string }[]
  /** catálogo só com o gênero das abas — o painel conta os resultados em cima dele */
  base: Archetype[]
  /** família, energia, notas e ordem (botão "Filtrar", out/2026); a família também vem dos cards de família */
  filtrosPainel: FiltrosCatalogo
  setFiltrosPainel: (f: FiltrosCatalogo) => void
}) {
  const { precoFinal } = useCupom()
  const [painelAberto, setPainelAberto] = useState(false)
  const fecharPainel = useCallback(() => setPainelAberto(false), [])
  const qtdFiltros = contarFiltros(filtrosPainel)
  // um chip por filtro ligado, cada um com ✕
  const chips = (['familias', 'energias', 'notas'] as const).flatMap((grupo) =>
    (filtrosPainel[grupo] as string[]).map((id) => ({
      chave: `${grupo}-${id}`,
      nome: nomeDaOpcao(grupo, id),
      tirar: () => setFiltrosPainel({ ...filtrosPainel, [grupo]: (filtrosPainel[grupo] as string[]).filter((x) => x !== id) }),
    })),
  )
  return (
    <section
      id="catalogo"
      className="relative z-20 bg-papel-2 px-4 py-10 md:px-10 lg:py-16"
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
            Nove fragrâncias. <span className="text-latao-texto max-lg:block">Diferentes versões de você.</span>
          </h2>
          <div className="no-scrollbar mt-6 flex justify-start gap-2 overflow-x-auto sm:justify-center">
            {/* botão do painel de filtros (out/2026) — primeiro da fileira, pra não sumir na rolagem do celular */}
            <button
              type="button"
              onClick={() => setPainelAberto(true)}
              aria-haspopup="dialog"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-tinta/70 bg-papel px-4 py-2 text-xs font-medium text-tinta transition-colors hover:border-tinta"
            >
              <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" className="size-3.5">
                <path d="M4 7h10M18 7h2M4 17h4M12 17h8M16 5v4M10 15v4" />
              </svg>
              Filtrar
              {qtdFiltros > 0 && (
                <span className="flex size-4.5 items-center justify-center rounded-full bg-latao text-[10px] leading-none text-papel">
                  {qtdFiltros}
                </span>
              )}
            </button>
            <span aria-hidden className="my-1.5 w-px shrink-0 bg-linha-2" />
            <div role="tablist" aria-label="Filtrar por gênero" className="flex shrink-0 gap-2">
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
          {/* filtros ligados: um chip por filtro, pra tirar sem abrir o painel */}
          {chips.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {chips.map((c) => (
                <button
                  key={c.chave}
                  type="button"
                  onClick={c.tirar}
                  className="inline-flex items-center gap-2 rounded-full border border-latao/60 bg-papel px-3.5 py-1.5 text-xs text-tinta"
                >
                  {c.nome}
                  <span aria-hidden className="text-tinta-3">✕</span>
                  <span className="sr-only">Remover filtro</span>
                </button>
              ))}
              {chips.length > 1 && (
                <button
                  type="button"
                  onClick={() => setFiltrosPainel({ ...FILTROS_VAZIOS, ordem: filtrosPainel.ordem })}
                  className="px-2 py-1.5 text-xs text-tinta-2 underline underline-offset-4 hover:text-tinta"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          )}
        </div>

        {items.length === 0 && (
          <div className="mt-10 text-center">
            <p className="text-sm text-tinta-2">Nenhuma fragrância com esses filtros.</p>
            <button
              type="button"
              onClick={() => {
                setFiltro('ALL')
                setFiltrosPainel({ ...FILTROS_VAZIOS, ordem: filtrosPainel.ordem })
              }}
              className="mt-3 text-xs text-tinta underline underline-offset-4"
            >
              Ver todas
            </button>
          </div>
        )}

        <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:mt-12 lg:gap-6">
          {items.map((a) => (
            <li key={a.id} id={a.id} className="group/card relative flex flex-col overflow-hidden rounded-2xl bg-papel ring-1 ring-linha">
              {/* card leva pra página completa; o pop-up só abre pelo olhinho — celular: ícone no canto da foto;
                  desktop: pílula "Visualização rápida" no pé da foto, que sobe no hover do card */}
              <div className="relative">
              <EspiarProduto a={a} className="absolute top-2.5 right-2.5 z-10 lg:top-auto lg:right-auto lg:bottom-4 lg:left-1/2 lg:-translate-x-1/2" />
              <Link to={productPath(a)} className="group relative block">
                <div className="aspect-[4/5] overflow-hidden" style={{ background: a.bg }}>
                  <img
                    src={FRASCO_FOTO[a.id]?.src}
                    srcSet={FRASCO_FOTO[a.id]?.srcSet}
                    // 2 colunas no celular, 3 no tablet, 4 no desktop
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    alt={`${a.tipo} ${a.nome}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
              </Link>
              </div>
              <div className="flex flex-1 flex-col p-3 lg:p-5">
                {/* celular: tudo empilhado; lg: informações à esquerda e preço à direita (out/2026) */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between lg:gap-4">
                  <div className="flex min-w-0 flex-col">
                    <b className="font-display text-lg leading-tight font-semibold text-tinta lg:text-xl">
                      {a.nome}
                      <Sobrenome a={a} size="text-[0.78em]" />
                    </b>
                    <Avaliacao id={a.id} className="mt-1.5 text-[11px] lg:text-xs" />
                    {/* família numa linha própria; tipo do produto em rótulo, sem o volume (out/2026) */}
                    <span className="mt-2 text-[11px] leading-snug text-tinta-2 lg:text-xs">{a.fam}</span>
                    <span className="mt-1 font-label text-[9px] tracking-[0.14em] text-tinta-3 uppercase">
                      {a.tipo}
                    </span>
                  </div>
                  {/* regra 7: preço e parcelas sempre à vista no card. O Pix saiu do card a pedido do usuário
                      (out/2026) e segue no pop-up/PDP */}
                  <div className="mt-3 flex flex-col lg:mt-0.5 lg:shrink-0 lg:items-end lg:text-right">
                    <Preco a={a} className="text-base lg:flex-col lg:items-end lg:gap-y-0.5 lg:text-xl" />
                    <span className="mt-0.5 text-[11px] text-tinta-2 lg:mt-1 lg:text-xs">{CONDICOES.parcelasSemJuros}x {brl(parcela(precoFinal(a.preco)))} sem juros</span>
                  </div>
                </div>
                <div className="mt-auto pt-3.5">
                  <Link
                    to={productPath(a)}
                    className="block rounded-full border border-latao bg-latao py-2.5 text-center font-label text-[10px] tracking-[0.2em] text-papel uppercase transition-colors duration-300 hover:border-tinta hover:bg-tinta lg:py-3"
                  >
                    Comprar
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {painelAberto && <FiltroCatalogo base={base} valor={filtrosPainel} aplicar={setFiltrosPainel} fechar={fecharPainel} />}
    </section>
  )
}

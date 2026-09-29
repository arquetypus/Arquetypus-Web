import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { Archetype } from '@/types/archetype'
import { FRASCO_CUT_IMG, FRASCO_IMG } from '@/data/home'

type Filtro = 'ALL' | 'F' | 'M' | 'U'

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

/**
 * Catálogo da direção "Ateliê" — índice de revista em vez de carrossel: uma linha por arquétipo
 * (número grande, nome, família, volume, preço, seta). No desktop, passar o mouse numa linha mostra a
 * foto do frasco na coluna fixa à direita; no celular cada linha tem a miniatura. Mesmo filtro por gênero
 * e o mesmo destino (pop-up de compra /loja/:id) do carrossel.
 */
export function CatalogIndex({
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
  const [hover, setHover] = useState<string | null>(null)
  const preview = items.find((a) => a.id === hover) ?? items[0]

  return (
    <section id="catalogo" className="border-t border-tinta bg-papel px-5 pt-14 pb-16 md:px-10 lg:pt-24 lg:pb-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-label text-[10px] tracking-[0.3em] text-tinta-2 uppercase">Índice · O catálogo</p>
            <h2 className="mt-4 font-display text-[40px] leading-[1.02] text-tinta lg:text-7xl">
              Nove fragrâncias.
              <br />
              <span className="text-latao-texto">Diferentes versões de você.</span>
            </h2>
          </div>
          <div className="no-scrollbar flex gap-5 overflow-x-auto" role="tablist" aria-label="Filtrar catálogo">
            {filtros.map((f) => (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={filtro === f.key}
                onClick={() => setFiltro(f.key)}
                className={`shrink-0 border-b pb-1.5 font-label text-[10.5px] tracking-[0.16em] uppercase transition-colors ${
                  filtro === f.key ? 'border-tinta text-tinta' : 'border-transparent text-tinta-3 hover:text-tinta'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 lg:mt-16 lg:grid lg:grid-cols-12 lg:gap-x-12">
          <ol className="border-t border-linha-2 lg:col-span-7" onMouseLeave={() => setHover(null)}>
            {items.map((a) => (
              <li key={a.id} onMouseEnter={() => setHover(a.id)}>
                <Link
                  to={`/loja/${a.id}`}
                  state={{ backgroundLocation: location }}
                  className="group grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 border-b border-linha-2 py-4 transition-colors hover:bg-papel-2 lg:grid-cols-[5rem_1fr_auto_auto] lg:gap-8 lg:px-2 lg:py-6"
                >
                  {/* celular: miniatura; desktop: número grande */}
                  {FRASCO_CUT_IMG[a.id] && (
                    <img src={FRASCO_CUT_IMG[a.id]} alt="" className="h-16 w-12 object-cover lg:hidden" />
                  )}
                  <span aria-hidden className="hidden font-display text-5xl leading-none font-light lg:block" style={{ color: a.cor }}>
                    {a.cod.split('-')[1]}
                  </span>
                  <span className="min-w-0">
                    <b className="block font-display text-2xl leading-tight font-normal text-tinta lg:text-3xl">{a.nome}</b>
                    <span className="mt-1 block truncate font-label text-[9px] tracking-[0.16em] text-tinta-3 uppercase">
                      {a.fam} · {a.tipo} {a.vol}
                    </span>
                  </span>
                  <span className="hidden text-sm text-tinta-2 tabular-nums lg:block">{brl(a.preco)}</span>
                  <span aria-hidden className="text-xl text-tinta-3 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-tinta">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          {/* prévia fixa (desktop): troca conforme a linha em foco */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[3/4] overflow-hidden bg-papel-3 ring-1 ring-linha-2">
                {items.map((a) => (
                  <img
                    key={a.id}
                    src={FRASCO_IMG[a.id]}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
                    style={{ opacity: preview?.id === a.id ? 1 : 0 }}
                  />
                ))}
              </div>
              {preview && (
                <p className="mt-3 flex justify-between font-label text-[9px] tracking-[0.2em] text-tinta-3 uppercase">
                  <span>
                    {preview.cod} · {preview.nome}
                  </span>
                  <span>{brl(preview.preco)}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

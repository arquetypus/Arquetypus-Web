import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Archetype } from '@/types/archetype'
import { aplicarFiltros, contarFiltros, FILTROS_VAZIOS, OPCOES, type FiltrosCatalogo } from '@/lib/filtroCatalogo'

type Grupo = 'familias' | 'energias' | 'notas'

/**
 * Painel de filtros do catálogo (out/2026): celular sobe de baixo (bottom sheet), desktop entra pela direita.
 * Mexe num rascunho e só aplica no "Ver N fragrâncias" — o número já conta o gênero escolhido nas abas (`base`).
 * Fecha pelo ✕, fundo ou Esc (sem aplicar). Vai por portal pro <body>: o catálogo tem `content-visibility`, que
 * prenderia o `fixed` dentro da seção (e o header ficaria por cima).
 */
export function FiltroCatalogo({
  base,
  valor,
  aplicar,
  fechar,
}: {
  /** catálogo já filtrado pelo gênero das abas */
  base: Archetype[]
  valor: FiltrosCatalogo
  aplicar: (f: FiltrosCatalogo) => void
  fechar: () => void
}) {
  const [rascunho, setRascunho] = useState(valor)
  const painelRef = useRef<HTMLDivElement>(null)
  const total = aplicarFiltros(base, rascunho).length

  useEffect(() => {
    // trava o scroll da página por trás (o scroll vive no container do Layout), como o pop-up de compra
    const scroller = document.querySelector<HTMLElement>('[data-scroll-container]')
    const prev = scroller?.style.overflowY
    if (scroller) scroller.style.overflowY = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && fechar()
    document.addEventListener('keydown', onKey)
    painelRef.current?.focus()
    return () => {
      if (scroller) scroller.style.overflowY = prev ?? ''
      document.removeEventListener('keydown', onKey)
    }
  }, [fechar])

  const alternar = (grupo: Grupo, id: string) =>
    setRascunho((r) => {
      const atual = r[grupo] as string[]
      return { ...r, [grupo]: atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id] }
    })

  const pilula = (ativo: boolean) =>
    `rounded-full border px-3.5 py-2 text-xs transition-colors ${
      ativo ? 'border-tinta bg-tinta text-papel' : 'border-linha-2 bg-papel text-tinta-2 hover:border-tinta-3 hover:text-tinta'
    }`

  const secoes: { grupo: Grupo; titulo: string }[] = [
    { grupo: 'familias', titulo: 'Família olfativa' },
    { grupo: 'energias', titulo: 'Energia' },
    { grupo: 'notas', titulo: 'Notas' },
  ]

  return createPortal(
    <div className="fixed inset-0 z-40 flex items-end lg:justify-end" role="dialog" aria-modal="true" aria-label="Filtrar fragrâncias">
      <button type="button" aria-label="Fechar filtros" onClick={fechar} className="sheet-backdrop absolute inset-0 cursor-default bg-noite/60" />
      <div
        ref={painelRef}
        tabIndex={-1}
        className="filtro-in relative flex max-h-[88svh] w-full flex-col rounded-t-3xl bg-papel shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.5)] outline-none lg:h-full lg:max-h-none lg:w-[26rem] lg:rounded-none lg:shadow-[-20px_0_60px_-20px_rgba(0,0,0,0.5)]"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-linha px-5 py-4 lg:px-7 lg:py-5">
          <p className="font-display text-xl text-tinta">Filtrar</p>
          <button
            type="button"
            onClick={fechar}
            aria-label="Fechar"
            className="flex size-9 items-center justify-center rounded-full text-lg text-tinta-3 transition-colors hover:bg-papel-2 hover:text-tinta"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-7 overflow-y-auto overscroll-contain px-5 py-6 lg:px-7">
          <fieldset>
            <legend className="font-label text-[10px] tracking-[0.18em] text-tinta-3 uppercase">Ordenar por</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {OPCOES.ordens.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={rascunho.ordem === o.id}
                  onClick={() => setRascunho((r) => ({ ...r, ordem: o.id }))}
                  className={pilula(rascunho.ordem === o.id)}
                >
                  {o.nome}
                </button>
              ))}
            </div>
          </fieldset>
          {secoes.map(({ grupo, titulo }) => (
            <fieldset key={grupo}>
              <legend className="font-label text-[10px] tracking-[0.18em] text-tinta-3 uppercase">{titulo}</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {OPCOES[grupo].map((o) => {
                  const ativo = (rascunho[grupo] as string[]).includes(o.id)
                  return (
                    <button key={o.id} type="button" aria-pressed={ativo} onClick={() => alternar(grupo, o.id)} className={pilula(ativo)}>
                      {o.nome}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-3 border-t border-linha px-5 pt-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] lg:px-7 lg:pb-6">
          <button
            type="button"
            onClick={() => setRascunho(FILTROS_VAZIOS)}
            disabled={contarFiltros(rascunho) === 0 && rascunho.ordem === 'destaque'}
            className="px-2 py-3 font-label text-[10px] tracking-[0.18em] text-tinta-2 uppercase underline-offset-4 hover:text-tinta hover:underline disabled:opacity-40"
          >
            Limpar
          </button>
          <button
            type="button"
            disabled={total === 0}
            onClick={() => {
              aplicar(rascunho)
              fechar()
            }}
            className="flex-1 rounded-full bg-tinta py-3.5 disabled:opacity-40 font-label text-[11px] tracking-[0.16em] text-papel uppercase transition-colors hover:bg-latao"
          >
            {total === 0 ? 'Nenhuma fragrância' : `Ver ${total} ${total === 1 ? 'fragrância' : 'fragrâncias'}`}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

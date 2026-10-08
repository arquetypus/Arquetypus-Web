import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { CONTATOS } from '@/data/home'

const INSTAGRAM = CONTATOS.find((c) => c.rede === 'instagram')

/**
 * Aviso "Em fase de lançamento" (out/2026, pedido do usuário): abre ao clicar em "Comprar agora" enquanto
 * `EM_LANCAMENTO` (data/empresa.ts) estiver ligado — o botão fica ativo, mas ainda não vende. Copy escrita por
 * mim a partir do pedido ("em fase de lançamento"); revisar com o usuário. Portal no <body> com z-50, acima do
 * pop-up de compra (z-40). Fecha pelo botão, ✕, fundo ou Esc.
 */
export function AvisoLancamento({ fechar }: { fechar: () => void }) {
  const fecharRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && fechar()
    document.addEventListener('keydown', onKey)
    fecharRef.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [fechar])

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="aviso-lancamento-titulo">
      <button type="button" aria-label="Fechar aviso" onClick={fechar} className="sheet-backdrop absolute inset-0 cursor-default bg-noite/60" />
      <div className="sheet-in relative w-full max-w-sm rounded-2xl bg-papel px-6 pt-8 pb-6 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)] ring-1 ring-latao/40">
        <button
          type="button"
          onClick={fechar}
          aria-label="Fechar"
          className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full text-lg text-tinta-3 transition-colors hover:bg-papel-2 hover:text-tinta"
        >
          ✕
        </button>
        <p className="font-label text-[10px] tracking-[0.2em] text-latao-texto uppercase">Arquétypus Parfum</p>
        <h2 id="aviso-lancamento-titulo" className="mt-3 font-display text-[28px] leading-tight text-tinta">
          Em fase de lançamento
        </h2>
        <span aria-hidden className="mx-auto mt-4 block h-px w-12 bg-latao/60" />
        <p className="mt-4 text-sm leading-relaxed text-tinta-2">
          As vendas pelo site abrem em breve. Estamos preparando cada detalhe pra você reconhecer o seu.
        </p>
        {INSTAGRAM && (
          <p className="mt-3 text-sm text-tinta-2">
            Acompanhe a novidade no Instagram{' '}
            <a href={INSTAGRAM.href} target="_blank" rel="noopener noreferrer" className="font-medium text-latao-texto underline underline-offset-4">
              {INSTAGRAM.rotulo}
            </a>
            .
          </p>
        )}
        <button
          ref={fecharRef}
          type="button"
          onClick={fechar}
          className="mt-6 w-full rounded-lg bg-latao py-3.5 text-xs font-semibold tracking-[0.14em] text-papel uppercase transition-shadow hover:shadow-[0_14px_30px_-14px_color-mix(in_srgb,var(--color-latao)_100%,transparent)]"
        >
          Entendi
        </button>
      </div>
    </div>,
    document.body,
  )
}

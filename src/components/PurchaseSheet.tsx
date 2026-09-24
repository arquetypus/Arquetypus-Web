import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'

/**
 * Casca do pop-up de compra (bottom sheet): fundo escurecido, puxador, fechar
 * (X, toque fora, Esc), trava do scroll de trás e link "Ver página completa".
 * Sempre aberto como rota com `state.backgroundLocation` (ver App.tsx) — a URL
 * `fullPageTo` acessada direto abre a página completa.
 */
export function PurchaseSheet({ label, fullPageTo, children }: { label: string; fullPageTo: string; children: ReactNode }) {
  const navigate = useNavigate()
  const close = () => navigate(-1)

  useEffect(() => {
    // trava o scroll da página por trás (o scroll vive no container do Layout)
    const scroller = document.querySelector<HTMLElement>('[data-scroll-container]')
    const prev = scroller?.style.overflowY
    if (scroller) scroller.style.overflowY = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') navigate(-1)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      if (scroller) scroller.style.overflowY = prev ?? ''
      document.removeEventListener('keydown', onKey)
    }
  }, [navigate])

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center" role="dialog" aria-modal="true" aria-label={label}>
      <button
        type="button"
        aria-label="Fechar"
        onClick={close}
        className="sheet-backdrop absolute inset-0 cursor-default bg-noite/55 backdrop-blur-[2px]"
      />
      <div className="sheet-in relative flex max-h-[90svh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-papel shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.5)]">
        <div className="relative flex shrink-0 items-center justify-center border-b border-linha py-3">
          <span aria-hidden className="h-1 w-10 rounded-full bg-linha-2" />
          <button
            type="button"
            onClick={close}
            aria-label="Fechar"
            className="absolute top-1/2 right-3 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-lg text-tinta-3"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto overscroll-contain pb-8">
          {children}
          <div className="mt-6 px-4 text-center">
            <Link
              to={fullPageTo}
              replace
              className="inline-block py-2 font-label text-[10px] tracking-[0.18em] text-latao-texto uppercase"
            >
              <span className="border-b border-latao-texto/40 pb-0.5">Ver página completa</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

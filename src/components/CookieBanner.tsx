import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { onOpenCookiePreferences, readConsent, saveConsent } from '@/lib/consent'
import { CutFrame } from '@/components/ui/CutFrame'

// null = página ainda não existe: o texto aparece sem link (nada de link morto)
const PRIVACY_PATH: string | null = '/privacidade'

// mesmo desenho do "Ver página completa" do PurchaseSheet: rótulo latão com filete embaixo
const TEXT_ACTION =
  'cursor-pointer py-2 font-label text-[9.5px] tracking-[0.18em] text-latao-texto uppercase focus-visible:outline-none'

// pílula compacta com filete latão (versão pequena da SweepCta, que é larga demais pra barra)
const PILL =
  'min-h-9 cursor-pointer rounded-full border border-latao/60 bg-papel px-5 font-label text-[9.5px] tracking-[0.16em] text-tinta uppercase hover:border-latao hover:bg-latao focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-latao'

/**
 * Decisão binária por produto: aceita tudo (análise + marketing) ou recusa tudo —
 * sem tela de personalização. "Gerenciar cookies" no rodapé reabre esta mesma barra.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(() => readConsent() === null)

  useEffect(() => onOpenCookiePreferences(() => setVisible(true)), [])

  if (!visible) return null

  const decide = (accepted: boolean) => {
    saveConsent(accepted, accepted)
    setVisible(false)
  }

  return (
    <section
      role="region"
      aria-label="Cookies neste site"
      // flutua dentro da largura do Layout (max-w-md); o wrapper não captura toque fora do card
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] mx-auto max-w-md px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]"
    >
      {/* clip-path do CutFrame corta box-shadow — a sombra vai em drop-shadow no wrapper */}
      <div className="pointer-events-auto drop-shadow-[0_10px_22px_rgba(26,25,23,0.2)] motion-safe:animate-[fade-in-up_0.6s_cubic-bezier(0.16,1,0.3,1)_both]">
        <CutFrame cut={10} innerClassName="bg-papel px-4 pt-3.5 pb-2.5">
          <p className="text-[12px] leading-snug text-tinta-2">
            Usamos cookies para entender como o site é usado e para medir nossos anúncios. Detalhes na{' '}
            {PRIVACY_PATH ? (
              <Link to={PRIVACY_PATH} className="border-b border-latao-texto/40 hover:border-latao-texto">
                Política de privacidade
              </Link>
            ) : (
              'Política de privacidade'
            )}
            .
          </p>
          <div className="mt-2 flex items-center justify-end gap-4">
            <button type="button" onClick={() => decide(false)} className={TEXT_ACTION}>
              <span className="border-b border-latao-texto/40 pb-0.5">Recusar</span>
            </button>
            <button type="button" onClick={() => decide(true)} className={PILL}>
              Aceitar
            </button>
          </div>
        </CutFrame>
      </div>
    </section>
  )
}

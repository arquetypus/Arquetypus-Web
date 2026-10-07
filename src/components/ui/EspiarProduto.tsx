import { Link, useLocation } from 'react-router-dom'
import type { Archetype } from '@/types/archetype'
import { productPath } from '@/data/archetypes'

/**
 * "Olhinho" de visualização rápida (out/2026, como no site da Saniella): é o ÚNICO caminho pro pop-up de compra na
 * home — abre /body-splash/:slug com `state.backgroundLocation` (pop-up por cima, ver App.tsx). Qualquer outro link
 * de produto vai pra página completa. Celular: ícone redondo, sempre à vista. Desktop: pílula maior com o olho e
 * "Visualização rápida", que aparece com fade no hover/foco do card (o card pai precisa de `group/card`).
 * Posicionar com `className`.
 */
// inline porque o `a, button { transition }` global de index.css (fora de layer) vence as utilities — só fade
const TRANSICAO = { transition: 'opacity 0.3s ease-out, background-color 0.3s ease-out, color 0.3s ease-out' }

export function EspiarProduto({ a, className = '' }: { a: Archetype; className?: string }) {
  const location = useLocation()
  return (
    <Link
      to={productPath(a)}
      state={{ backgroundLocation: location }}
      aria-label={`Visualização rápida: ${a.nome}`}
      title="Visualização rápida"
      className={`flex size-9 items-center justify-center gap-2 rounded-full bg-papel/90 text-tinta shadow-[0_4px_12px_-6px_rgba(43,29,22,0.45)] ring-1 ring-tinta/10 backdrop-blur-sm hover:bg-latao hover:text-papel focus-visible:opacity-100 lg:h-11 lg:w-auto lg:px-5 lg:whitespace-nowrap lg:opacity-0 lg:shadow-[0_10px_24px_-12px_rgba(43,29,22,0.55)] lg:ring-latao/50 lg:group-hover/card:opacity-100 ${className}`}
      style={TRANSICAO}
    >
      <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-[18px] shrink-0 lg:size-5">
        <path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <span className="hidden font-label text-[10px] tracking-[0.18em] uppercase lg:inline">Visualização rápida</span>
    </Link>
  )
}

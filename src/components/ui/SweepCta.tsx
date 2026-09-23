import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

const BASE =
  'group relative inline-block w-full cursor-pointer max-w-[280px] overflow-hidden rounded-full border border-latao/50 bg-papel/40 py-3.5 text-center text-xs font-medium tracking-wide text-tinta uppercase hover:border-latao hover:shadow-[0_8px_24px_-12px_rgba(198,164,108,0.6)] focus-visible:border-latao focus-visible:outline-none'

// inline porque o `a, button { transition }` global de index.css (fora de layer) vence as utilities
const TRANSITION = { transition: 'border-color 0.5s ease-out, box-shadow 0.5s ease-out, transform 0.2s ease' }

/**
 * CTA editorial sobre fundo claro: pílula translúcida com filete latão, preenchimento
 * latão que varre da esquerda no hover/foco e brilho discreto periódico (.cta-sheen,
 * index.css). `to` vira Link; sem `to`, botão (`onClick`, ou `type="submit"` dentro de form).
 */
export function SweepCta({
  children,
  to,
  onClick,
  type = 'button',
  className = '',
}: {
  children: ReactNode
  to?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
}) {
  const inner = (
    <>
      {/* preenchimento dourado do logo que varre da esquerda; texto segue escuro (tinta tem ~6:1 sobre ele) */}
      <span
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 bg-latao transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
      {/* brilho que atravessa de tempos em tempos */}
      <span aria-hidden className="cta-sheen pointer-events-none absolute inset-y-0 -left-1/2 w-1/2" />
      <span className="relative z-10 inline-block tracking-wide transition-[color,letter-spacing] duration-500 ease-out group-hover:tracking-[0.08em]">
        {children}
      </span>
    </>
  )

  if (to) {
    return (
      <Link to={to} style={TRANSITION} className={`${BASE} ${className}`}>
        {inner}
      </Link>
    )
  }
  return (
    <button type={type} onClick={onClick} style={TRANSITION} className={`${BASE} ${className}`}>
      {inner}
    </button>
  )
}

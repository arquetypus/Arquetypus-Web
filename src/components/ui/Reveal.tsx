import type { CSSProperties, ReactNode } from 'react'
import { useInView } from '@/lib/useInView'

/**
 * Seção entra com fade + translateY quando cruza a viewport. Respeita
 * prefers-reduced-motion via CSS. `animateContent` mantém o container
 * (bg próprio, ex. seções dark) sempre visível e anima só os filhos —
 * evita o pai "piscar" pra bg-papel enquanto opacity:0.
 */
export function Reveal({
  as: Tag = 'div',
  className = '',
  id,
  style,
  animateContent = false,
  children,
}: {
  as?: 'div' | 'section'
  className?: string
  id?: string
  style?: CSSProperties
  animateContent?: boolean
  children: ReactNode
}) {
  const { ref, inView } = useInView<HTMLDivElement>()

  if (animateContent) {
    return (
      <Tag id={id} ref={ref} style={style} className={className}>
        <div className={`reveal-init ${inView ? 'fade-in-up' : ''}`}>{children}</div>
      </Tag>
    )
  }

  return (
    <Tag
      id={id}
      ref={ref}
      style={style}
      className={`${className} reveal-init ${inView ? 'fade-in-up' : ''}`}
    >
      {children}
    </Tag>
  )
}

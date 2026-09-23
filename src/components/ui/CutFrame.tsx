import type { CSSProperties, ReactNode } from 'react'

/** Octógono com cantos cortados em `c` px. */
function cutPolygon(c: number) {
  return `polygon(${c}px 0, calc(100% - ${c}px) 0, 100% ${c}px, 100% calc(100% - ${c}px), calc(100% - ${c}px) 100%, ${c}px 100%, 0 calc(100% - ${c}px), 0 ${c}px)`
}

/**
 * Moldura de cantos recortados — assinatura visual da Arquétypus (UGC da
 * comunidade, product tag). Duas camadas com o mesmo recorte: a externa é
 * o filete (cor `line`), a interna fica 1px pra dentro com o corte reduzido
 * em √2−1 para o filete manter 1px também nas diagonais.
 * `clip-path` corta box-shadow — sombra, se precisar, vai em `filter: drop-shadow` num wrapper.
 */
export function CutFrame({
  cut = 12,
  line = 'color-mix(in srgb, var(--color-latao) 55%, transparent)',
  className = '',
  innerClassName = '',
  innerStyle,
  children,
}: {
  cut?: number
  line?: string
  className?: string
  innerClassName?: string
  innerStyle?: CSSProperties
  children: ReactNode
}) {
  return (
    <div className={`p-px ${className}`} style={{ clipPath: cutPolygon(cut), background: line }}>
      <div className={innerClassName} style={{ clipPath: cutPolygon(cut - 0.41), ...innerStyle }}>
        {children}
      </div>
    </div>
  )
}

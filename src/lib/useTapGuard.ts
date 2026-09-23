import { useRef } from 'react'
import type { MouseEvent, PointerEvent } from 'react'

/**
 * Cards clicáveis dentro de carrossel horizontal: um toque que virou arrasto
 * (mais que `threshold` px) não deve disparar o clique. Espalhar o retorno no
 * container do carrossel — o clique é barrado na fase de captura.
 */
export function useTapGuard(threshold = 10) {
  const start = useRef<{ x: number; y: number } | null>(null)
  const moved = useRef(false)

  return {
    onPointerDown(e: PointerEvent) {
      start.current = { x: e.clientX, y: e.clientY }
      moved.current = false
    },
    onPointerMove(e: PointerEvent) {
      const s = start.current
      if (s && Math.hypot(e.clientX - s.x, e.clientY - s.y) > threshold) moved.current = true
    },
    onClickCapture(e: MouseEvent) {
      if (moved.current) {
        e.preventDefault()
        e.stopPropagation()
      }
      moved.current = false
      start.current = null
    },
  }
}

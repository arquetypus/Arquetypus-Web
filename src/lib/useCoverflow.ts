import { useEffect } from 'react'
import type { RefObject } from 'react'

/**
 * Foco contínuo num carrossel horizontal centralizado: a cada frame de scroll,
 * cada filho direto recebe escala/opacidade proporcionais à distância do
 * centro do container (1 card de distância = efeito máximo) — só propriedades
 * de compositor, baratas. O blur é binário (liga passando da metade do caminho).
 * Escreve direto no DOM via rAF, sem re-render do React.
 */
export function useCoverflow(
  ref: RefObject<HTMLElement | null>,
  { minScale = 0.9, minOpacity = 0.35, maxBlur = 2 }: { minScale?: number; minOpacity?: number; maxBlur?: number } = {},
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0

    function paint() {
      frame = 0
      // posição de layout (offset*), que não muda com a escala aplicada aqui — o container precisa ser `relative`
      const center = el!.scrollLeft + el!.clientWidth / 2
      for (const child of Array.from(el!.children) as HTMLElement[]) {
        const childCenter = child.offsetLeft + child.offsetWidth / 2
        const d = Math.min(1, Math.abs(childCenter - center) / (child.offsetWidth || 1))
        child.style.opacity = String(1 - (1 - minOpacity) * d)
        if (reduceMotion) continue
        const side = childCenter < center ? 'right' : 'left'
        child.style.transformOrigin = `${side} center`
        child.style.transform = `scale(${1 - (1 - minScale) * d})`
        // blur em 2 estados (não contínuo): mudar o raio a cada frame força re-rasterizar a imagem
        // inteira e era o que travava o deslize no celular. Troca uma vez por card, com transição curta.
        const blurred = d > 0.5 ? '1' : '0'
        if (child.dataset.blurred !== blurred) {
          child.dataset.blurred = blurred
          child.style.transition = 'filter 0.3s ease'
          child.style.filter = blurred === '1' ? `blur(${maxBlur}px)` : 'blur(0px)'
        }
      }
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(paint)
    }

    paint()
    el.addEventListener('scroll', schedule, { passive: true })
    const ro = new ResizeObserver(schedule)
    ro.observe(el)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('scroll', schedule)
      ro.disconnect()
    }
  }, [ref, minScale, minOpacity, maxBlur])
}

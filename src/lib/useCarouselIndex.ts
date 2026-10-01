import { useCallback, useEffect, useState } from 'react'

/**
 * Índice do item "atual" de um carrossel horizontal com snap-start, para
 * alimentar os indicadores em pílula. Usa a fração de scroll (não a posição
 * de cada item) para que o último item acenda no fim, mesmo quando ele não
 * consegue encostar na borda esquerda.
 *
 * `ref` é ref de callback (elemento em estado): se o carrossel sai e volta do DOM com o hook montado, os
 * listeners vão pro elemento novo (ver useInfiniteCarousel).
 */
export function useCarouselIndex<T extends HTMLElement>(count: number) {
  const [el, setEl] = useState<T | null>(null)
  const ref = useCallback((node: T | null) => setEl(node), [])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!el || count <= 1) return

    function update() {
      const { scrollWidth, clientWidth, scrollLeft } = el!
      const maxScroll = scrollWidth - clientWidth
      const fraction = maxScroll > 0 ? scrollLeft / maxScroll : 0
      setActiveIndex(Math.round(fraction * (count - 1)))
    }

    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [count, el])

  return { ref, activeIndex }
}

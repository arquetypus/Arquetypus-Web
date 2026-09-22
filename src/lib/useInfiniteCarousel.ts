import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/**
 * Carrossel horizontal infinito: renderiza `loops` cópias de `count` itens
 * e reposiciona o scroll silenciosamente ao cruzar as bordas do bloco
 * central, dando a sensação de loop sem fim. `activeIndex` é o índice
 * (no array com loops) do item mais próximo do centro do container —
 * use `activeIndex % count` para saber qual item "real" está em foco.
 */
export function useInfiniteCarousel(count: number) {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(count)
  const settleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  function registerItem(i: number) {
    return (el: HTMLElement | null) => {
      itemsRef.current[i] = el
    }
  }

  useLayoutEffect(() => {
    const el = containerRef.current
    const target = itemsRef.current[count]
    if (!el || !target || count === 0) return
    el.scrollLeft = target.offsetLeft - (parseFloat(getComputedStyle(el).paddingLeft) || 0)
    setActiveIndex(count)
  }, [count])

  useEffect(() => {
    const el = containerRef.current
    if (!el || count === 0) return

    function closestIndex() {
      const el = containerRef.current
      if (!el) return count
      const center = el.scrollLeft + el.clientWidth / 2
      let best = 0
      let bestDist = Infinity
      itemsRef.current.forEach((item, i) => {
        if (!item) return
        const itemCenter = item.offsetLeft + item.offsetWidth / 2
        const dist = Math.abs(itemCenter - center)
        if (dist < bestDist) {
          bestDist = dist
          best = i
        }
      })
      return best
    }

    function onScroll() {
      setActiveIndex(closestIndex())

      clearTimeout(settleTimer.current)
      settleTimer.current = setTimeout(() => {
        const el = containerRef.current
        if (!el) return
        const idx = closestIndex()
        if (idx < count || idx >= count * 2) {
          const from = itemsRef.current[idx]
          const to = itemsRef.current[idx < count ? idx + count : idx - count]
          if (from && to) {
            el.scrollLeft += to.offsetLeft - from.offsetLeft
            setActiveIndex(idx < count ? idx + count : idx - count)
          }
        }
      }, 140)
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      clearTimeout(settleTimer.current)
    }
  }, [count])

  return { containerRef, registerItem, activeIndex }
}

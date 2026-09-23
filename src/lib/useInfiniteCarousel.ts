import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/**
 * Carrossel horizontal infinito: renderiza `loops` cópias de `count` itens
 * e reposiciona o scroll silenciosamente ao cruzar as bordas do bloco
 * central, dando a sensação de loop sem fim. `activeIndex` é o índice
 * (no array com loops) do item mais próximo do centro do container —
 * use `activeIndex % count` para saber qual item "real" está em foco.
 *
 * O posicionamento inicial mede pela tela (getBoundingClientRect) e é
 * refeito quando o container ganha tamanho de verdade: no primeiro render
 * a seção ainda está invisível (Reveal) e o celular podia ignorar o
 * scrollLeft, deixando o carrossel "desativado" (todos os cards borrados)
 * até o primeiro deslize. O ativo sempre sai do que está visível.
 */
export function useInfiniteCarousel(count: number) {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(count)
  const settleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const userScrolled = useRef(false)

  function registerItem(i: number) {
    return (el: HTMLElement | null) => {
      itemsRef.current[i] = el
    }
  }

  function closestIndex() {
    const el = containerRef.current
    if (!el) return count
    const box = el.getBoundingClientRect()
    const center = box.left + box.width / 2
    let best = count
    let bestDist = Infinity
    itemsRef.current.forEach((item, i) => {
      if (!item) return
      const r = item.getBoundingClientRect()
      const dist = Math.abs(r.left + r.width / 2 - center)
      if (dist < bestDist) {
        bestDist = dist
        best = i
      }
    })
    return best
  }

  function centerOn(i: number) {
    const el = containerRef.current
    const item = itemsRef.current[i]
    if (!el || !item || el.clientWidth === 0) return
    const box = el.getBoundingClientRect()
    const r = item.getBoundingClientRect()
    el.scrollLeft += r.left + r.width / 2 - (box.left + box.width / 2)
  }

  useLayoutEffect(() => {
    if (count === 0) return
    userScrolled.current = false
    centerOn(count)
    setActiveIndex(closestIndex())
    // segunda passada depois do layout assentar (fontes, snap, seção revelada)
    const raf = requestAnimationFrame(() => {
      if (userScrolled.current) return
      centerOn(count)
      setActiveIndex(closestIndex())
    })
    return () => cancelAnimationFrame(raf)
  }, [count])

  useEffect(() => {
    const el = containerRef.current
    if (!el || count === 0) return

    // container que nasce sem tamanho (ou muda de largura) é recentralizado enquanto ninguém mexeu nele
    const ro = new ResizeObserver(() => {
      if (userScrolled.current) {
        setActiveIndex(closestIndex())
        return
      }
      centerOn(count)
      setActiveIndex(closestIndex())
    })
    ro.observe(el)

    function markUser() {
      userScrolled.current = true
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
    el.addEventListener('pointerdown', markUser, { passive: true })
    el.addEventListener('touchstart', markUser, { passive: true })
    el.addEventListener('wheel', markUser, { passive: true })
    return () => {
      ro.disconnect()
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('pointerdown', markUser)
      el.removeEventListener('touchstart', markUser)
      el.removeEventListener('wheel', markUser)
      clearTimeout(settleTimer.current)
    }
  }, [count])

  return { containerRef, registerItem, activeIndex }
}

import { useEffect, useRef, useState } from 'react'

/** Preenchimento mínimo no início, pra sinalizar que o carrossel tem mais conteúdo mesmo sem scroll ainda. */
const MIN_FILL_PCT = 20

/** Acompanha scrollLeft/scrollWidth de um container horizontal para alimentar uma barra de progresso. */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [fillPct, setFillPct] = useState(MIN_FILL_PCT)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    function update() {
      const { scrollWidth, clientWidth, scrollLeft } = el!
      const maxScroll = scrollWidth - clientWidth
      const fraction = maxScroll > 0 ? scrollLeft / maxScroll : 1
      setFillPct(MIN_FILL_PCT + fraction * (100 - MIN_FILL_PCT))
    }

    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [])

  return { ref, fillPct }
}

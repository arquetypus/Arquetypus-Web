import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

/**
 * Carrossel horizontal infinito: renderiza `loops` cópias de `count` itens
 * e reposiciona o scroll silenciosamente ao cruzar as bordas do bloco
 * central, dando a sensação de loop sem fim. `activeIndex` é o índice
 * (no array com loops) do item mais próximo do centro do container —
 * use `activeIndex % count` para saber qual item "real" está em foco.
 *
 * As medidas usam a posição de LAYOUT (offsetLeft/offsetWidth), não a da tela:
 * os cards podem estar escalados (coverflow com transform-origin na lateral),
 * e a caixa transformada deslocava o centro calculado. O posicionamento
 * inicial é refeito quando o container ganha tamanho de verdade: no primeiro render
 * a seção ainda está invisível (Reveal) e o celular podia ignorar o
 * scrollLeft, deixando o carrossel "desativado" (todos os cards borrados)
 * até o primeiro deslize. O ativo sempre sai do que está visível.
 *
 * `containerRef` é ref de callback: o elemento fica em estado e os efeitos dependem dele. O hook pode viver
 * num componente que continua montado enquanto o carrossel sai e volta do DOM (ex.: trocar estrutura/catálogo
 * no painel de direção visual) — com ref de objeto e efeito só em [count], os listeners ficavam presos no
 * elemento antigo e o carrossel novo nascia travado.
 */
export function useInfiniteCarousel(count: number) {
  const elRef = useRef<HTMLDivElement | null>(null)
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    elRef.current = node
    setContainer(node)
  }, [])
  const itemsRef = useRef<(HTMLElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(count)
  const settleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const userScrolled = useRef(false)

  function registerItem(i: number) {
    return (el: HTMLElement | null) => {
      itemsRef.current[i] = el
    }
  }

  // centro do item em coordenadas do conteúdo rolável, ignorando transforms
  function layoutCenter(el: HTMLElement, item: HTMLElement) {
    const first = itemsRef.current.find(Boolean)!
    const padLeft = parseFloat(getComputedStyle(el).paddingLeft) || 0
    return padLeft + (item.offsetLeft - first.offsetLeft) + item.offsetWidth / 2
  }

  function closestIndex() {
    const el = elRef.current
    if (!el) return count
    const center = el.scrollLeft + el.clientWidth / 2
    let best = count
    let bestDist = Infinity
    itemsRef.current.forEach((item, i) => {
      if (!item) return
      const dist = Math.abs(layoutCenter(el, item) - center)
      if (dist < bestDist) {
        bestDist = dist
        best = i
      }
    })
    return best
  }

  function centerOn(i: number) {
    const el = elRef.current
    const item = itemsRef.current[i]
    if (!el || !item || el.clientWidth === 0) return
    el.scrollLeft = layoutCenter(el, item) - el.clientWidth / 2
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
  }, [count, container])

  useEffect(() => {
    const el = container
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
        const el = elRef.current
        if (!el) return
        const idx = closestIndex()
        if (idx < count || idx >= count * 2) {
          const from = itemsRef.current[idx]
          const to = itemsRef.current[idx < count ? idx + count : idx - count]
          if (from && to) {
            // O salto troca cada card visível por uma cópia dele em outro bloco. As cópias estavam com o
            // visual de "longe do centro" (menor, apagada, borrada): animavam até o estado certo (pulo) ou,
            // sem animação, apareciam 1 frame erradas até o React/coverflow atualizarem (piscada).
            // Então, antes do salto, cada cópia recebe na hora o estilo inline do card que ela substitui,
            // e data-loop-jump desliga as transições (index.css) até tudo assentar.
            const shift = idx < count ? count : -count
            const items = itemsRef.current
            const snapshot = items.map((it) => (it ? { css: it.style.cssText, blurred: it.dataset.blurred } : null))
            el.dataset.loopJump = ''
            items.forEach((it, t) => {
              const src = snapshot[t - shift]
              if (!it || !src) return
              it.style.cssText = src.css
              if (src.blurred === undefined) delete it.dataset.blurred
              else it.dataset.blurred = src.blurred
            })
            el.scrollLeft += to.offsetLeft - from.offsetLeft
            setActiveIndex(idx < count ? idx + count : idx - count)
            requestAnimationFrame(() => requestAnimationFrame(() => delete el.dataset.loopJump))
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
  }, [count, container])

  // setas (desktop): centraliza o vizinho com scroll suave; o reposicionamento do loop acontece no onScroll
  function step(dir: 1 | -1) {
    const el = elRef.current
    const item = itemsRef.current[closestIndex() + dir]
    if (!el || !item) return
    userScrolled.current = true
    el.scrollTo({ left: layoutCenter(el, item) - el.clientWidth / 2, behavior: 'smooth' })
  }

  return { containerRef, container, registerItem, activeIndex, step }
}

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
 *
 * `mouseDrag`: arrastar com o mouse (desktop). Toque e trackpad seguem com o scroll nativo; o mouse não rola na
 * horizontal sozinho, então o arraste move o scrollLeft na mão (snap desligado via data-dragging, ver index.css) e
 * engole o clique que viria no fim do arraste (não abre o link). Depois de um arraste o trilho PARA ONDE PAROU: o
 * encaixe fica desligado (`data-livre`) até alguém usar as setas (`step`), que centralizam um card e religam o snap.
 *
 * `copias` (out/2026, performance): o componente pode começar com 1 cópia (só os `count` itens — HTML inicial e
 * primeiro desenho leves) e passar a 3 depois do carregamento. Para a troca ser invisível, os itens da cópia única
 * devem ter as mesmas `key` da cópia do meio (ver `chaveDaCopia`): o React reaproveita esses elementos, insere as
 * cópias novas antes e depois, e aqui o scroll é compensado pela largura de um bloco antes da pintura.
 */
export function useInfiniteCarousel(count: number, { mouseDrag = false, copias = 3 }: { mouseDrag?: boolean; copias?: 1 | 3 } = {}) {
  const elRef = useRef<HTMLDivElement | null>(null)
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    elRef.current = node
    setContainer(node)
  }, [])
  const itemsRef = useRef<(HTMLElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(count)
  const settleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const livreTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const userScrolled = useRef(false)
  const initializedContainer = useRef<HTMLDivElement | null>(null)

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

  // 1 → 3 cópias: os itens visíveis viraram a cópia do meio (mesmas keys) e um bloco novo entrou antes deles —
  // anda o scroll exatamente esse bloco, antes da pintura, pra nada sair do lugar na tela
  const copiasAntes = useRef(copias)
  useLayoutEffect(() => {
    const antes = copiasAntes.current
    copiasAntes.current = copias
    const el = elRef.current
    if (antes !== 1 || copias !== 3 || !el) return
    const primeiro = itemsRef.current[0], meio = itemsRef.current[count]
    if (primeiro && meio) el.scrollLeft += meio.offsetLeft - primeiro.offsetLeft
    setActiveIndex(closestIndex())
  }, [copias, count])

  useLayoutEffect(() => {
    if (count === 0 || !container) return
    // Um trilho recém-hidratado já pode ter recebido scroll nativo no HTML.
    // Trocar o filtro continua centralizando; apenas a primeira conexão preserva o gesto.
    userScrolled.current = initializedContainer.current !== container && container.scrollLeft > 0
    initializedContainer.current = container
    if (!userScrolled.current && copiasAntes.current === 3) centerOn(count)
    setActiveIndex(closestIndex())
    // segunda passada depois do layout assentar (fontes, snap, seção revelada)
    const raf = requestAnimationFrame(() => {
      if (userScrolled.current || copiasAntes.current !== 3) return
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
      if (userScrolled.current || copiasAntes.current !== 3) {
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

    let drag: { x: number; left: number; moved: boolean; id: number } | null = null
    let swallowClick = false
    let dragEndTimer: ReturnType<typeof setTimeout> | undefined

    function onDragStart(e: PointerEvent) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      // sem isso o navegador começa a arrastar a imagem/selecionar texto em vez do carrossel
      e.preventDefault()
      clearTimeout(dragEndTimer)
      drag = { x: e.clientX, left: el!.scrollLeft, moved: false, id: e.pointerId }
    }

    function onDragMove(e: PointerEvent) {
      if (!drag) return
      const dx = e.clientX - drag.x
      if (!drag.moved) {
        // folga de 5px: clique com a mão tremendo ainda é clique
        if (Math.abs(dx) < 5) return
        drag.moved = true
        el!.setPointerCapture(drag.id)
        el!.dataset.dragging = ''
        el!.dataset.livre = ''
      }
      el!.scrollLeft = drag.left - dx
    }

    function onDragEnd() {
      if (!drag) return
      const moved = drag.moved
      drag = null
      if (!moved) return
      swallowClick = true
      setTimeout(() => (swallowClick = false), 0)
      // sem centralizar: fica onde o arraste deixou (data-livre segura o snap desligado até as setas)
      dragEndTimer = setTimeout(() => delete el!.dataset.dragging, 60)
    }

    function onClickCapture(e: MouseEvent) {
      if (!swallowClick) return
      e.preventDefault()
      e.stopPropagation()
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    el.addEventListener('pointerdown', markUser, { passive: true })
    el.addEventListener('touchstart', markUser, { passive: true })
    el.addEventListener('wheel', markUser, { passive: true })
    if (mouseDrag) {
      el.addEventListener('pointerdown', onDragStart)
      el.addEventListener('pointermove', onDragMove)
      el.addEventListener('pointerup', onDragEnd)
      el.addEventListener('pointercancel', onDragEnd)
      el.addEventListener('click', onClickCapture, true)
    }
    return () => {
      el.removeEventListener('pointerdown', onDragStart)
      el.removeEventListener('pointermove', onDragMove)
      el.removeEventListener('pointerup', onDragEnd)
      el.removeEventListener('pointercancel', onDragEnd)
      el.removeEventListener('click', onClickCapture, true)
      clearTimeout(dragEndTimer)
      ro.disconnect()
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('pointerdown', markUser)
      el.removeEventListener('touchstart', markUser)
      el.removeEventListener('wheel', markUser)
      clearTimeout(settleTimer.current)
    }
  }, [count, container, mouseDrag])

  // setas (desktop): centraliza o vizinho com scroll suave; o reposicionamento do loop acontece no onScroll
  function step(dir: 1 | -1) {
    const el = elRef.current
    const item = itemsRef.current[closestIndex() + dir]
    if (!el || !item) return
    userScrolled.current = true
    el.scrollTo({ left: layoutCenter(el, item) - el.clientWidth / 2, behavior: 'smooth' })
    // depois de um arraste o snap estava desligado: volta quando a rolagem suave assentar (já centralizado, sem pulo)
    if (el.dataset.livre !== undefined) {
      clearTimeout(livreTimer.current)
      livreTimer.current = setTimeout(() => delete el.dataset.livre, 500)
    }
  }

  return { containerRef, container, registerItem, activeIndex, step }
}

/** Key estável de um item do carrossel com `copias`: a cópia única e a cópia do meio têm as mesmas keys. */
export function chaveDaCopia(base: string, i: number, count: number, copias: 1 | 3) {
  const bloco = Math.floor(i / count) - (copias === 3 ? 1 : 0)
  return `${base}:${bloco}`
}

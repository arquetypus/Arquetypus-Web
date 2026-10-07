import { useEffect, type RefObject } from 'react'

/**
 * Arrastar com o mouse num trilho horizontal com overflow (desktop). Toque e trackpad seguem com o scroll nativo; o
 * mouse não rola na horizontal sozinho, então o arraste move o `scrollLeft` na mão. Pra não ficar travado:
 * - durante o arraste, o snap e o scroll suave ficam desligados e os cards não reagem a hover (`data-dragging`, ver
 *   index.css);
 * - ao soltar, o trilho continua com a velocidade do gesto e vai freando (inércia) e PARA ONDE PAROU: depois de um
 *   arraste o encaixe (snap) fica desligado (`data-livre`), pra não puxar o trilho de volta; ele volta quando alguém
 *   usa as setas (`rolarTrilho`), que já levam o trilho alinhado a um card;
 * - o clique do fim do arraste é engolido (não abre o card). Folga de 5 px: clique trêmulo continua sendo clique.
 */
export function useArrasteMouse(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let drag: { x: number; left: number; moved: boolean; id: number } | null = null
    // últimas posições do gesto, pra calcular a velocidade na hora de soltar
    let amostras: { x: number; t: number }[] = []
    let engolirClique = false
    let quadro = 0
    let fimTimer: ReturnType<typeof setTimeout> | undefined

    const parar = () => {
      cancelAnimationFrame(quadro)
      clearTimeout(fimTimer)
    }

    function inicio(e: PointerEvent) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      // sem isso o navegador começa a arrastar a imagem/selecionar texto em vez do trilho
      e.preventDefault()
      parar()
      drag = { x: e.clientX, left: el!.scrollLeft, moved: false, id: e.pointerId }
      amostras = [{ x: e.clientX, t: performance.now() }]
    }
    function mover(e: PointerEvent) {
      if (!drag) return
      const dx = e.clientX - drag.x
      if (!drag.moved) {
        if (Math.abs(dx) < 5) return
        drag.moved = true
        el!.setPointerCapture(drag.id)
        el!.dataset.dragging = ''
        el!.dataset.livre = ''
      }
      el!.scrollLeft = drag.left - dx
      const agora = performance.now()
      amostras.push({ x: e.clientX, t: agora })
      // só os últimos ~100 ms contam pra velocidade
      while (amostras.length > 2 && agora - amostras[0].t > 100) amostras.shift()
    }
    function fim() {
      if (!drag) return
      const moved = drag.moved
      drag = null
      if (!moved) return
      engolirClique = true
      setTimeout(() => (engolirClique = false), 0)

      // velocidade do gesto em px/ms (positiva = trilho anda pra direita)
      const a = amostras[0]
      const b = amostras[amostras.length - 1]
      let v = b && a && b.t > a.t ? -(b.x - a.x) / (b.t - a.t) : 0
      let anterior = performance.now()
      const passo = (agora: number) => {
        const dt = Math.min(32, agora - anterior)
        anterior = agora
        el!.scrollLeft += v * dt
        v *= Math.pow(0.94, dt / 16) // atrito
        const noLimite = el!.scrollLeft <= 0 || el!.scrollLeft >= el!.scrollWidth - el!.clientWidth - 1
        if (Math.abs(v) > 0.05 && !noLimite) quadro = requestAnimationFrame(passo)
        else delete el!.dataset.dragging
      }
      quadro = requestAnimationFrame(passo)
    }
    function clique(e: MouseEvent) {
      if (!engolirClique) return
      e.preventDefault()
      e.stopPropagation()
    }
    // roda do mouse / trackpad interrompe a inércia
    const interromper = () => {
      if (!drag && el.dataset.dragging !== undefined) {
        parar()
        delete el.dataset.dragging
      }
    }

    el.addEventListener('pointerdown', inicio)
    el.addEventListener('pointermove', mover)
    el.addEventListener('pointerup', fim)
    el.addEventListener('pointercancel', fim)
    el.addEventListener('click', clique, true)
    el.addEventListener('wheel', interromper, { passive: true })
    return () => {
      el.removeEventListener('pointerdown', inicio)
      el.removeEventListener('pointermove', mover)
      el.removeEventListener('pointerup', fim)
      el.removeEventListener('pointercancel', fim)
      el.removeEventListener('click', clique, true)
      el.removeEventListener('wheel', interromper)
      parar()
    }
  }, [ref])
}

/**
 * Setas de um trilho com arraste: andam ~3/4 da largura e param alinhadas ao início de um card (como o snap), com
 * rolagem suave e o snap ainda desligado; quando termina, o encaixe volta (`data-livre` sai) sem pulo — já está
 * alinhado. Use no lugar de `scrollBy` nos botões de seta.
 */
export function rolarTrilho(el: HTMLElement | null, dir: 1 | -1) {
  if (!el) return
  const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0
  const base = el.getBoundingClientRect().left
  const atual = el.scrollLeft
  const desejado = atual + dir * el.clientWidth * 0.75
  const max = el.scrollWidth - el.clientWidth
  // inícios dos cards em coordenadas de scroll; fica com o mais perto do desejado, sempre andando na direção da seta
  const inicios = (Array.from(el.children) as HTMLElement[]).map((c) => c.getBoundingClientRect().left - base + atual - pad)
  const candidatos = inicios.filter((x) => (dir > 0 ? x > atual + 2 : x < atual - 2))
  const alvo = candidatos.length
    ? candidatos.reduce((m, x) => (Math.abs(x - desejado) < Math.abs(m - desejado) ? x : m))
    : dir > 0
      ? max
      : 0
  el.dataset.livre = ''
  el.scrollTo({ left: Math.max(0, Math.min(max, alvo)), behavior: 'smooth' })
  clearTimeout(Number(el.dataset.livreTimer))
  el.dataset.livreTimer = String(window.setTimeout(() => {
    delete el.dataset.livre
    delete el.dataset.livreTimer
  }, 500))
}

import { useEffect, useRef, useState } from 'react'

/**
 * Liga/desliga todas as tags de proporção do site (apoio ao time de design).
 * Desligar antes do lançamento.
 */
export const SHOW_RATIO_TAGS = true

const COMMON: [number, number][] = [
  [1, 1], [4, 5], [5, 4], [3, 4], [4, 3], [2, 3], [3, 2],
  [9, 16], [16, 9], [16, 10], [10, 16], [21, 9], [1, 2], [2, 1],
]

function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a
}

/** Proporção legível [a, b]: a comum mais próxima (até 1,5% de diferença) ou w:h reduzido. */
function ratioOf(w: number, h: number): [number, number] {
  const r = w / h
  for (const [a, b] of COMMON) if (Math.abs(r / (a / b) - 1) < 0.015) return [a, b]
  const W = Math.round(w)
  const H = Math.round(h)
  const g = gcd(W, H)
  return [W / g, H / g]
}

/**
 * Resolução de entrega do asset, no padrão dos requisitos do projeto:
 * 1:1 → 1200×1200 · 9:16/16:9 → 1080×1920 · retrato → altura 2000 · paisagem → largura 1600.
 */
export function productionSize(a: number, b: number): [number, number] {
  if (a === b) return [1200, 1200]
  if (a === 9 && b === 16) return [1080, 1920]
  if (a === 16 && b === 9) return [1920, 1080]
  if (a < b) return [Math.round((2000 * a) / b), 2000]
  return [1600, Math.round((1600 * b) / a)]
}

/** "4:5 · 1600×2000" — proporção + resolução de entrega. */
export function ratioLabel(w: number, h: number) {
  if (!w || !h) return ''
  const [a, b] = ratioOf(w, h)
  const [pw, ph] = productionSize(a, b)
  return `${a}:${b} · ${pw}×${ph}`
}

/**
 * Selo discreto (marca d'água) com a proporção da caixa onde a imagem aparece.
 * Mede o elemento pai — que precisa ser `relative` e ter o tamanho da imagem —,
 * então reflete o recorte real na tela. Some em caixas com menos de 80px.
 */
export function RatioTag({
  className = 'top-2 right-2',
  title,
  label: fixedLabel,
}: {
  className?: string
  title?: string
  /** rótulo fixo, pra caixas de proporção variável (ex.: hero em tela cheia) */
  label?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [label, setLabel] = useState('')

  useEffect(() => {
    const parent = ref.current?.parentElement
    if (!parent) return
    const update = () => {
      const { width, height } = parent.getBoundingClientRect()
      setLabel(width < 80 || height < 80 ? '' : (fixedLabel ?? ratioLabel(width, height)))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(parent)
    return () => ro.disconnect()
  }, [fixedLabel])

  if (!SHOW_RATIO_TAGS) return null

  return (
    <span
      ref={ref}
      aria-hidden
      title={title}
      className={`pointer-events-none absolute z-30 rounded-sm bg-noite/30 px-1.5 py-0.5 font-mono text-[8px] leading-none tracking-[0.12em] text-papel-inv/75 backdrop-blur-[2px] select-none ${label ? '' : 'invisible'} ${className}`}
    >
      {label || '0:0'}
    </span>
  )
}

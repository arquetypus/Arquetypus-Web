import type { CSSProperties } from 'react'

// posições/tamanhos "aleatórios" mas fixos (mesma semente sempre) — não mudam a cada render nem no SSR
function seeded(n: number) {
  let s = 1234567
  const rand = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
  return Array.from({ length: n }, () => ({
    left: rand() * 100,
    top: 20 + rand() * 80,
    size: 1 + rand() * 2.2,
    opacity: 0.2 + rand() * 0.3,
    dur: 6 + rand() * 7,
    delay: -rand() * 12,
    dx: (rand() - 0.5) * 40,
  }))
}

const PARTICLES = seeded(44)

/**
 * Brasas: granulado dourado sutil que sobe devagar e se apaga, como fagulhas de fogo.
 * Preenche o elemento pai (precisa ser `relative`). Com movimento reduzido, os pontos ficam parados.
 */
export function Embers({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute overflow-hidden ${className}`}>
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="ember absolute rounded-full"
          style={
            {
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              background: i % 3 === 0 ? '#f6d9a0' : 'var(--color-latao)',
              boxShadow: `0 0 ${p.size * 3}px ${p.size * 0.8}px color-mix(in srgb, #f0b35a 40%, transparent)`,
              '--o': p.opacity,
              '--dx': `${p.dx}px`,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

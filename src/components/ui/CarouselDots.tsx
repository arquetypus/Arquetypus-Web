/** Indicador em pílulas dos carrosséis — mesmo desenho em todos (origem: carrossel do catálogo). */
export function CarouselDots({
  count,
  active,
  tone = 'light',
  className = 'mt-5',
}: {
  count: number
  active: number
  tone?: 'light' | 'dark'
  className?: string
}) {
  const inactive =
    tone === 'dark'
      ? 'color-mix(in srgb, var(--color-papel-inv) 25%, transparent)'
      : 'var(--color-linha-2)'

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="h-[3px] w-5 rounded-full transition-colors duration-300"
          style={{ background: i === active ? 'var(--color-latao)' : inactive }}
        />
      ))}
    </div>
  )
}

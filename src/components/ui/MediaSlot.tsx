/**
 * Placeholder de mídia — não há fotografia/vídeo real ainda (ver
 * CLAUDE.md, pendências). Mostra o requisito de produção no lugar do
 * asset, como o protótipo v6 faz com `.slot`/`.req`.
 */
export function MediaSlot({
  aspect = '4/5',
  bg = 'var(--color-papel-3)',
  requisito,
  className = '',
  dark = false,
}: {
  aspect?: string
  bg?: string
  requisito: string
  className?: string
  dark?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg border border-dashed px-4 text-center font-mono text-[10px] leading-relaxed ${
        dark ? 'border-papel-inv/15 text-papel-inv/30' : 'border-linha-2 text-tinta-3'
      } ${className}`}
      style={{ aspectRatio: aspect === 'auto' ? undefined : aspect, background: bg }}
    >
      {requisito}
    </div>
  )
}

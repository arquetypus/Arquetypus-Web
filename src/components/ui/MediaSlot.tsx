/**
 * Placeholder de mídia — mostra o requisito de produção no lugar do
 * asset, como o protótipo v6 faz com `.slot`/`.req`. Quando `src` é
 * passado, mostra uma imagem-base (mock gerado, não é still real da
 * Scentec) com o requisito como legenda por cima — ver CLAUDE.md.
 */
export function MediaSlot({
  aspect = '4/5',
  bg = 'var(--color-papel-3)',
  requisito,
  className = '',
  dark = false,
  src,
}: {
  aspect?: string
  bg?: string
  requisito: string
  className?: string
  dark?: boolean
  src?: string
}) {
  if (src) {
    return (
      <div
        className={`relative overflow-hidden rounded-lg border border-dashed ${
          dark ? 'border-papel-inv/15' : 'border-linha-2'
        } ${className}`}
        style={{ aspectRatio: aspect === 'auto' ? undefined : aspect }}
      >
        <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <p
          className={`absolute inset-x-0 top-0 z-30 truncate px-2 py-1.5 font-mono text-[9px] font-medium tracking-wide ${
            dark ? 'bg-noite/75 text-papel-inv' : 'bg-tinta/75 text-papel'
          }`}
        >
          {requisito}
        </p>
      </div>
    )
  }

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

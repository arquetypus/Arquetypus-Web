import { RatioTag } from '@/components/ui/RatioTag'

/**
 * Placeholder de mídia — mostra o requisito de produção no lugar do
 * asset, como o protótipo v6 faz com `.slot`/`.req`. Quando `src` é
 * passado, mostra uma imagem-base (mock gerado, não é still real da
 * Scentec) com a proporção num selo discreto (RatioTag); o requisito
 * completo fica no tooltip do selo — ver CLAUDE.md.
 */
export function MediaSlot({
  aspect = '4/5',
  bg = 'var(--color-papel-3)',
  requisito,
  className = '',
  dark = false,
  src,
  tagClassName,
  tagLabel,
}: {
  aspect?: string
  bg?: string
  requisito: string
  className?: string
  dark?: boolean
  src?: string
  tagClassName?: string
  tagLabel?: string
}) {
  if (src) {
    return (
      <div
        className={`relative overflow-hidden rounded-lg ${className}`}
        style={{ aspectRatio: aspect === 'auto' ? undefined : aspect }}
      >
        <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <RatioTag className={tagClassName} title={requisito} label={tagLabel} />
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

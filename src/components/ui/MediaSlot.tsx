import { RatioTag } from '@/components/ui/RatioTag'
import type { Foto } from '@/lib/foto'

/**
 * Placeholder de mídia — mostra o requisito de produção no lugar do
 * asset, como o protótipo v6 faz com `.slot`/`.req`. Quando `src` é
 * passado, mostra uma imagem-base (mock gerado, não é still real da
 * Scentec) com a proporção num selo discreto (RatioTag); o requisito
 * completo fica no tooltip do selo — ver CLAUDE.md.
 *
 * `srcDesktop` é a segunda fonte pra lg+ (quando a proporção vertical do
 * celular não serve no desktop); sem ela, o desktop usa `src`.
 *
 * `alt` é obrigatório (out/2026), pra toda foto nova passar por uma decisão: texto que descreve a foto quando ela
 * é conteúdo (produto, pessoa com o produto), ou `alt=""` explícito pra foto decorativa ou já dita pelo texto ao
 * lado. Sem foto (placeholder), o `alt` não é usado — passar `alt=""`.
 *
 * `prioridade` (out/2026): por padrão a foto só baixa perto da tela (`loading="lazy"`). Foto da primeira tela
 * (topo da página, 1ª foto da galeria) passa `prioridade` — baixa de cara e com prioridade alta.
 *
 * `src`/`srcDesktop` aceitam `Foto` (import `?responsiva`, lib/foto.ts): sai com `srcset` e o navegador baixa a
 * largura que serve. `sizes` diz a largura da foto na tela (padrão: tela inteira).
 */
export function MediaSlot({
  aspect = '4/5',
  bg = 'var(--color-papel-3)',
  requisito,
  className = '',
  dark = false,
  src,
  srcDesktop,
  tagClassName,
  tagLabel,
  alt,
  prioridade = false,
  sizes = '100vw',
}: {
  aspect?: string
  bg?: string
  requisito: string
  className?: string
  dark?: boolean
  src?: string | Foto
  srcDesktop?: string | Foto
  tagClassName?: string
  tagLabel?: string
  alt: string
  prioridade?: boolean
  sizes?: string
}) {
  if (src) {
    const f = typeof src === 'string' ? { src, srcSet: '' } : src
    const d = typeof srcDesktop === 'string' ? { src: srcDesktop, srcSet: '' } : srcDesktop
    return (
      <div
        className={`relative overflow-hidden rounded-lg ${className}`}
        style={{ aspectRatio: aspect === 'auto' ? undefined : aspect }}
      >
        <picture>
          {d && <source media="(min-width: 1024px)" srcSet={d.srcSet || d.src} sizes={d.srcSet ? sizes : undefined} />}
          <img
            src={f.src}
            srcSet={f.srcSet || undefined}
            sizes={f.srcSet ? sizes : undefined}
            alt={alt}
            loading={prioridade ? 'eager' : 'lazy'}
            fetchPriority={prioridade ? 'high' : undefined}
            className="absolute inset-0 h-full w-full object-cover" />
        </picture>
        <RatioTag className={tagClassName} title={requisito} label={tagLabel} />
      </div>
    )
  }

  return (
    <div
      className={`flex items-center justify-center rounded-lg border border-dashed px-4 text-center font-label text-[10px] leading-relaxed ${
        dark ? 'border-papel-inv/15 text-papel-inv/30' : 'border-linha-2 text-tinta-3'
      } ${className}`}
      style={{ aspectRatio: aspect === 'auto' ? undefined : aspect, background: bg }}
    >
      {requisito}
    </div>
  )
}

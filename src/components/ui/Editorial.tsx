import type { CSSProperties, ReactNode } from 'react'
import { Eyebrow } from '@/components/ui/Eyebrow'
import florArquetypus from '@/assets/brand/flor-arquetypus.png?responsiva'
import { foto } from '@/lib/foto'

const florFoto = foto(florArquetypus)
/** Atributos da flor-marca d'água (várias larguras; aparece com até 440 px). Espalhar no <img>: {...FLOR_IMG}. */
export const FLOR_IMG = { src: florFoto.src, srcSet: florFoto.srcSet || undefined, sizes: '(min-width: 1024px) 440px, 60vw' }

/**
 * Peças da linguagem visual da home reaproveitadas nas páginas internas (Criadores, PDP).
 *
 * Degrau: seções escuras "sobem" por cima da anterior (sombra + filete latão no topo) e as claras
 * ficam "abaixo" (sombra interna no topo).
 */
export const DEGRAU_ESCURO: CSSProperties = {
  boxShadow: '0 -14px 26px -10px rgba(37,46,40,0.5), 0 -4px 8px -3px rgba(37,46,40,0.35)',
  borderTop: '1px solid color-mix(in srgb, var(--color-latao) 70%, transparent)',
}
export const DEGRAU_CLARO: CSSProperties = {
  boxShadow: 'inset 0 26px 28px -20px rgba(40,46,41,0.4), inset 0 8px 10px -7px rgba(40,46,41,0.28)',
}

/** Halo dourado desfocado, como os da seção "A diferença" e do catálogo. */
export function Glow({ className, forca = 16 }: { className: string; forca?: number }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{
        background: `radial-gradient(closest-side, color-mix(in srgb, var(--color-latao) ${forca}%, transparent), transparent)`,
        filter: 'blur(26px)',
      }}
    />
  )
}

/** Flor da marca como marca d'água, cortada pela borda da seção. */
export function Flor({ style }: { style: CSSProperties }) {
  return (
    <img loading="lazy"
      {...FLOR_IMG}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute select-none"
      style={{
        height: 'auto',
        opacity: 0.14,
        maskImage: 'radial-gradient(closest-side, black 55%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(closest-side, black 55%, transparent 100%)',
        ...style,
      }}
    />
  )
}

/** Eyebrow com filete — padrão das seções da home. `dark` usa o latão claro sobre fundo noite. */
export function SectionEyebrow({ children, dark = false, center = false }: { children: ReactNode; dark?: boolean; center?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${center ? 'justify-center' : ''}`}>
      <span aria-hidden className="h-px w-6 bg-latao" />
      <Eyebrow className={dark ? 'text-latao' : undefined}>{children}</Eyebrow>
      {center && <span aria-hidden className="h-px w-6 bg-latao" />}
    </div>
  )
}

/** Ornamento: filete dourado com losango. */
export function Ornament({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`flex items-center gap-2 ${className}`}>
      <span className="h-px flex-1 bg-latao/60" />
      <span className="size-1 rotate-45 bg-latao" />
      <span className="h-px flex-1 bg-latao/60" />
    </div>
  )
}

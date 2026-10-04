import { comissaoTexto } from '@/data/economics'
import type { Archetype } from '@/types/archetype'

/**
 * Peças comuns às direções com estrutura própria (Oráculo, Galeria, Manifesto, Cinema — ver lib/theme.ts).
 * Todo texto de produto vem de data/; preço, Pix e parcelas sempre visíveis junto do produto (regra 7).
 */

export type Filtro = 'ALL' | 'F' | 'M' | 'U'
export type CatalogProps = {
  items: Archetype[]
  filtro: Filtro
  setFiltro: (f: Filtro) => void
  filtros: { key: Filtro; label: string }[]
}

export const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
export const pix = (v: number) => v * 0.95
export const parcela = (v: number) => v / 6

const ROMANOS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']
/** "ARQ-07" → "VII" (numeração de arcano das cartas do Oráculo) */
export function romano(cod: string): string {
  const n = Number(cod.replace(/\D/g, ''))
  return ROMANOS[n - 1] ?? String(n)
}
/** "ARQ-07" → "07" */
export const numero = (cod: string) => cod.replace(/\D/g, '')

/** Abas de filtro do catálogo — a aparência muda por direção via `on`/`off`. */
export function FilterTabs({
  filtro,
  setFiltro,
  filtros,
  className = '',
  on,
  off,
  base,
}: Pick<CatalogProps, 'filtro' | 'setFiltro' | 'filtros'> & { className?: string; on: string; off: string; base: string }) {
  return (
    <div className={`no-scrollbar flex gap-2 overflow-x-auto overflow-y-hidden ${className}`} role="tablist" aria-label="Filtrar catálogo">
      {filtros.map((f) => (
        <button
          key={f.key}
          type="button"
          role="tab"
          aria-selected={filtro === f.key}
          onClick={() => setFiltro(f.key)}
          className={`shrink-0 cursor-pointer transition-colors ${base} ${filtro === f.key ? on : off}`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------------------------------------------
   Página inteira das direções: hero e catálogo chegam prontos (podem vir de outra direção, ver "Misturar"),
   o resto das seções cada direção desenha do seu jeito, com o conteúdo de data/ (HOME_COPY e afins).
   --------------------------------------------------------------------------------------------------- */

export type DirectionPageProps = {
  catalog: React.ReactNode
  /** clique num card de coleção: filtra o catálogo pelo segmento e rola até ele */
  onSegment: (seg: 'F' | 'M' | 'U') => void
  /** clique em família/energia/CTA: rola até o catálogo */
  toCatalog: () => void
  /** arquétipo em destaque (FEATURED_ID no HomePage) e a foto dele */
  featured: Archetype
  featuredImg: string
}

const SEAL_ICON_PATHS: Record<string, string> = {
  'Entrega garantida': 'M3 7h11v8H3V7Zm11 3h3.5L20 13v2h-3M6 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  'Rápido e seguro': 'M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Zm-3 8.5 2 2 4-4.5',
  Vegano: 'M12 21c-4-1-7-4.5-7-10 5 0 8 2 9 6 1-4 4-6 9-6 0 5.5-3 9-7 10a4 4 0 0 1-4 0Z',
  'Cruelty free': 'M12 20s-7-4.35-7-9.5A4 4 0 0 1 12 8a4 4 0 0 1 7 2.5C19 15.65 12 20 12 20Z',
}

export function SealIcon({ seal, className }: { seal: string; className?: string }) {
  const d = SEAL_ICON_PATHS[seal]
  if (!d) return null
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={d} />
    </svg>
  )
}

/** Indicadores da seção de criadores — comissão vem de ECON (hipótese, ver CLAUDE.md). */
export const CREATOR_STATS = [
  { valor: comissaoTexto, label: 'de comissão por venda' },
  { valor: 'Grátis', label: 'amostra para aprovados' },
  { valor: 'D+30', label: 'pagamento via Pix' },
]

/** Links do rodapé — Trocas e Termos sem página ainda: visíveis, não clicáveis (mesmo critério do Drawer). */
export const FOOTER_EXPLORE = [
  { label: 'Os 9 arquétipos', to: '/#catalogo' },
  { label: 'Diário olfativo', to: '/#diario' },
  { label: 'Seja criador', to: '/criadores' },
]
export const FOOTER_SOON = ['Trocas e devoluções', 'Termos']

/** Formulário do cupom: sem backend ainda, o submit não envia nada (ver CLAUDE.md). */
export function preventSubmit(e: React.FormEvent) {
  e.preventDefault()
}

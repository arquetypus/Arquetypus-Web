import type { Archetype, FamiliaSlug } from '@/types/archetype'
import { ARCHETYPES } from '@/data/archetypes'
import { FAMILIAS } from '@/data/families'
import { getReview, SHOW_RATINGS } from '@/lib/reviews'

/**
 * Filtros do catálogo da home (out/2026): família olfativa, energia, notas e ordem, além das abas de gênero.
 * Dentro de um grupo vale "ou" (Baunilha ou Âmbar), entre grupos vale "e" (Florais e Sedução).
 * Tudo sai dos dados — família de `familias`, energia de `energia`, notas das pirâmides (fórmula da Scentec).
 */
export type Ordem = 'destaque' | 'avaliacao' | 'avaliacoes' | 'nome'

export interface FiltrosCatalogo {
  familias: FamiliaSlug[]
  energias: string[]
  notas: string[]
  ordem: Ordem
}

export const FILTROS_VAZIOS: FiltrosCatalogo = { familias: [], energias: [], notas: [], ordem: 'destaque' }

const semAcento = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/**
 * Grupos de notas, casados por palavra nas pirâmides (topo + coração + fundo) — um arquétipo entra num grupo se
 * alguma nota da fórmula bate. Nota nova na fórmula que não case com nenhum grupo só não aparece no filtro.
 * Regras da marca: nunca "Oriental" nem "Aquático".
 */
const GRUPOS_NOTAS: { id: string; nome: string; re: RegExp }[] = [
  { id: 'citricos', nome: 'Cítricos', re: /\b(bergamota|tangerina|mandarina|limao|toranja)\b/ },
  { id: 'frutas', nome: 'Frutas', re: /\b(lichia|groselha|ruibarbo|pera|ameixa|cassis|damasco|nectarina|pessego|maca|melao)\b/ },
  { id: 'rosa', nome: 'Rosa', re: /\brosa\b/ },
  { id: 'jasmim', nome: 'Jasmim', re: /\bjasmim\b/ },
  { id: 'flor-de-laranjeira', nome: 'Flor de laranjeira', re: /laranjeira|neroli/ },
  { id: 'baunilha', nome: 'Baunilha', re: /\bbaunilha\b/ },
  { id: 'ambar', nome: 'Âmbar', re: /ambar|amber|ambrox/ },
  { id: 'almiscar', nome: 'Almíscar', re: /\balmiscar\b/ },
  { id: 'madeiras', nome: 'Madeiras', re: /cedro|sandalo|vetiver|gaiaco|madeira|amadeirad|akigalawood|cashmeran|abeto/ },
  { id: 'especiarias', nome: 'Especiarias', re: /canela|cardamomo|pimenta|noz-moscada|gengibre|acafrao|picante/ },
  { id: 'patchouli', nome: 'Patchouli', re: /\bpatchouli\b/ },
]

const NOTAS_POR_ID: Record<string, string[]> = Object.fromEntries(
  ARCHETYPES.map((a) => {
    const texto = semAcento([a.topo, a.coracao, a.fundo].join(', '))
    return [a.id, GRUPOS_NOTAS.filter((g) => g.re.test(texto)).map((g) => g.id)]
  }),
)

/** opções de cada grupo, na ordem em que aparecem no painel (só as que têm algum arquétipo) */
export const OPCOES = {
  familias: FAMILIAS.map((f) => ({ id: f.slug, nome: f.nome })),
  energias: [...new Set(ARCHETYPES.map((a) => a.energia))].map((e) => ({ id: e, nome: e })),
  notas: GRUPOS_NOTAS.filter((g) => ARCHETYPES.some((a) => NOTAS_POR_ID[a.id].includes(g.id))).map((g) => ({ id: g.id, nome: g.nome })),
  ordens: [
    { id: 'destaque' as const, nome: 'Em destaque' },
    ...(SHOW_RATINGS
      ? [
          { id: 'avaliacao' as const, nome: 'Mais bem avaliados' },
          { id: 'avaliacoes' as const, nome: 'Mais avaliações' },
        ]
      : []),
    { id: 'nome' as const, nome: 'Nome (A–Z)' },
  ],
}

export const nomeDaOpcao = (grupo: 'familias' | 'energias' | 'notas', id: string) =>
  OPCOES[grupo].find((o) => o.id === id)?.nome ?? id

/** quantos filtros estão ligados (a ordem não conta) */
export const contarFiltros = (f: FiltrosCatalogo) => f.familias.length + f.energias.length + f.notas.length

export function aplicarFiltros(lista: Archetype[], f: FiltrosCatalogo): Archetype[] {
  const filtrada = lista.filter(
    (a) =>
      (f.familias.length === 0 || a.familias.some((s) => f.familias.includes(s))) &&
      (f.energias.length === 0 || f.energias.includes(a.energia)) &&
      (f.notas.length === 0 || NOTAS_POR_ID[a.id]?.some((n) => f.notas.includes(n))),
  )
  if (f.ordem === 'destaque') return filtrada
  const nota = (a: Archetype) => getReview(a.id)?.rating ?? 0
  const qtd = (a: Archetype) => getReview(a.id)?.count ?? 0
  return [...filtrada].sort((x, y) =>
    f.ordem === 'nome'
      ? x.nome.localeCompare(y.nome, 'pt-BR')
      : f.ordem === 'avaliacao'
        ? nota(y) - nota(x) || qtd(y) - qtd(x)
        : qtd(y) - qtd(x),
  )
}

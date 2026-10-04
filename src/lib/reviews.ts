import REVIEWS_JSON from '@/data/reviews.json'

/**
 * Avaliações por arquétipo (out/2026). Hoje vêm de data/reviews.json, atualizado à mão; a ideia é trocar
 * só este arquivo quando houver API (Judge.me ou outra) — os componentes leem por getReview(id) e não
 * sabem de onde vem o dado.
 *
 * SHOW_RATINGS liga/desliga as estrelas no site inteiro. Regra da marca (CLAUDE.md): nota e contagem só
 * no ar com avaliação real de cliente por trás.
 */
export const SHOW_RATINGS = true

export interface ReviewItem {
  author: string
  rating: number
  date: string
  title?: string
  body: string
}

export interface ReviewSummary {
  rating: number
  count: number
  items: ReviewItem[]
}

const REVIEWS = REVIEWS_JSON as Record<string, ReviewSummary>

/** Resumo de avaliações do arquétipo, ou null se não houver (count 0 = sem avaliação ainda). */
export function getReview(id: string): ReviewSummary | null {
  const r = REVIEWS[id]
  return r && r.count > 0 ? r : null
}

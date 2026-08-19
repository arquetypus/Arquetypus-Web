import { QUIZ_QUESTIONS } from '@/data/quiz'
import { ARCHETYPES_BY_ID, segmentPool } from '@/data/archetypes'
import type { QuizResult } from '@/types/archetype'

export type Segmento = 'F' | 'M' | 'todos'

/**
 * O passo de segmentação filtra o pool ANTES de pontuar, então o teste
 * nunca devolve um SKU que a pessoa não compraria (ver v6, "Como o quiz
 * pontua"). As respostas ficam fora do pool e não contam pontos.
 */
export function computeResult(
  segmento: Segmento,
  respostas: number[],
): QuizResult {
  const pool = segmentPool(segmento)
  const poolIds = new Set(pool.map((a) => a.id))

  const score: Record<string, number> = {}
  respostas.forEach((opcaoIndex, perguntaIndex) => {
    const opcao = QUIZ_QUESTIONS[perguntaIndex]?.opcoes[opcaoIndex]
    if (!opcao) return
    for (const [id, pontos] of Object.entries(opcao.pontos)) {
      if (!poolIds.has(id) || pontos == null) continue
      score[id] = (score[id] ?? 0) + pontos
    }
  })

  const rank = pool
    .map((a) => ({ id: a.id, pontos: score[a.id] ?? 0 }))
    .sort((a, b) => b.pontos - a.pontos)

  const [primeiro, segundo] = rank
  const total = primeiro.pontos + (segundo?.pontos ?? 0) || 1

  return {
    dominante: ARCHETYPES_BY_ID[primeiro.id],
    secundario: ARCHETYPES_BY_ID[segundo?.id ?? primeiro.id],
    percentualDominante: Math.round((primeiro.pontos / total) * 100),
  }
}

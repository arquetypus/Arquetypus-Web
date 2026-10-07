/**
 * Geometria das ilustrações da pirâmide olfativa (out/2026): fotos geradas por IA no Higgsfield
 * (GPT Image 2.5), uma por arquétipo, em `assets/fotos/pdp-piramide-3d/{id}.jpg` — pirâmide 3D de cristal com bordas
 * douradas, fatiada em três camadas com os ingredientes de cada uma dentro, sobre fundo bege liso (trocado pela cor
 * exata da seção, papel-2 do Âmbar #ebe1d3, ao salvar). Medidas da silhueta: base = altura das pontas da base. As linhas que ligam o texto a cada faixa (PDP) usam
 * estas medidas, em % da altura/largura da imagem, tiradas da própria imagem (linhas douradas detectadas por script).
 *
 * apice: topo do triângulo · l1/l2: divisões entre topo/coração e coração/base · base: base do triângulo ·
 * meiaBase: meia largura da base (do centro até a ponta).
 */
export interface GeometriaPiramide {
  apice: number
  l1: number
  l2: number
  base: number
  meiaBase: number
}

export const PIRAMIDE_GEOMETRIA: Record<string, GeometriaPiramide> = {
  afrodite: { apice: 11.5, l1: 36.9, l2: 61, base: 76, meiaBase: 38.1 },
}

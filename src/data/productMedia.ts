import { fotosPorId, urls, type FotoBruta } from '@/lib/foto'

// Fotos 1:1 aprovadas da PDP (arquivo = id do arquétipo). Galeria usa a versão responsiva (`*_FOTO`, várias
// larguras); SEO e quem precisa de uma URL só usam `PDP_FRASCO`/`PDP_LIFESTYLE` (maior versão).
export const PDP_FRASCO_FOTO = fotosPorId(import.meta.glob<FotoBruta>('@/assets/fotos/pdp-frasco/*.jpg', { eager: true, import: 'default', query: '?responsiva' }))
export const PDP_LIFESTYLE_FOTO = fotosPorId(import.meta.glob<FotoBruta>('@/assets/fotos/pdp-lifestyle/*.jpg', { eager: true, import: 'default', query: '?responsiva' }))
// Fotos extras da galeria (out/2026, geradas por IA no Higgsfield, GPT Image 2.5): notas olfativas em volta do frasco,
// o arquétipo ao fundo e a representação do arquétipo de corpo inteiro. Arquétipo sem foto na pasta só não ganha o slide.
export const PDP_NOTAS_FOTO = fotosPorId(import.meta.glob<FotoBruta>('@/assets/fotos/pdp-notas/*.jpg', { eager: true, import: 'default', query: '?responsiva' }))
export const PDP_ARQUETIPO_FOTO = fotosPorId(import.meta.glob<FotoBruta>('@/assets/fotos/pdp-arquetipo/*.jpg', { eager: true, import: 'default', query: '?responsiva' }))
export const PDP_REPRESENTACAO_FOTO = fotosPorId(import.meta.glob<FotoBruta>('@/assets/fotos/pdp-representacao/*.jpg', { eager: true, import: 'default', query: '?responsiva' }))
export const PDP_FRASCO = urls(PDP_FRASCO_FOTO)
export const PDP_LIFESTYLE = urls(PDP_LIFESTYLE_FOTO)

import { fotosPorId, urls, type FotoBruta } from '@/lib/foto'

// Fotos 1:1 aprovadas da PDP (arquivo = id do arquétipo). Galeria usa a versão responsiva (`*_FOTO`, várias
// larguras); SEO e quem precisa de uma URL só usam `PDP_FRASCO`/`PDP_LIFESTYLE` (maior versão).
export const PDP_FRASCO_FOTO = fotosPorId(import.meta.glob<FotoBruta>('@/assets/fotos/pdp-frasco/*.jpg', { eager: true, import: 'default', query: '?responsiva' }))
export const PDP_LIFESTYLE_FOTO = fotosPorId(import.meta.glob<FotoBruta>('@/assets/fotos/pdp-lifestyle/*.jpg', { eager: true, import: 'default', query: '?responsiva' }))
export const PDP_FRASCO = urls(PDP_FRASCO_FOTO)
export const PDP_LIFESTYLE = urls(PDP_LIFESTYLE_FOTO)

import { useParams } from 'react-router-dom'
import { getArchetypeBySlug, productPath } from '@/data/archetypes'
import { ProductPurchase } from '@/components/ProductPurchase'
import { PurchaseSheet } from '@/components/PurchaseSheet'

/**
 * Pop-up de compra do arquétipo, aberto por cima da página atual. É uma rota
 * de verdade (/body-splash/:slug com `state.backgroundLocation`, ver App.tsx): a URL é
 * compartilhável e, acessada direto, abre a PDP completa — o arquétipo nunca
 * fica "só num modal" (regra 6 do CLAUDE.md).
 */
export function ProductSheet() {
  const { slug } = useParams<{ slug: string }>()
  const a = slug ? getArchetypeBySlug(slug) : undefined
  if (!a) return null

  return (
    <PurchaseSheet label={`Comprar ${a.nome}`} fullPageTo={productPath(a)} mostrarLink={false}>
      <ProductPurchase key={a.id} a={a} fullPageTo={productPath(a)} />
    </PurchaseSheet>
  )
}

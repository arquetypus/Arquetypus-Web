import { useParams } from 'react-router-dom'
import { getArchetype } from '@/data/archetypes'
import { ProductPurchase } from '@/components/ProductPurchase'
import { PurchaseSheet } from '@/components/PurchaseSheet'

/**
 * Pop-up de compra do arquétipo, aberto por cima da página atual. É uma rota
 * de verdade (/loja/:id com `state.backgroundLocation`, ver App.tsx): a URL é
 * compartilhável e, acessada direto, abre a PDP completa — o arquétipo nunca
 * fica "só num modal" (regra 6 do CLAUDE.md).
 */
export function ProductSheet() {
  const { id } = useParams<{ id: string }>()
  const a = id ? getArchetype(id) : undefined
  if (!a) return null

  return (
    <PurchaseSheet label={`Comprar ${a.nome}`} fullPageTo={`/loja/${a.id}`}>
      <ProductPurchase key={a.id} a={a} />
    </PurchaseSheet>
  )
}

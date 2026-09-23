import { KitPurchase } from '@/components/KitPurchase'
import { PurchaseSheet } from '@/components/PurchaseSheet'

/** Pop-up de compra do Kit Descoberta — rota /kit-descoberta aberta por cima da página atual (ver App.tsx). */
export function KitSheet() {
  return (
    <PurchaseSheet label="Comprar Kit Descoberta" fullPageTo="/kit-descoberta">
      <KitPurchase />
    </PurchaseSheet>
  )
}

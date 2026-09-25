import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import type { Location } from 'react-router-dom'
import { CartProvider } from '@/context/CartContext'
import { Layout } from '@/components/Layout'
import { RouteTracker } from '@/components/RouteTracker'
import { CookieBanner } from '@/components/CookieBanner'
import { ProductSheet } from '@/components/ProductSheet'
import { HomePage } from '@/pages/HomePage'
import { ProductPage } from '@/pages/ProductPage'
import { CreatorsPage } from '@/pages/CreatorsPage'
import { PrivacyPage } from '@/pages/PrivacyPage'

function RedirectToLoja() {
  const { id } = useParams<{ id: string }>()
  return <Navigate to={`/loja/${id}`} replace />
}

export default function App() {
  const location = useLocation()
  // link com `state.backgroundLocation` abre /loja/:id como pop-up por cima dessa página;
  // sem ele (acesso direto, reload, link compartilhado), a mesma URL é a página completa
  const background = (location.state as { backgroundLocation?: Location } | null)?.backgroundLocation

  return (
    <CartProvider>
      {/* fora do <Routes>: valem pra página e pro pop-up de compra (que fica fora do Layout) */}
      <RouteTracker />
      <CookieBanner />
      <Routes location={background ?? location}>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          {/* página antiga de arquétipo foi descartada: links antigos caem na PDP */}
          <Route path="arquetipos/:id" element={<RedirectToLoja />} />
          <Route path="loja/:id" element={<ProductPage />} />
          {/* Kit Descoberta saiu do ar (set/2026) — KitPage/KitSheet ficam no repo pra religar */}
          <Route path="kit-descoberta" element={<Navigate to="/" replace />} />
          <Route path="criadores" element={<CreatorsPage />} />
          <Route path="privacidade" element={<PrivacyPage />} />
        </Route>
      </Routes>
      {background && (
        <Routes>
          <Route path="loja/:id" element={<ProductSheet />} />
        </Routes>
      )}
    </CartProvider>
  )
}

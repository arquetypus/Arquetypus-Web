import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import type { Location } from 'react-router-dom'
import { CartProvider } from '@/context/CartContext'
import { Layout } from '@/components/Layout'
import { ProductSheet } from '@/components/ProductSheet'
import { KitSheet } from '@/components/KitSheet'
import { HomePage } from '@/pages/HomePage'
import { ProductPage } from '@/pages/ProductPage'
import { KitPage } from '@/pages/KitPage'
import { CreatorsPage } from '@/pages/CreatorsPage'

function RedirectToLoja() {
  const { id } = useParams<{ id: string }>()
  return <Navigate to={`/loja/${id}`} replace />
}

export default function App() {
  const location = useLocation()
  // link com `state.backgroundLocation` abre /loja/:id ou /kit-descoberta como pop-up por cima dessa página;
  // sem ele (acesso direto, reload, link compartilhado), a mesma URL é a página completa
  const background = (location.state as { backgroundLocation?: Location } | null)?.backgroundLocation

  return (
    <CartProvider>
      <Routes location={background ?? location}>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          {/* página antiga de arquétipo foi descartada: links antigos caem na PDP */}
          <Route path="arquetipos/:id" element={<RedirectToLoja />} />
          <Route path="loja/:id" element={<ProductPage />} />
          <Route path="kit-descoberta" element={<KitPage />} />
          <Route path="criadores" element={<CreatorsPage />} />
        </Route>
      </Routes>
      {background && (
        <Routes>
          <Route path="loja/:id" element={<ProductSheet />} />
          <Route path="kit-descoberta" element={<KitSheet />} />
        </Routes>
      )}
    </CartProvider>
  )
}

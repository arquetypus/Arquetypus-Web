import { Route, Routes } from 'react-router-dom'
import { CartProvider } from '@/context/CartContext'
import { Layout } from '@/components/Layout'
import { HomePage } from '@/pages/HomePage'
import { ArchetypePage } from '@/pages/ArchetypePage'
import { ProductPage } from '@/pages/ProductPage'
import { KitPage } from '@/pages/KitPage'
import { CreatorsPage } from '@/pages/CreatorsPage'

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="arquetipos/:id" element={<ArchetypePage />} />
          <Route path="loja/:id" element={<ProductPage />} />
          <Route path="kit-descoberta" element={<KitPage />} />
          <Route path="criadores" element={<CreatorsPage />} />
        </Route>
      </Routes>
    </CartProvider>
  )
}

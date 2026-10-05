import type { ComponentType } from 'react'
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import type { Location } from 'react-router-dom'
import { PAGINAS_PUBLICAS } from '@/data/rotas'
import { CartProvider } from '@/context/CartContext'
import { Layout } from '@/components/Layout'
import { RouteTracker } from '@/components/RouteTracker'
import { RouteSeo } from '@/components/RouteSeo'
import { CookieBanner } from '@/components/CookieBanner'
import { ProductSheet } from '@/components/ProductSheet'
import { HomePage } from '@/pages/HomePage'
import { ProductPage } from '@/pages/ProductPage'
import { CreatorsPage } from '@/pages/CreatorsPage'
import { PrivacyPage } from '@/pages/PrivacyPage'
import { ShippingPage } from '@/pages/ShippingPage'
import { TrocasPage } from '@/pages/TrocasPage'
import { RegrasPage } from '@/pages/RegrasPage'
import { TermosPage } from '@/pages/TermosPage'
import { SobrePage } from '@/pages/SobrePage'
import { FaqPage } from '@/pages/FaqPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

/**
 * Componente de cada página pública de data/rotas.ts (fora a home). As rotas abaixo saem de PAGINAS_PUBLICAS, que
 * também alimenta sitemap.xml, llms.txt, SEO e pré-renderização: página nova entra lá, e o `satisfies` obriga a
 * ligar o componente aqui (sem componente, ou com caminho que não está na lista, o tsc falha).
 */
const PAGINAS = {
  '/criadores': CreatorsPage,
  '/sobre': SobrePage,
  '/perguntas-frequentes': FaqPage,
  '/entrega-e-frete': ShippingPage,
  '/trocas-e-devolucoes': TrocasPage,
  '/regras-do-site': RegrasPage,
  '/privacidade': PrivacyPage,
  '/termos-de-uso': TermosPage,
} satisfies Record<Exclude<(typeof PAGINAS_PUBLICAS)[number]['path'], '/'>, ComponentType>

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
      <RouteSeo />
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
          {/* páginas públicas: lista em data/rotas.ts, componente em PAGINAS — não escrever <Route path> solto aqui */}
          {Object.entries(PAGINAS).map(([path, Pagina]) => (
            <Route key={path} path={path.slice(1)} element={<Pagina />} />
          ))}
          {/* qualquer outro endereço: página 404 com link pra home */}
          <Route path="*" element={<NotFoundPage />} />
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

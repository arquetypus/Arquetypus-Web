import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { matchingPublicRoute, PUBLIC_ROUTES } from './lib/publicRoutes'

const root = document.getElementById('root')!
const background = window.history.state?.usr?.backgroundLocation
const compatible = document.documentElement.dataset.rota === matchingPublicRoute(window.location.pathname, PUBLIC_ROUTES)
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

if (root.hasChildNodes() && document.documentElement.dataset.rota && compatible && !background) {
  hydrateRoot(root, app, {
    onRecoverableError(error, info) {
      console.error('Falha recuperável na hidratação:', error, info.componentStack)
    },
  })
} else {
  // Histórico de pop-up e fallback de outra rota exigem a árvore cliente atual.
  // Commit síncrono libera a ocultação do bootstrap somente com essa árvore pronta.
  flushSync(() => createRoot(root).render(app))
}
document.documentElement.removeAttribute('data-arq-client-render')

import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import { resolveSeo } from '@/lib/seoModel'

export { DEFAULT_HTML_ATTRIBUTES } from '@/lib/theme'

export { PUBLIC_ROUTES as routes } from '@/lib/publicRoutes'

/** Ensaio de build: mesma árvore do cliente, sem efeitos DOM ou coleta global de SEO. */
export function render(url: string, options?: { genericNotFound?: boolean }) {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
  return { html, head: resolveSeo(url, options) }
}

import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import { ARCHETYPES } from '@/data/archetypes'
import { PAGINAS_PUBLICAS } from '@/data/rotas'
import { resolveSeo } from '@/lib/seoModel'

export { DEFAULT_HTML_ATTRIBUTES } from '@/lib/theme'

export const routes = [
  ...PAGINAS_PUBLICAS.map(page => page.path),
  ...ARCHETYPES.map(product => `/loja/${product.id}`),
]

/** Ensaio de build: mesma árvore do cliente, sem efeitos DOM ou coleta global de SEO. */
export function render(url: string) {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
  return { html, head: resolveSeo(url) }
}

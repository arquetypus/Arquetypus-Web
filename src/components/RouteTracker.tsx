import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Envia um `page_view` ao dataLayer na primeira carga e a cada troca de rota
 * (inclusive a abertura do pop-up de compra, que também é rota). Precisa ficar
 * DENTRO do Router.
 */
export function RouteTracker() {
  const { pathname, search } = useLocation()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    const path = pathname + search
    if (lastPath.current === path) return

    // setTimeout: deixa a página nova definir o document.title antes do envio.
    // lastPath só é gravado dentro do timeout, então o StrictMode (dev) não duplica nem perde o evento.
    const id = window.setTimeout(() => {
      lastPath.current = path
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        event: 'page_view',
        page_path: path,
        page_location: window.location.href,
        page_title: document.title,
      })
    }, 0)

    return () => window.clearTimeout(id)
  }, [pathname, search])

  return null
}

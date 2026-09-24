// Consentimento de cookies (LGPD + Google Consent Mode v2)
// Chave, versão e validade precisam bater com o script do index.html.

export const CONSENT_KEY = 'arq_consent'
export const CONSENT_VERSION = 1 // suba para 2 se mudar as categorias: todos veem o banner de novo
const CONSENT_TTL_MS = 365 * 24 * 60 * 60 * 1000 // pede de novo após 12 meses
const OPEN_PREFS_EVENT = 'arq:open-cookie-preferences'

export type ConsentChoice = {
  analytics: boolean
  marketing: boolean
  updatedAt: string
  version: number
}

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

function gtag(..._args: unknown[]) {
  if (typeof window.gtag === 'function') {
    window.gtag(..._args)
    return
  }
  window.dataLayer = window.dataLayer || []
  // gtag.js exige o objeto `arguments`, não um array
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments)
}

export function readConsent(): ConsentChoice | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ConsentChoice
    if (parsed.version !== CONSENT_VERSION) return null
    if (Date.now() - new Date(parsed.updatedAt).getTime() > CONSENT_TTL_MS) return null
    return parsed
  } catch {
    return null
  }
}

export function saveConsent(analytics: boolean, marketing: boolean) {
  const choice: ConsentChoice = {
    analytics,
    marketing,
    updatedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  }

  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(choice))
  } catch {
    // navegação privada sem storage: vale só para esta visita
  }

  const mkt = marketing ? 'granted' : 'denied'
  gtag('consent', 'update', {
    analytics_storage: analytics ? 'granted' : 'denied',
    ad_storage: mkt,
    ad_user_data: mkt,
    ad_personalization: mkt,
  })

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'consent_update',
    consent_analytics: analytics,
    consent_marketing: marketing,
  })
}

/** Reabre o banner (aceitar/recusar). Use no link "Gerenciar cookies" do rodapé. */
export function openCookiePreferences() {
  window.dispatchEvent(new Event(OPEN_PREFS_EVENT))
}

export function onOpenCookiePreferences(handler: () => void) {
  window.addEventListener(OPEN_PREFS_EVENT, handler)
  return () => window.removeEventListener(OPEN_PREFS_EVENT, handler)
}

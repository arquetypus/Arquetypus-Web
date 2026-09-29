import { useSyncExternalStore } from 'react'

/**
 * Direção visual ativa (ThemeSwitcher). A maioria das direções é só CSS (tokens em html[data-theme]);
 * as que mudam estrutura (ex.: "atelie") leem daqui pra trocar componentes.
 */
export const THEMES = [
  { id: 'editorial', label: 'Editorial' },
  { id: 'noite', label: 'Noite Imperial' },
  { id: 'aurora', label: 'Aurora Pop' },
  { id: 'ambar', label: 'Âmbar' },
  { id: 'esmeralda', label: 'Esmeralda' },
  { id: 'ametista', label: 'Ametista' },
  { id: 'safira', label: 'Safira' },
  { id: 'marmore', label: 'Mármore' },
  { id: 'atelie', label: 'Ateliê' },
  { id: 'boutique', label: 'Boutique' },
] as const

export type ThemeId = (typeof THEMES)[number]['id']
const STORAGE_KEY = 'arq-tema'

function isTheme(v: string | null): v is ThemeId {
  return THEMES.some((t) => t.id === v)
}

function initialTheme(): ThemeId {
  const fromUrl = new URLSearchParams(window.location.search).get('tema')
  if (isTheme(fromUrl)) return fromUrl
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (isTheme(saved)) return saved
  } catch {
    /* storage bloqueado: fica no padrão */
  }
  return 'editorial'
}

let current: ThemeId = initialTheme()
const listeners = new Set<() => void>()

function apply(theme: ThemeId) {
  const root = document.documentElement
  if (theme === 'editorial') delete root.dataset.theme
  else root.dataset.theme = theme
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* sem storage: vale só nesta visita */
  }
  // mantém o ?tema= na URL sem navegar (link compartilhável pra discussão)
  const url = new URL(window.location.href)
  if (theme === 'editorial') url.searchParams.delete('tema')
  else url.searchParams.set('tema', theme)
  window.history.replaceState(window.history.state, '', url)
}

apply(current)

export function setTheme(theme: ThemeId) {
  current = theme
  apply(theme)
  listeners.forEach((l) => l())
}

export function useTheme(): ThemeId {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => current,
  )
}

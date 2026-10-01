import { useSyncExternalStore } from 'react'
import type { Estado } from '@/lib/theme'

/**
 * Predefinições do painel de direção visual (ThemeSwitcher): combinações de estrutura + peças fixadas que a
 * pessoa nomeia e guarda. Ficam só no localStorage deste navegador (ferramenta interna, sem backend) — pra
 * passar uma combinação pra outra pessoa, o caminho é "Copiar link".
 */

export type Preset = Estado & { id: string; nome: string; criadoEm: string }

const KEY = 'arq-predefinicoes'

function ler(): Preset[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(v) ? v.filter((p) => p && typeof p.id === 'string' && typeof p.nome === 'string') : []
  } catch {
    return []
  }
}

let lista: Preset[] = ler()
const listeners = new Set<() => void>()

function gravar(nova: Preset[]) {
  lista = nova
  try {
    localStorage.setItem(KEY, JSON.stringify(nova))
  } catch {
    /* storage cheio ou bloqueado: vale só nesta visita */
  }
  listeners.forEach((l) => l())
}

// outra aba salvou/apagou: atualiza aqui também
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key !== KEY) return
    lista = ler()
    listeners.forEach((l) => l())
  })
}

const novoId = () => (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`)

export function salvarPreset(nome: string, estado: Estado): Preset {
  const p: Preset = { id: novoId(), nome: nome.trim(), theme: estado.theme, pins: { ...estado.pins }, criadoEm: new Date().toISOString() }
  gravar([p, ...lista])
  return p
}

/** Regrava a predefinição com a combinação que está na tela agora. */
export function sobrescreverPreset(id: string, estado: Estado) {
  gravar(lista.map((p) => (p.id === id ? { ...p, theme: estado.theme, pins: { ...estado.pins } } : p)))
}

export function renomearPreset(id: string, nome: string) {
  const n = nome.trim()
  if (!n) return
  gravar(lista.map((p) => (p.id === id ? { ...p, nome: n } : p)))
}

export function apagarPreset(id: string) {
  gravar(lista.filter((p) => p.id !== id))
}

/** A predefinição bate com a combinação atual? (mesma estrutura e exatamente as mesmas peças fixadas) */
export function mesmoEstado(p: Estado, e: Estado) {
  const a = Object.entries(p.pins).sort()
  const b = Object.entries(e.pins).sort()
  return p.theme === e.theme && JSON.stringify(a) === JSON.stringify(b)
}

export function usePresets(): Preset[] {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => {
        listeners.delete(cb)
      }
    },
    () => lista,
  )
}

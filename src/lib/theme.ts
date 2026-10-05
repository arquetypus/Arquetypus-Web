import { useSyncExternalStore } from 'react'

/**
 * Direção visual ativa (ThemeSwitcher) — cinco parâmetros independentes:
 * - estrutura: o layout da home (THEMES). Editorial = home padrão; Ateliê/Boutique trocam algumas seções;
 *   Oráculo, Galeria, Manifesto e Cinema desenham a home inteira (components/directions/).
 * - paleta: só cores (html[data-paleta] em index.css)
 * - estilo: fonte dos títulos + cantos (html[data-estilo])
 * - hero e catálogo: peças trocáveis entre estruturas
 * Cada estrutura traz os seus padrões; o que a pessoa escolhe em "Misturar" fica fixado (pin) e vale em
 * qualquer estrutura até ser solto — assim dá pra testar uma paleta em todas as versões, por exemplo.
 */

export const PALETAS = [
  { id: 'editorial', label: 'Editorial · verde e creme' },
  { id: 'noite', label: 'Noite Imperial' },
  { id: 'aurora', label: 'Aurora Pop' },
  { id: 'ambar', label: 'Âmbar' },
  { id: 'ambar-claro', label: 'Âmbar claro' },
  { id: 'esmeralda', label: 'Esmeralda' },
  { id: 'ametista', label: 'Ametista' },
  { id: 'safira', label: 'Safira' },
  { id: 'marmore', label: 'Mármore' },
  { id: 'grafica', label: 'Gráfica · do Ateliê' },
  { id: 'branco', label: 'Branco loja · da Boutique' },
  { id: 'noite-azul', label: 'Noite azul · do Oráculo' },
  { id: 'parede', label: 'Parede · da Galeria' },
  { id: 'ocre', label: 'Ocre · do Manifesto' },
  { id: 'noir', label: 'Noir burgundy · do Cinema' },
  { id: 'herbario', label: 'Musgo e ferrugem · do Herbário' },
  { id: 'laboratorio', label: 'Cobalto · do Laboratório' },
  { id: 'riviera', label: 'Mar e terracota · da Riviera' },
  { id: 'washi', label: 'Washi · do Zen' },
] as const

export const ESTILOS = [
  { id: 'elegant', label: 'Elegant · padrão' },
  { id: 'manrope-redondo', label: 'Manrope arredondado · Aurora' },
  { id: 'manrope', label: 'Manrope · Boutique' },
  { id: 'cormorant', label: 'Cormorant · Esmeralda/Safira/Oráculo' },
  { id: 'cormorant-reto', label: 'Cormorant reto · Ateliê/Cinema' },
  { id: 'cormorant-fino', label: 'Cormorant fino · Mármore' },
  { id: 'bodoni', label: 'Bodoni · Galeria' },
  { id: 'anton', label: 'Anton · Manifesto' },
  { id: 'garamond', label: 'EB Garamond · Herbário' },
  { id: 'grotesk', label: 'Space Grotesk · Laboratório' },
  { id: 'fraunces', label: 'Fraunces arredondado · Riviera' },
  { id: 'mincho', label: 'Shippori Mincho · Zen' },
] as const

export const HEROES = [
  { id: 'padrao', label: 'Carrossel em tela cheia' },
  { id: 'atelie', label: 'Capa de revista · Ateliê' },
  { id: 'boutique', label: 'Loja compacta · Boutique' },
  { id: 'oraculo', label: 'Tiragem de cartas · Oráculo' },
  { id: 'galeria', label: 'Nome gigante · Galeria' },
  { id: 'manifesto', label: 'Manchete · Manifesto' },
  { id: 'cinema', label: 'Tela de cinema · Cinema' },
  { id: 'herbario', label: 'Prancha de espécime · Herbário' },
  { id: 'laboratorio', label: 'Ficha técnica · Laboratório' },
  { id: 'riviera', label: 'Sol e toldo · Riviera' },
  { id: 'zen', label: 'Vazio e ensō · Zen' },
] as const

export const CATALOGS = [
  { id: 'padrao', label: 'Carrossel + bodegón' },
  { id: 'atelie', label: 'Índice numerado · Ateliê' },
  { id: 'boutique', label: 'Grade de produtos · Boutique' },
  { id: 'oraculo', label: 'Cartas de tarô · Oráculo' },
  { id: 'galeria', label: 'Exposição · Galeria' },
  { id: 'manifesto', label: 'Lista tipográfica · Manifesto' },
  { id: 'cinema', label: 'Elenco · Cinema' },
  { id: 'herbario', label: 'Espécimes · Herbário' },
  { id: 'laboratorio', label: 'Amostras · Laboratório' },
  { id: 'riviera', label: 'Cartões-postais · Riviera' },
  { id: 'zen', label: 'Um por vez · Zen' },
] as const

export type PaletaId = (typeof PALETAS)[number]['id']
export type EstiloId = (typeof ESTILOS)[number]['id']
export type HeroId = (typeof HEROES)[number]['id']
export type CatalogId = (typeof CATALOGS)[number]['id']

type Pecas = { paleta: PaletaId; estilo: EstiloId; hero: HeroId; catalogo: CatalogId }

/** Estruturas e os padrões de cada uma. */
export const THEMES = [
  { id: 'editorial', label: 'Editorial', desc: 'Home padrão: carrossel, bodegón e degraus', paleta: 'editorial', estilo: 'elegant', hero: 'padrao', catalogo: 'padrao' },
  { id: 'atelie', label: 'Ateliê', desc: 'Revista impressa: capa e índice numerado', paleta: 'grafica', estilo: 'cormorant-reto', hero: 'atelie', catalogo: 'atelie' },
  // direção decidida (out/2026): Boutique com paleta Âmbar, estilo Elegant e hero do Cinema. O visual
  // original da Boutique (branco, Manrope, hero compacto) continua acessível fixando as peças em "Misturar".
  { id: 'boutique', label: 'Boutique', desc: 'Direção escolhida: loja com hero de cinema, âmbar', paleta: 'ambar', estilo: 'elegant', hero: 'cinema', catalogo: 'boutique' },
  { id: 'oraculo', label: 'Oráculo', desc: 'Tarô: cartas, arcos e céu estrelado', paleta: 'noite-azul', estilo: 'cormorant', hero: 'oraculo', catalogo: 'oraculo' },
  { id: 'galeria', label: 'Galeria', desc: 'Museu: salas numeradas, molduras e plaquetas', paleta: 'parede', estilo: 'bodoni', hero: 'galeria', catalogo: 'galeria' },
  { id: 'manifesto', label: 'Manifesto', desc: 'Cartaz: caixa alta gigante e bordas grossas', paleta: 'ocre', estilo: 'anton', hero: 'manifesto', catalogo: 'manifesto' },
  { id: 'cinema', label: 'Cinema', desc: 'Filme noir: letterbox, pôsteres e créditos', paleta: 'noir', estilo: 'cormorant-reto', hero: 'cinema', catalogo: 'cinema' },
  { id: 'herbario', label: 'Herbário', desc: 'Arquivo botânico: espécimes, fita e carimbo', paleta: 'herbario', estilo: 'garamond', hero: 'herbario', catalogo: 'herbario' },
  { id: 'laboratorio', label: 'Laboratório', desc: 'Ficha técnica: milimetrado e dados em mono', paleta: 'laboratorio', estilo: 'grotesk', hero: 'laboratorio', catalogo: 'laboratorio' },
  { id: 'riviera', label: 'Riviera', desc: 'Verão: toldo, sol, ondas e postais', paleta: 'riviera', estilo: 'fraunces', hero: 'riviera', catalogo: 'riviera' },
  { id: 'zen', label: 'Zen', desc: 'Wabi-sabi: vazio, texto vertical e ensō', paleta: 'washi', estilo: 'mincho', hero: 'zen', catalogo: 'zen' },
] as const satisfies readonly ({ id: string; label: string; desc: string } & Pecas)[]

export type ThemeId = (typeof THEMES)[number]['id']

/** Estrutura que abre quando a URL e o storage não dizem nada — a direção decidida. */
export const PADRAO: ThemeId = 'boutique'

/** Painel de direção visual (ThemeSwitcher). Desligado (out/2026, direção decidida): o site abre sempre no PADRAO
 *  com os padrões dele — ignora ?tema=/peças na URL e o que ficou salvo no navegador, e não grava nada. */
export const SHOW_THEME_SWITCHER = false

/** Famílias do Google Fonts usadas só pelos estilos alternativos e pelas direções desligadas. Saíram do
 *  index.html (out/2026: travavam a primeira exibição de toda página); o ThemeSwitcher injeta quando ligado. */
export const FONTES_DIRECOES =
  'https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400&family=Anton&family=EB+Garamond:ital,wght@0,400..600;1,400..600&family=Courier+Prime:wght@400;700&family=Space+Grotesk:wght@400..700&family=JetBrains+Mono:wght@400;500&family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Shippori+Mincho:wght@400;500;600&display=swap'

/** Links antigos (?tema=noite etc., de quando paleta e estrutura eram uma coisa só) continuam abrindo igual. */
const LEGADO: Record<string, { tema: ThemeId } & Partial<Pecas>> = {
  noite: { tema: 'editorial', paleta: 'noite' },
  aurora: { tema: 'editorial', paleta: 'aurora', estilo: 'manrope-redondo' },
  ambar: { tema: 'editorial', paleta: 'ambar' },
  esmeralda: { tema: 'editorial', paleta: 'esmeralda', estilo: 'cormorant' },
  ametista: { tema: 'editorial', paleta: 'ametista' },
  safira: { tema: 'editorial', paleta: 'safira', estilo: 'cormorant' },
  marmore: { tema: 'editorial', paleta: 'marmore', estilo: 'cormorant-fino' },
  'boutique-editorial': { tema: 'boutique', paleta: 'editorial' },
  'boutique-ambar': { tema: 'boutique', paleta: 'ambar-claro' },
}

export function isBoutiqueLayout(theme: ThemeId): boolean {
  return theme === 'boutique'
}

const is =
  <T extends string>(list: readonly { id: T }[]) =>
  (v: unknown): v is T =>
    typeof v === 'string' && list.some((x) => x.id === v)
const isTheme = is(THEMES)
const isPaleta = is(PALETAS)
const isEstilo = is(ESTILOS)
const isHero = is(HEROES)
const isCatalog = is(CATALOGS)

export type Pins = Partial<Pecas>
export type Estado = { theme: ThemeId; pins: Pins }
export type ThemeState = { theme: ThemeId; pins: Pins } & Pecas

// v3: troca de padrão (out/2026) — escolhas salvas antes da decisão não sobrepõem a direção nova
const STORAGE_KEY = 'arq-tema-v3'
const def = (t: ThemeId) => THEMES.find((x) => x.id === t)!

function limparPins(p: Record<string, unknown>): Pins {
  const out: Pins = {}
  if (isPaleta(p.paleta)) out.paleta = p.paleta
  if (isEstilo(p.estilo)) out.estilo = p.estilo
  if (isHero(p.hero)) out.hero = p.hero
  if (isCatalog(p.catalogo)) out.catalogo = p.catalogo
  return out
}

function inicial(): Estado {
  if (!SHOW_THEME_SWITCHER || typeof window === 'undefined') return { theme: PADRAO, pins: {} }
  const params = new URLSearchParams(window.location.search)
  const tema = params.get('tema')
  const daUrl = limparPins(Object.fromEntries(params))
  if (isTheme(tema)) return { theme: tema, pins: daUrl }
  if (tema && LEGADO[tema]) {
    const { tema: t, ...resto } = LEGADO[tema]
    return { theme: t, pins: { ...resto, ...daUrl } }
  }
  if (Object.keys(daUrl).length) return { theme: PADRAO, pins: daUrl }
  try {
    const salvo = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    if (salvo && isTheme(salvo.theme)) return { theme: salvo.theme, pins: limparPins(salvo.pins ?? {}) }
  } catch {
    /* storage bloqueado ou inválido: fica no padrão */
  }
  return { theme: PADRAO, pins: {} }
}

function resolver(e: Estado): ThemeState {
  const d = def(e.theme)
  return {
    theme: e.theme,
    pins: e.pins,
    paleta: e.pins.paleta ?? d.paleta,
    estilo: e.pins.estilo ?? d.estilo,
    hero: e.pins.hero ?? d.hero,
    catalogo: e.pins.catalogo ?? d.catalogo,
  }
}

// O servidor e a primeira hidratação usam o mesmo objeto, sem recalcular snapshots.
export const DEFAULT_THEME_STATE: ThemeState = resolver({ theme: PADRAO, pins: {} })
export const DEFAULT_HTML_ATTRIBUTES = {
  'data-estrutura': DEFAULT_THEME_STATE.theme,
  'data-paleta': DEFAULT_THEME_STATE.paleta,
  'data-estilo': DEFAULT_THEME_STATE.estilo,
} as const

let estado = inicial()
let atual = !SHOW_THEME_SWITCHER || typeof window === 'undefined' ? DEFAULT_THEME_STATE : resolver(estado)
const listeners = new Set<() => void>()

function aplicar() {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.dataset.estrutura = atual.theme
  root.dataset.paleta = atual.paleta
  root.dataset.estilo = atual.estilo
  if (!SHOW_THEME_SWITCHER || typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado))
  } catch {
    /* sem storage: vale só nesta visita */
  }
  // URL compartilhável: ?tema= + só o que foi fixado
  const url = new URL(window.location.href)
  for (const k of ['tema', 'paleta', 'estilo', 'hero', 'catalogo']) url.searchParams.delete(k)
  if (estado.theme !== PADRAO) url.searchParams.set('tema', estado.theme)
  for (const [k, v] of Object.entries(estado.pins)) url.searchParams.set(k, v)
  window.history.replaceState(window.history.state, '', url)
}

aplicar()

function atualizar(e: Estado) {
  estado = e
  atual = resolver(e)
  aplicar()
  listeners.forEach((l) => l())
}

/** Troca a estrutura; o que estiver fixado em "Misturar" continua. */
export function setTheme(theme: ThemeId) {
  atualizar({ ...estado, theme })
}

/** Fixa (ou solta, com null) uma peça. */
export function setPin<K extends keyof Pecas>(k: K, v: Pecas[K] | null) {
  const pins = { ...estado.pins }
  if (v === null) delete pins[k]
  else pins[k] = v
  atualizar({ ...estado, pins })
}

export function clearPins() {
  atualizar({ ...estado, pins: {} })
}

/** Aplica uma combinação salva (lib/presets.ts). Valida tudo: preset antigo com peça que deixou de existir
 *  cai no padrão da estrutura em vez de quebrar. Devolve false se a estrutura não existe mais. */
export function aplicarEstado(e: { theme: unknown; pins: unknown }): boolean {
  if (!isTheme(e.theme)) return false
  atualizar({ theme: e.theme, pins: limparPins((e.pins ?? {}) as Record<string, unknown>) })
  return true
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

export function useThemeState(): ThemeState {
  return useSyncExternalStore(subscribe, () => atual, () => DEFAULT_THEME_STATE)
}

export function useTheme(): ThemeId {
  return useThemeState().theme
}

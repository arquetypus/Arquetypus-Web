import type { IconeTracoId } from '@/components/ui/IconeTraco'
export type Segmento = 'F' | 'M' | 'U'
export type StatusCatalogo = 'ok' | 'wait'

/** As 5 famílias olfativas (out/2026) — ordem de exibição em data/families.ts */
export type FamiliaSlug =
  | 'florais-elegantes'
  | 'frutados-citricos'
  | 'frescos-luminosos'
  | 'ambarados-adocicados'
  | 'amadeirados-especiados'

export interface Familia {
  slug: FamiliaSlug
  nome: string
  desc: string
  /** três palavras que resumem os produtos da família — linha pequena no card */
  attrs: [string, string, string]
}

export interface Archetype {
  id: string
  /**
   * Endereço público da PDP: /body-splash/{slug} (out/2026, nome-sobrenome sem acento). Escrito à mão e definitivo —
   * não muda se o nome mudar; /loja/:id e /arquetipos/:id redirecionam pra ele. O `id` segue como chave interna.
   */
  slug: string
  cod: string
  nome: string
  /** Nome cadastrado no GTIN, informado pelo usuário; uso em SEO/integrações, não na apresentação comercial. */
  nomeOficial: string
  /** GTIN-13 informado pelo usuário; texto para preservar todos os dígitos. */
  gtin13: string
  /** Sobrenome do body splash (ex.: Afrodite → "First Kiss"), linha menor abaixo do nome */
  sobrenome?: string
  cor: string
  bg: string
  /** [principal, secundária] — o produto aparece no filtro das duas */
  familias: [FamiliaSlug, FamiliaSlug]
  /** derivado de `familias` em data/archetypes.ts: nome da família principal, pra exibir (a secundária só entra nos filtros) */
  fam: string
  energia: string
  seg: Segmento
  vol: string
  tipo: 'Body Splash Premium' | 'Perfume'
  /** número do processo de notificação do produto na Anvisa (confirmado pelo usuário, out/2026) */
  anvisa: string
  /** preço de venda (com desconto) — é o que vai pra sacola e base de Pix/parcelas */
  preco: number
  /** preço cheio, mostrado riscado ao lado do `preco` (componente Preco) */
  precoCheio: number
  status: StatusCatalogo
  /** Epíteto — linha de assinatura abaixo do nome */
  ep: string
  /** Frase do card 9:16 compartilhável — máx. 60 caracteres */
  card: string
  /** Bloco "quem é" — leitura de identidade, 2 parágrafos */
  quem: [string, string]
  /** Bloco "o que isso tem a ver com cheiro" — conexão olfativa, 2 parágrafos */
  cheiro: [string, string]
  topo: string
  coracao: string
  fundo: string
  /** id do arquétipo par pra layering (mesma energia) */
  par: string
  layer: string
  /** "Notas em destaque" da PDP e do pop-up: uma nota-assinatura por camada, escolhida a dedo (guia de arquétipos
   * do Fábio, out/2026) — antes era a 1ª nota de cada camada. Têm de existir em topo/coração/fundo. */
  destaques: [string, string, string]
  /** Os cinco traços do arquétipo na PDP (guia de arquétipos, out/2026): título curto + frase que liga o traço a
   * uma nota real da fórmula. */
  tracos: { titulo: string; icone: IconeTracoId; texto: string }[]
}

export interface QuizOption {
  label: string
  pontos: Partial<Record<string, number>>
}

export interface QuizQuestion {
  pergunta: string
  opcoes: QuizOption[]
}

export interface QuizResult {
  dominante: Archetype
  secundario: Archetype
  percentualDominante: number
}

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

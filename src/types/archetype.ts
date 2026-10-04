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
  /** Sobrenome do body splash (ex.: Fada → "First Kiss"), linha menor abaixo do nome */
  sobrenome?: string
  cor: string
  bg: string
  /** [principal, secundária] — o produto aparece no filtro das duas */
  familias: [FamiliaSlug, FamiliaSlug]
  /** derivado de `familias` em data/archetypes.ts: "Principal · Secundária", pra exibir */
  fam: string
  energia: string
  seg: Segmento
  vol: string
  tipo: 'Body splash' | 'Perfume'
  preco: number
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

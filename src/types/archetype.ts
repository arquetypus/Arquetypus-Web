export type Segmento = 'F' | 'M' | 'U'
export type StatusCatalogo = 'ok' | 'wait'

export interface Archetype {
  id: string
  cod: string
  nome: string
  cor: string
  bg: string
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

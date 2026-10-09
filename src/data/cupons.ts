import { arredondaDezena, CONDICOES } from '@/data/empresa'

/**
 * Cupons de link (out/2026): quem chega com `?cupom=CODIGO` na URL vê o preço com o desconto em todo o site
 * (CupomContext). Só cupons cadastrados aqui valem — código desconhecido é ignorado. Não há checkout ainda: o
 * desconto é só exibido; quando o checkout existir, o mesmo cadastro precisa estar lá (o site não garante o cupom).
 * O BEMVINDO10 é o de primeira compra: ativado sem URL, ao cadastrar na caixa de cupom da home (FormCupom).
 */
export interface Cupom {
  codigo: string
  /** desconto sobre o preço de venda (a.preco), em % */
  pct: number
}

export const CUPONS: Cupom[] = [
  // clientes da Saniella: vai no cartão que acompanha as amostras (link com ?cupom=CONHECA15). Não soma com o BEMVINDO10
  { codigo: 'CONHECA15', pct: 15 },
  // cupom de primeira compra: ativado ao cadastrar na caixa de cupom da home (FormCupom); % das condições comerciais
  { codigo: 'BEMVINDO10', pct: CONDICOES.cupomPrimeiraCompraPct },
]

/** Cupom cadastrado com esse código (sem diferenciar maiúsculas), ou null */
export const buscarCupom = (codigo: string | null | undefined): Cupom | null => {
  const c = codigo?.trim().toUpperCase()
  return (c && CUPONS.find((x) => x.codigo === c)) || null
}

/** Preço com o cupom, com os centavos arredondados pra baixo até a dezena (79,90 − 15% = 67,915 → 67,90) */
export const precoComCupom = (v: number, cupom: Cupom) => arredondaDezena(v * (1 - cupom.pct / 100))

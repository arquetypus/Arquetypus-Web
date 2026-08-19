/**
 * Parâmetros econômicos isolados — nunca hard-coded dentro de
 * componente. Fonte: v6, aba SPEC "Bloco 3 — a camada de amostragem".
 *
 * comissaoPct: HIPÓTESE — chute herdado do v6, sem CMV real por trás.
 * kitMargemPct: null de propósito — CMV do mini de 8 ml é desconhecido,
 *   não dá pra computar margem ainda. Não inventar valor aqui.
 */
export const ECON = {
  comissaoPct: 0.2,
  kitPreco: 79.9,
  kitMargemPct: null as number | null,
}

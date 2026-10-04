/**
 * Parâmetros econômicos isolados — nunca hard-coded dentro de
 * componente. Fonte: v6, aba SPEC "Bloco 3 — a camada de amostragem".
 *
 * comissaoMinPct/comissaoMaxPct: faixa de comissão do criador, 10% a 20% (confirmada pelo usuário, out/2026).
 * comissaoTexto: como a faixa aparece no site ("10% a 20%").
 * kitMargemPct: null de propósito — CMV do mini de 8 ml é desconhecido,
 *   não dá pra computar margem ainda. Não inventar valor aqui.
 */
export const ECON = {
  comissaoMinPct: 0.1,
  comissaoMaxPct: 0.2,
  kitPreco: 79.9,
  kitMargemPct: null as number | null,
}

/** Faixa de comissão como aparece no site: "10% a 20%" */
export const comissaoTexto = `${Math.round(ECON.comissaoMinPct * 100)}% a ${Math.round(ECON.comissaoMaxPct * 100)}%`

/**
 * Captura de lead da caixa de cupom da home (out/2026). O lead é gravado pela API do projeto `arquetypus-vip`
 * (vip.arquetypus.com.br, mesmo Supabase da lista VIP) — este site não guarda chave nenhuma. Diferente da página
 * VIP, aqui não há redirecionamento: depois do envio abre o pop-up do cupom e o grupo VIP vira um convite opcional
 * (botão que passa pelo /api/go de lá, que resolve o grupo com vaga pelo `event_id` do lead).
 *
 * Pra o envio funcionar, o /api/lead do VIP precisa aceitar a origem deste site (CORS, ver api/lead.ts de lá).
 */
export const VIP_API = 'https://vip.arquetypus.com.br'

/** origem do lead no banco (tracking.source) e no evento `lead_submitted` — separa da lista VIP */
export const LEAD_SOURCE = 'site-cupom'

/** cupom ativado ao cadastrar (cadastrado em data/cupons.ts) */
export const CUPOM_CADASTRO = 'BEMVINDO10'

/** link do botão "Entrar no grupo VIP" — /api/go acha o grupo ofertado ao lead pelo event_id, ou cai no grupo padrão */
export const grupoVipUrl = (eventId: string) =>
  `${VIP_API}/api/go?${new URLSearchParams({ event_id: eventId, v: 'short', session_id: eventId })}`

/**
 * Mesmo botão sem cadastro (pop-up de quem chega pelo link com ?cupom=): /api/go no caminho sem event_id —
 * claim_group_for_session reserva uma vaga por sessão e grava o clique (variante `cta` da página VIP). A sessão é
 * um id por aba, guardado no sessionStorage, pra o reclique não ocupar outra vaga.
 */
export function grupoVipSemCadastroUrl() {
  let sessao = ''
  try {
    sessao = sessionStorage.getItem('arquetypus:sessao') ?? ''
    if (!sessao) {
      sessao = crypto.randomUUID()
      sessionStorage.setItem('arquetypus:sessao', sessao)
    }
  } catch {
    sessao = crypto.randomUUID()
  }
  return `${VIP_API}/api/go?${new URLSearchParams({ session_id: sessao, v: 'cta' })}`
}

/**
 * Dados oficiais da empresa (confirmados pelo usuário, out/2026) — rodapés, páginas institucionais e FAQ leem
 * daqui. O Decreto 7.962/2013 (comércio eletrônico) pede razão social, CNPJ, endereço e contato visíveis no site.
 */
export const EMPRESA = {
  marca: 'Arquétypus Parfum',
  razao: 'Saniella Ltda',
  cnpj: '58.267.823/0001-68',
  endereco: 'Praça Cândido Mota, 193, sala 52, piso 2, Centro, Caraguatatuba – SP, CEP 11660-060',
  email: 'contato@arquetypus.com.br',
} as const

/** Linha de rodapé: razão social, CNPJ e endereço */
export const EMPRESA_LINHA = `${EMPRESA.razao} · CNPJ ${EMPRESA.cnpj} · ${EMPRESA.endereco}`

/** Data de vigência das políticas (Entrega, Trocas, Privacidade, Termos, Regras) */
export const POLITICAS_ATUALIZADAS = '1º de outubro de 2026'

/**
 * Operação (confirmado pelo usuário, out/2026): quem processa pagamento, frete, hospedagem e e-mail. As políticas
 * citam esses nomes — ao trocar um fornecedor, atualizar aqui e revisar Privacidade, Entrega e Regras.
 */
export const OPERACAO = {
  pagamento: 'Mercado Pago',
  frete: 'Melhor Envio',
  transportadoras: 'Correios, Jadlog e J&T Express',
  hospedagem: 'Vercel',
  email: 'Google (Google Workspace)',
  anuncios: 'Google Ads, Meta (Facebook e Instagram) e TikTok',
} as const

/** Frete grátis a partir deste valor (R$) — home, Entrega e Frete, FAQ e llms.txt leem daqui */
export const FRETE_GRATIS_ACIMA = 199

/**
 * Condições comerciais (confirmadas pelo usuário, out/2026) — preço no Pix, parcelas, prazos e concentração. Site,
 * descrições de SEO (data/rotas.ts, lib/seoModel.ts) e llms.txt leem daqui: mudar só aqui e rodar o build.
 */
export const CONDICOES = {
  pixDescontoPct: 5,
  parcelasSemJuros: 6,
  desistenciaDias: 7,
  defeitoDias: 30,
  envioHorasUteis: 24,
  essenciaPct: 10,
  cupomPrimeiraCompraPct: 15,
} as const

/** Preço no Pix (desconto de CONDICOES.pixDescontoPct) */
export const precoPix = (v: number) => v * (1 - CONDICOES.pixDescontoPct / 100)
/** Valor de cada parcela sem juros */
export const parcela = (v: number) => v / CONDICOES.parcelasSemJuros
/** Valor redondo em reais, sem centavos ("R$ 199") — pra frete grátis em textos e descrições */
export const brlInteiro = (v: number) => `R$ ${v.toLocaleString('pt-BR')}`

/**
 * Dados oficiais da empresa (confirmados pelo usuário, out/2026) — rodapés, páginas institucionais e FAQ leem
 * daqui. O Decreto 7.962/2013 (comércio eletrônico) pede razão social, CNPJ, endereço e contato visíveis no site.
 */
/**
 * Endereço oficial do site (out/2026): com www, como a Vercel serve — arquetypus.com.br redireciona (308) pra cá.
 * Canonical, og:url/og:image, sitemap, robots e llms.txt saem daqui; se o domínio principal mudar no painel da
 * Vercel, mudar só aqui (e os scripts de verificação do build).
 */
export const SITE = 'https://www.arquetypus.com.br'

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

/**
 * Frete grátis a partir deste valor (R$) — home, PDP, Entrega e Frete, FAQ e llms.txt leem daqui. DESLIGADO desde
 * out/2026 (`null`, pedido do usuário: ainda não confirmado) — com `null`, nenhum texto do site promete frete grátis.
 * Pra religar, trocar por `FRETE_GRATIS_PLANEJADO` (ou o valor confirmado) e rodar o build.
 */
export const FRETE_GRATIS_PLANEJADO = 199
export const FRETE_GRATIS_ACIMA: number | null = null

/**
 * Botão de compra ativo (out/2026, pedido do usuário pra trabalhar o destaque do CTA). Ainda NÃO existe checkout:
 * "Comprar agora" põe o produto na sacola em memória. `false` volta ao "Em breve" desligado (BotaoComprar).
 */
export const VENDAS_ATIVAS = true

/**
 * Brinde na compra (out/2026, copy do usuário) — quadro abaixo do botão de comprar na PDP completa. `kitsEmEstoque`
 * é o número real de kits de amostras: atualizar à mão (ou ligar no estoque quando houver checkout) — anunciar
 * escassez que não existe é publicidade enganosa (CDC, art. 37). `null` desliga o quadro; `kitsEmEstoque: null`
 * esconde só a linha de estoque.
 */
export const BRINDE: { amostras: number; ml: number; kitsEmEstoque: number | null } | null = {
  amostras: 3,
  ml: 5,
  kitsEmEstoque: 2,
}

/**
 * Outros canais de venda (out/2026, pedido do usuário): pra quem prefere comprar num marketplace que já conhece.
 * Aparecem na coluna de compra da PDP e no rodapé. `url` null = loja ainda sem link (o selo aparece, sem clique).
 */
export const CANAIS_VENDA: {
  id: 'mercado-livre' | 'shopee' | 'tiktok-shop' | 'magalu' | 'beleza-na-web' | 'amazon' | 'epoca-cosmeticos'
  nome: string
  url: string | null
}[] = [
  { id: 'mercado-livre', nome: 'Mercado Livre', url: null },
  { id: 'shopee', nome: 'Shopee', url: null },
  { id: 'tiktok-shop', nome: 'TikTok Shop', url: null },
  { id: 'magalu', nome: 'Magalu', url: null },
  { id: 'beleza-na-web', nome: 'Beleza na Web', url: null },
  { id: 'amazon', nome: 'Amazon', url: null },
  { id: 'epoca-cosmeticos', nome: 'Época Cosméticos', url: null },
]

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

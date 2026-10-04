import { ARCHETYPES } from '@/data/archetypes'
import { EMPRESA, FRETE_GRATIS_ACIMA, OPERACAO } from '@/data/empresa'
import { PAGINAS_PUBLICAS } from '@/data/rotas'

/**
 * robots.txt, sitemap.xml e llms.txt (out/2026), gerados no build pelo plugin `arquivosSeo` do vite.config.ts —
 * saem dos mesmos dados do site (produtos, preços, empresa, rotas), então nunca ficam desatualizados.
 * Em `npm run dev` os três também respondem, pra conferir.
 */
export const SITE = 'https://arquetypus.com.br'

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const xml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function robotsTxt(): string {
  return ['User-agent: *', 'Allow: /', '', `Sitemap: ${SITE}/sitemap.xml`, ''].join('\n')
}

export function sitemapXml(data: Date): string {
  const lastmod = data.toISOString().slice(0, 10)
  const urls = [
    ...PAGINAS_PUBLICAS.map((p) => p.path),
    ...ARCHETYPES.map((a) => `/loja/${a.id}`),
  ]
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((u) => `  <url><loc>${xml(SITE + (u === '/' ? '/' : u))}</loc><lastmod>${lastmod}</lastmod></url>`),
    '</urlset>',
    '',
  ].join('\n')
}

/** Formato do llmstxt.org: título, resumo em citação, detalhes e listas de links em Markdown */
export function llmsTxt(): string {
  const produtos = ARCHETYPES.map((a) => {
    const nome = `${a.nome} ${a.sobrenome ?? ''}`.trim()
    const preco = a.precoCheio > a.preco ? `${brl(a.preco)} (de ${brl(a.precoCheio)})` : brl(a.preco)
    return (
      `- [${nome}](${SITE}/loja/${a.id}): ${a.tipo} ${a.vol}, ${preco}. Família ${a.fam}. ` +
      `Notas de topo: ${a.topo}; coração: ${a.coracao}; fundo: ${a.fundo}. ${a.ep}`
    )
  })
  return [
    `# ${EMPRESA.marca}`,
    '',
    '> Perfumaria de arquétipos brasileira: nove fragrâncias Body Splash Premium com 10% de essência, cada uma ' +
      'traduzindo um arquétipo. "Você não escolhe um perfume. Você reconhece o seu."',
    '',
    `A ${EMPRESA.marca} é uma marca da ${EMPRESA.razao} (CNPJ ${EMPRESA.cnpj}), loja 100% online que entrega em todo ` +
      `o Brasil. Envio em até 24 horas úteis após a aprovação do pagamento, frete grátis acima de ` +
      `${brl(FRETE_GRATIS_ACIMA)}, Pix com 5% de desconto e cartão em até 6x sem juros (${OPERACAO.pagamento}). ` +
      'Desistência em até 7 dias com o produto lacrado e sem uso; 30 dias para defeito. Produtos regularizados na Anvisa. ' +
      `Contato: ${EMPRESA.email}.`,
    '',
    '## Produtos',
    '',
    ...produtos,
    '',
    '## Páginas',
    '',
    ...PAGINAS_PUBLICAS.filter((p) => p.path !== '/').map((p) => `- [${p.nome}](${SITE}${p.path})`),
    '',
  ].join('\n')
}

/** Os três arquivos, por nome — o que o plugin grava na raiz do build */
export function arquivosSeo(data = new Date()): Record<string, string> {
  return { 'robots.txt': robotsTxt(), 'sitemap.xml': sitemapXml(data), 'llms.txt': llmsTxt() }
}

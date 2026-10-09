import { ARCHETYPES, productPath } from '@/data/archetypes'
import { CONDICOES, EMPRESA, SITE, parcela } from '@/data/empresa'
import { PDP_FRASCO, PDP_LIFESTYLE } from '@/data/productMedia'
import type { Archetype, Segmento } from '@/types/archetype'

/**
 * Feed de produtos do Google Merchant Center (out/2026): /produtos.xml, RSS 2.0 com atributos `g:`
 * (support.google.com/merchants/answer/7052112). Gerado na pré-renderização (scripts/prerender.mjs), porque só o
 * bundle do servidor conhece a URL final das fotos. Sai dos mesmos dados da PDP e do JSON-LD (preço, GTIN,
 * disponibilidade), então o Merchant Center nunca vê preço diferente da página.
 *
 * Preço: só `preco` (o que a pessoa paga), igual ao Offer do JSON-LD. O preço cheio riscado não vai como
 * `sale_price` — o Google exige que o preço cheio já tenha sido cobrado de verdade. Frete fica configurado no
 * Merchant Center, não aqui.
 */

const xml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const valor = (v: number) => `${v.toFixed(2)} BRL`
const absoluta = (url: string) => new URL(url, SITE).href

const GENERO: Record<Segmento, string> = { F: 'female', M: 'male', U: 'unisex' }
/** Taxonomia do Google: Saúde e beleza > Cuidados pessoais > Cosméticos > Perfumes e colônias */
const CATEGORIA_GOOGLE = '479'

function item(a: Archetype): string {
  const nome = `${a.nome} ${a.sobrenome ?? ''}`.trim()
  const campos: [string, string | undefined][] = [
    ['g:id', a.id],
    ['g:title', `${a.tipo} ${nome} ${a.vol} | ${EMPRESA.marca}`],
    [
      'g:description',
      `${a.ep} ${a.tipo} ${a.vol} com ${CONDICOES.essenciaPct}% de essência, família ${a.fam}. ` +
        `Notas de topo: ${a.topo}. Coração: ${a.coracao}. Fundo: ${a.fundo}.`,
    ],
    ['g:link', SITE + productPath(a)],
    ['g:image_link', PDP_FRASCO[a.id] && absoluta(PDP_FRASCO[a.id])],
    ['g:additional_image_link', PDP_LIFESTYLE[a.id] && absoluta(PDP_LIFESTYLE[a.id])],
    ['g:availability', a.status === 'wait' ? 'out_of_stock' : 'in_stock'],
    ['g:price', valor(a.preco)],
    ['g:brand', EMPRESA.marca],
    ['g:gtin', a.gtin13],
    ['g:condition', 'new'],
    ['g:google_product_category', CATEGORIA_GOOGLE],
    ['g:product_type', `${a.tipo} > ${a.fam}`],
    ['g:gender', GENERO[a.seg]],
    ['g:age_group', 'adult'],
    ['g:size', a.vol],
  ]
  const linhas = campos
    .filter((c): c is [string, string] => !!c[1])
    .map(([tag, v]) => `      <${tag}>${xml(v)}</${tag}>`)
  return [
    '    <item>',
    ...linhas,
    '      <g:installment>',
    `        <g:months>${CONDICOES.parcelasSemJuros}</g:months>`,
    `        <g:amount>${valor(Math.round(parcela(a.preco) * 100) / 100)}</g:amount>`,
    '      </g:installment>',
    '    </item>',
  ].join('\n')
}

export function produtosXml(): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">',
    '  <channel>',
    `    <title>${xml(EMPRESA.marca)}</title>`,
    `    <link>${SITE}/</link>`,
    `    <description>${xml(`Produtos da ${EMPRESA.marca}`)}</description>`,
    ...ARCHETYPES.map(item),
    '  </channel>',
    '</rss>',
    '',
  ].join('\n')
}

import { ARCHETYPES } from '@/data/archetypes'
import { EMPRESA } from '@/data/empresa'
import { CONTATOS } from '@/data/home'
import { FAQ_LOJA, FAQ_PRODUTO } from '@/data/faq'
import { respostaTexto } from '@/data/faqText'
import { PAGINAS_PUBLICAS, SEO_HOME } from '@/data/rotas'
import { PDP_FRASCO } from '@/data/productMedia'
import logo from '@/assets/brand/logo-dourado.png'
import type { Archetype } from '@/types/archetype'

export const SITE = 'https://arquetypus.com.br'
export const comMarca = (t: string) => `${t} | ${EMPRESA.marca}`
export { SEO_HOME }

export const SEO_SCRIPT_IDS = ['arq-seo-organization', 'arq-seo-website', 'arq-seo-product', 'arq-seo-breadcrumb', 'arq-seo-faq'] as const
export type SeoScript = { id: typeof SEO_SCRIPT_IDS[number]; json: string }
export type SeoHead = {
  title: string
  description: string
  canonical?: string
  robots?: 'noindex'
  og: { type: 'website' | 'product'; locale: string; siteName: string; image: string; width: string; height: string; alt: string }
  scripts: SeoScript[]
}

/** Também utilizável na injeção em HTML: nenhum texto pode encerrar o script. */
export const serializeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c')
const script = (id: SeoScript['id'], data: unknown): SeoScript => ({ id, json: serializeJsonLd(data) })
const absolute = (url: string) => new URL(url, SITE).href

export function organizationSchema() {
  return {
    '@context': 'https://schema.org', '@type': 'Organization', '@id': `${SITE}/#organization`,
    name: EMPRESA.marca, legalName: EMPRESA.razao, taxID: EMPRESA.cnpj,
    url: `${SITE}/`, logo: absolute(logo), email: EMPRESA.email, address: EMPRESA.endereco,
    sameAs: CONTATOS.filter((c) => c.rede === 'instagram' || c.rede === 'tiktok').map((c) => c.href),
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE}/#website`,
    name: EMPRESA.marca, url: `${SITE}/`, inLanguage: 'pt-BR', publisher: { '@id': `${SITE}/#organization` },
  }
}

const brlSeo = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
export function productMetadata(a: Archetype) {
  return {
    title: comMarca(`${a.nome} ${a.sobrenome ?? ''} – ${a.tipo}`.replace(/\s+–/, ' –')),
    description: `${a.nome} ${a.sobrenome ?? ''}: ${a.ep} ${a.tipo} ${a.vol} com 10% de essência, família ${a.fam}. ${brlSeo(a.preco)} em até 6x sem juros.`,
  }
}

export function productSchema(a: Archetype) {
  const url = `${SITE}/loja/${a.id}`
  return {
    '@context': 'https://schema.org', '@type': 'Product', '@id': `${url}#product`, url,
    name: `${a.nome} ${a.sobrenome ?? ''}`.trim(), description: productMetadata(a).description,
    image: absolute(PDP_FRASCO[a.id]), brand: { '@type': 'Brand', name: EMPRESA.marca },
    category: a.tipo, sku: a.id,
    // Compra desativada: não publicar Offer, disponibilidade ou avaliações não confirmadas.
  }
}

export function breadcrumbSchema(a: Archetype) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', '@id': `${SITE}/loja/${a.id}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: `${a.nome} ${a.sobrenome ?? ''}`.trim(), item: `${SITE}/loja/${a.id}` },
    ],
  }
}

export function faqSchema() {
  return {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [...FAQ_LOJA, ...FAQ_PRODUTO].map((p) => ({
      '@type': 'Question', name: p.q, acceptedAnswer: { '@type': 'Answer', text: respostaTexto(p.a) },
    })),
  }
}

/** URL real, independente da página mantida ao fundo pelo pop-up. Sem estado global de render. */
export function resolveSeo(url: string, { genericNotFound = false } = {}): SeoHead {
  const pathname = new URL(url, SITE).pathname.replace(/\/+$/, '') || '/'
  const page = PAGINAS_PUBLICAS.find((p) => p.path.toLowerCase() === pathname.toLowerCase())
  const match = pathname.match(/^\/(?:loja|arquetipos)\/([^/]+)$/i)
  // IDs continuam sensíveis a caixa; não usar propriedades herdadas como produtos.
  let slug = match?.[1]
  try { if (slug) slug = decodeURIComponent(slug) } catch { /* URL malformada não é produto. */ }
  const product = match ? ARCHETYPES.find((a) => a.id === slug) : undefined
  const redirectHome = pathname.toLowerCase() === '/kit-descoberta' || (!!match && !product)
  const metadata = product ? productMetadata(product) : page?.seo ?? (redirectHome ? SEO_HOME : {
    title: comMarca('Página não encontrada'), description: 'A página que você procurou não existe ou mudou de endereço.',
  })
  const notFound = !product && !page && !redirectHome
  const path = product ? `/loja/${product.id}` : page?.path ?? (redirectHome ? '/' : pathname)
  const scripts: SeoScript[] = []
  if (path === '/' && !notFound) scripts.push(script('arq-seo-organization', organizationSchema()), script('arq-seo-website', websiteSchema()))
  if (product) scripts.push(script('arq-seo-product', productSchema(product)), script('arq-seo-breadcrumb', breadcrumbSchema(product)))
  if (path === '/perguntas-frequentes') scripts.push(script('arq-seo-faq', faqSchema()))
  return {
    ...metadata, canonical: notFound && genericNotFound ? undefined : SITE + path,
    robots: notFound ? 'noindex' : undefined,
    og: {
      type: product ? 'product' : 'website', locale: 'pt_BR', siteName: EMPRESA.marca,
      image: `${SITE}/og-image.jpg`, width: '1200', height: '630',
      alt: 'Logo Arquétypus Parfum e os nove frascos sobre pedras à beira-mar ao pôr do sol',
    }, scripts,
  }
}

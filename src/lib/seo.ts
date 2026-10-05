import { useEffect } from 'react'
import type { SeoHead } from '@/lib/seoModel'
import { SEO_SCRIPT_IDS } from '@/lib/seoModel'

const OWNER = 'data-arq-seo'

/** Adota tags do template/SSG e reconcilia somente scripts com IDs pertencentes ao app. */
export function applySeo(head: SeoHead, doc: Document = document) {
  function meta(attr: 'name' | 'property', key: string, value: string | undefined) {
    const selector = 'meta[' + attr + '="' + key + '"]'
    const existing = doc.head.querySelector<HTMLMetaElement>(selector)
    if (value === undefined) {
      doc.head.querySelectorAll(selector).forEach((el) => el.remove())
      return
    }
    const el = existing ?? doc.createElement('meta')
    el.setAttribute(attr, key)
    el.setAttribute(OWNER, '')
    if (el.content !== value) el.content = value
    if (!existing) doc.head.appendChild(el)
    doc.head.querySelectorAll(selector + '[' + OWNER + ']').forEach((other) => { if (other !== el) other.remove() })
  }
  if (doc.title !== head.title) doc.title = head.title
  meta('name', 'description', head.description)
  for (const [key, value] of Object.entries({
    'og:type': head.og.type, 'og:locale': head.og.locale, 'og:site_name': head.og.siteName,
    'og:title': head.title, 'og:description': head.description, 'og:url': head.canonical,
    'og:image': head.og.image, 'og:image:width': head.og.width, 'og:image:height': head.og.height, 'og:image:alt': head.og.alt,
  })) meta('property', key, value)
  meta('name', 'twitter:card', 'summary_large_image')
  meta('name', 'twitter:image', head.og.image)

  const canon = doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (head.canonical) {
    const el = canon ?? doc.createElement('link')
    el.rel = 'canonical'
    el.setAttribute(OWNER, '')
    if (el.href !== head.canonical) el.href = head.canonical
    if (!canon) doc.head.appendChild(el)
    doc.head.querySelectorAll('link[rel="canonical"][' + OWNER + ']').forEach((other) => { if (other !== el) other.remove() })
  } else doc.head.querySelectorAll('link[rel="canonical"]').forEach((el) => el.remove())

  // Não adotar nem remover robots de ferramentas externas; noindex do app tem ID próprio.
  const robots = doc.getElementById('arq-seo-robots')
  if (head.robots) {
    const el = robots ?? doc.createElement('meta')
    el.id = 'arq-seo-robots'
    el.setAttribute('name', 'robots')
    el.setAttribute('content', head.robots)
    el.setAttribute(OWNER, '')
    if (!robots) doc.head.appendChild(el)
  } else robots?.remove()

  for (const id of SEO_SCRIPT_IDS) {
    const desired = head.scripts.find((s) => s.id === id)
    const selector = 'script[id="' + id + '"][type="application/ld+json"]'
    const existing = doc.head.querySelector<HTMLScriptElement>(selector)
    if (!desired) { doc.head.querySelectorAll(selector).forEach((el) => el.remove()); continue }
    const el = existing ?? doc.createElement('script')
    el.id = id
    el.type = 'application/ld+json'
    el.setAttribute(OWNER, '')
    if (el.textContent !== desired.json) el.textContent = desired.json
    if (!existing) doc.head.appendChild(el)
    doc.head.querySelectorAll(selector).forEach((other) => { if (other !== el) other.remove() })
  }
}

export function useSeo(head: SeoHead) {
  // Conteúdo estável: renderizações da página de fundo não reiniciam aplicação do head.
  const content = JSON.stringify(head)
  useEffect(() => { applySeo(JSON.parse(content) as SeoHead) }, [content])
}

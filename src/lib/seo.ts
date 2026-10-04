import { useEffect } from 'react'

const SITE = 'https://arquetypus.com.br'
const MARCA = 'Arquétypus Parfum'

/** Título e descrição da home — também o padrão do index.html */
export const SEO_HOME = {
  title: 'Arquetypus | Body Splash Premium e Perfumaria de Arquétipos',
  description:
    'Nove fragrâncias Body Splash Premium com 10% de essência, uma para cada arquétipo. Descubra a sua: frete grátis acima de R$ 199, 6x sem juros e 5% off no Pix.',
}

function meta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = value
}

/**
 * SEO por página (out/2026): título (até ~60 caracteres, palavra-chave antes da marca), descrição (até ~155),
 * canonical e Open Graph do endereço atual. Sem isso, toda página herdaria o canonical da home do index.html —
 * para o Google, cópias da home. `path` é o caminho sem domínio ("/trocas-e-devolucoes").
 */
export function useSeo({ title, description, path }: { title: string; description: string; path: string }) {
  useEffect(() => {
    const url = SITE + path
    document.title = title
    meta('name', 'description', description)
    meta('property', 'og:title', title)
    meta('property', 'og:description', description)
    meta('property', 'og:url', url)
    let canon = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canon) {
      canon = document.createElement('link')
      canon.rel = 'canonical'
      document.head.appendChild(canon)
    }
    canon.href = url
  }, [title, description, path])
}

/** "Título da página | Arquétypus Parfum" */
export const comMarca = (t: string) => `${t} | ${MARCA}`

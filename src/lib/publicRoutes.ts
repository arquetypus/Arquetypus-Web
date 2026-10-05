import { ARCHETYPES } from '@/data/archetypes'
import { PAGINAS_PUBLICAS } from '@/data/rotas'

/** Prefixos da página de produto: /loja/:id e o endereço antigo /arquetipos/:id entregam o mesmo HTML (canonical em /loja). */
export const PRODUCT_PREFIXES = ['/loja/', '/arquetipos/'] as const

export const PUBLIC_ROUTES = [
  ...PAGINAS_PUBLICAS.map(page => page.path),
  ...PRODUCT_PREFIXES.flatMap(prefix => ARCHETYPES.map(product => `${prefix}${product.id}`)),
]

/** Mesma decodificação por segmento do Router; IDs de produto mantêm caixa. */
export function matchingPublicRoute(pathname: string, routes: readonly string[]): string | undefined {
  let decoded = pathname
  try { decoded = pathname.split('/').map(part => decodeURIComponent(part).replace(/\//g, '%2F')).join('/') } catch { /* Router preserva caminho malformado. */ }
  // Layout trata somente "/" como home; múltiplas barras não têm primeira árvore idêntica.
  if (decoded !== '/') decoded = decoded.replace(/\/+$/, '')
  // Prefixo de produto sem distinção de caixa; ID com. Lista literal: a função vai serializada pro head.
  return routes.find(route => {
    const prefix = ['/loja/', '/arquetipos/'].find(p => route.startsWith(p))
    return prefix
      ? decoded.slice(0, prefix.length).toLowerCase() === prefix && decoded.slice(prefix.length) === route.slice(prefix.length)
      : route.toLowerCase() === decoded.toLowerCase()
  })
}

/** Executado no head, antes da primeira pintura; função de matching compartilhada com main. */
export function initialRenderBootstrap() {
  return `<style>html[data-arq-client-render] #root{visibility:hidden}</style><script id="initial-render-bootstrap">(function(){
var root=document.documentElement;
var route=root.getAttribute('data-rota');
var background=history.state&&history.state.usr&&history.state.usr.backgroundLocation;
var match=(${matchingPublicRoute.toString()})(location.pathname,${JSON.stringify(PUBLIC_ROUTES)});
if(background||(route&&route!==match)){
root.setAttribute('data-arq-client-render','');
function release(){root.removeAttribute('data-arq-client-render');clearTimeout(timer);window.removeEventListener('error',failed,true);window.removeEventListener('arq:reveal-release',release)}
function failed(event){if(event.target&&event.target.tagName==='SCRIPT'&&event.target.type==='module')release()}
var timer=setTimeout(release,2000);
window.addEventListener('error',failed,true);
window.addEventListener('arq:reveal-release',release,{once:true});
}
})();</script>`
}

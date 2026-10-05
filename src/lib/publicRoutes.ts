import { ARCHETYPES, productPath } from '@/data/archetypes'
import { PAGINAS_PUBLICAS } from '@/data/rotas'

export const PUBLIC_ROUTES = [
  ...PAGINAS_PUBLICAS.map(page => page.path),
  ...ARCHETYPES.map(productPath),
]

/** Mesma decodificação por segmento do Router; slugs de produto mantêm caixa. */
export function matchingPublicRoute(pathname: string, routes: readonly string[]): string | undefined {
  let decoded = pathname
  try { decoded = pathname.split('/').map(part => decodeURIComponent(part).replace(/\//g, '%2F')).join('/') } catch { /* Router preserva caminho malformado. */ }
  // Layout trata somente "/" como home; múltiplas barras não têm primeira árvore idêntica.
  if (decoded !== '/') decoded = decoded.replace(/\/+$/, '')
  // Prefixo de produto sem distinção de caixa; slug com. Literal: a função vai serializada pro head (sem imports).
  return routes.find(route => route.startsWith('/body-splash/')
    ? decoded.slice(0, 13).toLowerCase() === '/body-splash/' && decoded.slice(13) === route.slice(13)
    : route.toLowerCase() === decoded.toLowerCase())
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

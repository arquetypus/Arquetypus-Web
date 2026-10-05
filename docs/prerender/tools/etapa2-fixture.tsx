// QA isolado: aplicativo real, StrictMode, navegação e tracking reais. Não é entry-server de produção.
import { useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom'
import App from '@/App'
import { applySeo } from '@/lib/seo'
import { resolveSeo } from '@/lib/seoModel'
import { PAGINAS_PUBLICAS } from '@/data/rotas'
import { ARCHETYPES } from '@/data/archetypes'

const paths = [...PAGINAS_PUBLICAS.map(p => p.path), ...ARCHETYPES.map(a => '/loja/' + a.id)]
const pause = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

function Driver() {
  const navigate = useNavigate()
  const location = useLocation()
  const started = useRef(false)
  useEffect(() => {
    if (started.current) return
    started.current = true
    const report: { errors: string[]; checks: string[]; events: unknown[]; steps: unknown[]; done: boolean } = { errors: [], checks: [], events: [], steps: [], done: false }
    const assert = (condition: unknown, message: string) => { if (!condition) throw new Error(message) }
    const publish = () => { document.getElementById('qa-report')!.textContent = JSON.stringify(report) }
    // Intercepta só dataLayer local da fixture; nenhum GTM ou request de analytics é carregado aqui.
    window.dataLayer = window.dataLayer || []
    const push = window.dataLayer.push.bind(window.dataLayer)
    window.dataLayer.push = (...values) => {
      for (const value of values) {
        if ((value as { event?: string }).event === 'page_view') report.events.push({
          ...value as object, headTitle: document.title,
          canonical: document.head.querySelector('link[rel="canonical"]')?.getAttribute('href'),
          scripts: Array.from(document.head.querySelectorAll('script[type="application/ld+json"]')).map(s => s.id),
        })
      }
      publish()
      return push(...values)
    }
    async function step(path: string, options?: Parameters<typeof navigate>[1]) {
      flushSync(() => navigate(path, options))
      const head = resolveSeo(path)
      const deadline = Date.now() + 8000
      do { await pause(80) } while (document.title !== head.title && Date.now() < deadline)
      await pause(80)
      assert(document.title === head.title, 'title ' + path)
      assert(document.head.querySelector('meta[name="description"]')?.getAttribute('content') === head.description, 'description ' + path)
      assert(document.head.querySelectorAll('link[rel="canonical"]').length === 1, 'canonical único ' + path)
      assert(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href') === head.canonical, 'canonical ' + path)
      for (const key of ['title', 'description', 'url', 'type', 'image', 'image:width', 'image:height', 'image:alt']) {
        assert(document.head.querySelectorAll('meta[property="og:' + key + '"]').length === 1, 'OG único ' + key)
      }
      const ids = Array.from(document.head.querySelectorAll('script[type="application/ld+json"]')).map(s => s.id)
      assert(JSON.stringify(ids) === JSON.stringify(head.scripts.map(s => s.id)), 'scripts residuais ' + path)
      assert(document.getElementById('arq-seo-robots')?.getAttribute('content') === head.robots, 'robots ' + path)
      report.steps.push({ path, title: document.title, scripts: ids, noindex: !!head.robots })
      publish()
    }
    void (async () => {
      try {
        await pause(120)
        for (const path of paths) await step(path)
        await step('/perguntas-frequentes')
        await step('/loja/zeus')
        await step('/')
        await step('/404-qa')
        await step('/')
        await step('/loja/zeus', { state: { backgroundLocation: { pathname: '/', search: '', hash: '', state: null, key: 'qa-home' } } })
        assert(!!document.querySelector('[role="dialog"]'), 'pop-up real montado')
        assert(document.querySelectorAll('#root h1').length >= 1, 'fundo home presente')
        await step('/')
        await step('/loja/fenix?utm_source=qa')
        const count = report.events.length
        await step('/loja/fenix?utm_source=qa#ficha')
        assert(report.events.length === count, 'hash não deve duplicar page_view')
        assert(report.events.length === report.steps.length - 1, 'um page_view por mudança de pathname/search; repetição da home e hash não duplicam')
        for (const event of report.events as { page_path: string; page_title: string; headTitle: string; canonical: string }[]) {
          assert(event.page_title === resolveSeo(event.page_path).title, 'tracking title ' + event.page_path)
          assert(event.page_title === event.headTitle, 'head aplicado antes do page_view')
          assert(event.canonical === resolveSeo(event.page_path).canonical, 'canonical antes do page_view')
        }
        report.checks.push('18 rotas, FAQ→PDP→home, 404→home e pop-up: head exato sem resíduos; tracking único e título correto antes do envio')

        const doc = document.implementation.createHTMLDocument('template')
        const home = resolveSeo('/')
        const adopted = doc.createElement('script')
        adopted.id = home.scripts[0].id; adopted.type = 'application/ld+json'; adopted.textContent = home.scripts[0].json
        doc.head.appendChild(adopted)
        const foreign = doc.createElement('script'); foreign.id = 'third-party'; foreign.type = 'application/ld+json'; foreign.textContent = '{"thirdParty":true}'
        doc.head.appendChild(foreign)
        const gtm = doc.createElement('script'); gtm.id = 'gtm-preserved'; gtm.textContent = '// GTM'; doc.head.appendChild(gtm)
        const externalRobots = doc.createElement('meta'); externalRobots.name = 'robots'; externalRobots.content = 'noindex,nofollow'; doc.head.appendChild(externalRobots)
        applySeo(home, doc)
        assert(doc.getElementById(adopted.id) === adopted, 'adota nó SSR existente')
        const nodes = [...doc.head.querySelectorAll('script')]
        applySeo(home, doc)
        assert(nodes.every(n => n === doc.getElementById(n.id)), 'render repetido preserva identidade')
        applySeo(resolveSeo('/perguntas-frequentes'), doc)
        applySeo(resolveSeo('/loja/zeus'), doc)
        applySeo(resolveSeo('/404-qa', { genericNotFound: true }), doc)
        assert(!doc.querySelector('link[rel="canonical"]') && !doc.querySelector('meta[property="og:url"]'), '404 genérica omite canonical/og:url')
        applySeo(home, doc)
        assert(!doc.getElementById('arq-seo-robots'), 'noindex do app removido')
        assert(doc.head.contains(foreign) && doc.head.contains(gtm) && doc.head.contains(externalRobots), 'terceiros preservados')
        report.checks.push('Adoção de script SSR por ID; identidade estável; 404 genérica sem URL fictícia; scripts/robots externos preservados')
      } catch (error) { report.errors.push(String(error)) }
      report.done = true
      publish()
    })()
  }, [navigate])
  return <aside style={{ position: 'fixed', zIndex: 9999, top: 0, left: 0, maxHeight: 120, overflow: 'auto', background: 'white', color: 'black' }}>
    <span data-qa-path>{location.pathname + location.search + location.hash}</span>
    <pre id="qa-report">pending</pre>
  </aside>
}

export function Fixture() {
  return <MemoryRouter initialEntries={['/']}><App /><Driver /></MemoryRouter>
}

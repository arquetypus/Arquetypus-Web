import { defineConfig, createServer, type Plugin, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { imagetools } from 'vite-imagetools'
import path from 'node:path'
import { writeFile } from 'node:fs/promises'

const alias = { '@': path.resolve(import.meta.dirname, './src') }
const GERADOR = '/src/lib/arquivosSeo.ts'
type Gerador = { arquivosSeo: () => Record<string, string> }

/** Atributos de HTML vêm da mesma resolução usada pelo snapshot React. */
function temaInicial(): Plugin {
  return {
    name: 'tema-inicial',
    async transformIndexHtml(html, ctx) {
      const server = ctx.server ?? await createServer({
        configFile: false, resolve: { alias }, server: { middlewareMode: true },
        appType: 'custom', logLevel: 'silent',
      })
      try {
        const mod = await server.ssrLoadModule('/src/lib/theme.ts')
        const bootstrap = await server.ssrLoadModule('/src/lib/publicRoutes.ts')
        const attributes = Object.entries(mod.DEFAULT_HTML_ATTRIBUTES as Record<string, string>)
          .map(([name, value]) => `${name}="${value}"`).join(' ')
        return html.replace('<html ', `<html ${attributes} `).replace('<!--arq-initial-render-->', () => bootstrap.initialRenderBootstrap())
      } finally {
        if (!ctx.server) await server.close()
      }
    },
  }
}

/**
 * robots.txt, sitemap.xml e llms.txt (out/2026). O conteúdo sai de src/lib/arquivosSeo.ts, com os mesmos dados do
 * site; aqui só se grava na raiz do build (e responde em `npm run dev`). O módulo é carregado pelo próprio Vite
 * (ssrLoadModule) pra resolver o alias "@" sem misturar o código do site no tsconfig da config.
 */
function arquivosSeo(): Plugin {
  let outDir = 'dist'
  let ssr = false
  return {
    name: 'arquivos-seo',
    configResolved(c) {
      outDir = path.resolve(c.root, c.build.outDir)
      ssr = !!c.build.ssr
    },
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const nome = req.url?.slice(1)
        if (nome !== 'robots.txt' && nome !== 'sitemap.xml' && nome !== 'llms.txt') return next()
        const mod = (await server.ssrLoadModule(GERADOR)) as Gerador
        res.setHeader('Content-Type', nome.endsWith('.xml') ? 'application/xml; charset=utf-8' : 'text/plain; charset=utf-8')
        res.end(mod.arquivosSeo()[nome])
      })
    },
    async closeBundle() {
      if (ssr || process.env.ARQUIVOS_SEO_RODANDO) return
      process.env.ARQUIVOS_SEO_RODANDO = '1'
      const server = await createServer({
        configFile: false,
        resolve: { alias },
        server: { middlewareMode: true },
        appType: 'custom',
        logLevel: 'silent',
      })
      try {
        const mod = (await server.ssrLoadModule(GERADOR)) as Gerador
        for (const [nome, conteudo] of Object.entries(mod.arquivosSeo())) {
          await writeFile(path.join(outDir, nome), conteudo, 'utf8')
        }
      } finally {
        await server.close()
        delete process.env.ARQUIVOS_SEO_RODANDO
      }
    },
  }
}

/**
 * Otimização automática das imagens (out/2026). Toda imagem importada de src/ (import, import.meta.glob) sai no
 * build em WebP, qualidade 80, sem metadados e com largura máxima — só reduz, nunca amplia. O original fica em
 * src/assets/ em qualidade cheia. public/ não passa por aqui (og-banner, favicons). Pra uma imagem específica,
 * passar a regra no import (`foto.jpg?w=2400`) — o que vier no import vale mais que este padrão.
 * O teto de tamanho por arquivo publicado é conferido em scripts/verify-prerender.mjs.
 */
const LARGURA_MAXIMA = 1600
const larguraMaxima = (arquivo: string) =>
  arquivo.includes('/brand/flor-') ? 900 // marca d'água: aparece com até 440 px
  : arquivo.endsWith('-desktop.jpg') ? 2400 // fotos de tela cheia no desktop (hero, destaque)
  : LARGURA_MAXIMA
/** `?responsiva` (out/2026): gera várias larguras pro `srcset` (o navegador baixa a menor que serve na tela) e
 *  devolve `{ sources, img }` — ler com `foto()`/`fotosPorId()` de src/lib/foto.ts. Nunca amplia: larguras acima
 *  do original viram o próprio original. */
const LARGURAS = '400;800;1200'
const LARGURAS_DESKTOP = '800;1200;1600;1920;2400'
const otimizarImagens = imagetools({
  defaultDirectives: async (url, metadata) => {
    if (url.searchParams.has('responsiva')) {
      const larguras = url.pathname.endsWith('-desktop.jpg') ? LARGURAS_DESKTOP : LARGURAS
      return new URLSearchParams({ format: 'webp', quality: '80', w: larguras, as: 'picture' })
    }
    const regras = new URLSearchParams({ format: 'webp', quality: '80' })
    for (const [k, v] of url.searchParams) regras.set(k, v)
    const max = larguraMaxima(url.pathname)
    if (!url.searchParams.has('w') && ((await metadata()).width ?? 0) > max) regras.set('w', String(max))
    return regras
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), otimizarImagens, temaInicial(), arquivosSeo()],
  resolve: { alias },
})

// QA isolado e sem GTM externo. Build entregue à Vercel continua sendo a SPA.
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../../../', import.meta.url));
const template = await readFile(path.join(root, 'dist/index.html'), 'utf8');
const css = template.match(/href="(\/assets\/[^" ]+\.css)"/)[1];
const server = await createServer({ root, configFile: false, plugins: [react({ include: /^$/ })],
  resolve: { alias: { '@': path.join(root, 'src') } }, appType: 'custom', server: { host: '127.0.0.1', port: 4174, strictPort: true } });
server.middlewares.use(async (req, res, next) => {
  if (req.url?.startsWith('/assets/')) {
    try { const bytes = await readFile(path.join(root, 'dist', new URL(req.url, 'http://local').pathname));
      res.setHeader('Content-Type', req.url.endsWith('.css') ? 'text/css' : 'application/octet-stream'); return res.end(bytes) } catch { return next() }
  }
  if (req.url !== '/qa-etapa2') return next();
  try {
    const { Fixture } = await server.ssrLoadModule('/docs/prerender/tools/etapa2-fixture.tsx');
    const { DEFAULT_HTML_ATTRIBUTES } = await server.ssrLoadModule('/src/lib/theme.ts');
    const attrs = Object.entries(DEFAULT_HTML_ATTRIBUTES).map(([key, value]) => `${key}="${value}"`).join(' ');
    const html = `<!doctype html><html lang="pt-BR" ${attrs}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="${css}"></head><body><pre id="qa-hydration">[]</pre><div id="root">${renderToString(createElement(Fixture))}</div><script type="module" src="/docs/prerender/tools/etapa2-client.tsx"></script></body></html>`;
    res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(html);
  } catch (error) { res.statusCode = 500; res.end(String(error)) }
});
await server.listen();
console.log('Etapa 2 QA: http://127.0.0.1:4174/qa-etapa2');

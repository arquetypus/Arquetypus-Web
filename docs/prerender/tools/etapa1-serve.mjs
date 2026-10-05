// Servidor QA local. SSR/hidratação somente neste ensaio; Vercel ainda recebe a SPA.
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const template = await readFile(path.join(root, 'index.html'), 'utf8');
const bootstrap = template.match(/<script id="reveal-bootstrap">[\s\S]*?<\/script>/)[0];
const built = await readFile(path.join(root, 'dist/index.html'), 'utf8');
const css = built.match(/href="(\/assets\/[^" ]+\.css)"/)[1];
// Simula as duas condições de mídia sem mudar preferências do computador do usuário.
const reducedCss = (await readFile(path.join(root, 'dist', css), 'utf8'))
  .replaceAll(/prefers-reduced-motion:\s*no-preference/g, 'width:0px')
  .replaceAll(/prefers-reduced-motion:\s*reduce/g, 'min-width:0px');
const server = await createServer({
  root, configFile: false, plugins: [react({ include: /^$/ })], resolve: { alias: { '@': path.join(root, 'src') } },
  server: { host: '127.0.0.1', port: 4174, strictPort: true }, appType: 'custom',
});
server.middlewares.use(async (req, res, next) => {
  if (req.url === '/qa-reduced.css') {
    res.setHeader('Content-Type', 'text/css');
    return res.end(reducedCss);
  }
  if (!req.url?.startsWith('/qa')) return next();
  try {
    const mode = new URL(req.url, 'http://localhost').searchParams.get('case') ?? 'normal';
    if (!['normal', 'slow', 'no-app', 'bundle-failed', 'no-scripts', 'missing-io', 'throwing-io', 'reduced', 'blocked', 'accepted', 'refused'].includes(mode)) throw new Error('Unknown case');
    const { Fixture } = await server.ssrLoadModule('/docs/prerender/tools/etapa1-fixture.tsx');
    const { DEFAULT_HTML_ATTRIBUTES } = await server.ssrLoadModule('/src/lib/theme.ts');
    const attributes = Object.entries(DEFAULT_HTML_ATTRIBUTES).map(([name, value]) => `${name}="${value}"`).join(' ');
    const setup = mode === 'missing-io' ? 'delete window.IntersectionObserver;' :
      mode === 'throwing-io' ? 'window.IntersectionObserver = function(){throw new Error("QA observer blocked")};' :
      mode === 'reduced' ? 'window.matchMedia = function(){return {matches:true}};' :
      mode === 'blocked' ? 'Object.defineProperty(window,"localStorage",{get(){throw new Error("QA storage blocked")}});' :
      ['accepted', 'refused'].includes(mode) ? `localStorage.setItem('arq_consent',JSON.stringify({version:1,updatedAt:new Date().toISOString(),analytics:${mode === 'accepted'},marketing:${mode === 'accepted'}}));` :
      'localStorage.removeItem("arq_consent");';
    const initialCheck = `<script>
      var result = {case:${JSON.stringify(mode)}, beforeHydration:{
        cookieAbsent: !document.querySelector('[aria-label="Cookies neste site"]'),
        formDisabled: Array.from(document.querySelectorAll('form input,form button')).every(function(el){return el.disabled}),
        videoAutoplay: document.querySelector('video').autoplay,
        heroStarted: document.querySelector('#inicio').dataset.heroStarted,
        galleryHint: !!document.querySelector('#gallery-probe .gallery-hint'),
        barAnimation: getComputedStyle(document.querySelector('.hero-timer-bar')).animationName
      }};
      var submitted = 0;
      document.querySelector('form').addEventListener('submit',function(){submitted++});
      document.querySelector('button[type=submit]').click();
      result.beforeHydration.nativeClickSubmits = submitted;
      var originalPlay = HTMLMediaElement.prototype.play;
      result.mediaStarts = [];
      function publishClocks() {
        var current=JSON.parse(document.getElementById('qa-report').textContent);
        current.mediaStarts=result.mediaStarts;
        current.heroTimers=result.heroTimers;
        document.getElementById('qa-report').textContent=JSON.stringify(current,null,2);
      }
      HTMLMediaElement.prototype.play = function() {
        var start = performance.now();
        var bar = document.querySelector('.hero-timer-bar');
        result.mediaStarts.push({time:start,heroStarted:document.querySelector('#inicio').dataset.heroStarted,barAnimation:getComputedStyle(bar).animationName,barTime:bar.getAnimations()[0]?.currentTime ?? null});
        publishClocks();
        return originalPlay.call(this);
      };
      var originalTimeout = window.setTimeout;
      result.heroTimers = [];
      window.setTimeout = function(fn,ms) {
        if (ms === 11450) {
          result.heroTimers.push({time:performance.now(),duration:ms});
          publishClocks();
        }
        return originalTimeout.apply(this,arguments);
      };
      document.getElementById('qa-report').textContent=JSON.stringify(result,null,2);
    </script>`;
    const scripts = mode === 'no-scripts' ? '' : `<script>try{localStorage.removeItem('arq_consent')}catch(e){};${setup}</script>${bootstrap}`;
    const after = mode === 'no-scripts' ? '' : initialCheck + (mode === 'no-app' ? '' : mode === 'bundle-failed' ? '<script type="module" src="/missing-qa-bundle.js"></script>' : '<script type="module" src="/docs/prerender/tools/etapa1-client.tsx"></script>');
    const html = `<!doctype html><html lang="pt-BR" ${attributes}><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>QA Etapa 1 — ${mode}</title><link rel="stylesheet" href="${mode === 'reduced' ? '/qa-reduced.css' : '/dist' + css}">${scripts}</head><body><div id="root">${renderToString(createElement(Fixture))}</div><pre id="qa-report" style="position:relative;z-index:200;white-space:pre-wrap;background:white;color:black;padding:12px">${JSON.stringify({case: mode, status:'STATIC'})}</pre><button id="qa-unmount">Desmontar ensaio</button>${after}</body></html>`;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // Sem HMR/React-refresh no documento: valida hidratação, não Fast Refresh.
    res.end(html);
  } catch (error) { res.statusCode = 500; res.end(String(error)); }
});
await server.listen();
console.log('QA: http://127.0.0.1:4174/qa?case=normal');

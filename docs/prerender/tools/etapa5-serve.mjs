// Servidor de QA restrito a loopback; respostas instrumentadas, artefatos originais intactos.
import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
process.env.NODE_ENV = 'production';
const root = fileURLToPath(new URL('../../../', import.meta.url));
const dist = path.join(root, 'dist');
const renderer = await import(pathToFileURL(path.join(root, 'dist-server/entry-server.js')));
const fixture = await readFile(new URL('./etapa5-fixture.js', import.meta.url), 'utf8');
const requests = [];
// A opção remota testa os bytes do preview em loopback com falhas controladas.
// Não acessa o painel Vercel nem altera o deployment. Analytics real é substituído.
const remotePreview = process.argv.includes('--remote-preview');
const noAppScripts = process.argv.includes('--no-app-scripts');
const previewOrigin = 'https://arquetypus-parfum-git-prerender-saniella.vercel.app';
const remoteCache = new Map();
const remoteProof = [];
const stripToolbar = html => html.replace(/\s*<script\b(?=[^>]*\bsrc="https:\/\/vercel\.live\/[^"\s]*")[^>]*>[\s\S]*?<\/script>\s*/g, '').trim();
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.jpg': 'image/jpeg', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.webmanifest': 'application/manifest+json' };
const cleanAnalytics = html => html.replace(/<!-- Google Tag Manager -->[\s\S]*?<!-- End Google Tag Manager -->/, '<script>window.dataLayer.push({event:"gtm.js",qa:true})</script>')
  .replace(/<!-- Google Tag Manager \(noscript\) -->[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->/, '');
const jsonSafe = data => JSON.stringify(data).replace(/</g, '\\u003c');
const noJsWrapper = (url, consent) => `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0}iframe{position:fixed;inset:0;width:100%;height:100%;border:0}</style></head><body><iframe id="qa-frame" sandbox="allow-same-origin allow-forms"></iframe><pre id="qa-off" hidden></pre><script>
localStorage.removeItem('arq_consent');var c=${jsonSafe(consent)};
if(['accepted','refused','expired'].includes(c))localStorage.setItem('arq_consent',JSON.stringify({version:1,analytics:c!=='refused',marketing:c!=='refused',updatedAt:new Date(Date.now()-(c==='expired'?366*864e5:0)).toISOString()}));
var frame=document.getElementById('qa-frame');if(c==='blocked')frame.setAttribute('sandbox','allow-forms');frame.src=${jsonSafe(url)};
frame.onload=function(){setTimeout(async function(){if(c==='blocked'){document.getElementById('qa-off').textContent=JSON.stringify({ready:true,consent:c,jsDisabledBySandbox:true,storageBlockedByOpaqueOrigin:true});return}var doc=frame.contentDocument;await doc.fonts.ready;var copy=doc.querySelector('main').cloneNode(true);copy.querySelectorAll('script,style,noscript').forEach(n=>n.remove());var hidden=Array.from(doc.querySelectorAll('.reveal-init')).filter(n=>frame.contentWindow.getComputedStyle(n).opacity==='0');document.getElementById('qa-off').textContent=JSON.stringify({ready:true,consent:c,jsDisabledBySandbox:true,title:doc.title,h1:Array.from(doc.querySelectorAll('main h1')).map(n=>n.textContent),mainText:copy.textContent,hiddenReveal:hidden.length,cookie:!!doc.querySelector('[aria-label="Cookies neste site"]'),rootVisibility:frame.contentWindow.getComputedStyle(doc.getElementById('root')).visibility,carousel:Array.from(doc.querySelectorAll('#comunidade article')).slice(0,3).map(n=>({filter:frame.contentWindow.getComputedStyle(n).filter,opacity:frame.contentWindow.getComputedStyle(n).opacity})),forms:Array.from(doc.querySelectorAll('form')).map(f=>({names:Array.from(f.elements).map(n=>n.name)}))})},250)};
</script></body></html>`;
createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1:4177');
  const requestRecord = { time: new Date().toISOString(), method: req.method, url: req.url, range: req.headers.range ?? null };
  requests.push(requestRecord);
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (url.pathname === '/__qa/requests') { res.setHeader('Content-Type', types['.json']); return res.end(JSON.stringify(requests)); }
    if (url.pathname === '/__qa/remote-proof') { res.setHeader('Content-Type', types['.json']); return res.end(JSON.stringify(remoteProof)); }
    if (url.pathname === '/__qa/dom.js') {
      const script = await readFile(new URL('./etapa5-dom.js', import.meta.url), 'utf8');
      res.setHeader('Content-Type', types['.js']); return res.end(script);
    }
    if (url.pathname === '/__qa/raw') {
      res.setHeader('Content-Type', types['.html']);
      return res.end('<!doctype html><meta charset="utf-8"><h1>QA de HTML bruto</h1><pre id="qa-dom"></pre><script src="/__qa/dom.js"></script>');
    }
    if (url.pathname === '/__qa/slow') {
      const target = new URL(url.searchParams.get('route') ?? '/', url.origin);
      if (target.origin !== url.origin) throw Error('Somente loopback');
      target.searchParams.set('bundle', 'slow'); target.searchParams.set('consent', 'accepted');
      res.setHeader('Content-Type', types['.html']);
      return res.end(`<!doctype html><meta charset="utf-8"><style>html,body{margin:0}iframe{position:fixed;inset:0;width:100%;height:100%;border:0}button{position:fixed;right:0;top:0;z-index:99}</style><iframe id="qa-frame"></iframe><button id="start">Carregar teste lento</button><pre id="qa-slow" hidden></pre><script>
document.getElementById('start').onclick=function(){this.hidden=true;document.getElementById('qa-frame').src=${jsonSafe(target.pathname + target.search + target.hash)}};
var samples=[];setInterval(function(){var doc=document.getElementById('qa-frame').contentDocument;if(!doc||!doc.getElementById('root'))return;var reportNode=doc.getElementById('qa-report'),report=reportNode?.textContent?JSON.parse(reportNode.textContent):null;var scroll=doc.querySelector('[data-scroll-container]')?.scrollTop;var carousels=Array.from(doc.querySelectorAll('.no-scrollbar')).map(n=>({left:n.scrollLeft,width:n.clientWidth,total:n.scrollWidth}));var video=doc.querySelector('video'),bar=Array.from(doc.querySelectorAll('.hero-timer-bar')).find(n=>n.parentElement.getBoundingClientRect().width>0),hero=doc.querySelector('[data-hero-started]');var media={started:hero?.dataset.heroStarted,h1:doc.querySelector('h1')?.textContent,videoTime:video?.currentTime,paused:video?.paused,barWidth:bar?.getBoundingClientRect().width};if(samples.length<650)samples.push({time:Date.now(),scroll:scroll,carousels:carousels,media:media,hydrated:!!report?.hydrated});document.getElementById('qa-slow').textContent=JSON.stringify({ready:true,scroll:scroll,media:media,h1:doc.querySelector('h1')?.textContent,report:report,samples:samples})},100);
</script>`);
    }
    if (url.pathname === '/__qa/contracts') {
      const rows = [];
      for (const route of [...renderer.routes, null]) {
        const file = route === null ? '404.html' : route === '/' ? 'index.html' : route.slice(1) + '.html';
        const rendered = renderer.render(route ?? '/qa-not-found', { genericNotFound: route === null });
        rows.push({ route, file, html: await readFile(path.join(dist, file), 'utf8'), head: rendered.head,
          product: renderer.products.find(product => '/loja/' + product.id === route) ?? null });
      }
      res.setHeader('Content-Type', types['.json']); return res.end(jsonSafe(rows));
    }
    if (url.pathname === '/__qa/off') {
      const target = new URL(url.searchParams.get('route') ?? '/', url.origin);
      if (target.origin !== url.origin) throw Error('Somente loopback');
      target.searchParams.set('raw', '1');
      res.setHeader('Content-Type', types['.html']); return res.end(noJsWrapper(target.pathname + target.search, url.searchParams.get('consent') ?? 'absent'));
    }
    const pathname = decodeURIComponent(url.pathname).replace(/\/+$/, '') || '/';
    let file = pathname === '/' ? 'index.html' : path.extname(pathname) ? pathname.slice(1) : pathname.slice(1) + '.html';
    const base = url.searchParams.has('baseline') ? path.join(root, 'node_modules/.tmp/etapa5-baseline/dist') : dist;
    // Baseline assets carregam pela mesma origem; seu prefixo privado não altera URLs do app.
    const assetBase = url.pathname.startsWith('/__baseline-assets/') ? path.join(root, 'node_modules/.tmp/etapa5-baseline/dist') : base;
    if (url.pathname.startsWith('/__baseline-assets/')) file = url.pathname.slice('/__baseline-assets/'.length);
    const absolute = path.resolve(assetBase, file);
    if (!absolute.startsWith(assetBase + path.sep)) { res.writeHead(400); return res.end(); }
    let bytes;
    try { bytes = await readFile(absolute); } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      file = url.searchParams.has('baseline') ? 'index.html' : '404.html';
      bytes = await readFile(path.join(url.searchParams.has('baseline') ? base : dist, file));
      res.statusCode = url.searchParams.has('baseline') ? 200 : 404;
    }
    if (remotePreview) {
      if (url.searchParams.has('baseline') || url.pathname.startsWith('/__baseline-assets/')) throw Error('Baseline não permitido no QA remoto');
      // Apenas caminhos que correspondem a arquivos do build validado são encaminhados.
      const remotePath = file === '404.html' ? '/qualquer-coisa' : file.endsWith('.html') ? pathname : '/' + file.replaceAll(path.sep, '/');
      if (!remoteCache.has(remotePath)) {
        const upstream = await fetch(previewOrigin + remotePath, { redirect: 'manual', signal: AbortSignal.timeout(30000) });
        const remoteBytes = Buffer.from(await upstream.arrayBuffer());
        if (upstream.status !== res.statusCode) throw Error('Status remoto divergente: ' + remotePath);
        const same = file.endsWith('.html') ? stripToolbar(remoteBytes.toString('utf8')) === stripToolbar(bytes.toString('utf8')) : remoteBytes.equals(bytes);
        if (!same) throw Error('Bytes remotos divergentes do build validado: ' + remotePath);
        remoteProof.push({ path: remotePath, status: upstream.status, sameAsValidatedBuild: same,
          sha256: createHash('sha256').update(remoteBytes).digest('hex'),
          deploymentId: remoteBytes.toString('utf8').match(/data-deployment-id="([^"]+)"/)?.[1] ?? null });
        remoteCache.set(remotePath, remoteBytes);
      }
      bytes = remoteCache.get(remotePath);
      if (file.endsWith('.html')) bytes = Buffer.from(stripToolbar(bytes.toString('utf8')));
    }
    if (file.endsWith('.js') && url.searchParams.get('bundle') === 'blocked') { res.writeHead(503); return res.end('QA bundle bloqueado'); }
    if (file.endsWith('.js') && url.searchParams.get('bundle') === 'slow') await new Promise(resolve => setTimeout(resolve, 45000));
    if (file.endsWith('.html')) {
      let html = cleanAnalytics(bytes.toString('utf8'));
      if (url.searchParams.has('baseline')) html = html.replaceAll('/assets/', '/__baseline-assets/assets/');
      if (noAppScripts) {
        // Remove somente scripts executáveis das respostas QA; JSON-LD permanece.
        // Permite controles nativos sem React/bootstrap/GTM, com automação do Chrome ativa.
        html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, script => /type=["']application\/ld\+json["']/.test(script) ? script : '');
      } else if (!url.searchParams.has('raw')) {
        html = html.replace('<head>', '<head><script>' + fixture + '</script>');
        html = html.replace('</body>', '<pre id="qa-report" hidden></pre><script>window.dispatchEvent(new Event("qa:root-ready"))</script></body>');
        const bundle = url.searchParams.get('bundle');
        if (bundle) html = html.replace(/(<script\b[^>]*type="module"[^>]*src=")([^"]+)/g, (_, prefix, src) => prefix + src + '?bundle=' + bundle);
        if (url.searchParams.has('reduce')) html = html.replace('</head>', '<style>*,*::before,*::after{animation-duration:0.001ms!important;animation-delay:0ms!important;transition-duration:0.001ms!important}</style></head>');
      }
      bytes = Buffer.from(html);
    }
    res.setHeader('Content-Type', types[path.extname(file)] ?? 'application/octet-stream');
    // O navegador solicita trechos de MP4; responder sempre 200 distorce o waterfall de QA.
    if (file.endsWith('.mp4')) {
      res.setHeader('Accept-Ranges', 'bytes');
      if (req.headers.range) {
        const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
        const start = range?.[1] ? Number(range[1]) : range?.[2] ? Math.max(0, bytes.length - Number(range[2])) : NaN;
        const end = range?.[1] && range[2] ? Math.min(Number(range[2]), bytes.length - 1) : bytes.length - 1;
        if (!Number.isSafeInteger(start) || start > end || start >= bytes.length) {
          res.setHeader('Content-Range', `bytes */${bytes.length}`);
          res.writeHead(416); return res.end();
        }
        res.statusCode = 206;
        res.setHeader('Content-Range', `bytes ${start}-${end}/${bytes.length}`);
        bytes = bytes.subarray(start, end + 1);
      }
    }
    res.setHeader('Content-Length', bytes.length);
    Object.assign(requestRecord, { status: res.statusCode, bytes: bytes.length });
    res.end(bytes);
  } catch (error) { res.writeHead(500); res.end(String(error)); }
}).listen(4177, '127.0.0.1', () => console.log(`QA ${remotePreview ? 'preview instrumentado' : 'local'}: http://127.0.0.1:4177/`));
process.on('SIGINT', async () => { await writeFile(path.join(root, `node_modules/.tmp/${remotePreview ? 'etapa6' : 'etapa5'}-requests.json`), JSON.stringify(remotePreview ? { requests, remoteProof } : requests, null, 2)); process.exit(); });

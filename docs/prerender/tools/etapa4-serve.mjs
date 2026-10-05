// QA local das URLs limpas antes da configuração Vercel da Etapa 6.
// Serve o build real; instrumentação DOM somente aqui, sem analytics externos.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../../../', import.meta.url));
const dist = path.join(root, 'dist');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.jpg': 'image/jpeg', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.webmanifest': 'application/manifest+json' };
const instrument = `<script id="qa-instrument">(function(){
var logs=[];function publish(){var report=document.getElementById('qa-errors');if(report)report.textContent=JSON.stringify(logs)}
['warn','error'].forEach(function(key){var original=console[key];console[key]=function(){logs.push(Array.from(arguments).map(String).join(' '));original.apply(console,arguments);publish()}});
window.addEventListener('error',function(event){if(event.error){logs.push(String(event.error));publish()}});
window.addEventListener('unhandledrejection',function(event){logs.push(String(event.reason));publish()});
document.addEventListener('DOMContentLoaded',publish);
})();</script>`;
const observe = `<pre id="qa-errors" hidden>[]</pre><pre id="qa-state" hidden></pre><script>(function(){
var root=document.getElementById('root'), initial=root.querySelector('h1');
var before={route:document.documentElement.getAttribute('data-rota'),h1:initial&&initial.textContent,rootHidden:!!document.documentElement.hasAttribute('data-arq-client-render')};
var frames=[];var until=Date.now()+1200;function paint(){frames.push({time:Date.now(),hidden:getComputedStyle(root).visibility==='hidden',dialog:!!document.querySelector('[role="dialog"]'),h1:root.querySelector('h1')&&root.querySelector('h1').textContent});if(Date.now()<until)requestAnimationFrame(paint)}requestAnimationFrame(paint);
setTimeout(function(){document.getElementById('qa-state').textContent=JSON.stringify({before:before,nodePreserved:initial===root.querySelector('h1'),frames:frames,ready:true})},1600);
})();</script>`;
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://127.0.0.1');
    let pathname = decodeURIComponent(url.pathname);
    let file = pathname === '/' ? '/index.html' : path.extname(pathname) ? pathname : pathname.replace(/\/+$/, '') + '.html';
    const absolute = path.resolve(dist, '.' + file);
    if (!absolute.startsWith(dist + path.sep)) { res.writeHead(400); return res.end(); }
    let bytes;
    try { bytes = await readFile(absolute); } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      file = '/404.html'; bytes = await readFile(path.join(dist, '404.html')); res.statusCode = 404;
    }
    if (file.endsWith('.html')) {
      let html = bytes.toString('utf8').replace(/<!-- Google Tag Manager -->[\s\S]*?<!-- End Google Tag Manager -->/, '')
        .replace(/<!-- Google Tag Manager \(noscript\) -->[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->/, '');
      html = html.replace('<head>', '<head>' + instrument).replace('</body>', observe + '</body>');
      // React pede imagem antes de DOM estar pronto; nada da instrumentação altera root/head SEO.
      bytes = Buffer.from(html);
    }
    if (url.searchParams.get('qa_no_bundle') === '1' && file.endsWith('.js')) { res.writeHead(503); return res.end(); }
    res.setHeader('Content-Type', types[path.extname(file)] ?? 'application/octet-stream');
    res.end(bytes);
  } catch (error) { res.writeHead(500); res.end(String(error)); }
}).listen(4175, '127.0.0.1', () => console.log('Etapa 4 QA: http://127.0.0.1:4175/'));

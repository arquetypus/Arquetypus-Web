// Fixture local: iframe carrega HTML e JS reais da Vercel; não modifica dist/deployment.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
const gate = JSON.parse(await readFile('dist-server/verify-prerender.json', 'utf8'));
const routes = gate.rows.filter(row => row.route !== null).map(row => row.route);
const preview = 'https://arquetypus-parfum-git-prerender-saniella.vercel.app';
const escape = text => text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const server = http.createServer((request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1:4178');
  const route = url.searchParams.get('route') ?? '/';
  const mode = url.searchParams.get('mode') ?? 'off';
  const origin = url.searchParams.get('variant') === 'baseline' ? 'https://www.arquetypus.com.br' : preview;
  if ((!routes.includes(route) && route !== '/qualquer-coisa') || !['off', 'blocked', 'normal'].includes(mode)) {
    response.writeHead(400); response.end('Cenário inválido'); return;
  }
  const sandbox = mode === 'off' ? ' sandbox="allow-same-origin"' : mode === 'blocked' ? ' sandbox="allow-scripts"' : '';
  const width = [390, 768, 1024, 1440].includes(Number(url.searchParams.get('width'))) ? Number(url.searchParams.get('width')) + 'px' : '100%';
  const height = [844, 900].includes(Number(url.searchParams.get('height'))) ? Number(url.searchParams.get('height')) + 'px' : '100vh';
  // Escala somente a apresentação da fixture; viewport CSS do site permanece original.
  const fit = url.searchParams.get('fit') === '1' && width.endsWith('px') ? Math.min(1, 390 / parseFloat(width)) : 1;
  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>QA remoto ${escape(route)}</title>
    <style>body{margin:0;overflow:hidden}iframe{width:${width};height:${height};border:0;display:block;transform:scale(${fit});transform-origin:top left}</style>
    <iframe id="app" title="Preview real: ${escape(route)}" src="${escape(origin + route)}"${sandbox}></iframe></html>`);
});
server.listen(4178, '127.0.0.1', () => console.log('QA remoto em http://127.0.0.1:4178; off=sem scripts, blocked=origem opaca, normal=CSS responsivo real.'));
process.on('SIGINT', () => server.close(() => process.exit(0)));

// Verifica HTTP real, sem executar JavaScript dos documentos ou seguir redirects implicitamente.
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { verifyDocuments, routeFile } from '../../../scripts/prerender-utils.mjs';

process.env.NODE_ENV = 'production';
const origin = process.argv[2] ?? 'https://arquetypus-parfum-git-prerender-saniella.vercel.app';
assert.match(origin, /^https:\/\/[a-z0-9-]+\.vercel\.app\/?$/);
const output = 'docs/prerender/evidence/etapa6';
await mkdir(output + '-html', { recursive: true });
const renderer = await import(pathToFileURL(path.resolve('dist-server/entry-server.js')).href);
const gate = JSON.parse(await readFile('dist-server/verify-prerender.json', 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const report = { collectedAt: new Date().toISOString(), origin, checks: [], failures: [], documents: [], resources: [] };
const pages = [];
// Única mutação permitida na comparação: toolbar Vercel injetada em preview.
const stripToolbar = html => html.replace(/\s*<script\b(?=[^>]*\bsrc="https:\/\/vercel\.live\/[^"\s]*")[^>]*>[\s\S]*?<\/script>\s*/g, '');
const run = async (target, status, destination, file) => {
  let getBody;
  for (const method of ['GET', 'HEAD']) {
    const row = { target, method, expectedStatus: status, expectedLocation: destination ?? null };
    try {
      const response = await fetch(new URL(target, origin), { method, redirect: 'manual', signal: AbortSignal.timeout(30000) });
      const body = await response.text();
      Object.assign(row, { status: response.status, headers: Object.fromEntries(response.headers), bytes: Buffer.byteLength(body), sha256: hash(body) });
      assert.equal(response.status, status, `${method} ${target}`);
      if (destination) {
        const location = new URL(response.headers.get('location'), origin);
        assert.equal(location.origin, new URL(origin).origin);
        const expected = new URL(destination, origin);
        assert.equal(decodeURIComponent(location.pathname), decodeURIComponent(expected.pathname), `${target} Location`);
        assert.equal(location.search, expected.search, `${target} query`);
      } else assert.equal(response.headers.get('location'), null);
      if (method === 'HEAD') assert.equal(body.length, 0);
      if (file && method === 'GET') {
        assert.match(response.headers.get('content-type'), /^text\/html/);
        assert.match(response.headers.get('x-robots-tag') ?? '', /noindex/);
        assert.ok(!/immutable/.test(response.headers.get('cache-control') ?? ''), 'Cache HTML imutável');
        const local = await readFile(path.join('dist', file), 'utf8');
        // A ferramenta não remove head, conteúdo, bootstrap ou scripts da aplicação.
        assert.equal(stripToolbar(body).trim(), stripToolbar(local).trim(), `${target}: HTML remoto/local divergente`);
      }
      row.passed = true;
      if (method === 'GET') getBody = body;
    } catch (error) { row.passed = false; row.error = error.message; report.failures.push(row); }
    report.checks.push(row);
  }
  return getBody;
};

for (const route of renderer.routes) {
  const file = routeFile(route);
  const html = await run(route, 200, null, file);
  if (html !== undefined) {
    await writeFile(path.join(output + '-html', file.replaceAll('/', '--')), html);
    pages.push({ route, file, html: stripToolbar(html).trim() });
  }
  const extensionPath = route === '/' ? '/index.html' : route + '.html';
  await run(extensionPath, 308, route);
  if (route !== '/') await run(route + '/', 308, route);
}
for (const product of renderer.products) {
  const id = product.id;
  await run(`/arquetipos/${id}?utm_source=qa&utm_campaign=prerender`, 308, `/loja/${id}?utm_source=qa&utm_campaign=prerender`);
  const encoded = [...id].map(char => '%' + char.charCodeAt(0).toString(16)).join('');
  await run(`/loja/${encoded}`, 200, null, routeFile('/loja/' + id));
  await run(`/loja/${encoded}/`, 308, `/loja/${encoded}`);
  await run(`/loja/${encoded}.html`, 308, `/loja/${encoded}`);
  await run(`/loja/${id}.html/`, 308, '/loja/' + id);
  // Dot codificado não é extensão estática normalizada pela plataforma: 404 própria.
  await run(`/loja/${id}%2ehtml`, 404, null, '404.html');
  await run(`/loja/${id}x`, 307, '/');
  await run(`/loja/${id.toUpperCase()}`, 307, '/');
}
for (const id of ['nao-existe', 'constructor', 'toString', '__proto__', 'ze', '%5Aeus', '%257aeus', 'zeus%2Fextra']) {
  await run('/loja/' + id, 307, '/');
  await run('/loja/' + id + '/', 308, '/loja/' + id);
}
await run('/kit-descoberta', 307, '/');
await run('/kit-descoberta?utm_source=qa', 307, '/?utm_source=qa');
await run('/loja/nao-existe?utm_source=qa', 307, '/?utm_source=qa');
await run('/loja/zeus.html?utm_source=qa', 308, '/loja/zeus?utm_source=qa');
await run('/loja/zeus/?utm_source=qa', 308, '/loja/zeus?utm_source=qa');

for (const target of ['/trocas', '/termos', '/qualquer-coisa', '/loja/zeus/extra', '/assets/nao-existe.js', '/loja', '/loja/']) {
  // Barra de /loja/ primeiro normaliza; destino /loja retorna 404.
  if (target === '/loja/') { await run(target, 308, '/loja'); continue; }
  const html = await run(target, 404, null, '404.html');
  if (target === '/qualquer-coisa' && html) {
    await writeFile(path.join(output + '-html', '404.html'), html);
    pages.push({ route: null, file: '404.html', html: stripToolbar(html).trim() });
  }
}

try {
  assert.equal(pages.length, 19);
  const checked = await verifyDocuments(pages, renderer, path.resolve('dist'));
  report.documents = checked.rows;
} catch (error) { report.failures.push({ scope: 'HTML bruto/head/H1/preço/conteúdo/JSON-LD', error: error.message }); }

for (const target of [...gate.resources, '/robots.txt', '/sitemap.xml', '/llms.txt']) {
  const row = { target };
  try {
    const response = await fetch(new URL(target, origin), { redirect: 'manual', signal: AbortSignal.timeout(30000) });
    const bytes = Buffer.from(await response.arrayBuffer());
    const local = await readFile(path.join('dist', target.slice(1)));
    Object.assign(row, { status: response.status, headers: Object.fromEntries(response.headers), bytes: bytes.length, sha256: hash(bytes), localSha256: hash(local) });
    assert.equal(response.status, 200);
    assert.ok(!response.headers.get('content-type')?.startsWith('text/html'));
    // sitemap lastmod é data de build: única diferença volátil permitida nos recursos SEO.
    if (target === '/sitemap.xml') assert.equal(bytes.toString().replace(/<lastmod>[^<]+<\/lastmod>/g, ''), local.toString().replace(/<lastmod>[^<]+<\/lastmod>/g, ''));
    else assert.ok(bytes.equals(local), 'Bytes de recurso diferentes do build local');
    const type = response.headers.get('content-type') ?? '';
    const mime = target.endsWith('.js') ? /(?:javascript|ecmascript)/ : target.endsWith('.css') ? /text\/css/ : /\.(?:png|jpe?g|webp|avif|svg|ico)$/.test(target) ? /image\// : /\.(?:woff2?|ttf)$/.test(target) ? /(?:font\/|application\/font)/ : target.endsWith('.xml') ? /xml/ : target.endsWith('.txt') ? /text\/plain/ : null;
    if (mime) assert.match(type, mime);
    const head = await fetch(new URL(target, origin), { method: 'HEAD', redirect: 'manual', signal: AbortSignal.timeout(30000) });
    row.head = { status: head.status, headers: Object.fromEntries(head.headers), bytes: (await head.arrayBuffer()).byteLength };
    assert.equal(head.status, 200);
    assert.equal(row.head.bytes, 0);
    assert.equal(head.headers.get('content-type'), response.headers.get('content-type'));
    if (/\.(?:js|css|png|jpe?g|webp|avif|svg|ico|woff2?|ttf)$/.test(target)) {
      assert.equal(head.headers.get('etag'), response.headers.get('etag'), 'GET/HEAD de builds distintos');
    }
    row.passed = true;
  } catch (error) { row.passed = false; row.error = error.message; report.failures.push(row); }
  report.resources.push(row);
}
await writeFile(output + '-http.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ checks: report.checks.length, documents: report.documents.length, resources: report.resources.length, failures: report.failures }, null, 2));
if (report.failures.length) process.exitCode = 1;

// Preview ainda SPA. SSR é ensaio privado de build nesta etapa.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const evidence = path.join(root, 'docs/prerender/evidence');
const origin = 'https://arquetypus-parfum-git-prerender-saniella.vercel.app';
const codeCommit = process.argv[2];
assert.match(codeCommit ?? '', /^[0-9a-f]{40}$/);
const json = async file => JSON.parse(await readFile(path.join(evidence, file), 'utf8'));
const contracts = JSON.parse(await readFile(path.join(root, 'dist-server/smoke-ssr.json'), 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const fetchBytes = async (base, route) => {
  const response = await fetch(base + route, { redirect: 'manual', signal: AbortSignal.timeout(30000) });
  return { status: response.status, headers: Object.fromEntries(response.headers), bytes: Buffer.from(await response.arrayBuffer()) };
};
let report;
if (!process.argv.includes('--browser-only')) {
  report = { collectedAt: new Date().toISOString(), codeCommit, origin, responses: [], resources: [], staticFiles: [], checks: [] };
  const localHtml = await readFile(path.join(root, 'dist/index.html'));
  const paths = [...contracts.routes.map(row => row.route), '/loja/constructor', '/loja/toString', '/loja/__proto__', '/loja/zeus?utm_source=qa', '/%6Coja/%7Aeus'];
  for (const route of paths) {
    const response = await fetchBytes(origin, route);
    assert.equal(response.status, 200, route);
    assert.equal(response.headers['x-robots-tag'], 'noindex', route);
    assert.ok(response.bytes.subarray(0, localHtml.length).equals(localHtml), route);
    assert.match(response.bytes.toString('utf8'), /<div id="root"><\/div>/);
    report.responses.push({ route, status: response.status, rootEmpty: true, sha256: hash(response.bytes) });
  }
  // Publicar só dist: rotas de fontes/ensaio continuam fallback HTML, nunca JS/relatório SSR.
  for (const route of ['/dist-server/entry-server.js', '/dist-server/smoke-ssr.json', '/src/entry-server.tsx']) {
    const response = await fetchBytes(origin, route);
    assert.match(response.headers['content-type'], /text\/html/);
    assert.ok(response.bytes.subarray(0, localHtml.length).equals(localHtml), route);
    report.responses.push({ route, status: response.status, privateArtifactNotExposed: true });
  }
  const resources = [...contracts.resources];
  const workers = Array.from({ length: 4 }, async () => {
    while (resources.length) {
      const item = resources.shift();
      const response = await fetchBytes(origin, item.url);
      assert.equal(response.status, 200, item.url);
      assert.equal(hash(response.bytes), item.sha256, item.url);
      report.resources.push({ ...item, identical: true });
    }
  });
  await Promise.all(workers);
  report.resources.sort((a, b) => a.url.localeCompare(b.url));
  for (const file of ['robots.txt', 'sitemap.xml', 'llms.txt']) {
    const response = await fetchBytes(origin, '/' + file);
    assert.equal(response.status, 200);
    assert.ok(response.bytes.equals(await readFile(path.join(root, 'dist', file))), file);
    report.staticFiles.push({ file, identical: true, sha256: hash(response.bytes) });
  }
  const production = await fetchBytes('https://www.arquetypus.com.br', '/');
  assert.equal(production.status, 200);
  const html = production.bytes.toString('utf8');
  assert.ok(html.includes('/assets/index-CEBNf12q.js'));
  assert.ok(html.includes('/assets/index-C9zeGloN.css'));
  report.production = { origin: 'https://www.arquetypus.com.br', status: production.status, assetsPreserved: true, sha256: hash(production.bytes) };
  report.checks.push('24 respostas SPA, preview noindex, ensaio privado, recursos/SEO byte a byte, produção preservada');
  await writeFile(path.join(evidence, 'etapa3-preview-http.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(`PASS HTTP: ${paths.length} rotas/variantes, ${report.resources.length} recursos, 3 arquivos SEO, SSR privado e produção preservada.`);
  if (process.argv.includes('--http-only')) process.exit(0);
} else {
  report = await json('etapa3-preview-http.json');
  assert.equal(report.codeCommit, codeCommit);
}
const metadata = await json('etapa3-preview-metadata.json');
const ui = await json('etapa3-preview-ui.json');
assert.equal(metadata.codeCommit, codeCommit);
assert.equal(ui.codeCommit, codeCommit);
assert.equal(metadata.rows.length, 18);
assert.deepEqual(metadata.console, []);
assert.deepEqual(ui.console, []);
const normalized = value => value.replace(/\s+/g, ' ').trim();
for (const row of metadata.rows) {
  const expected = contracts.routes.find(r => r.route === row.route);
  assert.equal(row.title, expected.head.title, row.route);
  assert.equal(row.description, expected.head.description, row.route);
  assert.equal(row.canonical, expected.head.canonical, row.route);
  assert.equal(row.ogType, expected.head.og.type, row.route);
  assert.deepEqual(row.theme, contracts.theme);
  assert.deepEqual(row.brokenVisibleImages, []);
  assert.ok(row.mainExcerpt.length > 100);
  if (row.route !== '/') assert.deepEqual(row.h1.map(normalized), expected.h1, row.route);
  assert.ok(Object.values(row.counts).every(n => n === 1), row.route);
  assert.deepEqual(row.jsonLd, expected.head.scripts.map(s => ({ id: s.id, data: JSON.parse(s.json) })), row.route);
  if (row.route.startsWith('/loja/')) {
    const product = row.jsonLd.find(s => s.id === 'arq-seo-product').data;
    assert.equal(new URL(row.primaryImage).pathname, new URL(product.image).pathname, row.route);
    const price = expected.head.description.match(/R\$\s*[\d.,]+/)[0];
    assert.ok(row.mainExcerpt.replaceAll(/\s/g, '').includes(price.replaceAll(/\s/g, '')), row.route);
  }
}
for (const [key, value] of Object.entries(ui.checks)) assert.equal(value, true, key);
report.checks.push('18 páginas reais: head/conteúdo/imagens; slugs herdados redirecionam sem crash; popup/galeria/FAQ/menu/histórico/404 aprovados');
await writeFile(path.join(evidence, 'etapa3-preview-validation.json'), JSON.stringify(report, null, 2) + '\n');
console.log('PASS preview completo da Etapa 3');

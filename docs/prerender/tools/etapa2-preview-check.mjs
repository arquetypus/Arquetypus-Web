// Coleta HTTP e valida o preview da Etapa 2. Não é aceite do HTML pré-renderizado da Etapa 4.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../../../', import.meta.url));
const evidence = path.join(root, 'docs/prerender/evidence');
const origin = 'https://arquetypus-parfum-git-prerender-saniella.vercel.app';
const json = async name => JSON.parse(await readFile(path.join(evidence, name), 'utf8'));
const baseline = await json('etapa1-preview-metadata.json');
const contracts = await json('etapa2-contracts.json');
const localBrowser = await json('etapa2-browser-local.json');
assert.equal(localBrowser.done, true); assert.deepEqual(localBrowser.errors, []);
assert.deepEqual(localBrowser.hydration, []); assert.deepEqual(localBrowser.console, []);
assert.equal(localBrowser.events.length, 26); assert.equal(localBrowser.steps.length, 27);
const localHtml = await readFile(path.join(root, 'dist/index.html'));
const routes = contracts.rows.map(row => row.route);
const report = { collectedAt: new Date().toISOString(), origin, codeCommit: process.argv[2], routes, responses: [], assets: [], staticFiles: [], checks: [] };
assert.match(report.codeCommit ?? '', /^[0-9a-f]{40}$/);
const hash = b => createHash('sha256').update(b).digest('hex');
const fetchBytes = async route => {
  const r = await fetch(origin + route, { signal: AbortSignal.timeout(25000), redirect: 'manual' });
  return { route, status: r.status, headers: Object.fromEntries(r.headers), bytes: Buffer.from(await r.arrayBuffer()) };
};
const responses = await Promise.all([...routes, '/404-etapa2-qa', '/loja/nao-existe', '/loja/zeus?utm_source=qa', '/SOBRE'].map(fetchBytes));
for (const r of responses) {
  assert.equal(r.status, 200, r.route); // SPA até Etapa 4/6.
  assert.equal(r.headers['x-robots-tag'], 'noindex', r.route);
  const html = r.bytes.toString('utf8');
  assert.ok(/<div id="root"><\/div>/.test(html), r.route);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 0);
  assert.ok(r.bytes.subarray(0, localHtml.length).equals(localHtml), r.route);
  report.responses.push({ route: r.route, status: r.status, headers: r.headers, rootEmpty: true, rawH1Count: 0, sha256: hash(r.bytes) });
}
await writeFile(path.join(evidence, 'etapa2-preview-index.html'), responses[0].bytes);
report.checks.push('18 rotas públicas e quatro variantes retornam SPA esperada, preview noindex e template do build local');
const assets = [...localHtml.toString('utf8').matchAll(/(?:src|href)="(\/assets\/[^" ]+\.(?:js|css))"/g)].map(m => m[1]);
for (const asset of assets) {
  const remote = await fetchBytes(asset);
  const expected = await readFile(path.join(root, 'dist', asset));
  assert.equal(remote.status, 200); assert.ok(remote.bytes.equals(expected), asset);
  report.assets.push({ path: asset, bytes: expected.length, sha256: hash(expected), identical: true });
}
assert.equal(report.assets.length, 2);
for (const file of ['robots.txt', 'sitemap.xml', 'llms.txt']) {
  const remote = await fetchBytes('/' + file);
  const expected = await readFile(path.join(root, 'dist', file));
  assert.equal(remote.status, 200); assert.ok(remote.bytes.equals(expected), file);
  report.staticFiles.push({ file, sha256: hash(expected), identical: true });
}
report.checks.push('JS/CSS e três arquivos SEO byte a byte iguais ao build local');
await writeFile(path.join(evidence, 'etapa2-preview-http.json'), JSON.stringify(report, null, 2) + '\n');
if (process.argv.includes('--http-only')) { console.log('PASS HTTP/assets/arquivos SEO'); process.exit(0) }
const metadata = await json('etapa2-preview-metadata.json');
const ui = await json('etapa2-preview-ui.json');
assert.equal(metadata.codeCommit, report.codeCommit); assert.equal(metadata.rows.length, 18);
assert.deepEqual(metadata.console, []); assert.deepEqual(ui.console, []);
for (const row of metadata.rows) {
  const expected = contracts.rows.find(r => r.route === row.route).head;
  const old = baseline.rows.find(r => r.route === row.route);
  assert.equal(row.title, expected.title, row.route);
  assert.equal(row.description, expected.description, row.route);
  assert.equal(row.canonical, expected.canonical, row.route);
  assert.equal(row.ogType, expected.og.type, row.route);
  assert.equal(row.ogTitle, row.title); assert.equal(row.ogDescription, row.description); assert.equal(row.ogUrl, row.canonical);
  assert.equal(row.ogImage, expected.og.image); assert.equal(row.ogWidth, expected.og.width); assert.equal(row.ogHeight, expected.og.height); assert.equal(row.ogAlt, expected.og.alt);
  assert.equal(row.robots, null); assert.deepEqual(row.brokenVisibleImages, []);
  assert.ok(Object.values(row.counts).every(count => count === 1), row.route);
  if (row.route !== '/') assert.deepEqual(row.h1, old.h1, row.route); // Hero da home gira.
  assert.deepEqual(row.jsonLd.map(s => s.id), expected.scripts.map(s => s.id));
  for (const script of row.jsonLd) {
    const desired = JSON.parse(expected.scripts.find(s => s.id === script.id).json);
    const actual = script.data;
    if (actual['@type'] === 'Product') {
      const imagePath = new URL(actual.image).pathname;
      assert.match(imagePath, /^\/assets\/[^/]+\.jpg$/);
      assert.equal(imagePath, new URL(row.primaryImage, origin).pathname, row.route);
      const price = expected.description.match(/R\$\s*[\d.,]+/)[0];
      assert.ok(row.mainExcerpt.replaceAll(/\s/g, '').includes(price.replaceAll(/\s/g, '')), 'preço ' + row.route);
      const remote = await fetchBytes(imagePath);
      const local = await readFile(path.join(root, 'dist', imagePath));
      assert.equal(remote.status, 200); assert.ok(remote.bytes.equals(local));
      desired.image = actual.image; // Vite dev e build usam URLs diferentes; origem real da foto verificada acima.
    }
    if (actual['@type'] === 'Organization') {
      const logoPath = new URL(actual.logo).pathname;
      const remote = await fetchBytes(logoPath);
      assert.equal(remote.status, 200); assert.ok(remote.bytes.equals(await readFile(path.join(root, 'dist', logoPath))));
      desired.logo = actual.logo;
    }
    assert.deepEqual(actual, desired, row.route + ':' + script.id);
  }
}
for (const [key, value] of Object.entries(ui.checks)) assert.equal(value, true, key);
report.checks.push('18 heads exatos, conteúdo/H1 preservados, fotos/schema coerentes, navegação e histórico aprovados');
await writeFile(path.join(evidence, 'etapa2-preview-validation.json'), JSON.stringify(report, null, 2) + '\n');
console.log('PASS preview completo da Etapa 2');

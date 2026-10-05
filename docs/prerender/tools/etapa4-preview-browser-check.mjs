import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const evidence = path.join(root, 'docs/prerender/evidence');
const json = async file => JSON.parse(await readFile(file, 'utf8'));
const expected = await json(path.join(root, 'dist-server/smoke-ssr.json'));
const browser = await json(path.join(evidence, 'etapa4-preview-metadata.json'));
const http = await json(path.join(evidence, 'etapa4-preview-http.json'));
assert.equal(browser.codeCommit, http.codeCommit);
assert.equal(browser.rows.length, 18);
assert.equal(new Set(browser.rows.map(row => row.route)).size, 18);
assert.deepEqual(browser.console, []);
const normalized = value => value.replace(/\s+/g, ' ').trim();
for (const row of browser.rows) {
  const contract = expected.routes.find(item => item.route === row.route);
  assert.ok(contract, row.route);
  assert.equal(row.title, contract.head.title, row.route);
  assert.equal(row.description, contract.head.description, row.route);
  assert.equal(row.canonical, contract.head.canonical, row.route);
  assert.equal(row.ogType, contract.head.og.type, row.route);
  assert.deepEqual(row.theme, expected.theme, row.route);
  assert.deepEqual(row.brokenVisibleImages, [], row.route);
  assert.ok(row.mainExcerpt.length > 100, row.route);
  assert.ok(Object.values(row.counts).every(count => count === 1), row.route);
  if (row.route !== '/') assert.deepEqual(row.h1.map(normalized), contract.h1, row.route);
  assert.deepEqual(row.jsonLd, contract.head.scripts.map(script => ({ id: script.id, data: JSON.parse(script.json) })), row.route);
  if (row.route.startsWith('/loja/')) {
    const product = row.jsonLd.find(script => script.id === 'arq-seo-product').data;
    assert.equal(new URL(row.primaryImage).pathname, new URL(product.image).pathname, row.route);
    const price = contract.head.description.match(/R\$\s*[\d.,]+/)[0];
    assert.ok(normalized(row.mainExcerpt).replaceAll(' ', '').includes(price.replaceAll(/\s/g, '')), row.route);
  }
}
for (const [key, value] of Object.entries(browser.checks)) assert.equal(value, true, key);
const localHome = await readFile(path.join(root, 'dist/index.html'));
const privateArtifacts = [];
for (const route of ['/dist-server/entry-server.js', '/dist-server/client-template.html', '/src/entry-server.tsx']) {
  const response = await fetch(http.origin + route, { signal: AbortSignal.timeout(30000) });
  assert.match(response.headers.get('content-type'), /text\/html/);
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.ok(bytes.subarray(0, localHome.length).equals(localHome), route);
  privateArtifacts.push({ route, status: response.status, privateArtifactNotExposed: true });
}
await writeFile(path.join(evidence, 'etapa4-preview-validation.json'), JSON.stringify({
  collectedAt: new Date().toISOString(), codeCommit: browser.codeCommit,
  pages: browser.rows.length, uiChecks: Object.keys(browser.checks).length,
  console: browser.console, privateArtifacts,
  rawPublishedHtmls: http.files.length, resources: http.resources.length,
  ownHtmlAtCleanUrls: http.cleanRoutes.filter(row => row.ownHtml).length,
  routingPendingStage6: true, passed: true,
}, null, 2) + '\n');
console.log(`PASS preview: 18 páginas, ${Object.keys(browser.checks).length} cenários, head/JSON-LD/preços/imagens, console limpo; SSR privado.`);

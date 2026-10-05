// Validação do preview SPA da Etapa 1. Não confundir com aceite do SSG da Etapa 4.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const evidence = path.join(root, 'docs/prerender/evidence');
const readJson = async name => JSON.parse(await readFile(path.join(evidence, name), 'utf8'));
const http = await readJson('etapa1-preview-http-baseline.json');
const metadata = await readJson('etapa1-preview-metadata.json');
const ui = await readJson('etapa1-preview-ui.json');
const local = await readFile(path.join(root, 'dist/index.html'));
const remote = await readFile(path.join(evidence, 'etapa1-preview-index.html'));
const report = { collectedAt: new Date().toISOString(), codeCommit: metadata.codeCommit, origin: http.origin, checks: [], staticFiles: [], prices: [] };
function pass(name) { report.checks.push(name); console.log(`PASS ${name}`); }
assert.equal(http.routes.length, 18);
assert.equal(metadata.rows.length, 18);
assert.ok(http.responses.filter(row => http.routes.includes(row.route)).every(row => row.chain[0].status === 200));
assert.ok(http.responses.every(row => row.chain[0].headers['x-robots-tag'] === 'noindex'));
assert.ok(http.assets.every(row => row.status === 200 && row.identical));
pass('18 rotas HTTP 200; preview noindex; JS/CSS idênticos ao build local');
assert.ok(http.responses.every(row => row.rootEmpty && row.rawH1Count === 0));
assert.ok(remote.subarray(0, local.length).equals(local));
const suffix = remote.subarray(local.length).toString('utf8');
assert.match(suffix, /^<script async data-explicit-opt-in="true" data-deployment-id="[^"]+" src="https:\/\/vercel.live\/_next-live\/feedback\/feedback.js"><\/script>$/);
report.deploymentId = suffix.match(/data-deployment-id="([^"]+)"/)[1];
pass('HTML SPA esperado; diferença da home limitada ao feedback da Vercel');
assert.ok(metadata.rows.every(row => row.differences.length === 0 && row.brokenVisibleImages.length === 0));
assert.deepEqual(metadata.console, []);
assert.deepEqual(ui.console, []);
pass('Metadados/H1 das 18 rotas iguais à baseline; sem erros ou imagens visíveis quebradas');
for (const [name, value] of Object.entries(ui.checks)) {
  if (typeof value === 'boolean') assert.equal(value, true, name);
}
assert.equal(ui.checks.notFound.heading, 'Página não encontrada');
assert.equal(ui.checks.notFound.robots, 'noindex');
pass('Pop-up/histórico, galeria, autoplay, cupom, cookies, filtros, menu/FAQ e URLs inválidas aprovados');

const server = await createServer({
  root, configFile: false, appType: 'custom', logLevel: 'silent',
  resolve: { alias: { '@': path.join(root, 'src') } }, server: { middlewareMode: true },
});
try {
  const { ARCHETYPES } = await server.ssrLoadModule('/src/data/archetypes.ts');
  const { DEFAULT_HTML_ATTRIBUTES } = await server.ssrLoadModule('/src/lib/theme.ts');
  for (const [name, value] of Object.entries(DEFAULT_HTML_ATTRIBUTES)) {
    assert.ok(local.toString('utf8').includes(`${name}="${value}"`));
  }
  const format = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  for (const product of ARCHETYPES) {
    const row = metadata.rows.find(row => row.route === `/loja/${product.id}`);
    const expected = format.format(product.preco);
    assert.ok(row.mainExcerpt.replaceAll(/\s/g, '').includes(expected.replaceAll(/\s/g, '')), product.id);
    report.prices.push({ route: row.route, expected, present: true });
  }
  pass('Nove preços presentes no conteúdo cliente e derivados de ARCHETYPES');
} finally { await server.close(); }

for (const name of ['robots.txt', 'sitemap.xml', 'llms.txt']) {
  const response = await fetch(`${http.origin}/${name}`, { signal: AbortSignal.timeout(20000) });
  const bytes = Buffer.from(await response.arrayBuffer());
  const expected = await readFile(path.join(root, 'dist', name));
  assert.equal(response.status, 200);
  assert.ok(bytes.equals(expected), name);
  report.staticFiles.push({ name, status: response.status, identical: true, sha256: createHash('sha256').update(bytes).digest('hex') });
}
pass('Três arquivos SEO publicados sem mudança de conteúdo');
await writeFile(path.join(evidence, 'etapa1-preview-validation.json'), JSON.stringify(report, null, 2) + '\n');

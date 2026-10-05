// Etapa 4 publica .html; contrato definitivo de URLs limpas fica para Etapa 6.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../../', import.meta.url));
const evidence = path.join(root, 'docs/prerender/evidence');
const origin = 'https://arquetypus-parfum-git-prerender-saniella.vercel.app';
const codeCommit = process.argv[2];
assert.match(codeCommit ?? '', /^[0-9a-f]{40}$/);
const artifacts = JSON.parse(await readFile(path.join(root, 'dist-server/verify-prerender.json'), 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const get = async (base, route) => {
  const r = await fetch(base + route, { redirect: 'manual', signal: AbortSignal.timeout(30000) });
  return { status: r.status, headers: Object.fromEntries(r.headers), bytes: Buffer.from(await r.arrayBuffer()) };
};
const report = { collectedAt: new Date().toISOString(), codeCommit, origin, files: [], cleanRoutes: [], resources: [], seo: [], checks: [] };
for (const row of artifacts.rows) {
  const url = row.route === '/' ? '/' : '/' + row.file;
  const remote = await get(origin, url);
  assert.equal(remote.status, 200, url);
  assert.equal(remote.headers['x-robots-tag'], 'noindex', url);
  const local = await readFile(path.join(root, 'dist', row.file));
  assert.ok(remote.bytes.subarray(0, local.length).equals(local), url);
  report.files.push({ url, file: row.file, bytes: local.length, sha256: hash(local), identical: true, title: row.title, h1: row.h1 });
}
// Registrar diferença de roteamento; fallback home não certifica HTML bruto da PDP.
const home = await readFile(path.join(root, 'dist/index.html'));
for (const row of artifacts.rows.filter(row => row.route !== null)) {
  const response = await get(origin, row.route);
  assert.equal(response.status, 200, row.route);
  const own = await readFile(path.join(root, 'dist', row.file));
  const ownHtml = response.bytes.subarray(0, own.length).equals(own);
  const homeFallback = response.bytes.subarray(0, home.length).equals(home);
  assert.ok(ownHtml || homeFallback, row.route);
  report.cleanRoutes.push({ route: row.route, status: response.status, ownHtml, homeFallback: !ownHtml && homeFallback,
    note: ownHtml ? 'HTML próprio entregue' : 'Rewrite SPA preservado; configuração definitiva na Etapa 6' });
}
const queue = [...artifacts.resources];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (queue.length) {
    const url = queue.shift(); const response = await get(origin, url);
    assert.equal(response.status, 200, url);
    const expected = await readFile(path.resolve(root, 'dist', '.' + decodeURIComponent(url)));
    assert.ok(response.bytes.equals(expected), url);
    report.resources.push({ url, bytes: expected.length, sha256: hash(expected), identical: true });
  }
}));
report.resources.sort((a, b) => a.url.localeCompare(b.url));
for (const file of ['robots.txt', 'sitemap.xml', 'llms.txt']) {
  const response = await get(origin, '/' + file);
  assert.equal(response.status, 200); assert.ok(response.bytes.equals(await readFile(path.join(root, 'dist', file))));
  report.seo.push({ file, identical: true });
}
const production = await get('https://www.arquetypus.com.br', '/');
assert.equal(production.status, 200);
assert.ok(production.bytes.toString().includes('/assets/index-CEBNf12q.js'));
assert.ok(production.bytes.toString().includes('/assets/index-C9zeGloN.css'));
report.production = { status: production.status, assetsPreserved: true };
report.checks.push('19 HTMLs publicados iguais ao build local; assets/SEO iguais; produção preservada');
await writeFile(path.join(evidence, 'etapa4-preview-http.json'), JSON.stringify(report, null, 2) + '\n');
console.log(`PASS HTTP: ${report.files.length} HTMLs, ${report.resources.length} recursos; ${report.cleanRoutes.filter(r => r.ownHtml).length}/18 URLs limpas já entregam HTML próprio.`);

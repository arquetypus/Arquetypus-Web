// QA local: não certifica rewrites, redirects ou headers da Vercel.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
const origin = 'http://127.0.0.1:4177';
const gate = JSON.parse(await readFile('dist-server/verify-prerender.json', 'utf8'));
const documents = [], resources = [];
for (const row of gate.rows) {
  const route = row.route ?? '/qa-rota-inexistente';
  for (const target of [route, '/' + row.file]) {
    const response = await fetch(origin + target + '?raw=1', { redirect: 'manual' });
    const html = await response.text();
    const expected = target === '/qa-rota-inexistente' ? 404 : 200;
    assert.equal(response.status, expected, target);
    assert.match(response.headers.get('content-type'), /^text\/html/);
    assert.ok(html.includes(`<title>${row.title}</title>`), target + ' title');
    assert.ok(!html.includes('qa-report'), 'Fixture em resposta bruta');
    documents.push({ target, status: response.status, headers: Object.fromEntries(response.headers), bytes: Buffer.byteLength(html), passed: true });
  }
}
for (const target of [...gate.resources, '/robots.txt', '/sitemap.xml', '/llms.txt']) {
  const response = await fetch(origin + target, { redirect: 'manual' });
  assert.equal(response.status, 200, target);
  const bytes = (await response.arrayBuffer()).byteLength;
  assert.ok(bytes > 0, target);
  assert.ok(!response.headers.get('content-type').startsWith('text/html'), target + ' fallback HTML');
  resources.push({ target, status: response.status, type: response.headers.get('content-type'), bytes, passed: true });
}
const report = { collectedAt: new Date().toISOString(), scope: 'localhost; roteamento Vercel pendente na etapa 6', documents, resources };
await writeFile('docs/prerender/evidence/etapa5-http.json', JSON.stringify(report, null, 2) + '\n');
console.log(`PASS HTTP local: ${documents.length} GET HTML, ${resources.length} recursos.`);

import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { createServer } from 'vite';
import { escapeHtml, composeDocument, renderHead, validateRoutes, replaceOnce, verifyDocuments } from '../../../scripts/prerender-utils.mjs';

const root = fileURLToPath(new URL('../../../', import.meta.url));
process.env.NODE_ENV = 'production';
const checks = [];
const sample = { title: 'A & B <tag> "teste" $& $1', description: 'Descrição > < & "', canonical: 'https://arquetypus.com.br/?a=1&b=2',
  og: { type: 'website', locale: 'pt_BR', siteName: 'A&B', image: 'https://arquetypus.com.br/og-image.jpg', width: '1200', height: '630', alt: 'A < B' },
  scripts: [{ id: 'arq-seo-faq', json: JSON.stringify({ text: '</script><script>$&$1' }) }] };
const markup = renderHead(sample);
assert.ok(markup.includes(`<title>${escapeHtml(sample.title)}</title>`));
assert.ok(markup.includes('content="Descrição &gt; &lt; &amp; &quot;"'));
const script = markup.match(/type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)[1];
assert.ok(!script.includes('<'));
assert.equal(JSON.parse(script).text, '</script><script>$&$1');
checks.push('Escape de atributos/title, JSON-LD anti-fechamento de script e substituição literal de $&/$1');
assert.equal(replaceOnce('<!--slot-->', '<!--slot-->', '$&$1'), '$&$1');
assert.throws(() => replaceOnce('x', '<!--slot-->', 'y'));
assert.throws(() => replaceOnce('xx', 'x', 'y'));
for (const routes of [['/', '/'], ['/', '/a/../b'], ['/', '/sobre?x=1'], ['/', '/sobre#x'], ['/', '//sobre'], ['/', '/404']]) {
  assert.throws(() => validateRoutes(routes, path.join(root, 'dist')));
}
checks.push('Rotas/destinos seguros, duplicatas/404/query/hash/traversal e marcadores inválidos bloqueados');
const template = await readFile(path.join(root, 'dist-server/client-template.html'), 'utf8');
const composed = composeDocument(template, '/sobre', { html: '<main><h1>$&$1</h1></main>', head: sample });
assert.ok(composed.includes('<main><h1>$&$1</h1></main>'));
assert.equal((composed.match(/<title>/g) ?? []).length, 1);
assert.equal((composed.match(/rel="canonical"/g) ?? []).length, 1);
checks.push('Injeção mantém template, uma raiz e um conjunto de head; strings especiais não são interpretadas');
const renderer = await import(pathToFileURL(path.join(root, 'dist-server/entry-server.js')).href);
const report = JSON.parse(await readFile(path.join(root, 'dist-server/verify-prerender.json'), 'utf8'));
const pages = [];
for (const row of report.rows) pages.push({ route: row.route, file: row.file, html: await readFile(path.join(root, 'dist', row.file), 'utf8') });
const wrongHead = pages.map((page, index) => index === 0 ? { ...page, html: page.html.replace('<title>', '<title>ERRADO') } : page);
await assert.rejects(verifyDocuments(wrongHead, renderer, path.join(root, 'dist')), /Head incorreto/);
const missingAsset = pages.map((page, index) => index === 0 ? { ...page, html: page.html.replace('</head>', '<link rel="preload" href="/assets/inexistente-qa.jpg" /></head>') } : page);
await assert.rejects(verifyDocuments(missingAsset, renderer, path.join(root, 'dist')), /ENOENT/);
checks.push('Gate rejeita head divergente e recurso ausente antes de publicar HTML');
const server = await createServer({ root, configFile: false, appType: 'custom', logLevel: 'silent',
  resolve: { alias: { '@': path.join(root, 'src') } }, server: { middlewareMode: true } });
try {
  const { matchingPublicRoute, PUBLIC_ROUTES, initialRenderBootstrap } = await server.ssrLoadModule('/src/lib/publicRoutes.ts');
  for (const route of PUBLIC_ROUTES) assert.equal(matchingPublicRoute(route, PUBLIC_ROUTES), route);
  for (const [input, expected] of [['/SOBRE', '/sobre'], ['/sobre/', '/sobre'], ['/%73obre', '/sobre'],
    ['/%6Coja/%7Aeus', '/loja/zeus'], ['/LOJA/zeus/', '/loja/zeus'], ['/loja/%257Aeus', undefined],
    ['/loja%2Fzeus', undefined], ['/loja/ZEUS', undefined], ['//', undefined], ['/loja/constructor', undefined], ['/loja/zeus.html', undefined]]) {
    assert.equal(matchingPublicRoute(input, PUBLIC_ROUTES), expected, input);
  }
  // O bootstrap usa exatamente a função compartilhada; não há segunda implementação de matching.
  assert.ok(initialRenderBootstrap().includes(matchingPublicRoute.toString()));
  checks.push('Chave de hidratação segue Router: caixa, trailing slash, uma decodificação, slug e home exatos');
} finally { await server.close(); }
await writeFile(path.join(root, 'docs/prerender/evidence/etapa4-contracts.json'), JSON.stringify({ collectedAt: new Date().toISOString(), checks }, null, 2) + '\n');
console.log('PASS contratos da Etapa 4: ' + checks.length + ' grupos');

import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { composeDocument, routeFile, validateRoutes, verifyDocuments } from './prerender-utils.mjs';

process.env.NODE_ENV = 'production';
const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const renderer = await import(pathToFileURL(path.join(root, 'dist-server/entry-server.js')).href);
const targets = validateRoutes(renderer.routes, dist);
const template = await readFile(path.join(dist, 'index.html'), 'utf8');
assert.match(template, /<div id="root"><!--arq-root--><\/div>/);
assert.ok(!template.includes('data-rota='), 'Executar build cliente limpo antes de pré-renderizar');
for (const file of targets) {
  if (file === 'index.html') continue;
  let exists = false;
  try { await access(path.join(dist, file)); exists = true; } catch (error) { if (error.code !== 'ENOENT') throw error; }
  assert.ok(!exists, 'Colisão com arquivo cliente/público: ' + file);
}
const pages = renderer.routes.map(route => ({ route, file: routeFile(route), html: composeDocument(template, route, renderer.render(route)) }));
pages.push({ route: null, file: '404.html', html: composeDocument(template, null, renderer.render('/404-prerender', { genericNotFound: true })) });
// Nenhum HTML é sobrescrito antes de validar conjunto inteiro e recursos.
const report = await verifyDocuments(pages, renderer, dist);
await writeFile(path.join(root, 'dist-server/client-template.html'), template);
for (const page of pages) {
  await mkdir(path.dirname(path.join(dist, page.file)), { recursive: true });
  await writeFile(path.join(dist, page.file), page.html, 'utf8');
}
await writeFile(path.join(root, 'dist-server/prerender.json'), JSON.stringify(report, null, 2) + '\n');
// Feed do Google Merchant Center (src/lib/feedMerchant.ts); toda foto citada precisa existir no build.
const feed = renderer.produtosXml();
for (const [, url] of feed.matchAll(/<g:(?:additional_)?image_link>([^<]+)</g)) {
  await access(path.join(dist, new URL(url).pathname));
}
assert.equal((feed.match(/<item>/g) ?? []).length, renderer.products.length, 'Feed sem todos os produtos');
await writeFile(path.join(dist, 'produtos.xml'), feed, 'utf8');
console.log(`PASS geração: ${renderer.routes.length} rotas + 404, head e recursos validados antes da escrita.`);

import assert from 'node:assert/strict';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { routeFile, verifyDocuments } from './prerender-utils.mjs';

process.env.NODE_ENV = 'production';
const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const renderer = await import(pathToFileURL(path.join(root, 'dist-server/entry-server.js')).href);
const pages = [];
for (const route of [...renderer.routes, null]) {
  const file = route === null ? '404.html' : routeFile(route);
  pages.push({ route, file, html: await readFile(path.join(dist, file), 'utf8') });
}
const files = (await readdir(dist, { recursive: true, withFileTypes: true })).filter(file => file.isFile())
  .map(file => path.relative(dist, path.join(file.parentPath, file.name)).replaceAll(path.sep, '/')).sort();
assert.deepEqual(files.filter(file => file.endsWith('.html')), pages.map(page => page.file).sort(), 'HTML extra/obsoleto');
assert.ok(!files.some(file => /(?:entry-server|client-template|smoke-ssr|\.tsx?$)/.test(file)), 'Artefato privado na saída pública');
const report = await verifyDocuments(pages, renderer, dist);
await writeFile(path.join(root, 'dist-server/verify-prerender.json'), JSON.stringify({ ...report, inventory: files }, null, 2) + '\n');
console.log(`PASS artefatos: ${pages.length} HTMLs, ${report.resources.length} recursos, ${report.sitemap.length} canonicals no sitemap.`);

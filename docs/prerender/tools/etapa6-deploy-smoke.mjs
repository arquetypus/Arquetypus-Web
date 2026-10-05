// Smoke do deployment final após commit documental, sem reescrever provas anteriores.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { routeFile } from '../../../scripts/prerender-utils.mjs';
process.env.NODE_ENV = 'production';
const origin = 'https://arquetypus-parfum-git-prerender-saniella.vercel.app';
const { routes } = await import(pathToFileURL(path.resolve('dist-server/entry-server.js')).href);
const expectedDeployment = process.argv[2];
assert.ok(expectedDeployment?.startsWith('dpl_'), 'Informar ID retornado pelo check Vercel do SHA final.');
const stripToolbar = html => html.replace(/\s*<script\b(?=[^>]*\bsrc="https:\/\/vercel\.live\/[^"\s]*")[^>]*>[\s\S]*?<\/script>\s*/g, '').trim();
for (const route of [...routes, '/qualquer-coisa']) {
  const response = await fetch(origin + route, { redirect: 'manual', signal: AbortSignal.timeout(30000) });
  const html = await response.text();
  assert.equal(response.status, route === '/qualquer-coisa' ? 404 : 200);
  assert.match(response.headers.get('x-robots-tag') ?? '', /noindex/);
  if (route === '/') assert.ok(html.includes(`data-deployment-id="${expectedDeployment}"`), 'Alias ainda aponta outro deployment.');
  const file = route === '/qualquer-coisa' ? '404.html' : routeFile(route);
  assert.equal(stripToolbar(html), stripToolbar(await readFile(path.join('dist', file), 'utf8')), route);
}
const script = JSON.parse(await readFile('dist/.vite/manifest.json', 'utf8'))['index.html'].file;
const response = await fetch(origin + '/' + script, { redirect: 'manual', signal: AbortSignal.timeout(30000) });
assert.equal(response.status, 200);
assert.ok(Buffer.from(await response.arrayBuffer()).equals(await readFile(path.join('dist', script))));
console.log(`PASS deployment ${expectedDeployment}: 18 HTMLs + 404 e entry JS iguais ao build validado, preview noindex.`);

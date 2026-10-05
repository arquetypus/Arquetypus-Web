import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const server = await createServer({
  configFile: false, resolve: { alias: { '@': path.join(root, 'src') } },
  server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent',
});
let products;
try { ({ ARCHETYPES: products } = await server.ssrLoadModule('/src/data/archetypes.ts')); }
finally { await server.close(); }

const ids = products.map(product => product.id);
const slugs = products.map(product => product.slug);
for (const [nome, lista] of [['ID', ids], ['Slug', slugs]]) {
  assert.equal(lista.length, new Set(lista).size, nome + ' de produto duplicado');
  assert.ok(lista.length > 0 && lista.every(value => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)), nome + ' não suportado');
}
const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Aceita também percent-encoding, sem aceitar letras maiúsculas.
// A Vercel pode normalizar a URL antes ou depois do matcher: ambos são seguros.
const encodedPattern = value => [...value].map(char => {
  const hex = char.charCodeAt(0).toString(16).padStart(2, '0');
  const encoded = [...hex].map(digit => /[a-f]/.test(digit) ? `[${digit}${digit.toUpperCase()}]` : digit).join('');
  return `(?:${escapeRegex(char)}|%${encoded})`;
}).join('');
const extension = encodedPattern('.html');
const withExtension = value => `${encodedPattern(value)}(?:${extension})?`;
const invalidSlug = `(?!(?:${slugs.map(encodedPattern).join('|')})(?:${extension})?/?$)[^/]+`;

// URL definitiva do produto: /body-splash/{slug}, com HTML pré-renderizado. Endereços antigos /loja/{id} e
// /arquetipos/{id} vão pra ela com 308, num salto só; ID/slug inexistente e /body-splash sozinho vão pra home (307).
const legacyPrefixes = ['loja', 'arquetipos'];
const redirects = [
  { source: '/kit-descoberta', destination: '/', permanent: false },
  { source: '/body-splash', destination: '/#catalogo', permanent: false },
  { source: `/body-splash/:slug(${invalidSlug})`, destination: '/', permanent: false },
  ...legacyPrefixes.flatMap(prefix => products.map(product => ({
    source: `/${prefix}/:id(${withExtension(product.id)})`, destination: `/body-splash/${product.slug}`, permanent: true,
  }))),
  ...legacyPrefixes.map(prefix => ({ source: `/${prefix}/:id`, destination: '/', permanent: false })),
];

// Simula a Vercel: a primeira regra que casa vence; sem regra, responde o arquivo estático (ou a 404).
// `:nome(regex)` vira o grupo da regex (parênteses balanceados); `:nome` sozinho vira um segmento.
const toRegex = source => {
  let out = '';
  for (let i = 0; i < source.length;) {
    const param = source.slice(i).match(/^:\w+/);
    if (!param) { out += escapeRegex(source[i++]); continue; }
    i += param[0].length;
    if (source[i] !== '(') { out += '([^/]+)'; continue; }
    let depth = 0, j = i;
    do { if (source[j] === '\\') j++; else if (source[j] === '(') depth++; else if (source[j] === ')') depth--; j++; } while (depth > 0);
    out += source.slice(i, j);
    i = j;
  }
  return new RegExp('^' + out + '/?$');
};
const compiled = redirects.map(rule => ({ ...rule, regex: toRegex(rule.source) }));
const resolve = pathname => {
  const rule = compiled.find(r => r.regex.test(pathname));
  return rule ? `${rule.permanent ? 308 : 307} ${rule.destination}` : 'arquivo';
};
let cases = 0;
const check = (pathname, expected) => { assert.equal(resolve(pathname), expected, `Redirect: ${pathname}`); cases++; };
const encodeAll = value => [...value].map(char => `%${char.charCodeAt(0).toString(16)}`).join('');
for (const product of products) {
  const destino = `308 /body-splash/${product.slug}`;
  for (const prefix of legacyPrefixes) {
    for (const value of [product.id, encodeAll(product.id)]) {
      for (const suffix of ['', '/', '.html', '.html/']) check(`/${prefix}/${value}${suffix}`, destino);
    }
    check(`/${prefix}/${product.id}%2ehtml`, destino);
    check(new URL(`/${prefix}/${product.id}?utm_source=teste`, 'https://example.test').pathname, destino);
    check(`/${prefix}/${product.id}x`, '307 /');
    check(`/${prefix}/${product.id.toUpperCase()}`, '307 /');
    check(`/${prefix}/${product.slug}`, '307 /');
    check(`/${prefix}/${product.id}/extra`, 'arquivo');
  }
  for (const value of [product.slug, encodeAll(product.slug)]) {
    for (const suffix of ['', '/', '.html', '.html/']) check(`/body-splash/${value}${suffix}`, 'arquivo');
  }
  check(`/body-splash/${product.slug}x`, '307 /');
  check(`/body-splash/${product.id}`, '307 /');
  check(`/body-splash/${product.slug.toUpperCase()}`, '307 /');
  check(`/body-splash/${product.slug}/extra`, 'arquivo');
}
for (const prefix of ['loja', 'arquetipos', 'body-splash']) {
  for (const id of ['nao-existe', 'constructor', 'toString', '__proto__', 'ze', 'zeus-extra', '%5Aeus', '%257aeus', 'zeus%2Fextra']) {
    check(`/${prefix}/${id}`, '307 /'); check(`/${prefix}/${id}/`, '307 /');
  }
}
check('/body-splash', '307 /#catalogo');
check('/body-splash/', '307 /#catalogo');
for (const pathname of ['/loja', '/arquetipos', '/assets/nao-existe.js', '/sobre', '/']) check(pathname, 'arquivo');

const config = {
  $schema: 'https://openapi.vercel.sh/vercel.json',
  framework: 'vite', buildCommand: 'npm run build', outputDirectory: 'dist',
  cleanUrls: true, trailingSlash: false,
  redirects,
};
const filename = path.join(root, 'vercel.json');
if (process.argv.includes('--write')) {
  await writeFile(filename, JSON.stringify(config, null, 2) + '\n');
  console.log('vercel.json gerado antes do deploy. Revisar e versionar o arquivo.');
} else {
  assert.deepEqual(JSON.parse(await readFile(filename, 'utf8')), config,
    'vercel.json divergiu dos dados/contrato. Execute npm run configure:vercel e versione antes do deploy.');
}
console.log(`Configuração Vercel validada: ${ids.length} produtos, ${redirects.length} redirecionamentos, ${cases} casos simulados, sem rewrite SPA.`);

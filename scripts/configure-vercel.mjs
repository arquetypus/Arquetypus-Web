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
assert.equal(ids.length, new Set(ids).size, 'IDs de produto duplicados');
assert.ok(ids.length > 0 && ids.every(id => /^[a-z0-9-]+$/.test(id)), 'ID não suportado');
const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Exclui também IDs com percent-encoding, sem aceitar letras maiúsculas no ID.
// A Vercel pode normalizar a URL antes ou depois do matcher: ambos são seguros.
const encodedPattern = value => [...value].map(char => {
  const hex = char.charCodeAt(0).toString(16).padStart(2, '0');
  const encoded = [...hex].map(digit => /[a-f]/.test(digit) ? `[${digit}${digit.toUpperCase()}]` : digit).join('');
  return `(?:${escapeRegex(char)}|%${encoded})`;
}).join('');
const validIds = ids.map(encodedPattern).join('|');
const extension = encodedPattern('.html');
const invalidId = `(?!(?:${validIds})(?:${extension})?/?$)[^/]+`;
const matchesInvalidProduct = pathname => new RegExp(`^/loja/(${invalidId})/?$`).test(pathname);

let cases = 0;
const check = (pathname, expected) => {
  assert.equal(matchesInvalidProduct(pathname), expected, `Matcher: ${pathname}`); cases++;
};
for (const id of ids) {
  for (const value of [id, [...id].map(char => `%${char.charCodeAt(0).toString(16)}`).join('')]) {
    for (const suffix of ['', '/', '.html', '.html/']) check(`/loja/${value}${suffix}`, false);
  }
  check(`/loja/${id}%2ehtml`, false);
  check(`/loja/${id}/extra`, false);
  check(`/loja/${id}x`, true);
  check(`/loja/${id.toUpperCase()}`, true);
  const withQuery = new URL(`/loja/${id}?utm_source=teste`, 'https://example.test');
  check(withQuery.pathname, false);
}
for (const id of ['nao-existe', 'constructor', 'toString', '__proto__', 'ze', 'zeus-extra', '%5Aeus', '%257aeus', 'zeus%2Fextra']) {
  check(`/loja/${id}`, true); check(`/loja/${id}/`, true);
}
for (const pathname of ['/loja/', '/loja', '/loja/zeus/extra', '/assets/nao-existe.js']) check(pathname, false);

const config = {
  $schema: 'https://openapi.vercel.sh/vercel.json',
  framework: 'vite', buildCommand: 'npm run build', outputDirectory: 'dist',
  cleanUrls: true, trailingSlash: false,
  redirects: [
    { source: '/arquetipos/:id', destination: '/loja/:id', permanent: true },
    { source: '/kit-descoberta', destination: '/', permanent: false },
    { source: `/loja/:id(${invalidId})`, destination: '/', permanent: false },
  ],
};
const filename = path.join(root, 'vercel.json');
if (process.argv.includes('--write')) {
  await writeFile(filename, JSON.stringify(config, null, 2) + '\n');
  console.log('vercel.json gerado antes do deploy. Revisar e versionar o arquivo.');
} else {
  assert.deepEqual(JSON.parse(await readFile(filename, 'utf8')), config,
    'vercel.json divergiu dos dados/contrato. Execute npm run configure:vercel e versione antes do deploy.');
}
console.log(`Configuração Vercel validada: ${ids.length} produtos, ${cases} casos do matcher, sem rewrite SPA.`);

import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

// Antes dos imports de React: mesmo modo do bundle cliente, portátil Windows/Linux.
process.env.NODE_ENV = 'production';
const root = fileURLToPath(new URL('../', import.meta.url));
const warnings = [];
const originalWarn = console.warn;
const originalError = console.error;
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const text = html => html.replace(/<[^>]*>/g, '').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&(amp|quot|apos|nbsp|lt|gt);/g, (_, name) => ({ amp: '&', quot: '"', apos: "'", nbsp: ' ', lt: '<', gt: '>' })[name])
  .replace(/\s+/g, ' ').trim();
const references = new Set();
const resource = value => {
  if (/^(?:data:|https?:|\/\/|#)/.test(value)) return;
  const pathname = new URL(value, 'https://www.arquetypus.com.br').pathname;
  assert.ok(pathname.startsWith('/assets/') || value.startsWith('/'), 'Recurso relativo inesperado: ' + value);
  references.add(pathname);
};
const scanMarkup = html => {
  for (const m of html.matchAll(/\b(?:src|poster)="([^"]+)"/g)) resource(m[1]);
  for (const m of html.matchAll(/\b(?:srcSet|srcset|imagesrcset)="([^"]+)"/g)) {
    // data: é recurso inline; globs/fotos atuais usam uma URL por candidato.
    if (!m[1].startsWith('data:')) for (const item of m[1].split(',')) resource(item.trim().split(/\s+/)[0]);
  }
  for (const m of html.matchAll(/<link\b[^>]*\bhref="([^"]+)"[^>]*>/g)) resource(m[1]);
  for (const m of html.matchAll(/url\((?:&quot;|["'])?([^)'"&]+)(?:&quot;|["'])?\)/g)) resource(m[1]);
};
console.warn = (...args) => { warnings.push(args.join(' ')); originalWarn(...args); };
console.error = (...args) => { warnings.push(args.join(' ')); originalError(...args); };
try {
  assert.equal(typeof globalThis.window, 'undefined');
  assert.equal(typeof globalThis.document, 'undefined');
  const { StaticRouter } = await import('react-router-dom');
  assert.equal(typeof StaticRouter, 'function');
  const { routes, render, products, DEFAULT_HTML_ATTRIBUTES } = await import(pathToFileURL(path.join(root, 'dist-server/entry-server.js')).href);
  assert.equal(routes.length, 18, '9 páginas + 9 produtos em /body-splash');
  assert.equal(new Set(routes).size, routes.length);
  const manifest = JSON.parse(await readFile(path.join(root, 'dist/.vite/manifest.json'), 'utf8'));
  assert.ok(manifest['index.html'].isEntry);
  const bundle = await readFile(path.join(root, 'dist-server/entry-server.js'), 'utf8');
  // Auditoria do formato não minificado emitido pelo Vite/Rolldown instalado.
  // Caminho original identifica asset; basename sozinho nunca decide associação.
  const serverAssets = new Map([...bundle.matchAll(/\/\/#region (src\/assets\/[^\r\n]+)\r?\nvar [^=\n]+ = ("[^\r\n]+");/g)]
    .map(m => [m[1], JSON.parse(m[2])]));
  const assets = [];
  for (const [source, entry] of Object.entries(manifest)) {
    if (!source.startsWith('src/assets/')) continue;
    if (serverAssets.has(source)) assert.equal(serverAssets.get(source), '/' + entry.file, 'URL SSR/cliente: ' + source);
    else assert.ok(!bundle.includes('//#region ' + source), 'Formato de asset SSR não reconhecido: ' + source);
    const original = await readFile(path.join(root, source));
    const emitted = await readFile(path.join(root, 'dist', entry.file));
    assert.ok(original.equals(emitted), 'Bytes do asset: ' + source);
    assets.push({ source, url: '/' + entry.file, inServerBundle: bundle.includes(JSON.stringify('/' + entry.file)),
      sourceRegionMapped: serverAssets.has(source), bytes: emitted.length, sha256: hash(emitted) });
  }
  assert.ok(assets.length > 0);
  for (const [source, url] of serverAssets) {
    if (url.startsWith('data:')) continue;
    assert.ok(manifest[source], 'Asset SSR ausente no manifest cliente: ' + source);
    resource(url);
  }
  for (const m of bundle.matchAll(/["'](\/assets\/[^"'\s]+)["']/g)) resource(m[1]);
  const duplicateBasenames = Object.entries(Object.groupBy(assets, a => path.basename(a.source)))
    .filter(([, group]) => group.length > 1).map(([basename, group]) => ({ basename, sources: group.map(a => a.source), urls: group.map(a => a.url) }));
  assert.ok(duplicateBasenames.length >= 9);
  const publicIndex = await readFile(path.join(root, 'dist/index.html'), 'utf8');
  const template = publicIndex.includes('<html data-rota=')
    ? await readFile(path.join(root, 'dist-server/client-template.html'), 'utf8') : publicIndex;
  assert.match(template, /<div id="root">(?:<!--arq-root-->)?<\/div>/);
  assert.ok(!template.includes('<h1'));
  scanMarkup(template);
  for (const css of manifest['index.html'].css ?? []) {
    resource('/' + css);
    // Não tratar url(%23n) interno de SVG data: como arquivo externo do CSS.
    const content = (await readFile(path.join(root, 'dist', css), 'utf8')).replace(/url\((["'])data:[\s\S]*?\1\)/g, '');
    for (const m of content.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g)) {
      if (!/^(?:data:|#|https?:|\/\/)/.test(m[1])) resource(new URL(m[1], 'https://www.arquetypus.com.br/' + css).pathname);
    }
  }
  for (const attr of Object.entries(DEFAULT_HTML_ATTRIBUTES)) assert.ok(template.includes(`${attr[0]}="${attr[1]}"`));
  const rows = [];
  await mkdir(path.join(root, 'dist-server/smoke'), { recursive: true });
  for (const route of [...routes, '/nao-existe-ensaio-ssr']) {
    const { html, head } = render(route);
    assert.ok(html.length > 1000, route);
    assert.match(html, /<main\b/, route);
    assert.match(html, /<h1\b/, route);
    assert.ok(head.title && head.description, route);
    assert.ok(!html.includes('aria-label="Cookies neste site"'), route);
    assert.ok(!/ARQ-\d+/.test(html), route);
    const h1 = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m => text(m[1]));
    assert.equal(h1.length, 1, 'H1 único: ' + route);
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
    assert.ok(text(main ?? '').length > 100, 'Conteúdo principal: ' + route);
    scanMarkup(html);
    for (const script of head.scripts) {
      const data = JSON.parse(script.json);
      for (const field of ['image', 'logo']) if (data[field]) resource(new URL(data[field]).pathname);
    }
    if (route.startsWith('/body-splash/')) {
      // fotos seguem nomeadas pelo id interno; a URL usa o slug
      const id = products.find(p => '/body-splash/' + p.slug === route)?.id;
      assert.ok(id, 'Produto da rota: ' + route);
      for (const folder of ['pdp-frasco', 'pdp-lifestyle']) {
        const expected = manifest[`src/assets/fotos/${folder}/${id}.jpg`];
        assert.ok(expected, folder + '/' + id);
        assert.ok(html.includes('/' + expected.file), 'Glob no HTML: ' + folder + '/' + id);
      }
      const data = JSON.parse(head.scripts.find(s => s.id === 'arq-seo-product').json);
      assert.equal(data.image, 'https://www.arquetypus.com.br/' + manifest[`src/assets/fotos/pdp-frasco/${id}.jpg`].file);
      const price = head.description.match(/R\$\s*[\d.,]+/)[0];
      assert.ok(text(main).replaceAll(/\s/g, '').includes(price.replaceAll(/\s/g, '')), 'Preço: ' + route);
    }
    const file = (route === '/' ? 'home' : route.slice(1).replaceAll('/', '--')) + '.html';
    await writeFile(path.join(root, 'dist-server/smoke', file), html);
    rows.push({ route, bytes: Buffer.byteLength(html), sha256: hash(html), h1, mainExcerpt: text(main).slice(0, 700), head });
  }
  assert.equal(rows.at(-1).head.robots, 'noindex');
  const first = render('/body-splash/zeus-stormbreak');
  render('/perguntas-frequentes');
  assert.deepEqual(render('/body-splash/zeus-stormbreak'), first);
  assert.deepEqual(DEFAULT_HTML_ATTRIBUTES, { 'data-estrutura': 'boutique', 'data-paleta': 'ambar', 'data-estilo': 'elegant' });
  assert.deepEqual(warnings, [], 'Nenhum warning nas rotas publicáveis + 404');
  // Lookup real, sem expor export de auditoria no entry-server de produção.
  const { createServer } = await import('vite');
  const server = await createServer({ root, configFile: false, appType: 'custom', logLevel: 'silent',
    resolve: { alias: { '@': path.join(root, 'src') } }, server: { middlewareMode: true } });
  const slugs = [];
  try {
    const { ARCHETYPES, getArchetype, getArchetypeBySlug, productPath } = await server.ssrLoadModule('/src/data/archetypes.ts');
    const { PAGINAS_PUBLICAS } = await server.ssrLoadModule('/src/data/rotas.ts');
    const { resolveSeo, serializeJsonLd } = await server.ssrLoadModule('/src/lib/seoModel.ts');
    assert.deepEqual(routes, [...PAGINAS_PUBLICAS.map(p => p.path), ...ARCHETYPES.map(productPath)]);
    // Página pública só existe via PAGINAS_PUBLICAS (sitemap, llms.txt, SEO, prerender); <Route path> literal no
    // App.tsx fica restrito a produto, redirecionamentos e 404.
    const app = await readFile(path.join(root, 'src/App.tsx'), 'utf8');
    const literais = [...app.matchAll(/<Route\b[^>]*\bpath="([^"]+)"/g)].map(m => m[1]);
    const foraDoSitemap = ['body-splash/:slug', 'body-splash', 'arquetipos/:id', 'loja/:id', 'kit-descoberta', '*'];
    assert.deepEqual(literais.filter(p => !foraDoSitemap.includes(p)), [],
      'Rota escrita à mão no App.tsx: cadastrar em PAGINAS_PUBLICAS (src/data/rotas.ts) e ligar em PAGINAS');
    // Contrato permanente: validar dados atuais, sem depender de snapshots da migração.
    for (const row of rows) {
      const expected = resolveSeo(row.route);
      // Imports do módulo fonte usam /src; no bundle, conferir URL emitida pelo manifest.
      expected.scripts = expected.scripts.map(script => {
        const data = JSON.parse(script.json);
        for (const field of ['image', 'logo']) if (data[field]) {
          const url = new URL(data[field]);
          if (url.pathname.startsWith('/src/assets/')) {
            const asset = manifest[url.pathname.slice(1)];
            assert.ok(asset, 'Asset do head no manifest: ' + url.pathname);
            data[field] = new URL('/' + asset.file, url.origin).href;
          }
        }
        return { ...script, json: serializeJsonLd(data) };
      });
      assert.deepEqual(row.head, expected, 'Head fonte/bundle: ' + row.route);
    }
    for (const product of ARCHETYPES) {
      assert.equal(getArchetype(product.id), product);
      assert.equal(getArchetypeBySlug(product.slug), product);
      // Endereços antigos: no cliente redirecionam (Navigate) pra URL definitiva, com o head dela.
      for (const prefix of ['/loja/', '/arquetipos/']) {
        const result = render(prefix + product.id);
        assert.equal(result.head.canonical, 'https://www.arquetypus.com.br' + productPath(product), prefix + product.id);
        assert.ok(!result.html.includes('Pirâmide olfativa'), prefix + product.id);
        slugs.push({ id: prefix + product.id, redirect: productPath(product) });
      }
    }
    for (const id of ['constructor', 'toString', '__proto__', 'nao-existe', 'ZEUS', 'zeus', 'ZEUS-STORMBREAK']) {
      assert.equal(getArchetypeBySlug(id), undefined, id);
      const prefixes = getArchetype(id) ? ['/body-splash/'] : ['/body-splash/', '/loja/', '/arquetipos/'];
      for (const prefix of prefixes) {
        const result = render(prefix + id);
        assert.equal(result.head.canonical, 'https://www.arquetypus.com.br/');
        assert.ok(!result.html.includes('Pirâmide olfativa'), prefix + id);
        slugs.push({ id: prefix + id, rejected: true });
      }
    }
  } finally { await server.close(); }
  const redirectWarnings = warnings.splice(0);
  assert.equal(redirectWarnings.length, slugs.length);
  for (const warning of redirectWarnings) assert.ok(warning.startsWith('<Navigate> must not be used on the initial render in a <StaticRouter>.'), warning);
  const resources = [];
  for (const url of [...references].sort()) {
    const file = path.resolve(root, 'dist', '.' + decodeURIComponent(url));
    assert.ok(file.startsWith(path.join(root, 'dist') + path.sep), url);
    const bytes = await readFile(file);
    resources.push({ url, bytes: bytes.length, sha256: hash(bytes) });
  }
  const publicFiles = [];
  for (const file of await readdir(path.join(root, 'public'), { recursive: true, withFileTypes: true })) {
    if (!file.isFile()) continue;
    const source = path.join(file.parentPath, file.name);
    const relative = path.relative(path.join(root, 'public'), source);
    const expected = await readFile(source);
    assert.ok(expected.equals(await readFile(path.join(root, 'dist', relative))), relative);
    publicFiles.push(relative.replaceAll(path.sep, '/'));
  }
  assert.deepEqual(warnings, []);
  const routerPackage = JSON.parse(await readFile(path.join(root, 'node_modules/react-router-dom/package.json'), 'utf8'));
  const report = { collectedAt: new Date().toISOString(), node: process.version, mode: process.env.NODE_ENV,
    router: { version: routerPackage.version, StaticRouter: typeof StaticRouter, exports: Object.keys(routerPackage.exports) },
    theme: DEFAULT_HTML_ATTRIBUTES, routes: rows, assets, duplicateBasenames, resources, publicFiles, slugs, warnings, redirectWarnings,
    checks: ['18 rotas + 404 com H1 e conteúdo; preço/fotos nas nove PDPs em /body-splash; endereços antigos redirecionam', 'Tema igual ao template cliente',
      'URLs e bytes por caminho original iguais ao manifest cliente', 'Globs, basenames duplicados, src/srcset/poster/preloads/CSS/public verificados',
      'Head fonte/bundle iguais; H1 único em cada documento', 'Head e HTML da primeira rota iguais após renderizar outra rota', 'Lookup real rejeita propriedades herdadas', 'Sem DOM ou warnings; modo production', 'Template cliente íntegro antes da geração estática'] };
  await writeFile(path.join(root, 'dist-server/smoke-ssr.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(`PASS SSR: ${routes.length} rotas + 404; ${assets.length} assets por origem; ${resources.length} recursos; ${duplicateBasenames.length} basenames repetidos; slugs seguros; sem DOM/warnings nas rotas publicáveis. ${redirectWarnings.length} avisos esperados de Navigate nos testes negativos.`);
} finally {
  console.warn = originalWarn;
  console.error = originalError;
}

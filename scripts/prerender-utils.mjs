import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

export const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
export const decodeHtml = value => value.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (_, name) => ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' })[name]);
export const plainText = html => decodeHtml(html.replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, '').replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();
export const routeFile = route => route === '/' ? 'index.html' : route.slice(1) + '.html';

export function validateRoutes(routes, dist) {
  assert.ok(routes.length > 0 && routes.includes('/'));
  assert.equal(new Set(routes).size, routes.length, 'Rotas duplicadas');
  const destinations = new Set(['404.html']);
  for (const route of routes) {
    assert.match(route, /^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/, 'Rota insegura: ' + route);
    assert.ok(!route.includes('..'), route);
    const file = routeFile(route);
    assert.ok(!destinations.has(file.toLowerCase()), 'Colisão de destino: ' + file);
    destinations.add(file.toLowerCase());
    assert.ok(path.resolve(dist, file).startsWith(path.resolve(dist) + path.sep), file);
  }
  return [...destinations].sort();
}

export function replaceOnce(value, pattern, replacement) {
  const regex = typeof pattern === 'string' ? null : new RegExp(pattern.source, 'g');
  const count = regex ? [...value.matchAll(regex)].length : value.split(pattern).length - 1;
  assert.equal(count, 1, 'Marcador ausente/duplicado: ' + pattern);
  return value.replace(pattern, () => replacement);
}

export function renderHead(head) {
  const meta = (attr, key, value) => value === undefined ? '' : `<meta ${attr}="${escapeHtml(key)}" content="${escapeHtml(value)}" data-arq-seo />`;
  const tags = [`<title>${escapeHtml(head.title)}</title>`, meta('name', 'description', head.description)];
  if (head.canonical) tags.push(`<link rel="canonical" href="${escapeHtml(head.canonical)}" data-arq-seo />`);
  for (const [key, value] of Object.entries({ type: head.og.type, locale: head.og.locale, site_name: head.og.siteName,
    url: head.canonical, title: head.title, description: head.description, image: head.og.image,
    'image:width': head.og.width, 'image:height': head.og.height, 'image:alt': head.og.alt })) tags.push(meta('property', 'og:' + key, value));
  tags.push(meta('name', 'twitter:card', 'summary_large_image'), meta('name', 'twitter:image', head.og.image));
  if (head.robots) tags.push(`<meta id="arq-seo-robots" name="robots" content="${escapeHtml(head.robots)}" data-arq-seo />`);
  for (const script of head.scripts) {
    const json = JSON.stringify(JSON.parse(script.json)).replace(/</g, '\\u003c');
    tags.push(`<script id="${escapeHtml(script.id)}" type="application/ld+json" data-arq-seo>${json}</script>`);
  }
  return tags.filter(Boolean).join('\n');
}

export function composeDocument(template, route, rendered) {
  let html = replaceOnce(template, /<!--arq-head:start-->[\s\S]*?<!--arq-head:end-->/, renderHead(rendered.head));
  html = replaceOnce(html, /<!--arq-social:start-->[\s\S]*?<!--arq-social:end-->/, '');
  html = replaceOnce(html, '<!--arq-root-->', rendered.html);
  if (route !== null) html = replaceOnce(html, '<html ', `<html data-rota="${escapeHtml(route)}" `);
  return html;
}

/** Gate do build. DOMParser e matriz comportamental complementam este gate no QA local. */
export async function verifyDocuments(pages, renderer, dist) {
  const { routes, render, DEFAULT_HTML_ATTRIBUTES } = renderer;
  const expectedFiles = validateRoutes(routes, dist);
  assert.deepEqual(pages.map(p => p.file).sort(), expectedFiles, 'Inventário HTML');
  const manifest = JSON.parse(await readFile(path.join(dist, '.vite/manifest.json'), 'utf8'));
  const resources = new Set();
  function addResource(raw, base = '/') {
    const value = decodeHtml(raw);
    if (/^(?:data:|#)/i.test(value)) return;
    const url = new URL(value, 'https://arquetypus.com.br' + base);
    if (url.origin !== 'https://arquetypus.com.br') return;
    assert.ok(!/^\/(?:src|dist-server)\//.test(url.pathname), value);
    const file = path.resolve(dist, '.' + decodeURIComponent(url.pathname));
    assert.ok(file.startsWith(path.resolve(dist) + path.sep), value);
    resources.add(url.pathname);
  }
  const rows = [];
  for (const page of pages) {
    const expected = render(page.route ?? '/404-prerender', { genericNotFound: page.route === null });
    const html = page.html;
    const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1];
    assert.ok(head, page.file);
    assert.equal((html.match(/<div id="root">/g) ?? []).length, 1, page.file);
    assert.ok(!/<!--arq-(?:root|head|social|initial-render)/.test(html), page.file);
    assert.ok(!html.includes('aria-label="Cookies neste site"'), page.file);
    assert.ok(!/ARQ-\d+/.test(html), page.file);
    assert.equal((head.match(/<title>/g) ?? []).length, 1);
    assert.equal((head.match(/<meta\b[^>]*name="description"/g) ?? []).length, 1);
    assert.equal((head.match(/<link\b[^>]*rel="canonical"/g) ?? []).length, page.route === null ? 0 : 1);
    for (const property of ['type', 'locale', 'site_name', 'title', 'description', 'image', 'image:width', 'image:height', 'image:alt']) {
      assert.equal((head.match(new RegExp(`<meta\\b[^>]*property="og:${property}"`, 'g')) ?? []).length, 1, page.file + ' og:' + property);
    }
    assert.equal((head.match(/<meta\b[^>]*property="og:url"/g) ?? []).length, page.route === null ? 0 : 1);
    for (const name of ['twitter:card', 'twitter:image']) assert.equal((head.match(new RegExp(`<meta\\b[^>]*name="${name}"`, 'g')) ?? []).length, 1, page.file + ' ' + name);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, 'IDs duplicados: ' + page.file);
    assert.ok(head.includes(renderHead(expected.head)), 'Head incorreto: ' + page.file);
    assert.equal((head.match(/<script\b[^>]*type="application\/ld\+json"/g) ?? []).length, expected.head.scripts.length);
    for (const script of head.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
      const data = JSON.parse(script[1]);
      assert.ok(!script[1].includes('<'));
      for (const key of ['image', 'logo']) if (data[key]) addResource(data[key]);
    }
    for (const [name, value] of Object.entries(DEFAULT_HTML_ATTRIBUTES)) assert.ok(html.includes(`${name}="${value}"`));
    const marker = html.match(/<html\b[^>]*\bdata-rota="([^"]+)"/)?.[1];
    assert.equal(marker, page.route ?? undefined, page.file);
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
    const serverMain = expected.html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
    assert.ok(main && plainText(main).length > 100, 'Conteúdo vazio: ' + page.file);
    assert.equal(main, serverMain, 'Conteúdo divergente: ' + page.file);
    const h1 = [...main.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m => plainText(m[1]));
    assert.equal(h1.length, 1, page.file);
    if (page.route?.startsWith('/loja/')) {
      const product = renderer.products.find(item => '/loja/' + item.id === page.route);
      assert.ok(product, page.file);
      const compact = value => plainText(value).replaceAll(/\s/g, '');
      assert.equal(compact(h1[0]), compact(product.nome + (product.sobrenome ?? '')), 'Nome H1: ' + page.file);
      const price = product.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      // Identidade e preço são irmãos na coluna de compra; limitar antes dos selos/ritual.
      const identityStart = main.indexOf('<h1');
      const nextSection = main.indexOf('<section', identityStart);
      const purchase = main.slice(identityStart, nextSection);
      assert.ok(purchase && compact(purchase).includes(compact(price)), 'Preço na compra: ' + page.file);
      assert.ok(compact(purchase).includes(compact(product.card)), 'Descrição na compra: ' + page.file);
      const schema = JSON.parse(expected.head.scripts.find(script => script.id === 'arq-seo-product').json);
      assert.equal(schema.name, `${product.nome} ${product.sobrenome ?? ''}`.trim());
      assert.ok(!('offers' in schema) && !('aggregateRating' in schema) && !('review' in schema), page.file);
      assert.equal(schema.sku, product.id);
      addResource(schema.image);
    }
    for (const m of html.matchAll(/\b(?:src|poster)="([^"]+)"/g)) addResource(m[1]);
    for (const m of html.matchAll(/\b(?:srcset|srcSet|imagesrcset)="([^"]+)"/g)) {
      if (!m[1].startsWith('data:')) for (const item of m[1].split(',')) addResource(item.trim().split(/\s+/)[0]);
    }
    for (const m of html.matchAll(/<link\b[^>]*>/g)) {
      if (m[0].includes('rel="canonical"')) continue;
      const href = m[0].match(/href="([^"]+)"/)?.[1];
      if (href) addResource(href);
    }
    for (const m of html.matchAll(/url\((?:&quot;|["'])?([^)'"&]+)(?:&quot;|["'])?\)/g)) addResource(m[1]);
    rows.push({ route: page.route, file: page.file, bytes: Buffer.byteLength(html), title: expected.head.title,
      canonical: expected.head.canonical ?? null, h1, mainExcerpt: plainText(main).slice(0, 600), jsonLdCount: expected.head.scripts.length });
  }
  // Grafo do manifest: módulos, imports, CSS e assets não necessariamente presentes no HTML.
  for (const entry of Object.values(manifest)) {
    addResource('/' + entry.file);
    for (const file of [...(entry.css ?? []), ...(entry.assets ?? [])]) addResource('/' + file);
    for (const key of [...(entry.imports ?? []), ...(entry.dynamicImports ?? [])]) assert.ok(manifest[key], 'Import sem manifest: ' + key);
  }
  const webmanifest = JSON.parse(await readFile(path.join(dist, 'site.webmanifest'), 'utf8'));
  for (const icon of webmanifest.icons ?? []) addResource(icon.src);
  for (const css of manifest['index.html'].css ?? []) {
    addResource('/' + css);
    const content = (await readFile(path.join(dist, css), 'utf8')).replace(/url\((["'])data:[\s\S]*?\1\)/g, '');
    for (const m of content.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g)) addResource(m[1], '/' + css);
  }
  const checkedResources = [];
  for (const resource of [...resources].sort()) {
    assert.ok((await stat(path.resolve(dist, '.' + decodeURIComponent(resource)))).isFile(), resource);
    checkedResources.push(resource);
  }
  const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => decodeHtml(m[1])).sort();
  assert.deepEqual(urls, rows.filter(row => row.route !== null).map(row => row.canonical).sort(), 'Sitemap/canonicals');
  return { rows, resources: checkedResources, sitemap: urls };
}

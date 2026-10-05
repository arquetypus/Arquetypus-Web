// Contratos puros reais da Etapa 2; nenhuma dependência nova ou mudança no pipeline.
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const evidence = path.join(root, 'docs/prerender/evidence');
const baseline = JSON.parse(await readFile(path.join(evidence, 'etapa1-preview-metadata.json'), 'utf8'));
const report = { collectedAt: new Date().toISOString(), checks: [], rows: [] };
const server = await createServer({ root, configFile: false, appType: 'custom', logLevel: 'silent',
  resolve: { alias: { '@': path.join(root, 'src') } }, server: { middlewareMode: true } });
const pass = name => { report.checks.push(name); console.log('PASS ' + name) };
try {
  const model = await server.ssrLoadModule('/src/lib/seoModel.ts');
  const { ARCHETYPES } = await server.ssrLoadModule('/src/data/archetypes.ts');
  const { PDP_FRASCO, PDP_LIFESTYLE } = await server.ssrLoadModule('/src/data/productMedia.ts');
  assert.equal(typeof globalThis.window, 'undefined');
  assert.equal(typeof globalThis.document, 'undefined');
  for (const row of baseline.rows) {
    const head = model.resolveSeo(row.route);
    assert.equal(head.title, row.title, row.route);
    assert.equal(head.description, row.description, row.route);
    assert.equal(head.canonical, row.canonical, row.route);
    assert.deepEqual(model.resolveSeo(row.route + '?utm_source=qa#catalogo'), head);
    assert.deepEqual(model.resolveSeo(row.route === '/' ? '/' : row.route + '/'), head);
    assert.equal(head.robots, undefined);
    assert.equal(head.og.image, 'https://arquetypus.com.br/og-image.jpg');
    assert.equal(head.og.width, '1200'); assert.equal(head.og.height, '630');
    report.rows.push({ route: row.route, head });
  }
  pass('18 descritores preservam título/descrição/canonical; query/hash/barra final não contaminam head');
  for (const a of ARCHETYPES) {
    assert.ok(PDP_FRASCO[a.id]); assert.ok(PDP_LIFESTYLE[a.id]);
    const head = model.resolveSeo('/loja/' + a.id);
    assert.equal(head.og.type, 'product');
    assert.deepEqual(head.scripts.map(s => s.id), ['arq-seo-product', 'arq-seo-breadcrumb']);
    const product = JSON.parse(head.scripts[0].json);
    assert.equal(product.sku, a.id);
    assert.equal(product.image, new URL(PDP_FRASCO[a.id], model.SITE).href);
    assert.equal(product.description, head.description);
    assert.equal(product.url, head.canonical);
    const serialized = JSON.stringify(product);
    for (const excluded of ['offers', 'aggregateRating', 'review', 'gtin', 'availability', a.cod]) assert.ok(!serialized.includes(excluded), excluded);
    assert.equal(JSON.parse(head.scripts[1].json).itemListElement[1].item, head.canonical);
  }
  pass('Nove Products/Breadcrumbs: foto real compartilhada, IDs/canonical/sku coerentes, sem Offer/claims não confirmados');
  const faq = model.resolveSeo('/perguntas-frequentes');
  assert.equal(faq.scripts.length, 1);
  const previousFaq = baseline.rows.find(r => r.route === '/perguntas-frequentes').jsonLd;
  const oldData = typeof previousFaq[0] === 'string' ? JSON.parse(previousFaq[0]) : previousFaq[0];
  assert.deepEqual(JSON.parse(faq.scripts[0].json), oldData);
  assert.ok(!faq.scripts[0].json.includes('{{'));
  pass('FAQPage mantém perguntas e respostas exatas da baseline, tokens resolvidos');
  const home = model.resolveSeo('/');
  assert.deepEqual(home.scripts.map(s => JSON.parse(s.json)['@type']), ['Organization', 'WebSite']);
  assert.equal(home.og.type, 'website');
  assert.equal(JSON.parse(home.scripts[1].json).inLanguage, 'pt-BR');
  assert.ok(!JSON.stringify(home).includes('SearchAction'));
  assert.equal(model.resolveSeo('/SOBRE').canonical, model.SITE + '/sobre');
  assert.equal(model.resolveSeo('/LOJA/zeus').canonical, model.SITE + '/loja/zeus');
  assert.equal(model.resolveSeo('/loja/ZEUS').canonical, model.SITE + '/');
  assert.deepEqual(model.resolveSeo('/%73obre'), model.resolveSeo('/sobre'));
  assert.deepEqual(model.resolveSeo('/%6Coja/%7Aeus'), model.resolveSeo('/loja/zeus'));
  assert.equal(model.resolveSeo('/loja/%257Aeus').canonical, model.SITE + '/');
  assert.equal(model.resolveSeo('/loja%2Fzeus').robots, 'noindex');
  pass('Caminhos codificados seguem uma decodificação por segmento do Router, sem dupla decodificação ou barra extra');
  const unknown = model.resolveSeo('/404-qa');
  assert.equal(unknown.robots, 'noindex'); assert.deepEqual(unknown.scripts, []);
  assert.equal(model.resolveSeo('/404-qa', { genericNotFound: true }).canonical, undefined);
  assert.deepEqual(model.resolveSeo('/'), home);
  assert.equal(JSON.parse(model.serializeJsonLd({ text: '</script><script>$&$1' })).text, '</script><script>$&$1');
  assert.ok(!model.serializeJsonLd({ text: '</script>' }).includes('<'));
  pass('404 genérica sem canonical fictício; caixa conforme Router; render puro sem vazamento; serialização segura');
  const template = await readFile(path.join(root, 'dist/index.html'), 'utf8');
  assert.ok(template.includes(home.title));
  assert.ok(/<div id="root"><\/div>/.test(template));
  report.stage = 'SPA; HTML por rota e hidratação de produção permanecem para Etapas 3/4';
  pass('Build ainda SPA deliberadamente; Etapas 3/4 não antecipadas');
  await writeFile(path.join(evidence, 'etapa2-contracts.json'), JSON.stringify(report, null, 2) + '\n');
} finally { await server.close() }

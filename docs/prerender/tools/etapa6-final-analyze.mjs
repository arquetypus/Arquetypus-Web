// Consolida provas de QA. Não automatiza navegador, Git remoto ou painel Vercel.
import assert from 'node:assert/strict';
import { readFile, writeFile, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

process.env.NODE_ENV = 'production';
const folder = new URL('../evidence/', import.meta.url);
const read = async name => JSON.parse(await readFile(new URL(name, folder), 'utf8'));
const [chrome, fresh, http, performance, tbt, decision] = await Promise.all([
  'etapa6-chrome-analysis.json', 'etapa6-final-chrome.json', 'etapa6-http.json',
  'etapa6-analysis.json', 'etapa6-tbt-investigation-analysis.json', 'etapa6-final-review.json',
].map(read));
const { products } = await import('../../../dist-server/entry-server.js');
const text = value => value.normalize('NFC').replace(/\s/g, '');
assert.equal(http.failures.length, 0);
assert.equal(http.checks.length, 306);
assert.equal(http.documents.length, 19);
assert.equal(http.resources.length, 94);
assert.ok(http.checks.every(row => row.passed));
assert.equal(chrome.primaryBrowser, 'Google Chrome');
assert.equal(chrome.deployedHtmlWithJsPassed, 19);
assert.equal(chrome.deployedHtmlWithoutScriptsVisiblePassed, 19);
assert.equal(chrome.instrumentedHydrationConsentPassed, 95);
assert.equal(chrome.instrumentedFallbackCasesPassed, 57);
assert.equal(chrome.formCasesPassed, 8);
assert.equal(chrome.expectedPageViews, 7);
assert.ok(chrome.nativeControlsWithoutSiteScriptsPassed);
assert.equal(fresh.pdps.length, products.length);
assert.equal(new Set(fresh.pdps.map(row => row.url)).size, 9);
for (const product of products) {
  const row = fresh.pdps.find(item => new URL(item.url).pathname === '/loja/' + product.id);
  assert.ok(row?.pass);
  assert.equal(text(row.h1), text(product.nome + product.sobrenome));
  assert.deepEqual(row.photosTested, ['Ver foto 1', 'Ver foto 2']);
  assert.equal(row.details.length, 10);
  assert.ok(row.details.every(item => item.open));
  assert.ok(row.ritual);
  assert.deepEqual(row.disabled, [true, true]);
  assert.deepEqual(row.counts, [1, 1, 1]);
}
const responsive = fresh.responsive.filter(row => !row.invalidMeasurement);
assert.equal(responsive.length, 16);
assert.ok(responsive.every(row => row.pass && row.fonts === 'loaded'));
for (const width of [390, 768, 1024, 1440]) {
  for (const route of ['/', '/loja/zeus']) {
    const pair = responsive.filter(row => row.expected.w === width && row.route === route);
    assert.equal(pair.length, 2);
    const [baseline, ssg] = ['baseline', 'ssg'].map(variant => pair.find(row => row.variant === variant));
    assert.equal(baseline.h1[0].font, ssg.h1[0].font);
    assert.equal(baseline.h1[0].size, ssg.h1[0].size);
    assert.equal(baseline.main.w, ssg.main.w);
    // Tolerância numérica subpixel; não é certificado de identidade de pixels.
    assert.ok(Math.abs(baseline.h1[0].rect.w - ssg.h1[0].rect.w) < 0.01);
    assert.ok(Math.abs(baseline.h1[0].rect.h - ssg.h1[0].rect.h) < 0.01);
    if (route !== '/') assert.equal(baseline.gallery[0].w, ssg.gallery[0].w);
  }
}
assert.equal(fresh.homeClean.length, 8);
assert.ok(fresh.homeClean.every(row => row.pass && row.scrollTop === 0 && row.after.scrollTop === 0));
for (const row of [...responsive, ...fresh.homeClean]) assert.ok((await stat(new URL(row.screenshot, folder))).size > 0);
assert.ok(fresh.visualReview.layoutParityObserved);
assert.equal(fresh.liveConsent.acceptedReloadBannerVisible, false);
assert.equal(fresh.liveConsent.refusedReloadBannerVisible, false);
assert.deepEqual(fresh.consoleAtEnd, []);
const flows = fresh.flows.filter(row => !row.observationOnly);
const flow = label => {
  const row = flows.find(item => item.label === label);
  assert.ok(row, label);
  assert.deepEqual(row.counts, [1, 1, 1], label);
  return row;
};
for (const [label, expected] of [['Feminino', 'F'], ['Masculino', 'M'], ['Compartilhável', 'U'], ['Todos', null]]) {
  const row = flow('filtro ' + label);
  assert.deepEqual(new Set(row.catalog), new Set(products.filter(item => !expected || item.seg === expected).map(item => '/loja/' + item.id)));
}
for (const [name, slug] of [
  ['Florais & Elegantes', 'florais-elegantes'], ['Frutados & Cítricos', 'frutados-citricos'],
  ['Frescos & Luminosos', 'frescos-luminosos'], ['Ambarados & Adocicados', 'ambarados-adocicados'],
  ['Amadeirados & Especiados', 'amadeirados-especiados'],
]) assert.deepEqual(new Set(flow('família ' + name).catalog), new Set(products.filter(item => item.familias.includes(slug)).map(item => '/loja/' + item.id)));
for (const label of ['popup Escape móvel', 'popup X móvel', 'popup arraste mouse móvel confirmado', 'popup → home por fundo desktop confirmado', 'popup back']) {
  assert.equal(new URL(flow(label).url).pathname, '/');
  assert.equal(flow(label).dialog, null);
}
for (const label of ['home → popup Zeus', 'popup reload', 'popup forward']) {
  assert.equal(new URL(flow(label).url).pathname, '/loja/zeus');
  assert.equal(flow(label).dialog, 'Comprar Zeus');
}
assert.equal(flow('popup → página completa sem trocar URL').dialog, null);
assert.equal(new URL(flow('drawer mobile → FAQ').url).pathname, '/perguntas-frequentes');
assert.equal(flow('404 → home reteste direto estável').h1.length, 1);
assert.equal(flow('404 → home reteste direto estável').h1[0], 'Qual versão de você quer expressar hoje?');
assert.deepEqual(flow('hero slide 2 por teclado em visita direta').h1, ['Afrodite']);
assert.deepEqual(flow('hero slide 3 por teclado').h1, ['Guerreiro']);
assert.deepEqual(flow('hero slide 1 por teclado').h1, ['Qual versão de você quer expressar hoje?']);
const homePerformance = performance.performance.find(row => row.route === '/');
assert.ok(homePerformance.deltaPercent.LCP <= 10 && homePerformance.deltaPercent.TBT <= 10);
assert.ok(homePerformance.ssg.CLS - homePerformance.baseline.CLS <= 0.02);
assert.ok(tbt.expectedRetestComplete && tbt.zeusPerformanceComparisonAccepted);
assert.equal(decision.verdict, 'Aprovada com limitações documentadas');
assert.equal(decision.blockingIssues.length, 0);
assert.equal(decision.manualEvidence.previewCommit, '67d66d35c4535f121cd0c4179e5f531acee52012');
assert.ok(decision.manualEvidence.fullBuildPassed && decision.manualEvidence.rollbackDialogAvailable);
assert.equal(execFileSync('git', ['diff', '--name-only', '--', 'src', 'public', 'scripts', 'package.json', 'package-lock.json', 'vercel.json', 'vite.config.ts'], { encoding: 'utf8' }).trim(), '');
const inputs = ['etapa6-final-chrome.json', 'etapa6-http.json', 'etapa6-chrome-analysis.json', 'etapa6-tbt-investigation-analysis.json', 'etapa6-final-review.json'];
const hashes = Object.fromEntries(await Promise.all(inputs.map(async file => [file, createHash('sha256').update(await readFile(new URL(file, folder))).digest('hex')])));
const result = {
  analyzedAt: new Date().toISOString(), verdict: decision.verdict,
  phase6Accepted: true, scope: decision.acceptanceScope,
  routeChecks: 306, rawHtmlDocuments: 19, resourcePairs: 94,
  deployedPdpFullGalleries: 9, photosTested: 18, detailsOpened: 90,
  responsiveCases: 16, cleanHomeCaptures: 8, validatedFlowObservations: flows.length,
  homePerformanceAccepted: true, zeusPerformanceAccepted: true,
  manualBuildAndRollbackPreparationReviewed: true,
  literalEntirePhase5MatrixOnUnmodifiedPreviewRepeated: false,
  analyticsDeliveryCertified: false, physicalTouchCertified: false, pixelIdentityCertified: false,
  productionPublished: false, phase7Authorized: false, blockingIssues: [], inputHashes: hashes,
};
await writeFile(new URL('etapa6-final-analysis.json', folder), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));

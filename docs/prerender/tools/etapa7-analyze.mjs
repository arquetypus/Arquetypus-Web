// Consolida provas já coletadas; não publica nem consulta painéis administrativos.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const base = 'docs/prerender/evidence/';
const files = ['etapa7-publication-wait.json', 'etapa7-production-http.json',
  'etapa7-production-retest.json', 'etapa7-production-chrome.json', 'etapa7-canonical-host.json', 'etapa7-git-release.json'];
const inputs = [], inputHashes = {};
for (const file of files) {
  const bytes = await readFile(base + file);
  inputs.push(JSON.parse(bytes.toString()));
  inputHashes[file] = createHash('sha256').update(bytes).digest('hex');
}
const [publication, http, retest, chrome, hosts, gitRelease] = inputs;
const renderer = await import(pathToFileURL(path.resolve('dist-server/entry-server.js')).href);
assert.equal(publication.publicHtmlArrived, true);
assert.equal(gitRelease.refs['refs/heads/main'], publication.expectedCommit);
assert.equal(gitRelease.expectedReleaseCommit, publication.expectedCommit);
assert.equal(http.mode, 'production');
assert.equal(http.origin, 'https://www.arquetypus.com.br');
assert.equal(http.checks.length, 306);
assert.ok(http.checks.every(row => row.passed));
assert.equal(http.documents.length, 19);
assert.equal(http.resources.length, 94);
// Aceitar repetição somente para falha de transporte em recurso, mantendo tentativa inicial.
assert.ok(http.failures.every(row => row.error === 'fetch failed' && row.target?.startsWith('/assets/')));
assert.deepEqual(retest.retries.map(row => row.target).sort(), http.failures.map(row => row.target).sort());
assert.ok(retest.retries.every(row => row.passed && row.rows.length === 2 && row.rows.every(r => r.passed)));
assert.equal(http.resources.filter(row => row.passed).length + retest.retries.length, 94);
assert.equal(retest.productionHttpAccepted, true);
assert.equal(chrome.browser, 'Google Chrome');
assert.deepEqual(chrome.routes.map(row => new URL(row.url).pathname).sort(), [...renderer.routes].sort());
for (const row of chrome.routes) {
  const route = new URL(row.url).pathname;
  const expected = renderer.render(route).head;
  assert.equal(row.title, expected.title, route);
  assert.equal(row.canonical, expected.canonical, route);
  assert.equal(row.ogType, expected.og.type, route);
  assert.equal(row.h1.length, 1, route);
  assert.ok(row.mainChars > 100, route);
  assert.deepEqual([row.titleCount, row.descriptionCount, row.canonicalCount], [1, 1, 1], route);
  assert.ok(!/\b(?:noindex|none)\b/i.test(row.robots ?? ''), route);
  assert.deepEqual(row.readyBrokenImages, [], route);
  if (route.startsWith('/loja/')) assert.equal(row.pricePresent, true, route);
}
const flow = name => {
  const row = chrome.flows.find(row => row.name === name);
  assert.ok(row, name);
  return row;
};
assert.equal(flow('popup Zeus').dialog, true);
assert.equal(flow('página completa').dialog, false);
assert.equal(flow('foto 2 Fênix').ariaCurrent, 'true');
assert.equal(flow('notas Fênix').visible, true);
for (const name of ['recusa persistida', 'aceite persistido']) assert.equal(flow(name).bannerVisible, false);
assert.equal(flow('FAQ SPA e acordeão').openDetails, 1);
assert.equal(flow('404 direta').robots, 'noindex');
assert.equal(new URL(flow('404 → home').url).pathname, '/');
assert.equal(flow('reload pop-up').dialog, true);
assert.equal(flow('voltar').dialog, false);
assert.equal(flow('avançar').dialog, true);
assert.equal(flow('fechar pop-up').dialog, false);
assert.deepEqual(chrome.console, []);
for (const row of hosts.rows) {
  assert.equal(row.status, 308);
  assert.equal(row.location, row.url.replace('https://arquetypus.com.br', 'https://www.arquetypus.com.br'));
}
await readFile(base + 'etapa7-production-popup.png');
const last = publication.history.at(-1);
const report = {
  analyzedAt: new Date().toISOString(), releaseCommit: publication.expectedCommit,
  publicSsgObservedAt: last.at, primaryDomain: http.origin,
  verdict: 'Merge e smoke técnico em produção aprovados; encerramento operacional pendente',
  mainMergedAndPushed: true, publicSsgPublished: true,
  productionHttpAccepted: true, productionChromeSmokeAccepted: true,
  routeChecks: http.checks.length, rawHtmlDocuments: http.documents.length,
  resourcePairsAccepted: http.resources.length, transportFailuresRetested: retest.retries.length,
  chromePages: chrome.routes.length, productPages: chrome.routes.filter(row => new URL(row.url).pathname.startsWith('/loja/')).length,
  functionalFlowObservations: chrome.flows.length, hydrationErrorsObserved: 0,
  administrativeDeploymentIdentityVerified: false, administrativeBuildLogsVerified: false,
  currentRollbackEligibilityReconfirmed: false, externalAnalyticsReceiptCertified: false,
  followUpOwnerConfirmed: false, followUp24To48HoursCompleted: false,
  phase7FullyComplete: false, inputHashes,
};
await writeFile(base + 'etapa7-production-analysis.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));

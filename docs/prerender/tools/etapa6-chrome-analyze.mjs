// Verifica provas coletadas no Chrome. Não automatiza navegador ou painel Vercel.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
const folder = new URL('../evidence/', import.meta.url);
const read = async name => JSON.parse(await readFile(new URL(name, folder), 'utf8'));
const [functional, live, noJs, pdps, gestures, forms, tracking, mobile, native, proof, requests, nativeRequests] = await Promise.all([
  'functional', 'preview', 'no-js', 'pdp-ui', 'gestures', 'forms', 'tracking', 'mobile',
  'native-no-scripts', 'remote-proof', 'requests', 'native-requests',
].map(name => read(`etapa6-chrome-${name}.json`)));
const routes = live.rows.map(row => row.route);
assert.equal(new Set(routes).size, 19);
assert.equal(functional.rows.length, 152);
assert.ok(functional.rows.every(row => row.pass && row.errors.length === 0));
for (const mode of ['expired', 'blocked', 'noObserver', 'reduce', 'consent-absent', 'consent-accepted', 'consent-refused', 'consent-blocked']) {
  const rows = functional.rows.filter(row => row.mode === mode);
  assert.equal(rows.length, 19, mode);
  assert.deepEqual(new Set(rows.map(row => row.route)), new Set(routes), mode);
  for (const row of rows) {
    const defaultAt = row.events.findIndex(event => Array.isArray(event) && event[0] === 'consent' && event[1] === 'default');
    const gtmAt = row.events.findIndex(event => event.event === 'gtm.js');
    assert.ok(defaultAt >= 0 && defaultAt < gtmAt, `${row.route}: consent default antes do GTM`);
    const defaultState = row.events[defaultAt][2];
    assert.equal(defaultState.analytics_storage, 'denied');
    assert.equal(defaultState.ad_storage, 'denied');
    if (['consent-accepted', 'consent-refused', 'noObserver', 'reduce'].includes(mode)) {
      const updateAt = row.events.findIndex(event => Array.isArray(event) && event[0] === 'consent' && event[1] === 'update');
      assert.ok(updateAt >= 0 && updateAt < gtmAt);
      const state = mode === 'consent-accepted' ? 'granted' : 'denied';
      for (const key of ['analytics_storage', 'ad_storage', 'ad_user_data', 'ad_personalization']) assert.equal(row.events[updateAt][2][key], state);
    }
  }
}
assert.equal(live.rows.length, 19);
assert.ok(live.rows.every(row => row.pass));
assert.deepEqual(live.logs, []);
for (const row of live.rows) {
  assert.equal(row.dom.canonical, 'https://arquetypus.com.br' + row.route);
  assert.equal(row.dom.titleCount, 1);
  assert.equal(row.dom.descriptionCount, 1);
  assert.equal(row.dom.canonicalCount, 1);
  assert.equal(row.dom.h1.length, 1);
  assert.deepEqual(row.dom.brokenImages, []);
  assert.equal(row.retry?.cookie ?? row.dom.cookie, false);
}
for (const [suite, expected] of [[noJs, 19], [pdps, 9], [gestures, 3], [forms, 8], [mobile, 4]]) {
  assert.equal(suite.rows.length, expected);
  assert.ok(suite.rows.every(row => row.pass));
}
assert.ok(tracking.pass);
assert.deepEqual(tracking.pageViews.map(event => event.page_path), tracking.expectedPaths);
assert.equal(tracking.pageViews.length, 7);
assert.ok(native.pass && native.before.scripts === 0 && native.after.scripts === 0 && native.creatorsEnter.scripts === 0);
assert.ok(proof.every(row => row.sameAsValidatedBuild && /^[a-f0-9]{64}$/.test(row.sha256)));
assert.deepEqual(new Set(proof.filter(row => row.path === '/qualquer-coisa' || routes.includes(row.path)).map(row => row.path)), new Set(routes));
for (const row of [...requests, ...nativeRequests]) {
  assert.equal(row.method, 'GET', 'Nenhuma submissão POST nos testes');
  assert.ok(!/qa\.chrome|example\.invalid|00000000000|%40qa_chrome|[?&](email|whatsapp|nome|name)=/i.test(row.url), 'Campos sintéticos não enviados pela rede');
}
const result = {
  collectedAt: new Date().toISOString(), primaryBrowser: 'Google Chrome',
  deployedHtmlWithJsPassed: 19, deployedHtmlWithoutScriptsVisiblePassed: 19,
  instrumentedHydrationConsentPassed: 95, instrumentedFallbackCasesPassed: 57,
  deployedPdpUiPassed: 9, preHydrationGestureRunsPassed: 3, formCasesPassed: 8,
  mobileFlowsPassed: 4, expectedPageViews: 7, nativeControlsWithoutSiteScriptsPassed: true,
  functionalScenariosCovered: true,
  literalEntirePhase5MatrixOnUnmodifiedPreviewRepeated: false,
  limitations: [
    'Falhas/consentimento/gestos/tracking: bytes do preview verificados, servidos em loopback com instrumentação. Origem muda e GTM é substituído.',
    'Sem JS no preview: visibilidade comprovada em iframe sandbox. Controles nativos comprovados em loopback com zero scripts executáveis do site.',
    'Viewport móvel CSS 390×844 verificado em iframe do preview real. Não testa touch ou aparelho físico. Override do Chrome não aplicou dimensão e foi resetado.',
    'Tracking comprova contrato do dataLayer e ordem de consentimento; entrega real GA4/GTM não certificada.',
  ],
  performanceAccepted: false, rollbackPermissionVerified: false, manualVercelBuildVerified: false,
  phase6FullyAccepted: false, productionPublished: false,
};
await writeFile(new URL('etapa6-chrome-analysis.json', folder), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));

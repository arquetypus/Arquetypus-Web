// Analisa evidências coletadas no navegador; não repete nem inventa observações.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
const folder = new URL('../evidence/', import.meta.url);
const read = async name => JSON.parse(await readFile(new URL(name, folder), 'utf8'));
const [browser, frames, interactive, pdps, responsive, psi, forms] = await Promise.all([
  'etapa6-browser.json', 'etapa6-frames.json', 'etapa6-post-hydration.json',
  'etapa6-pdp-ui.json', 'etapa6-responsive-scaled.json', 'etapa6-pagespeed.json',
  'etapa6-forms-off.json',
].map(read));
assert.equal(browser.rows.length, 54);
assert.ok(browser.rows.every(row => row.passed));
assert.equal(new Set(browser.rows.map(row => `${row.consent}:${row.route}`)).size, 54);
const latestFrames = [...new Map(frames.rows.map(row => [`${row.mode}:${row.route}`, row])).values()];
assert.equal(latestFrames.length, 36);
assert.ok(latestFrames.every(row => row.passed));
assert.equal(interactive.length, 18);
assert.ok(interactive.every(row => row.passed && new Set(row.schemas.map(s => s.id)).size === row.schemas.length));
for (const row of interactive) {
  const before = browser.rows.find(sample => sample.route === row.path && sample.consent === 'absent');
  assert.ok(before, row.path);
  assert.deepEqual(row.schemas, before.dom.schemas.map(schema => ({ id: schema.id, json: JSON.parse(schema.json) })), row.path);
}
assert.equal(pdps.length, 9);
assert.ok(pdps.every(row => row.passed));
assert.equal(responsive.length, 16);
assert.ok(responsive.every(row => row.dom.width === row.size[0] && row.dom.scrollWidth === row.dom.width && !row.dom.broken.length));
assert.ok(forms.every(row => row.forms.every(form => form.fields.every(field => !field.name || field.disabled) && form.fields.some(field => field.tag === 'BUTTON' && field.disabled))));
const median = values => {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  return n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
};
const compare = (route, rounds) => {
  const groups = Object.fromEntries(['baseline', 'ssg'].map(variant => {
    const rows = psi.rows.filter(row => row.route === route && row.variant === variant && rounds.includes(row.round));
    assert.equal(rows.length, rounds.length);
    assert.equal(new Set(rows.map(row => row.url)).size, rounds.length);
    assert.ok(rows.every(row => row.metrics.device === 'mobile' && row.metrics.version === '13.5.0'));
    return [variant, Object.fromEntries(['FCP', 'LCP', 'TBT', 'CLS'].map(metric => [metric, median(rows.map(row => Number(row.metrics[metric])))]))];
  }));
  return { route, rounds, ...groups, deltaPercent: Object.fromEntries(['FCP', 'LCP', 'TBT'].map(metric => [metric, (groups.ssg[metric] / groups.baseline[metric] - 1) * 100])) };
};
const result = {
  browserCasesPassed: 54, interactiveRoutesPassed: 18, pdpUiPassed: 9,
  noScriptsAndBlockedStorageLatestPassed: latestFrames.length,
  responsiveCasesPassed: 16,
  initialCollectorFalseNegatives: frames.rows.filter(row => !row.passed).map(row => ({ mode: row.mode, route: row.route })),
  flowCollectorCorrection: 'Filtro tinha dois links por card; contagem corrigida para produtos únicos. Drawer confirmado após pathname mudar, não apenas H2 da PDP.',
  performance: [compare('/', [1, 2, 3]), compare('/loja/zeus', [1, 2, 3]), compare('/loja/zeus', [4, 5, 6]), compare('/loja/zeus', [1, 2, 3, 4, 5, 6])],
  performanceAccepted: false,
  reason: 'TBT mediano da PDP acima de 10% no conjunto final; tarefas de GTM/GA4 predominam na amostra diagnosticada. Causa da diferença ainda não isolada.',
  fullPhase5RemoteMatrixRepeated: false,
  rollbackPermissionVerified: false,
  phase6FullyAccepted: false,
};
await writeFile(new URL('etapa6-analysis.json', folder), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
